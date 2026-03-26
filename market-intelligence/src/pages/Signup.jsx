import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .signup-root {
    min-height: 100vh;
    background: #0d1117;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    color: #e6edf3;
  }

  .signup-left {
    flex: 1;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 56px;
    background: linear-gradient(160deg, #0d1117 0%, #111827 100%);
    border-right: 1px solid #1e2938;
  }

  .brand-mark { display: flex; flex-direction: column; gap: 4px; }
  .brand-name { font-family: 'DM Serif Display', serif; font-size: 22px; color: #e6edf3; }
  .brand-role { font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #4a9eff; }

  .features-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 0;
    gap: 28px;
  }

  .feature-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .feature-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(74,158,255,0.1);
    border: 1px solid rgba(74,158,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .feature-text h4 {
    font-size: 14px;
    font-weight: 600;
    color: #e6edf3;
    margin-bottom: 4px;
  }

  .feature-text p {
    font-size: 13px;
    color: #7d8590;
    line-height: 1.6;
  }

  .left-footer {
    font-size: 12px;
    color: #484f58;
    line-height: 1.7;
  }

  .signup-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    background: #0d1117;
  }

  .signup-card { width: 100%; max-width: 400px; }
  .card-title { font-size: 26px; font-weight: 700; color: #e6edf3; margin-bottom: 8px; letter-spacing: -0.4px; }
  .card-sub { font-size: 14px; color: #7d8590; margin-bottom: 36px; }

  .form-field { margin-bottom: 20px; }
  .form-label { display: block; font-size: 13px; font-weight: 500; color: #8d96a0; margin-bottom: 8px; }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 8px;
    color: #e6edf3;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }
  .form-input:focus { border-color: #4a9eff; background: #1a2130; }
  .form-input::placeholder { color: #3d444d; }

  .btn-primary {
    width: 100%;
    padding: 13px;
    background: #1f6feb;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.15s;
  }
  .btn-primary:hover { background: #388bfd; }
  .btn-primary:disabled { background: #21262d; color: #484f58; cursor: not-allowed; }

  .error-msg { font-size: 13px; color: #f85149; background: rgba(248,81,73,0.08); border: 1px solid rgba(248,81,73,0.2); border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; }
  .success-msg { font-size: 13px; color: #3fb950; background: rgba(63,185,80,0.08); border: 1px solid rgba(63,185,80,0.2); border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; }

  .divider { height: 1px; background: #21262d; margin: 28px 0; }
  .auth-link { text-align: center; font-size: 13px; color: #7d8590; }
  .auth-link a { color: #4a9eff; text-decoration: none; font-weight: 500; }

  .terms-note { font-size: 12px; color: #484f58; margin-top: 16px; text-align: center; line-height: 1.6; }
`

function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setMessage('Account created! Redirecting to login…')
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <>
      <style>{styles}</style>
      <div className="signup-root">
        <div className="signup-left">
          <div className="brand-mark">
            <div className="brand-name">YuktiLens</div>
            <div className="brand-role">Market Intelligence</div>
          </div>

          <div className="features-list">
            {[
              { icon: '📡', title: 'Real-time Signal Detection', desc: 'Track competitor pricing, campaigns, and web changes as they happen.' },
              { icon: '🧠', title: 'Predictive Strategy Engine', desc: 'Behavioral modeling predicts competitor moves 4–6 months ahead.' },
              { icon: '⚡', title: 'Decision Simulation Lab', desc: 'Run strategic scenarios before committing resources.' },
              { icon: '🗺️', title: 'Whitespace Opportunity Mapping', desc: 'Identify untapped market zones by competition density.' },
            ].map(f => (
              <div className="feature-item" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="left-footer">
            By joining YuktiLens you get access to all 5 intelligence engines<br />
            and real-time market signal feeds.
          </div>
        </div>

        <div className="signup-right">
          <div className="signup-card">
            <div className="card-title">Create your account</div>
            <div className="card-sub">Start exploring competitive intelligence today</div>

            <form onSubmit={handleSignup}>
              <div className="form-field">
                <label className="form-label">Email address</label>
                <input className="form-input" type="email" placeholder="analyst@firm.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Create a strong password"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              {error && <div className="error-msg">{error}</div>}
              {message && <div className="success-msg">{message}</div>}

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <div className="terms-note">
              By creating an account you agree to the Terms of Service and Privacy Policy.
            </div>
            <div className="divider" />
            <div className="auth-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup