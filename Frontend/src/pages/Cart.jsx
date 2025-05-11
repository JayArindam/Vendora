import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import axios from 'axios';
import { AiFillDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [Cart, setCart] = useState([]);
  const [Total, setTotal] = useState(0);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/get-user-cart",
          { headers }
        );
        setCart(response.data.data);

        // Calculate total
        const totalPrice = response.data.data.reduce((sum, item) => {
          return sum + (item.book?.price || 0);
        }, 0);
        setTotal(totalPrice);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  const deleteItem = async (bookId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/v1/remove-from-cart/${bookId}`,
        {},
        { headers }
      );
      alert(response.data.message);

      // Refresh cart after deletion
      const refreshed = await axios.get("http://localhost:3001/api/v1/get-user-cart", { headers });
      setCart(refreshed.data.data);

      const newTotal = refreshed.data.data.reduce((sum, item) => {
        return sum + (item.book?.price || 0);
      }, 0);
      setTotal(newTotal);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const PlaceOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/place-order",
        { order: Cart },
        { headers }
      );
      alert(response.data.message);
      navigate("/profile/orderHistory");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='bg-zinc-900 px-12 min-h-screen py-8'>
      {!Cart && <div className='w-full h-[100%] flex items-center justify-center'> <Loader />{" "}</div>}

      {Cart && Cart.length === 0 && (
        <div className="h-full flex items-center justify-center flex-col">
          <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">
            Empty Cart
          </h1>
          <img
            src="https://cdn-icons-png.flaticon.com/512/107/107831.png"
            alt="empty cart"
            className="lg:h-[50vh]"
          />
        </div>
      )}

      {Cart && Cart.length > 0 && (
        <>
          <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
            Your Cart
          </h1>

          {Cart.map((item, i) => (
            <div
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
              key={i}
            >
              <img
                src={item.book?.url}
                alt={item.book?.title}
                className="h-[20vh] md:h-[10vh] object-cover"
              />
              <div className="w-full md:w-auto">
                <h1 className="text-2xl text-zinc-100 font-semibold text-start mt-2 md:mt-0">
                  {item.book?.title}
                </h1>
                <p className="text-normal text-zinc-300 mt-2 hidden lg:block">
                  {item.book?.description?.slice(0, 100)}...
                </p>
                <p className="text-normal text-zinc-300 mt-2 hidden md:block lg:hidden">
                  {item.book?.description?.slice(0, 65)}...
                </p>
                <p className="text-normal text-zinc-300 mt-2 block md:hidden">
                  {item.book?.description?.slice(0, 100)}...
                </p>
              </div>
              <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-zinc-100 text-3xl font-semibold flex">
                  ₹ {item.book?.price}
                </h2>
                <button
                  className="bg-red-100 text-red-700 border border-red-700 rounded p-2 ms-12"
                  onClick={() => deleteItem(item.book.id)}
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 w-full flex items-center justify-end">
            <div className="p-6 bg-zinc-800 rounded w-full md:w-1/2 lg:w-1/3">
              <h1 className="text-3xl text-zinc-200 font-semibold mb-4">
                Total Amount
              </h1>

              <div className="mb-4 flex items-center justify-between text-xl text-zinc-200">
                <h2>{Cart.length} {Cart.length === 1 ? 'book' : 'books'}</h2>
                <h2>₹ {Total}</h2>
              </div>

              <button className="bg-zinc-100 text-zinc-900 rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-white transition-all duration-300"
                onClick={PlaceOrder}
              >
                Place your order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
