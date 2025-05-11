import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader'; // Import your loader component
import { Link } from 'react-router-dom';

const UserOrderHistory = () => {
  const [OrderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/order-history", { headers });
        setOrderHistory(response.data.data);
      } catch (error) {
        console.error("Error fetching order history:", error.response ? error.response.data : error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  return (
    <>
      {loading && (
        <div className='h-[100%] flex items-center justify-center'>
          <Loader />
        </div>
      )}

      {!loading && OrderHistory.length === 0 && (
        <div className='h-[80vh] p-4 text-zinc-100'>
          <div className='h-full flex flex-col items-center justify-center'>
            <h1 className='text-5xl font-semibold text-zinc-500 mb-8'>No Order History</h1>
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-order-history-illustration-download-in-svg-png-gif-file-formats--previous-orders-past-purchases-records-empty-ecommerce-states-pack-e-commerce-shopping-illustrations-9741057.png?f=webp" alt="No Orders" />
          </div>
        </div>
      )}

      {!loading && OrderHistory.length > 0 && (
        <div className="h-full p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Your Order History
          </h1>

          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%] text-center">Sr.</div>
            <div className="w-[22%]">Books</div>
            <div className="w-[45%]">Description</div>
            <div className="w-[9%]">Price</div>
            <div className="w-[16%]">Status</div>
            <div className="w-none md:w-[5%] hidden md:block">Mode</div>
          </div>

          {OrderHistory.map((item, index) => (
            <div key={item.orderId} className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor-pointer mt-2">
              <div className="w-[3%] text-center">{index + 1}</div>
              <div className="w-[22%]">
                <Link to={`/view-book-details/${item.book.id}`} className="hover:text-blue-300">
                  {item.book.title}
                </Link>
              </div>
              <div className="w-[45%]">
                <h1>{item.book.description?.slice(0, 50)}...</h1>
              </div>
              <div className="w-[9%]">
                <h1>₹{item.book.price}</h1>
              </div>
              <div className="w-[16%]">
                <h1 className={`font-semibold ${
                  item.status === "Order placed" ? 'text-yellow-500' :
                  item.status === "Canceled" ? 'text-red-500' : 'text-green-500'
                }`}>
                  {item.status}
                </h1>
              </div>
              <div className="w-none md:w-[5%] hidden md:block">
                <h1 className="text-sm text-zinc-400">COD</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserOrderHistory;
