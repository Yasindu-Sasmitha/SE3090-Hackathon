import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
});

const registerSchema = z.object({
  name: z.string().min(3, 'Officer / User name must be at least 3 characters.'),
  email: z.string().email('Please enter a valid official or personal email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
});

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login, register: authRegister } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(isRegistering ? registerSchema : loginSchema)
  });

  const handleAutofillDemo = () => {
    setValue('email', 'admin@safelk.gov.lk');
    setValue('password', 'Admin123!');
    if (isRegistering) {
      setValue('name', 'Municipal Officer Gamage');
    }
  };

  const onSubmit = async (data) => {
    setAuthError('');
    setSuccessMsg('');
    try {
      if (isRegistering) {
        await authRegister(data.name, data.email, data.password);
        // Automatically log in after registration
        await login(data.email, data.password);
        navigate('/admin');
      } else {
        await login(data.email, data.password);
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
      if (isRegistering) {
        setAuthError(err.response?.data || 'Registration failed. This email may already exist.');
      } else {
        // If login failed on demo account because it's not registered yet, give friendly hint
        if (data.email === 'admin@safelk.gov.lk') {
          // Auto register demo admin!
          try {
            await authRegister('SafeLK Officer', 'admin@safelk.gov.lk', 'Admin123!');
            await login('admin@safelk.gov.lk', 'Admin123!');
            navigate('/admin');
            return;
          } catch (regErr) {
            console.error(regErr);
          }
        }
        setAuthError('Invalid credentials. Please check your email and password.');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          background: '#fff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}
      >
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '1.75rem', textAlign: 'center' }}>
          <span style={{ fontSize: '2rem' }}>🏛️</span>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            Authority & Officer Portal
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Sri Lanka Municipal Councils, RDA & Emergency Response
          </p>
        </div>

        {/* Demo Fast Track Banner */}
        <div style={{ padding: '0.75rem 1.25rem', background: '#ecfdf5', borderBottom: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#065f46' }}>
            💡 <strong>Hackathon Demo Admin:</strong><br />
            <code>admin@safelk.gov.lk</code>
          </div>
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="btn btn-sm btn-emerald"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
          >
            ⚡ Auto-Fill
          </button>
        </div>

        <div style={{ padding: '1.75rem' }}>
          {/* Tab Switcher */}
          <div style={{ display: 'flex', borderBottom: '2px solid var(--slate-100)', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setAuthError(''); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                color: !isRegistering ? 'var(--primary)' : 'var(--slate-400)',
                borderBottom: !isRegistering ? '2px solid var(--primary)' : 'none',
                marginBottom: '-2px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(true); setAuthError(''); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                color: isRegistering ? 'var(--primary)' : 'var(--slate-400)',
                borderBottom: isRegistering ? '2px solid var(--primary)' : 'none',
                marginBottom: '-2px',
                cursor: 'pointer'
              }}
            >
              Register Officer
            </button>
          </div>

          {authError && (
            <div style={{ padding: '0.75rem', background: 'var(--rose-light)', border: '1px solid #fecdd3', borderRadius: '8px', color: 'var(--rose)', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 600 }}>
              ⚠️ {authError}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '0.75rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#059669', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 600 }}>
              ✅ {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {isRegistering && (
              <div className="form-group">
                <label className="form-label">Full Name / Department</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Officer K. Perera (CMC)"
                  {...register('name')}
                />
                {errors.name && <div className="form-error">{errors.name.message}</div>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="officer@safelk.gov.lk"
                {...register('email')}
              />
              {errors.email && <div className="form-error">{errors.email.message}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <div className="form-error">{errors.password.message}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : isRegistering ? 'Register as Officer' : 'Access Authority Portal'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            <Link to="/" style={{ color: 'var(--slate-600)' }}>
              ← Return to Citizen Public View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}