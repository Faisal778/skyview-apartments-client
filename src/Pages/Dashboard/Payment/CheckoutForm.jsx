import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useReservation from "../../../Hooks/useReservation";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const CheckoutForm = () => {
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const [transactionId, setTransactionId] = useState("");
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [reservation] = useReservation();
  const { user } = useAuth();
  const price = reservation[0]?.rent || 0;
  console.log(price);
  useEffect(() => {
    axiosSecure.post("/create-payment-intent", { price: price }).then((res) => {
      console.log(res.data.clientSecret);
      setClientSecret(res.data.clientSecret);
    });
  }, [axiosSecure, price]);

  useEffect(() => {
    if (transactionId) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Payment completed successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }, [transactionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("payment error", error);
      setError(error.message);
    } else {
      console.log("payment method", paymentMethod);
      setError("");
    }
    //confirm payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: user?.email || "anonymous",
          name: user?.displayName || "anonymous",
        },
      },
    });

    if (confirmError) {
      console.log("confirm error");
    } else {
      console.log("payment intent", paymentIntent);
      if (paymentIntent.status === "succeeded") {
        console.log("transaction id", paymentIntent.id);
        setTransactionId(paymentIntent.id);

        const payment = {
          email: user.email,
          price: price,
          transactionId: paymentIntent.id,
          date: new Date(),
          reservationId: reservation.map((item) => item._id),
          apartmentId: reservation.map((item) => item.apartmentId),
          status: "pending",
        };
        const res = await axiosSecure.post("/payments", payment);
        console.log("payment saved", res);
        if (res.data?.paymentResult.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Payment completed successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        className="m-20 p-4 border-2 border-gray-600 rounded-lg"
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <div className="flex justify-center">
        <button className="btn btn-sm btn-wide bg-green-300 " type="submit" disabled={!stripe}>
          Pay
        </button>
        <p className="text-red-400">{error}</p>
        {transactionId && <p className="text-green-600 block py-4">Your transaction id: {transactionId}</p>}
      </div>
    </form>
  );
};

export default CheckoutForm;
