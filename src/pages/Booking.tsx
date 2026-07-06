import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../api/reservations';
import { ordersApi } from '../api/orders';
import { GlassmorphismCard } from '../components/common/GlassmorphismCard';
import { ProgressTimeline } from '../components/common/ProgressTimeline';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { apiClient } from '../api/client';

export const Booking: React.FC = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { cart, total: cartTotal } = useCart();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cash'>('mpesa');

  // Fetch table details
  const { data: table, isLoading } = useQuery({
    queryKey: ['table', tableId],
    queryFn: async () => {
      const response = await apiClient.get(`/tables/${tableId}`);
      return response.data;
    },
    enabled: !!tableId,
  });

  const RESERVATION_DEPOSIT = 500;
  const TAX_RATE = 0.18;
  const subtotal = cartTotal;
  const tax = subtotal * TAX_RATE;
  const total = RESERVATION_DEPOSIT + subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Step 1: Create Reservation
      const reservationResponse = await reservationsApi.create({
        tableId: tableId!,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        date: formData.date,
        time: formData.time,
      });

      const reservationId = reservationResponse.id;

      // Step 2: Create Order if cart has items
      let orderId = null;
      if (cart.length > 0) {
        const orderResponse = await ordersApi.create(reservationId, cart);
        orderId = orderResponse.id;
      }

      // Step 3: Create Payment
      const paymentResponse = await apiClient.post('/admin/payments', {
        reservationId,
        amount: total,
        currency: 'KES',
        paymentMethod,
        status: paymentMethod === 'cash' ? 'PENDING' : 'PROCESSING',
      });

      // Navigate to confirmation
      navigate('/booking-confirmation', {
        state: {
          reservationId,
          orderId,
          paymentId: paymentResponse.data.id,
          tableNumber: table?.tableNumber,
          customerName: formData.customerName,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          cart,
          subtotal,
          tax,
          total,
          paymentMethod,
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete reservation');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const steps = ['Customer Info', 'Reservation', 'Your Order', 'Payment'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-roots-green/10 to-roots-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <GlassmorphismCard className="p-8">
          <h1 className="text-3xl font-bold text-roots-green mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 mb-6">
            Table {table?.tableNumber} • {table?.zone} • {table?.seats} seats
          </p>

          {/* Progress Timeline */}
          <ProgressTimeline currentStep={currentStep} steps={steps} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-semibold text-roots-green mb-4">
                  Customer Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-roots-green focus:border-transparent"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-roots-green focus:border-transparent"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, customerPhone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-roots-green focus:border-transparent"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 2: Reservation Details */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-semibold text-roots-green mb-4">
                  Reservation Details
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-roots-green focus:border-transparent"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-roots-green focus:border-transparent"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guests *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-roots-green focus:border-transparent"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: Number(e.target.value) })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-roots-green focus:border-transparent
                             resize-none h-20"
                    placeholder="Any dietary requirements, special occasions, or preferences?"
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setFormData({ ...formData, specialRequests: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 3: Your Order */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-semibold text-roots-green mb-4">
                  Your Order
                </h2>
                {cart.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          {item.notes && <p className="text-xs text-gray-600">Notes: {item.notes}</p>}
                        </div>
                        <p className="font-semibold text-roots-green">
                          Ksh {(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      No items in your order yet. You can add items later at the restaurant.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-roots-green hover:text-roots-green/70 text-sm font-medium"
                >
                  ← Browse Menu
                </button>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-roots-green mb-4">
                  Payment Summary
                </h2>

                {/* Payment Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Reservation Deposit</span>
                    <span className="font-medium">Ksh {RESERVATION_DEPOSIT}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Food Total</span>
                    <span className="font-medium">Ksh {subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">VAT (18%)</span>
                    <span className="font-medium">Ksh {tax.toFixed(0)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-lg">TOTAL</span>
                    <span className="font-bold text-lg text-roots-green">Ksh {total.toFixed(0)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="mpesa"
                        checked={paymentMethod === 'mpesa'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'mpesa' | 'card' | 'cash')}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">M-Pesa</p>
                        <p className="text-xs text-gray-600">Pay via Safaricom M-Pesa</p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'mpesa' | 'card' | 'cash')}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Card</p>
                        <p className="text-xs text-gray-600">Visa, Mastercard, or American Express</p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'mpesa' | 'card' | 'cash')}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Cash at Arrival</p>
                        <p className="text-xs text-gray-600">Pay when you arrive at the restaurant</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 
                           rounded-lg hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 1) {
                      if (!formData.customerName || !formData.customerPhone) {
                        setError('Please fill in all required fields');
                        return;
                      }
                    }
                    if (currentStep === 2) {
                      if (!formData.date || !formData.time) {
                        setError('Please select date and time');
                        return;
                      }
                    }
                    setError('');
                    setCurrentStep((prev) => (prev + 1) as any);
                  }}
                  className="flex-1 bg-roots-green text-white px-6 py-3 rounded-lg 
                           hover:bg-roots-green/90 transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-roots-gold text-white px-6 py-3 rounded-lg 
                           hover:bg-roots-gold/90 transition disabled:opacity-50
                           flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" color="text-white" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              )}
            </div>
          </form>
        </GlassmorphismCard>
      </div>
    </div>
  );
};