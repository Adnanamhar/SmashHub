"use client";

import React, { useEffect } from 'react';

// Hooks
import { useAuth } from '@/app/hooks/useAuth';
import { useToast } from '@/app/hooks/useToast';
import { useCourts } from '@/app/hooks/useCourts';
import { useBookings } from '@/app/hooks/useBookings';
import { useEvents } from '@/app/hooks/useEvents';

// Components
import Navbar from '@/app/components/Navbar';
import Hero from '@/app/components/Hero';
import HomeContent from '@/app/components/HomeContent';
import LoginModal from '@/app/components/LoginModal';
import RegisterModal from '@/app/components/RegisterModal';
import ForgotPasswordModal from '@/app/components/ForgotPasswordModal';
import Footer from '@/app/components/Footer';
import ToastContainer from '@/app/components/ToastContainer';
import OwnerDashboard from '@/app/components/owner/OwnerDashboard';
import UserDashboard from '@/app/components/user/UserDashboard';

export default function SmashHubApp() {
  // --- HOOKS ---
  const auth = useAuth();
  const { toasts, toast, removeToast } = useToast();
  const courtsHook = useCourts();
  const bookingsHook = useBookings();
  const eventsHook = useEvents();

  // --- DATA LOADING ---
  useEffect(() => {
    courtsHook.fetchCourts();
    eventsHook.fetchEvents();
    bookingsHook.fetchAllBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch participants when events change (for owner)
  useEffect(() => {
    if (eventsHook.events.length > 0) {
      eventsHook.fetchAllParticipants(eventsHook.events);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsHook.events.length]);

  // Auto-select first court when courts load
  useEffect(() => {
    if (courtsHook.courts.length > 0 && !bookingsHook.selectedCourt) {
      bookingsHook.setSelectedCourt(courtsHook.courts[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courtsHook.courts]);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Login Modal */}
      <LoginModal
        showLogin={auth.showLogin}
        loginForm={auth.loginForm}
        setLoginForm={auth.setLoginForm}
        handleLogin={auth.handleLogin}
        onError={toast.error}
        onShowRegister={() => { auth.setShowLogin(false); auth.setShowRegister(true); }}
        onShowForgotPassword={() => { auth.setShowLogin(false); auth.setShowForgotPassword(true); }}
      />

      <RegisterModal
        showRegister={auth.showRegister}
        registerForm={auth.registerForm}
        setRegisterForm={auth.setRegisterForm}
        handleRegister={auth.handleRegister}
        onShowLogin={() => { auth.setShowRegister(false); auth.setShowLogin(true); }}
        onSuccess={toast.success}
        onError={toast.error}
      />

      <ForgotPasswordModal
        showForgotPassword={auth.showForgotPassword}
        setShowForgotPassword={auth.setShowForgotPassword}
        handleForgotPassword={auth.handleForgotPassword}
        handleResetPassword={auth.handleResetPassword}
        onShowLogin={() => { auth.setShowForgotPassword(false); auth.setShowLogin(true); }}
        onSuccess={toast.success}
        onError={toast.error}
      />

      {/* Navbar */}
      <Navbar
        role={auth.role}
        showLogin={auth.showLogin}
        setShowLogin={auth.setShowLogin}
        setView={auth.setView}
        handleLogout={auth.handleLogout}
      />

      {/* Home View */}
      {auth.view === 'home' && (
        <div className="animate-in fade-in duration-1000">
          <Hero setShowLogin={auth.setShowLogin} />
          <HomeContent setShowLogin={auth.setShowLogin} />
        </div>
      )}

      {/* Dashboard View */}
      {auth.view === 'dashboard' && (
        <div className="bg-slate-50 min-h-[calc(100vh-80px)]">
          {auth.role === 'owner' ? (
            <OwnerDashboard
              courts={courtsHook.courts}
              courtsLoading={courtsHook.isLoading}
              form={courtsHook.form}
              setForm={courtsHook.setForm}
              editingCourt={courtsHook.editingCourt}
              handleSaveCourt={courtsHook.handleSaveCourt}
              handleDeleteCourt={courtsHook.handleDeleteCourt}
              startEditCourt={courtsHook.startEditCourt}
              cancelEditCourt={courtsHook.cancelEditCourt}
              events={eventsHook.events}
              eventForm={eventsHook.eventForm}
              setEventForm={eventsHook.setEventForm}
              handleSaveEvent={eventsHook.handleSaveEvent}
              allBookings={bookingsHook.allBookings}
              bookingsLoading={bookingsHook.isLoading}
              eventParticipants={eventsHook.eventParticipants}
              onSuccess={toast.success}
              onError={toast.error}
            />
          ) : (
            <UserDashboard
              courts={courtsHook.courts}
              courtsLoading={courtsHook.isLoading}
              selectedCourt={bookingsHook.selectedCourt}
              setSelectedCourt={bookingsHook.setSelectedCourt}
              selectedDate={bookingsHook.selectedDate}
              setSelectedDate={bookingsHook.setSelectedDate}
              selectedTime={bookingsHook.selectedTime}
              setSelectedTime={bookingsHook.setSelectedTime}
              getNext7Days={bookingsHook.getNext7Days}
              isSlotBooked={bookingsHook.isSlotBooked}
              handleBooking={bookingsHook.handleBooking}
              handleCancelBooking={bookingsHook.handleCancelBooking}
              allBookings={bookingsHook.allBookings}
              events={eventsHook.events}
              eventsLoading={eventsHook.isLoading}
              joinedEvents={eventsHook.joinedEvents}
              handleJoinEvent={eventsHook.handleJoinEvent}
              onSuccess={toast.success}
              onError={toast.error}
            />
          )}
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}