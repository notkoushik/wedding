import { useState, useEffect } from 'react'
import { NavBar } from './components/common/NavBar'
import { MobileBottomBar } from './components/common/MobileBottomBar'
import { HeroSection } from './components/hero/HeroSection'
import { MusicPlayer } from './components/hero/MusicPlayer'
import { TeluguRitualsSection } from './components/rituals/TeluguRitualsSection'
import { InvitationSection } from './components/invitation/InvitationSection'
import { EventsSection } from './components/events/EventsSection'
import { VenuesSection } from './components/venues/VenuesSection'
import { GallerySection } from './components/gallery/GallerySection'
import { WishesWall } from './components/wishes/WishesWall'
import { RsvpSection } from './components/rsvp/RsvpSection'
import { Footer } from './components/common/Footer'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { AccessibilityBar } from './components/common/AccessibilityBar'
import { PetalShower } from './components/common/PetalShower'

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleCloseAdmin = () => {
    setIsAdminOpen(false)
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname)
    }
  }

  return (
    <div className="min-h-screen bg-ivory font-body text-[#1c0a0a] selection:bg-gold selection:text-white pb-14 lg:pb-0">
      {/* Fixed Luxury Desktop & Mobile Header Navigation */}
      <NavBar />

      {/* Quick Accessibility & Elder Font Clarity Tools */}
      <AccessibilityBar />

      {/* Sticky Mobile Quick-Action Dock (RSVP, Maps, WhatsApp, Shubhlekha) */}
      <MobileBottomBar />

      {/* Floating Traditional Ambient Music Player */}
      <MusicPlayer />

      {/* 🌸 Interactive 3D Turmeric & Rose Petal Shower Celebration Effect */}
      <PetalShower />

      {/* Grand Royal Hero Section */}
      <HeroSection />

      {/* Sacred Telugu Wedding Traditions & Aesthetic Art Stickers */}
      <TeluguRitualsSection />

      {/* Interactive Digital Shubhlekha & 3D Folio Card Viewer */}
      <InvitationSection />

      {/* Milestone Events & Muhurtham Schedule */}
      <EventsSection />

      {/* Venues & Live Navigation */}
      <VenuesSection />

      {/* Photo Gallery & Lightbox */}
      <GallerySection />

      {/* Live Interactive Blessings / Wishes Wall */}
      <WishesWall />

      {/* Guest RSVP & Attendance Registration */}
      <RsvpSection />

      {/* Royal Footer */}
      <Footer />

      {/* 🔒 Family Admin Dashboard Modal */}
      <AdminDashboard isOpen={isAdminOpen} onClose={handleCloseAdmin} />
    </div>
  )
}
