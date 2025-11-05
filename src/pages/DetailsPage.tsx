import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { experiencesApi } from '../api/experiences';
import { Experience, Slot } from '../types';

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [expData, slotsData] = await Promise.all([
          experiencesApi.getById(parseInt(id)),
          experiencesApi.getSlots(parseInt(id)),
        ]);

        setExperience(expData);
        setSlots(slotsData);
      } catch (err) {
        setError('Failed to load experience details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleProceedToCheckout = () => {
    if (selectedSlot && experience) {
      navigate('/checkout', {
        state: {
          experience,
          slot: selectedSlot,
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience details...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Experience not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Experiences
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Experience Details */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64 bg-gray-200">
                {experience.image_url ? (
                  <img
                    src={experience.image_url}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {experience.title}
                </h1>
                <p className="text-gray-600 mb-4">{experience.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium mr-2">Location:</span>
                    <span>{experience.location}</span>
                  </div>
                  {experience.duration_hours && (
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Duration:</span>
                      <span>{experience.duration_hours} hours</span>
                    </div>
                  )}
                  {experience.max_group_size && (
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Max Group Size:</span>
                      <span>{experience.max_group_size} people</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium mr-2">Price:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${Number(experience.price).toFixed(2)}
                    </span>
                    <span className="ml-2 text-gray-500">per person</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slot Selection */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Select a Date & Time
              </h2>

              {slots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No available slots at the moment.</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {Object.entries(slotsByDate).map(([date, dateSlots]) => (
                    <div key={date}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {formatDate(date)}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {dateSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            disabled={slot.available_spots === 0}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              selectedSlot?.id === slot.id
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-primary-300'
                            } ${
                              slot.available_spots === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                            }`}
                          >
                            <div className="font-medium text-gray-900">
                              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {slot.available_spots > 0
                                ? `${slot.available_spots} spots available`
                                : 'Sold out'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSlot && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

