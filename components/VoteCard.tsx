import Link from 'next/link';
import React from 'react';

const VoteCard: React.FC = () => {
 
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative">
      <h2 className="text-xl font-bold mb-2">Vote Here</h2>
      <p className="text-gray-700 text-base mb-4">Cast your vote </p>
      <Link href='/dashboard/users/elections'>
      <button
        
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Vote
      </button>
      </Link>
    </div>
  );
};

export default VoteCard;