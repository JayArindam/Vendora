import React from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

const BookCard = ({ data, favourite, onRemove }) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data.id,
  };

  const handleRemoveBook = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/v1/delete-from-fav`,
        { headers }
      );
      alert(response.data.message);
      onRemove(data.id);  // Remove book from the list after successful deletion
    } catch (error) {
      console.error("Error removing from favorites:", error);
      alert("Failed to remove from favorites. Please try again.");
    }
  };

  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col">
      <Link to={`/view-book-details/${data.id}`}>
        <div className="flex flex-col h-full">
          <div className='bg-zinc-900 rounded flex items-center justify-center'>
            <img src={data.url} alt="/" className='h-[25vh]' />
          </div>
          <h2 className="mt-4 text-xl text-white font-semibold truncate">{data.title}</h2>
          <p className="mt-2 text-zinc-400 font-semibold">by {data.author}</p>
          <p className="mt-2 text-zinc-200 font-semibold text-xl">₹{data.price}</p>
        </div>
      </Link>

      {favourite && (
        <button
          className="bg-yellow-50 px-4 py-2 rounded border border-yellow-500 text-yellow-500 mt-4"
          onClick={handleRemoveBook}
        >
          Remove from favorites
        </button>
      )}
    </div>
  );
}

export default BookCard;
