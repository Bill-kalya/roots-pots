import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReservationRequest, Table } from '../types';

interface ReservationState {
  currentReservation: ReservationRequest | null;
  selectedTable: Table | null;
  bookingDate: string | null;
  bookingTime: string | null;
  isBookingModalOpen: boolean;
  
  // Actions
  setSelectedTable: (table: Table | null) => void;
  setBookingDateTime: (date: string, time: string) => void;
  setCurrentReservation: (reservation: ReservationRequest | null) => void;
  openBookingModal: () => void;
  closeBookingModal: () => void;
  clearReservation: () => void;
}

export const useReservationStore = create<ReservationState>()(
  persist(
    (set) => ({
      currentReservation: null,
      selectedTable: null,
      bookingDate: null,
      bookingTime: null,
      isBookingModalOpen: false,

      setSelectedTable: (table) => set({ selectedTable: table }),
      
      setBookingDateTime: (date, time) => set({ bookingDate: date, bookingTime: time }),
      
      setCurrentReservation: (reservation) => set({ currentReservation: reservation }),
      
      openBookingModal: () => set({ isBookingModalOpen: true }),
      
      closeBookingModal: () => set({ isBookingModalOpen: false }),
      
      clearReservation: () => set({
        currentReservation: null,
        selectedTable: null,
        bookingDate: null,
        bookingTime: null,
        isBookingModalOpen: false,
      }),
    }),
    {
      name: 'reservation-storage',
    }
  )
);