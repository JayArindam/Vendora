import React, { useState, useEffect } from 'react';
import { FaUser, FaCheck } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import SeeUserData from './SeeUserData';

const AllOrders = () => {
  const [AllOrders, setAllOrders] = useState([]);
  const [Options, setOptions] = useState(-1);
  const [Values, setValues] = useState({ status: "" });
  const [userDiv, setuserDiv] = useState("hidden");
  const [userDivData, setuserDivData] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/get-all-orders", { headers });
        setAllOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []); // empty dependency array to avoid infinite loop

  const change = (e) => {
    const { value } = e.target;
    setValues({ status: value });
  };

  const SubmitChanges = async (i) => {
    const id = AllOrders[i].orderId;
    try {
      const response = await axios.put(`http://localhost:3001/api/v1/update-status/${id}`, Values, { headers });
      alert(response.data.message);

      // Refresh orders
      const updated = await axios.get("http://localhost:3001/api/v1/get-all-orders", { headers });
      setAllOrders(updated.data.data);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  return (
    <>
      {!AllOrders ? (
        <div className='flex justify-center items-center h-[100%]'>
          <Loader />
        </div>
      ) : (
        AllOrders.length > 0 && (
          <div className="h-[100%] p-0 md:p-4 text-zinc-100">
            <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
              All Orders
            </h1>

            <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
              <div className="w-[3%] text-center">Sr.</div>
              <div className="w-[22%]">Books</div>
              <div className="w-[45%] hidden md:block">Description</div>
              <div className="w-[9%]">Price</div>
              <div className="w-[16%]">Status</div>
              <div className="w-[5%] text-center">
                <FaUser />
              </div>
            </div>

            {AllOrders.map((items, i) => (
              <div
                key={i}
                className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300"
              >
                <div className="w-[3%] text-center">
                  {i + 1}
                </div>

                <div className="w-[40%] md:w-[22%]">
                  <Link
                    to={`/view-book-details/${items.book.id}`}
                    className="hover:text-blue-300"
                  >
                    {items.book.title}
                  </Link>
                </div>

                <div className="w-0 md:w-[45%] hidden md:block">
                  <h1>{items.book?.description ? items.book.description.slice(0, 50) + "..." : "No description"}</h1>
                </div>

                <div className="w-[17%] md:w-[9%]">
                  ₹{items.book.price}
                </div>

                <div className="w-[30%] md:w-[16%]">
                  <button
                    className="hover:scale-105 transition-all duration-300 font-semibold"
                    onClick={() => setOptions(i)}
                  >
                    {items.status === "Order placed" ? (
                      <div className="text-yellow-500">{items.status}</div>
                    ) : items.status === "Cancelled" ? (
                      <div className="text-red-500">{items.status}</div>
                    ) : (
                      <div className="text-green-500">{items.status}</div>
                    )}
                  </button>

                  <div className={`${Options === i ? "flex" : "hidden"} gap-2 mt-1`}>
                    <select
                      name="status"
                      className="bg-gray-800 px-2 py-1 rounded"
                      onChange={change}
                      value={Values.status}
                    >
                      {["Order placed", "Out for delivery", "Delivered", "Cancelled"].map(
                        (statusOption, index) => (
                          <option value={statusOption} key={index}>
                            {statusOption}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      className="text-green-500 hover:text-pink-600"
                      onClick={() => {
                        setOptions(-1);
                        SubmitChanges(i);
                      }}
                    >
                      <FaCheck />
                    </button>
                  </div>
                </div>

                <div className="w-[10%] md:w-[5%] text-center">
                  <button
                    className="text-xl hover:text-orange-500"
                    onClick={() => {
                      setuserDiv("fixed");
                      setuserDivData(items.user);
                    }}
                  >
                    <IoOpenOutline />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      {userDivData && (
        <SeeUserData
        userDivData={userDivData}
        userDiv={userDiv}
        setuserDiv={setuserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;
