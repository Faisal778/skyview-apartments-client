import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();

  const { data: users = [], refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
         .patch(`/users/user/${user.email}`)
         .then((response) => {
            console.log(response);
            refetch();
            Swal.fire({
              title: "Updated!",
              text: "User role has been updated.",
              icon: "success",
            });
          })
         .catch((error) => {
            console.error(error);
            Swal.fire({
              title: "Error",
              text: "Failed to update user role.",
              icon: "error",
            });
          });
      }
    });
  };

  const handleMakeAdmin = (user) => {
    axiosSecure.patch(`/users/admin/${user._id}`)
    .then(res => {
        console.log(res.data)
        if (res.data.modifiedCount > 0){
            refetch();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${user.name} is an admin now`,
                showConfirmButton: false,
                timer: 1500
              });
        }
    })
  };
  return (
    <div>
      <div className="flex justify-evenly my-4 mt-10">
        <h2 className="text-3xl">All Users</h2>
        <h2 className="text-3xl">Total Users : {users.length}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role/Make Admin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                    {user.role === 'admin'? 'Admin' : 
                  <button onClick={() => handleMakeAdmin(user)}>
                    <FaUsers className="text-green-400 mr-4" />
                  </button>}
                </td>
                <td>
                  <button onClick={() => handleDeleteUser(user)}>
                    <FaTrashAlt className="text-red-400 mr-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
