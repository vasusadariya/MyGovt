import React, { useState } from 'react';

const VoteCard: React.FC = () => {
 
  return (

    <div>
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">

    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white p-6">

      <h2 className="text-xl font-bold mb-2">Vote Here</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"

        onClick={() => {
          router.push("/dashboard/users/elections");
        }}
      >
        Vote
      </button>
    </div>
    
   </div> 
  );
};

export default VoteCard;