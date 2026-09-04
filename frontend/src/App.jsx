import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReportHazardModal from './components/ReportHazardModal';
import EmergencyHotlinesModal from './components/EmergencyHotlinesModal';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './App.css';

function MainApp() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const handleReportCreated = () => {
    // Triggers refresh by reloading or event
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sri Lanka Emergency Quick Banner */}
      <div className="emergency-strip">
        <div className="container emergency-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🇱🇰 Sri Lanka National Emergency Response:</span>
          </div>
          <div className="emergency-items">
            <span className="emergency-pill">🚨 Police: 119</span>
            <span className="emergency-pill">🚑 Suwa Seriya: 1990</span>
            <span className="emergency-pill">🚒 Fire: 110</span>
            <span className="emergency-pill">⚡ CEB Power: 1987</span>
            <span className="emergency-pill">🌪️ Disaster: 117</span>
          </div>
        </div>
      </div>

      <Navbar 
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
              />
            } 
          />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals */}
      <ReportHazardModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        onReportCreated={handleReportCreated}
      />

      <EmergencyHotlinesModal 
        isOpen={isEmergencyModalOpen} 
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </AuthProvider>
  );
}