import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { HAZARD_CATEGORIES } from '../utils/sriLankaData';

export default function Detail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifiedCount, setVerifiedCount] = useState(1);
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/SafetyReports/${id}`)
      .then(res => setReport(res.data))
      .catch(err => {
        console.error(err);
        setError('Hazard report not found or server error.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleVerify = () => {
    if (!hasVerified) {
      setVerifiedCount(prev => prev + 1);
      setHasVerified(true);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <p style={{ color: 'var(--slate-500)', fontWeight: 600 }}>Loading incident details...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2>Report Not Found</h2>
        <p style={{ color: 'var(--slate-500)', margin: '0.5rem auto 1.5rem', maxWidth: '400px' }}>
          {error || 'The requested incident report ID does not exist in the system.'}
        </p>
        <Link to="/" className="btn btn-primary">
          ← Back to All Hazards
        </Link>
      </div>
    );
  }

  const catInfo = HAZARD_CATEGORIES.find(c => c.id === report.category) || {
    name: report.category || 'General',
    icon: '⚠️',
    authority: 'Local Municipal Council / Police'
  };

  const statusStep = (() => {
    const s = (report.status || '').toLowerCase();
    if (s === 'resolved') return 3;
    if (s === 'in progress') return 2;
    return 1;
  })();

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" className="btn btn-sm btn-outline">
          ← Back to Hazard Explorer
        </Link>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="hazard-category-chip">
                <span>{catInfo.icon}</span>
                <span>{catInfo.name}</span>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', fontWeight: 600 }}>
                Incident #{report.id}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{report.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-600)', fontSize: '0.9rem' }}>
              <span>📍 Location:</span>
              <strong>{report.location}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span 
              className={`badge ${
                (report.severity || '').toLowerCase() === 'high' ? 'badge-severity-high' :
                (report.severity || '').toLowerCase() === 'medium' ? 'badge-severity-medium' :
                'badge-severity-low'
              }`}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              {report.severity} Severity
            </span>
          </div>
        </div>

        {/* Responsible Authority Box */}
        <div style={{ padding: '1rem 1.25rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0369a1', fontWeight: 700 }}>
              Designated Sri Lankan Authority
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0c4a6e' }}>
              🏛️ {catInfo.authority}
            </div>
          </div>
          <span className="badge badge-status-inprogress" style={{ textTransform: 'none' }}>
            Status: {report.status}
          </span>
        </div>

        {/* Progress Lifecycle Timeline */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Resolution Progress
          </h4>
          <div className="timeline">
            <div className={`timeline-step ${statusStep >= 1 ? 'active' : ''}`}>
              <div className="timeline-dot">1</div>
              <span className="timeline-label">Reported</span>
            </div>
            <div className={`timeline-step ${statusStep >= 2 ? 'active' : ''}`}>
              <div className="timeline-dot">2</div>
              <span className="timeline-label">In Progress</span>
            </div>
            <div className={`timeline-step ${statusStep >= 3 ? 'active' : ''}`}>
              <div className="timeline-dot">3</div>
              <span className="timeline-label">Resolved</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--slate-700)', marginBottom: '0.5rem' }}>
            Citizen Report Description
          </h4>
          <p style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--slate-200)', lineHeight: 1.6, color: 'var(--slate-700)' }}>
            {report.description || 'No additional description provided.'}
          </p>
        </div>

        {/* Community Verification & Action Strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              Reported on {report.reportedAt ? new Date(report.reportedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently reported'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={handleVerify}
              className={`btn btn-sm ${hasVerified ? 'btn-emerald' : 'btn-outline'}`}
            >
              {hasVerified ? '✓ You confirmed this hazard' : `👍 Confirm / Witnessed (${verifiedCount})`}
            </button>
            <Link to="/admin" className="btn btn-sm btn-outline">
              Authority Update ⚙️
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
