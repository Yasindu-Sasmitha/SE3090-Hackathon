import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenReportModal, onOpenEmergencyModal }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand-logo">
          <span className="brand-flag" role="img" aria-label="Sri Lanka">🇱🇰</span>
          <div>
            <span>SafeLK</span>
            <span className="brand-subtitle">Community Safety</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Explore Hazards
          </Link>

          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="btn btn-sm btn-outline"
            style={{ color: '#dc2626', borderColor: '#fecdd3', background: '#fff1f2' }}
          >
            🚨 Emergency (119 / 1990)
          </button>

          <button
            type="button"
            onClick={onOpenReportModal}
            className="btn btn-sm btn-emerald"
          >
            + Report Hazard
          </button>

          <Link
            to="/admin"
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            Authority Portal
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-status-reported" style={{ textTransform: 'none' }}>
                👤 {user.name || user.email}
              </span>
              <button onClick={logout} className="btn btn-sm btn-outline" style={{ padding: '0.25rem 0.5rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-outline">
              Officer Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
