import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background: #0d1117;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    color: #e6edf3;
  }

  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 56px;
    background: linear-gradient(160deg, #0d1117 0%, #111827 100%);
    border-right: 1px solid #1e2938;
    max-width: 520px;
  }

  .brand-mark {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: #e6edf3;
    letter-spacing: -0.3px;
  }

  .brand-role {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #4a9eff;
  }

  .login-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 0;
  }

  .login-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #4a9eff;
    margin-bottom: 20px;
  }

  .login-headline {
    font-family: 'DM Serif Display', serif;
    font-size: 42px;
    line-height: 1.15;
    color: #e6edf3;
    margin-bottom: 20px;
    letter-spacing: -0.5px;
  }

  .login-headline em {
    font-style: italic;
    color: #4a9eff;
  }

  .login-sub {
    font-size: 15px;
    color: #7d8590;
    line-height: 1.7;
    max-width: 340px;
  }

  .stat-row {
    display: flex;
    gap: 32px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-val {
    font-family: 'DM Serif Display', serif;
    font-size: 28px;
    color: #e6edf3;
  }

  .stat-label {
    font-size: 12px;
    color: #7d8590;
  }

  .login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    background: #0d1117;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
  }

  .card-title {
    font-size: 26px;
    font-weight: 700;
    color: #e6edf3;
    margin-bottom: 8px;
    letter-spacing: -0.4px;
  }

  .card-sub {
    font-size: 14px;
    color: #7d8590;
    margin-bottom: 36px;
  }

  .form-field {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #8d96a0;
    margin-bottom: 8px;
    letter-spacing: 0.3px;
  }

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

  .form-input:focus {
    border-color: #4a9eff;
    background: #1a2130;
  }

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
    letter-spacing: 0.2px;
  }

  .btn-primary:hover { background: #388bfd; }
  .btn-primary:disabled { background: #21262d; color: #484f58; cursor: not-allowed; }

  .error-msg {
    font-size: 13px;
    color: #f85149;
    background: rgba(248,81,73,0.08);
    border: 1px solid rgba(248,81,73,0.2);
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 16px;
  }

  .auth-link {
    text-align: center;
    font-size: 13px;
    color: #7d8590;
    margin-top: 28px;
  }

  .auth-link a {
    color: #4a9eff;
    text-decoration: none;
    font-weight: 500;
  }

  .divider {
    height: 1px;
    background: #21262d;
    margin: 28px 0;
  }

  .engine-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
  }

  .engine-badge {
    padding: 5px 12px;
    background: rgba(74,158,255,0.08);
    border: 1px solid rgba(74,158,255,0.2);
    border-radius: 100px;
    font-size: 12px;
    color: #4a9eff;
    font-weight: 500;
  }
`

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/onboarding')
  }

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-left">
          <div className="brand-mark">
            <div className="brand-name">YuktiLens</div>
            <div className="brand-role">Market Intelligence</div>
          </div>

          <div className="login-hero">
            <div className="login-eyebrow">Competitive Intelligence Platform</div>
            <h1 className="login-headline">
              See what your<br />competitors do <em>before</em><br />they announce it.
            </h1>
            <p className="login-sub">
              Behavioral modeling, predictive signals, and strategic simulations — built for analysts who need an edge.
            </p>
            <div className="engine-badges">
              <span className="engine-badge">Pricing Engine</span>
              <span className="engine-badge">Signal Detection</span>
              <span className="engine-badge">Risk Tracker</span>
              <span className="engine-badge">Decision Simulation</span>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-val">5</span>
              <span className="stat-label">Intelligence engines</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">Real‑time</span>
              <span className="stat-label">Signal detection</span>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="card-title">Welcome back</div>
            <div className="card-sub">Sign in to continue to your intelligence dashboard</div>

            <form onSubmit={handleLogin}>
              <div className="form-field">
                <label className="form-label">Email address</label>
                <input className="form-input" type="email" placeholder="analyst@firm.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in to dashboard'}
              </button>
            </form>

            <div className="divider" />
            <div className="auth-link">
              New to YuktiLens? <Link to="/signup">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login