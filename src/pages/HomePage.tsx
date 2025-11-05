import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { experiencesApi } from '../api/experiences';
import { Experience } from '../types';

export default function HomePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await experiencesApi.getAll();
        setExperiences(data);
      } catch (err) {
        setError('Failed to load experiences. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">BookIt</h1>
          <p className="text-gray-600 mt-1">Discover amazing travel experiences</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Available Experiences</h2>
          <p className="text-gray-600">Choose from our curated selection of travel experiences</p>
        </div>

        {/* Experiences Grid */}
        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No experiences available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                onClick={() => navigate(`/experience/${experience.id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative h-48 bg-gray-200">
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {experience.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {experience.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{experience.location}</p>
                      {experience.duration_hours && (
                        <p className="text-xs text-gray-400 mt-1">
                          {experience.duration_hours} hours
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        ${Number(experience.price).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

