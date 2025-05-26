import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();


  const handleReservation = async () => {
    try {
      const response = await fetch(`/api/flights/${id}/book`, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method: 'pending'
        }),
      });

      if (response.ok) {
        navigate('/my-flights');
      }
    } catch (error) {
      console.error('Error making reservation:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">Flight Details</h2>
        <div className="space-y-4">
          {/* Flight information will be displayed here */}
          <button
            onClick={handleReservation}
            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition duration-300"
          >
            Add to My Flights
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;