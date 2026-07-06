import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GlassmorphismCard } from '../components/common/GlassmorphismCard';
import { CartItem } from '../context/CartContext';

interface ConfirmationState {
  reservationId: string;
  orderId?: string;
  paymentId: string;
  tableNumber: number;
  customerName: string;
  date: string;
  time: string;
  guests: number;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'mpesa' | 'card' | 'cash';
}

export const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ConfirmationState;

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-roots-green/10 to-roots-cream py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <GlassmorphismCard className="p-8 text-center">
            <p className="text-gray-600">No reservation data found. Redirecting...</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-roots-green text-white px-6 py-2 rounded-lg hover:bg-roots-green/90"
            >
              Go Home
            </button>
          </GlassmorphismCard>
        </div>
      </div>
    );
  }

  const paymentMethodLabel = {
    mpesa: 'M-Pesa',
    card: 'Card',
    cash: 'Cash at Arrival',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-roots-green/10 to-roots-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <GlassmorphismCard className="p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-roots-green mb-2">
              Reservation Confirmed!
            </h1>
            <p className="text-gray-600">
              Your table is reserved and your order has been sent to the kitchen
            </p>
          </div>
        </GlassmorphismCard>

        {/* Reservation Details */}
        <GlassmorphismCard className="p-8 mb-6">
          <h2 className="text-xl font-semibold text-roots-green mb-6">
            Reservation Details
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Table Number</p>
                <p className="text-2xl font-bold text-roots-green">
                  Table {state.tableNumber}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Date</p>
                <p className="text-lg font-semibold">
                  {new Date(state.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Time</p>
                <p className="text-lg font-semibold">{state.time}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Number of Guests</p>
                <p className="text-lg font-semibold">{state.guests} guests</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Guest Name</p>
                <p className="text-lg font-semibold">{state.customerName}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Reservation ID</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                  {state.reservationId}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Estimated Wait Time</p>
                <p className="text-lg font-semibold">25 minutes</p>
              </div>
            </div>
          </div>
        </GlassmorphismCard>

        {/* Order Details */}
        {state.cart.length > 0 && (
          <GlassmorphismCard className="p-8 mb-6">
            <h2 className="text-xl font-semibold text-roots-green mb-6">
              Your Order
            </h2>

            <div className="space-y-3 mb-6">
              {state.cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    {item.notes && (
                      <p className="text-xs text-gray-600">Notes: {item.notes}</p>
                    )}
                  </div>
                  <p className="font-semibold">
                    Ksh {(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Ksh {state.subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (18%)</span>
                <span>Ksh {state.tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                <span>Order Total</span>
                <span className="text-roots-green">
                  Ksh {(state.subtotal + state.tax).toFixed(0)}
                </span>
              </div>
            </div>
          </GlassmorphismCard>
        )}

        {/* Payment Details */}
        <GlassmorphismCard className="p-8 mb-6">
          <h2 className="text-xl font-semibold text-roots-green mb-6">
            Payment Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-700">Reservation Deposit</span>
              <span className="font-medium">Ksh 500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Food Total</span>
              <span className="font-medium">Ksh {state.subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">VAT (18%)</span>
              <span className="font-medium">Ksh {state.tax.toFixed(0)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-bold text-lg">TOTAL PAID</span>
              <span className="font-bold text-lg text-roots-green">
                Ksh {state.total.toFixed(0)}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 text-sm">
              <strong>Payment Method:</strong> {paymentMethodLabel[state.paymentMethod]}
            </p>
            <p className="text-blue-900 text-sm mt-1">
              <strong>Payment ID:</strong> {state.paymentId}
            </p>
          </div>
        </GlassmorphismCard>

        {/* Next Steps */}
        <GlassmorphismCard className="p-8 mb-6">
          <h2 className="text-xl font-semibold text-roots-green mb-4">
            What's Next?
          </h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-roots-green flex-shrink-0">1.</span>
              <span>
                You'll receive an SMS confirmation with your reservation details
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-roots-green flex-shrink-0">2.</span>
              <span>
                Arrive 5-10 minutes before your reservation time
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-roots-green flex-shrink-0">3.</span>
              <span>
                Your meals will be prepared and ready when you arrive
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-roots-green flex-shrink-0">4.</span>
              <span>
                Enjoy your meal at your reserved table!
              </span>
            </li>
          </ol>
        </GlassmorphismCard>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 bg-roots-green text-white rounded-lg 
                     hover:bg-roots-green/90 transition font-medium"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 border border-roots-green text-roots-green rounded-lg 
                     hover:bg-roots-green/10 transition font-medium"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};
