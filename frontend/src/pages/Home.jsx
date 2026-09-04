import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { SRI_LANKAN_DISTRICTS, HAZARD_CATEGORIES, INITIAL_SAMPLE_REPORTS } from '../utils/sriLankaData';

export default function Home({ onOpenReportModal, onOpenEmergencyModal }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [seedingLoading, setSeedingLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/SafetyReports');
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching safety reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Quick Seed Realistic Data to Backend
  const handleSeedSampleData = async () => {
    setSeedingLoading(true);
    try {
      for (const item of INITIAL_SAMPLE_REPORTS) {
        await api.post('/SafetyReports', item);
      }
      await fetchReports();
    } catch (err) {
      console.error('Error seeding sample data:', err);
    } finally {
      setSeedingLoading(false);
    }
  };

  // Live Statistics Calculations (Required: calculate / process data)
  const stats = useMemo(() => {
    const total = reports.length;
    const reported = reports.filter(r => (r.status || '').toLowerCase() === 'reported').length;
    const inProgress = reports.filter(r => (r.status || '').toLowerCase() === 'in progress').length;
    const resolved = reports.filter(r => (r.status || '').toLowerCase() === 'resolved').length;
    const highSeverity = reports.filter(r => (r.severity || '').toLowerCase() === 'high').length;

    return { total, reported, inProgress, resolved, highSeverity };
  }, [reports]);

  // Search and Multi-Criteria Filtering
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (report.title || '').toLowerCase().includes(q);
        const matchesLoc = (report.location || '').toLowerCase().includes(q);
        const matchesDesc = (report.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && report.category !== selectedCategory) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'ALL' && (report.severity || '').toLowerCase() !== selectedSeverity.toLowerCase()) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && (report.status || '').toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }

      // District filter
      if (selectedDistrict !== 'ALL') {
        const loc = (report.location || '').toLowerCase();
        if (!loc.includes(selectedDistrict.toLowerCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.reportedAt || 0) - new Date(a.reportedAt || 0);
      }
      if (sortBy === 'severity') {
        const weight = { High: 3, Medium: 2, Low: 1 };
        return (weight[b.severity] || 0) - (weight[a.severity] || 0);
      }
      return 0;
    });
  }, [reports, searchQuery, selectedCategory, selectedSeverity, selectedStatus, selectedDistrict, sortBy]);

  const getCategoryInfo = (catId) => {
    return HAZARD_CATEGORIES.find(c => c.id === catId) || { name: catId || 'Hazard', icon: '⚠️' };
  };

  const getSeverityBadgeClass = (sev) => {
    const s = (sev || '').toLowerCase();
    if (s === 'high') return 'badge-severity-high';
    if (s === 'medium') return 'badge-severity-medium';
    return 'badge-severity-low';
  };

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved') return 'badge-status-resolved';
    if (s === 'in progress') return 'badge-status-inprogress';
    return 'badge-status-reported';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently reported';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Recently reported' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      {/* Hero Section & In-App Sri Lankan Problem Explanation */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-tag">
                <span>🇱🇰 Build for Sri Lanka Initiative</span>
              </div>
              <h1 className="hero-title">
                Crowdsourced Community Safety for Sri Lanka
              </h1>
              <p className="hero-subtitle">
                Empowering Sri Lankan citizens to flag road potholes, broken streetlights, open storm drains, and hazards directly to Municipal Councils, RDA, and CEB.
              </p>
              <div className="hero-actions">
                <button 
                  type="button" 
                  onClick={onOpenReportModal}
                  className="btn btn-emerald"
                  style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                >
                  📢 Report a Hazard in Your Area
                </button>
                <button 
                  type="button" 
                  onClick={onOpenEmergencyModal}
                  className="btn btn-outline"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  🚨 Sri Lanka Hotlines (119 / 1990)
                </button>
              </div>
            </div>

            {/* In-App Explanation of the Sri Lankan Problem */}
            <div className="problem-card">
              <div className="problem-card-header">
                <span>📌 The Problem in Sri Lanka</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                Thousands of preventable accidents occur annually across Sri Lanka due to unreported public infrastructure defects:
              </p>
              <ul className="problem-points">
                <li>
                  <span>⚠️</span>
                  <span><strong>Monsoon Storm Drains:</strong> Uncovered deep drains flood during rains, posing fatal risks to pedestrians.</span>
                </li>
                <li>
                  <span>💡</span>
                  <span><strong>Dark Walkways:</strong> Unlit bus stands and roads compromise women's and student safety at night.</span>
                </li>
                <li>
                  <span>🚧</span>
                  <span><strong>Severe Potholes:</strong> Dangerous craters on A- & B-grade roads cause frequent motorcycle and three-wheeler crashes.</span>
                </li>
                <li>
                  <span>🏛️</span>
                  <span><strong>Fragmented Reporting:</strong> Citizens lack a direct, transparent channel to reach local Pradeshiya Sabhas and RDA.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Real-Time Calculated Metrics Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">📊</div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Reported</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-rose">🚨</div>
            <div className="stat-info">
              <span className="stat-value">{stats.highSeverity}</span>
              <span className="stat-label">High Risk Hazards</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-amber">⏳</div>
            <div className="stat-info">
              <span className="stat-value">{stats.inProgress}</span>
              <span className="stat-label">Under Inspection</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-emerald">✅</div>
            <div className="stat-info">
              <span className="stat-value">{stats.resolved}</span>
              <span className="stat-label">Resolved Issues</span>
            </div>
          </div>
        </div>

        {/* Search, Multi-Criteria Filter & Sort Toolbar */}
        <div className="filter-container">
          <div className="filter-row">
            {/* Search Box */}
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search hazards by title, street, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Selects */}
            <div className="filter-selects">
              <select 
                className="form-select" 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                style={{ width: 'auto', minWidth: '150px' }}
              >
                <option value="ALL">All Sri Lanka Districts</option>
                {SRI_LANKAN_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select 
                className="form-select" 
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="ALL">All Severities</option>
                <option value="High">🔴 High Severity</option>
                <option value="Medium">🟡 Medium Severity</option>
                <option value="Low">⚪ Low Severity</option>
              </select>

              <select 
                className="form-select" 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select 
                className="form-select" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="newest">Sort: Newest First</option>
                <option value="severity">Sort: Highest Risk</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            <button 
              type="button" 
              className={`category-tab ${selectedCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('ALL')}
            >
              <span>🌐</span>
              <span>All Categories</span>
            </button>
            {HAZARD_CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                type="button" 
                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hazards Feed Header */}
        <div className="hazards-header">
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Live Sri Lanka Incident Reports</h2>
            <div className="hazards-count">
              Showing {filteredReports.length} of {reports.length} community hazards
            </div>
          </div>

          {reports.length <= 2 && (
            <button 
              onClick={handleSeedSampleData} 
              className="btn btn-sm btn-outline"
              disabled={seedingLoading}
              title="Populate authentic Sri Lankan hazard reports for demonstration"
            >
              {seedingLoading ? 'Loading Samples...' : '⚡ Load Sample Sri Lanka Hazards'}
            </button>
          )}
        </div>

        {/* Hazard Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
            <p style={{ color: 'var(--slate-500)', fontWeight: 600 }}>Loading active hazard reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <h3>No Hazards Found</h3>
            <p style={{ color: 'var(--slate-500)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
              No reports match your current filter criteria. Try resetting your search or report a new incident.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedSeverity('ALL');
                  setSelectedStatus('ALL');
                  setSelectedDistrict('ALL');
                }} 
                className="btn btn-outline"
              >
                Reset Filters
              </button>
              <button onClick={onOpenReportModal} className="btn btn-emerald">
                Report a Hazard
              </button>
            </div>
          </div>
        ) : (
          <div className="hazards-grid">
            {filteredReports.map(report => {
              const catInfo = getCategoryInfo(report.category);
              return (
                <article key={report.id} className="hazard-card">
                  <div className="hazard-card-top">
                    <span className="hazard-category-chip">
                      <span>{catInfo.icon}</span>
                      <span>{catInfo.name}</span>
                    </span>
                    <span className={`badge ${getSeverityBadgeClass(report.severity)}`}>
                      {report.severity}
                    </span>
                  </div>

                  <h3 className="hazard-title">{report.title}</h3>

                  <div className="hazard-location">
                    <span>📍</span>
                    <span>{report.location}</span>
                  </div>

                  <p className="hazard-desc">
                    {report.description || 'No detailed description provided by citizen.'}
                  </p>

                  <div className="hazard-footer">
                    <div>
                      <span className={`badge ${getStatusBadgeClass(report.status)}`} style={{ marginRight: '0.5rem' }}>
                        {report.status}
                      </span>
                      <span>{formatDate(report.reportedAt)}</span>
                    </div>

                    <Link to={`/detail/${report.id}`} className="btn btn-sm btn-outline" style={{ padding: '0.3rem 0.6rem' }}>
                      Inspect →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}