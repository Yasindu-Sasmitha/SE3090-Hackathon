import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { HAZARD_CATEGORIES } from '../utils/sriLankaData';

export default function Admin() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/SafetyReports');
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setNotice({ type: 'error', text: 'Failed to fetch incident reports from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    setNotice(null);
    try {
      await api.put(`/SafetyReports/${id}/status`, { status: newStatus });
      setNotice({ type: 'success', text: `Hazard #${id} updated to status "${newStatus}".` });
      await fetchReports();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.status === 403 
        ? 'Permission Denied: Only users with Admin role can update report status. Please log in with admin@safelk.gov.lk'
        : 'Failed to update status.';
      setNotice({ type: 'error', text: errMsg });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to remove Hazard report #${id}?`)) return;
    setUpdatingId(id);
    setNotice(null);
    try {
      await api.delete(`/SafetyReports/${id}`);
      setNotice({ type: 'success', text: `Hazard report #${id} removed successfully.` });
      await fetchReports();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.status === 403 
        ? 'Permission Denied: Only Admin accounts can delete reports.'
        : 'Failed to delete report.';
      setNotice({ type: 'error', text: errMsg });
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '460px', margin: '0 auto', background: '#fff', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2>Official Authentication Required</h2>
          <p style={{ color: 'var(--slate-500)', margin: '0.75rem 0 1.5rem', fontSize: '0.9rem' }}>
            The Authority Portal is restricted to Municipal Council staff, Road Development Authority officers, and response coordinators.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In with Officer Credentials
          </Link>
        </div>
      </div>
    );
  }

  const filtered = reports.filter(r => {
    if (statusFilter === 'ALL') return true;
    return (r.status || '').toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.6rem', margin: 0 }}>Authority Resolution Portal</h1>
            <span className="badge badge-status-reported" style={{ textTransform: 'none' }}>
              {user.role || 'Officer'}
            </span>
          </div>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Manage civic reports, update dispatch statuses, and track community hazard resolutions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
            Logged in as: <strong>{user.name || user.email}</strong>
          </span>
          <Link to="/" className="btn btn-sm btn-outline">
            View Public Site →
          </Link>
        </div>
      </div>

      {notice && (
        <div 
          style={{ 
            padding: '0.85rem 1rem', 
            borderRadius: '8px', 
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: notice.type === 'error' ? 'var(--rose-light)' : '#ecfdf5',
            color: notice.type === 'error' ? 'var(--rose)' : '#059669',
            border: `1px solid ${notice.type === 'error' ? '#fecdd3' : '#a7f3d0'}`
          }}
        >
          {notice.type === 'error' ? '⚠️' : '✅'} {notice.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: `All Reports (${reports.length})` },
          { id: 'Reported', label: `Pending (${reports.filter(r => (r.status || '').toLowerCase() === 'reported').length})` },
          { id: 'In Progress', label: `In Progress (${reports.filter(r => (r.status || '').toLowerCase() === 'in progress').length})` },
          { id: 'Resolved', label: `Resolved (${reports.filter(r => (r.status || '').toLowerCase() === 'resolved').length})` }
        ].map(tab => (
          <button 
            key={tab.id}
            type="button" 
            onClick={() => setStatusFilter(tab.id)}
            className={`btn btn-sm ${statusFilter === tab.id ? 'btn-primary' : 'btn-outline'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>🔄 Loading incident records...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No reports in this category</h3>
          <p style={{ color: 'var(--slate-500)', margin: '0.5rem 0' }}>All issues in this view have been attended to.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hazard & Location</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const cat = HAZARD_CATEGORIES.find(c => c.id === item.category) || { name: item.category, icon: '⚠️' };
                const isUpdating = updatingId === item.id;
                return (
                  <tr key={item.id}>
                    <td>
                      <strong>#{item.id}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                        📍 {item.location}
                      </div>
                    </td>
                    <td>
                      <span className="hazard-category-chip">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                    </td>
                    <td>
                      <span 
                        className={`badge ${
                          (item.severity || '').toLowerCase() === 'high' ? 'badge-severity-high' :
                          (item.severity || '').toLowerCase() === 'medium' ? 'badge-severity-medium' :
                          'badge-severity-low'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={item.status} 
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        disabled={isUpdating}
                        className="form-select"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.825rem', width: 'auto', fontWeight: 600 }}
                      >
                        <option value="Reported">Reported</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Link to={`/detail/${item.id}`} className="btn btn-sm btn-outline" style={{ padding: '0.25rem 0.5rem' }}>
                          View
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          disabled={isUpdating}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '0.25rem 0.5rem', color: 'var(--rose)', borderColor: '#fecdd3' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}