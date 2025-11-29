import React, { useState } from "react";
import TopNav from "./components/TopNav";
import SideMenu from "./components/SideMenu";
import HomeDashboard from "./pages/HomeDashboard";
import GalleryPage from "./pages/GalleryPage";
import VirtualTour from "./pages/VirtualTour";
import ArtworkDetailModal from "./components/ArtworkDetailModal";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CheckoutPage from "./pages/checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import UploadArtwork from "./pages/UploadArtwork";

import SettingsPage from "./pages/SettingsPage.jsx";  // ⬅️ make sure this line exists
import AdminPanel from "./pages/AdminPanel.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";

export default function App() {
  const [role, setRole] = useState(null)            // null = not logged in
  const [menuOpen, setMenuOpen] = useState(true)
  // 'home' | 'gallery' | 'tour' | 'checkout' | 'paymentSuccess' | 'upload' | 'settings' | 'admin' | 'manageUsers'
  const [route, setRoute] = useState('home')
  const [selected, setSelected] = useState(null)    // artwork for modal
  const [authView, setAuthView] = useState('login') // 'login' | 'signup'
  const [checkoutArtwork, setCheckoutArtwork] = useState(null) // artwork for payment flow

  const openArtwork = (art) => setSelected(art)
  const closeArtwork = () => setSelected(null)

  // when user clicks Buy in the modal
  const handleBuy = (art) => {
    setCheckoutArtwork(art)
    setSelected(null)
    setRoute('checkout')
  }

  const handleLogout = () => {
    setRole(null)
    setAuthView('login')
  }

  // ---------- AUTH SCREENS ----------
  if (!role) {
    return authView === 'login' ? (
      <Login
        onLogin={(r) => {
          setRole(r)
          setRoute('home')
        }}
        onSwitchToSignup={() => setAuthView('signup')}
      />
    ) : (
      <Signup onSwitchToLogin={() => setAuthView('login')} />
    )
  }

  // ---------- MAIN APP ----------
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <TopNav
        role={role}
        onOpenMenu={() => setMenuOpen(!menuOpen)}
        onLogout={handleLogout}
      />

      <div className="flex">
        {menuOpen && (
          <SideMenu role={role} active={route} onNavigate={setRoute} />
        )}

        <main className="flex-1">
          {/* HOME DASHBOARD */}
          {route === 'home' && (
            <HomeDashboard
              role={role}
              onOpenArtwork={openArtwork}
              onStartTour={() => setRoute('tour')}
            />
          )}

          {/* GALLERY – reads artworks from MongoDB inside GalleryPage */}
          {route === 'gallery' && (
            <GalleryPage
              role={role}
              onOpen={openArtwork}
            />
          )}

          {/* VIRTUAL TOUR */}
          {route === 'tour' && (
            <VirtualTour onOpenArtwork={openArtwork} />
          )}

          {/* ARTIST: UPLOAD ARTWORK PAGE */}
          {route === 'upload' && role === 'Artist' && (
            <UploadArtwork onDone={() => setRoute('gallery')} />
          )}

          {/* CHECKOUT PAGE */}
          {route === 'checkout' && (
            <CheckoutPage
              artwork={checkoutArtwork}
              onBack={() => setRoute('gallery')}
              onPaymentSuccess={() => setRoute('paymentSuccess')}
            />
          )}

          {/* PAYMENT SUCCESS / RECEIPT */}
          {route === 'paymentSuccess' && (
            <PaymentSuccess
              artwork={checkoutArtwork}
              role={role}
              onDone={() => {
                setRoute('gallery')
                setCheckoutArtwork(null)
              }}
            />
          )}

          {/* SETTINGS – any logged-in role */}
          {route === 'settings' && (
            <SettingsPage
              onLogout={handleLogout}
            />
          )}

          {/* ADMIN PAGES – Admin only */}
          {route === 'admin' && role === 'Admin' && (
            <AdminPanel role={role} />
          )}

          {route === 'manageUsers' && role === 'Admin' && (
            <ManageUsers />
          )}
        </main>
      </div>

      {/* ARTWORK MODAL (used from Home / Gallery / Tour) */}
      <ArtworkDetailModal
        art={selected}
        onClose={closeArtwork}
        onBuy={handleBuy}
      />
    </div>
  )
}
