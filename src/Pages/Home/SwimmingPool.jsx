import React from 'react';

const SwimmingPool = () => {
    return (
        <div>
             <div className="hero  min-h-[500px] py-10  ">
  <div className="hero-content flex-col lg:flex-row">
    <img src="data:image/jpeg;base64,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" className="min-w-[600px] min-h-[450px] rounded-lg shadow-2xl" />
    <div className='p-4'>
      <h1 className="text-5xl font-bold">Swimming Pool Facility</h1>
      <p className="py-6">Our apartment complex offers a state-of-the-art gym facility, designed to provide a comfortable and convenient workout experience for residents. The gym is equipped with a range of equipment, including treadmills, ellipticals, and weight machines, as well as free weights and a variety of cardio machines.</p>
      
    </div>
  </div>
</div>
        </div>
    );
};

export default SwimmingPool;