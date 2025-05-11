import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../BookCard/BookCard';

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState([]);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/get-favs', { headers });
        setFavouriteBooks(response.data.data);
      } catch (error) {
        console.error("Error fetching favorites:", error.response ? error.response.data : error.message);
      }
    };
    fetch();
  }, []);  // Empty dependency array to run only once on component mount

  const handleRemove = (bookId) => {
    setFavouriteBooks((prevBooks) => prevBooks.filter(book => book.id !== bookId));  // Remove the book from the local state
  };

  return (
    <div>
      {FavouriteBooks.length === 0 ? (
        <div className="text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center flex-col w-full">
          No Favourites
          <img src="https://cdn-icons-png.flaticon.com/512/3208/3208709.png" alt="star" className="h-[20vh] my-8" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {FavouriteBooks.map((items, i) => (
            <div key={i}>
              <BookCard data={items} favourite={true} onRemove={handleRemove} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
