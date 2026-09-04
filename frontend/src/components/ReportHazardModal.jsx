import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { SRI_LANKAN_DISTRICTS, HAZARD_CATEGORIES } from '../utils/sriLankaData';

const reportSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Hazard title must be at least 5 characters long.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
  category: z
    .string()
    .min(1, { message: 'Please select a hazard category.' }),
  district: z
    .string()
    .min(1, { message: 'Please select the Sri Lankan district.' }),
  specificLocation: z
    .string()
    .min(4, { message: 'Specify the street, town, or nearby landmark (e.g. Near clock tower, Kandy Road).' })
    .max(80, { message: 'Location detail is too long.' }),
  severity: z
    .enum(['Low', 'Medium', 'High'], { message: 'Please choose severity level.' }),
  description: z
    .string()
    .min(10, { message: 'Provide at least 10 characters describing the hazard and potential danger.' })
    .max(500, { message: 'Description cannot exceed 500 characters.' })
});

export default function ReportHazardModal({ isOpen, onClose, onReportCreated }) {
  const [serverError, setServerError] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: 'Road',
      severity: 'Medium',
      district: 'Colombo',
      title: '',
      specificLocation: '',
      description: ''
    }
  });

  const selectedCategory = watch('category');
  const selectedSeverity = watch('severity');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const fullLocation = `${data.specificLocation.trim()}, ${data.district}`;
      const payload = {
        title: data.title.trim(),
        category: data.category,
        location: fullLocation,
        description: data.description.trim(),
        severity: data.severity
      };

      const res = await api.post('/SafetyReports', payload);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        reset();
        onClose();
        if (onReportCreated) onReportCreated(res.data);
      }, 1200);
    } catch (err) {
      console.error('Failed to submit report:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Failed to submit report. Please verify connection to the server.';
      setServerError(typeof msg === 'string' ? msg : 'Error creating safety report.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Report a Community Hazard</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Notify your Sri Lankan Local Council, RDA, or CEB about dangerous conditions
            </p>
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
          {successNotice ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✅</div>
              <h3 style={{ color: 'var(--emerald)', marginBottom: '0.5rem' }}>Hazard Report Submitted!</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                Thank you for helping keep Sri Lanka safer. Your incident report has been logged.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {serverError && (
                <div style={{ padding: '0.75rem', background: 'var(--rose-light)', border: '1px solid #fecdd3', borderRadius: '8px', color: 'var(--rose)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                  ⚠️ {serverError}
                </div>
              )}

              {/* Title */}
              <div className="form-group">
                <label className="form-label">
                  Incident / Hazard Title <span style={{ color: 'var(--rose)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Deep Pothole after rain, Broken Streetlamp pole"
                  {...register('title')}
                />
                {errors.title && <div className="form-error">⚠️ {errors.title.message}</div>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Hazard Category <span style={{ color: 'var(--rose)' }}>*</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {HAZARD_CATEGORIES.map(cat => (
                    <label 
                      key={cat.id} 
                      style={{ 
                        border: selectedCategory === cat.id ? '2px solid var(--primary)' : '1px solid var(--slate-200)',
                        borderRadius: '8px',
                        padding: '0.5rem 0.6rem',
                        cursor: 'pointer',
                        background: selectedCategory === cat.id ? 'var(--primary-light)' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: selectedCategory === cat.id ? 'var(--primary-hover)' : 'var(--slate-700)'
                      }}
                    >
                      <input 
                        type="radio" 
                        value={cat.id} 
                        {...register('category')} 
                        style={{ display: 'none' }}
                      />
                      <span>{cat.icon}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</span>
                    </label>
                  ))}
                </div>
                {errors.category && <div className="form-error">⚠️ {errors.category.message}</div>}
              </div>

              {/* Location: District & Street */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">District <span style={{ color: 'var(--rose)' }}>*</span></label>
                  <select className="form-select" {...register('district')}>
                    {SRI_LANKAN_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.district && <div className="form-error">⚠️ {errors.district.message}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Street / Landmark / Town <span style={{ color: 'var(--rose)' }}>*</span></label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Galle Road near Clock Tower"
                    {...register('specificLocation')}
                  />
                  {errors.specificLocation && <div className="form-error">⚠️ {errors.specificLocation.message}</div>}
                </div>
              </div>

              {/* Severity Level */}
              <div className="form-group">
                <label className="form-label">Urgency & Severity <span style={{ color: 'var(--rose)' }}>*</span></label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                    { val: 'Low', label: 'Low (Inconvenience)', color: 'var(--slate-600)', bg: 'var(--slate-100)' },
                    { val: 'Medium', label: 'Medium (Potential Risk)', color: 'var(--amber)', bg: 'var(--amber-light)' },
                    { val: 'High', label: 'High (Immediate Danger)', color: 'var(--rose)', bg: 'var(--rose-light)' }
                  ].map(sev => (
                    <label 
                      key={sev.val}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        textAlign: 'center',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: selectedSeverity === sev.val ? `2px solid ${sev.color}` : '1px solid var(--slate-200)',
                        background: selectedSeverity === sev.val ? sev.bg : '#fff',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        color: sev.color
                      }}
                    >
                      <input 
                        type="radio" 
                        value={sev.val} 
                        {...register('severity')} 
                        style={{ display: 'none' }}
                      />
                      {sev.label}
                    </label>
                  ))}
                </div>
                {errors.severity && <div className="form-error">⚠️ {errors.severity.message}</div>}
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Detailed Description <span style={{ color: 'var(--rose)' }}>*</span></label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Describe the hazard, size, affected area, and risks to vehicles or pedestrians..."
                  {...register('description')}
                />
                {errors.description && <div className="form-error">⚠️ {errors.description.message}</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={onClose} className="btn btn-outline" disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting Report...' : 'Submit Incident Report 🇱🇰'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
