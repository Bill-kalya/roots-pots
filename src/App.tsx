import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Booking } from './pages/Booking';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { RestaurantSetup } from './pages/Admin/RestaurantSetup';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/booking/:tableId" element={<Booking />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/setup" element={<RestaurantSetup />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;