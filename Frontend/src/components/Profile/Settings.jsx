import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';

const Settings = () => {
  const [value, setValue] = useState({ address: "" });
  const [profileData, setProfileData] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const change = (e) => { 
    const { name, value } = e.target;
    setValue({ ...value, [name]: value });
  };
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get("http://localhost:3001/api/v1/get-user-information", { headers });
      setProfileData(response.data);
      setValue({ address: response.data.address });
    };
    fetch();
  }, []);
  const submitAddress = async () => {
    const response = await axios.put("http://localhost:3001/api/v1/update-address", value, { headers });
    alert(response.data.message);
  };
  return (
    <>
      {!profileData && (
        <div className='w-full h-full flex items-center justify-center'>
          <Loader />
        </div>
      )}
      {profileData && (
        <div className='min-h-screen p-4 text-zinc-100'>
          <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
            Settings
          </h1>
          <div className='flex flex-col md:flex-row md:gap-12 gap-6'>
            <div className='flex-1'>
              <label htmlFor='username' className='block mb-1'>Username</label>
              <p className='p-3 rounded bg-zinc-800 font-semibold'>
                {profileData.username}
              </p>
            </div>
            <div className='flex-1'>
              <label htmlFor='email' className='block mb-1'>Email</label>
              <p className='p-3 rounded bg-zinc-800 font-semibold'>
                {profileData.email}
              </p>
            </div>
          </div>
          <div className='mt-6'>
            <label htmlFor='address' className='block mb-1'>Address</label>
            <textarea
              className='w-full p-3 rounded bg-zinc-800 font-semibold resize-none'
              rows='5'
              placeholder='Address'
              name='address'
              value={value.address}
              onChange={change}

            />
          </div>
          <div className='mt-6 flex justify-end'>
            <button className='bg-yellow-500 text-zinc-900 font-semibold px-5 py-2 rounded hover:bg-yellow-400 transition-all duration-300' onClick={submitAddress}>
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
