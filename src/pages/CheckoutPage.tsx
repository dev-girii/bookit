import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingsApi, promoApi } from '../api';
import { Experience, Slot } from '../types';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, slot } = location.state as { experience: Experience; slot: Slot };

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_guests: 1,
    promo_code: '',
  });

  const [promoValidation, setPromoValidation] = useState<{
    valid: boolean;
    discount_amount: number;
    message?: string;
  } | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!experience || !slot) {
      navigate('/');
    }
  }, [experience, slot, navigate]);

  if (!experience || !slot) {
    return null;
  }

  const subtotal = Number(experience.price) * formData.number_of_guests;
  const discount = promoValidation?.valid ? Number(promoValidation.discount_amount) : 0;
  const total = subtotal - discount;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Invalid email format';
    }

    if (formData.number_of_guests < 1) {
      newErrors.number_of_guests = 'At least 1 guest is required';
    } else if (formData.number_of_guests > slot.available_spots) {
      newErrors.number_of_guests = `Only ${slot.available_spots} spots available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePromoValidate = async () => {
    if (!formData.promo_code.trim()) {
      setPromoValidation(null);
      return;
    }

    setValidatingPromo(true);
    try {
      const result = await promoApi.validate(formData.promo_code, subtotal);
      setPromoValidation(result);
    } catch (error) {
      setPromoValidation({
        valid: false,
        discount_amount: 0,
        message: 'Failed to validate promo code',
      });
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const booking = await bookingsApi.create({
        experience_id: experience.id,
        slot_id: slot.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone || undefined,
        number_of_guests: formData.number_of_guests,
        promo_code: formData.promo_code || undefined,
      });

      navigate('/result', {
        state: {
          success: true,
          booking,
          experience,
        },
      });
    } catch (error: any) {
      navigate('/result', {
        state: {
          success: false,
          error: error.response?.data?.error || 'Failed to create booking. Please try again.',
          experience,
        },
      });
    } finally {
      setSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.customer_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customer_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="customer_email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.customer_email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customer_email && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                )}
              </div>

              <div>
                <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="number_of_guests" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  id="number_of_guests"
                  min="1"
                  max={slot.available_spots}
                  value={formData.number_of_guests}
                  onChange={(e) =>
                    setFormData({ ...formData, number_of_guests: parseInt(e.target.value) || 1 })
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.number_of_guests ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.number_of_guests && (
                  <p className="text-red-500 text-sm mt-1">{errors.number_of_guests}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {slot.available_spots} spots available
                </p>
              </div>

              <div>
                <label htmlFor="promo_code" className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="promo_code"
                    value={formData.promo_code}
                    onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter promo code"
                  />
                  <button
                    type="button"
                    onClick={handlePromoValidate}
                    disabled={validatingPromo || !formData.promo_code.trim()}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validatingPromo ? 'Validating...' : 'Apply'}
                  </button>
                </div>
                {promoValidation && (
                  <p
                    className={`text-sm mt-1 ${
                      promoValidation.valid ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {promoValidation.valid
                      ? `Discount applied: $${Number(promoValidation.discount_amount).toFixed(2)}`
                      : promoValidation.message || 'Invalid promo code'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processing...' : 'Complete Booking'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">{experience.title}</h3>
                <p className="text-sm text-gray-600">{experience.location}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(slot.date)} at {formatTime(slot.start_time)}
                </p>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per person</span>
                  <span className="text-gray-900">${Number(experience.price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of guests</span>
                  <span className="text-gray-900">{formData.number_of_guests}</span>
                </div>
                {promoValidation?.valid && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

