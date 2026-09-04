export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-inner">
        <div>
          <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🇱🇰 SafeLK</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>• Community Safety Reporting System</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
            Built for Sri Lanka — SE3090 Mini Hackathon 2026
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
          <div>
            <strong style={{ color: '#cbd5e1' }}>Direct Stakeholders:</strong> RDA, CEB, DMC, Municipal Councils
          </div>
          <div>
            <strong style={{ color: '#cbd5e1' }}>Police Emergency:</strong> 119
          </div>
          <div>
            <strong style={{ color: '#cbd5e1' }}>Ambulance:</strong> 1990
          </div>
        </div>
      </div>
    </footer>
  );
}
