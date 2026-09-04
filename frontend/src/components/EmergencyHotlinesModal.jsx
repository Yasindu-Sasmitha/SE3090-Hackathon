import { EMERGENCY_NUMBERS } from '../utils/sriLankaData';

export default function EmergencyHotlinesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header" style={{ background: '#fef2f2', borderBottomColor: '#fecdd3' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚨</span>
            <div>
              <h3 style={{ color: '#991b1b', margin: 0 }}>Sri Lanka Emergency Hotlines</h3>
              <p style={{ fontSize: '0.8rem', color: '#b91c1c', margin: 0 }}>
                Immediate assistance for life-threatening or urgent incidents
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-sm btn-outline" 
            style={{ border: 'none', fontSize: '1.25rem', padding: '0 0.5rem', background: 'transparent' }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {EMERGENCY_NUMBERS.map(item => (
              <div 
                key={item.number} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  border: '1px solid #fee2e2',
                  borderRadius: '8px',
                  background: '#fff'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{item.service}</div>
                  <span className="badge badge-severity-high" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', marginTop: '0.2rem' }}>
                    {item.badge}
                  </span>
                </div>
                <a 
                  href={`tel:${item.number}`}
                  className="btn btn-sm btn-danger"
                  style={{ fontWeight: 800, letterSpacing: '0.05em', minWidth: '85px' }}
                >
                  📞 {item.number}
                </a>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' }}>
            💡 <strong>Tip for Non-Emergency Hazards:</strong> For broken streetlights, road potholes, and open drains, please use the SafeLK Report Form below so the relevant Municipal Council or RDA can schedule maintenance.
          </div>
        </div>
      </div>
    </div>
  );
}

