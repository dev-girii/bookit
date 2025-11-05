import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Booking, Experience } from '../types';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, booking, error, experience } = location.state as {
    success: boolean;
    booking?: Booking;
    error?: string;
    experience?: Experience;
  };

  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {success && booking ? (
          <>
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600">
                Your booking has been successfully created. We've sent a confirmation email to your
                address.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium text-gray-900">#{booking.id}</span>
                </div>
                {experience && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium text-gray-900">{experience.title}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Guest Name:</span>
                  <span className="font-medium text-gray-900">{booking.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{booking.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Guests:</span>
                  <span className="font-medium text-gray-900">{booking.number_of_guests}</span>
                </div>
                {booking.promo_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Promo Code:</span>
                    <span className="font-medium text-gray-900">{booking.promo_code}</span>
                  </div>
                )}
                {Number(booking.discount_amount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">
                      -${Number(booking.discount_amount).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-900 font-semibold">Total Amount:</span>
                  <span className="text-primary-600 font-bold text-lg">
                    ${Number(booking.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Book Another Experience
            </button>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Failed</h1>
              <p className="text-gray-600 mb-4">
                {error || 'We encountered an error while processing your booking. Please try again.'}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

