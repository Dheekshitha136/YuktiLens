import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ob-root {
    min-height: 100vh;
    background: #0d1117;
    font-family: 'DM Sans', sans-serif;
    color: #e6edf3;
    display: flex;
    flex-direction: column;
  }

  .ob-header {
    padding: 24px 40px;
    border-bottom: 1px solid #21262d;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand-name { font-family: 'DM Serif Display', serif; font-size: 20px; color: #e6edf3; }
  .brand-role { font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #4a9eff; margin-top: 2px; }

  .ob-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #7d8590;
  }

  .prog-step {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .prog-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #21262d;
    border: 1px solid #30363d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: #484f58;
  }

  .prog-dot.active {
    background: #1f6feb;
    border-color: #1f6feb;
    color: white;
  }

  .prog-dot.done {
    background: #238636;
    border-color: #238636;
    color: white;
  }

  .prog-line {
    width: 40px;
    height: 1px;
    background: #21262d;
  }

  .ob-body {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 400px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
    padding: 56px 40px;
    gap: 64px;
  }

  .ob-main {}

  .ob-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #4a9eff;
    margin-bottom: 16px;
  }

  .ob-headline {
    font-family: 'DM Serif Display', serif;
    font-size: 36px;
    line-height: 1.2;
    color: #e6edf3;
    margin-bottom: 12px;
    letter-spacing: -0.4px;
  }

  .ob-sub {
    font-size: 14px;
    color: #7d8590;
    margin-bottom: 36px;
    line-height: 1.7;
  }

  .section-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #4a9eff;
    margin-bottom: 16px;
  }

  .industry-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 40px;
  }

  .industry-btn {
    padding: 14px 12px;
    border-radius: 8px;
    border: 1px solid #21262d;
    background: #161b22;
    color: #8d96a0;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s;
  }

  .industry-btn:hover {
    border-color: #30363d;
    color: #e6edf3;
    background: #1c2128;
  }

  .industry-btn.active {
    border-color: #1f6feb;
    background: rgba(31,111,235,0.1);
    color: #4a9eff;
    font-weight: 600;
  }

  .company-section { margin-bottom: 36px; }

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
    margin-bottom: 14px;
  }
  .form-input:focus { border-color: #4a9eff; }
  .form-input::placeholder { color: #3d444d; }
  .form-input:disabled { opacity: 0.4; }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #7d8590;
    cursor: pointer;
  }

  .checkbox-label input { accent-color: #1f6feb; }

  .btn-primary {
    padding: 13px 28px;
    background: #1f6feb;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover { background: #388bfd; }
  .btn-primary:disabled { background: #21262d; color: #484f58; cursor: not-allowed; }

  /* Right panel */
  .ob-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 8px;
  }

  .preview-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 24px;
  }

  .preview-card-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #4a9eff;
    margin-bottom: 16px;
  }

  .module-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .module-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 8px;
  }

  .module-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: rgba(74,158,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }

  .module-name {
    font-size: 13px;
    font-weight: 500;
    color: #e6edf3;
    flex: 1;
  }

  .module-status {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 100px;
    background: rgba(35,134,54,0.15);
    border: 1px solid rgba(35,134,54,0.3);
    color: #3fb950;
    letter-spacing: 0.5px;
  }

  .selected-preview {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 24px;
  }

  .sp-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #7d8590;
    margin-bottom: 8px;
  }

  .sp-value {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: #e6edf3;
  }

  .sp-placeholder {
    font-size: 14px;
    color: #3d444d;
    font-style: italic;
  }

  .info-banner {
    background: rgba(31,111,235,0.08);
    border: 1px solid rgba(31,111,235,0.2);
    border-radius: 10px;
    padding: 16px;
    font-size: 13px;
    color: #7d8590;
    line-height: 1.7;
  }

  .info-banner strong { color: #4a9eff; }
`

const industries = ['SaaS', 'E-commerce', 'EdTech', 'HealthTech', 'FinTech', 'AI Tools', 'Productivity', 'Marketing Tech']

const modules = [
  { icon: '📡', name: 'Cross-Platform Correlation' },
  { icon: '⚡', name: 'Change Velocity Engine' },
  { icon: '🔍', name: 'Claim vs Reality Checker' },
  { icon: '🎯', name: 'Decision Simulation Lab' },
  { icon: '🔔', name: 'Real-time Alert System' },
]

function Onboarding() {
  const navigate = useNavigate()
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [noCompany, setNoCompany] = useState(false)

  const handleContinue = () => {
    if (!selectedIndustry) return
    const onboardingData = {
      industry: selectedIndustry,
      companyName: noCompany ? '' : companyName,
      noCompany,
    }
    localStorage.setItem('yuktilens_onboarding', JSON.stringify(onboardingData))
    navigate('/workspace')
  }

  const canContinue = selectedIndustry && (companyName || noCompany)

  return (
    <>
      <style>{styles}</style>
      <div className="ob-root">
        <div className="ob-header">
          <div>
            <div className="brand-name">YuktiLens</div>
            <div className="brand-role">Market Intelligence</div>
          </div>
          <div className="ob-progress">
            <div className="prog-step">
              <div className="prog-dot active">1</div>
              <span style={{ color: '#e6edf3', fontWeight: 500 }}>Setup</span>
            </div>
            <div className="prog-line" />
            <div className="prog-step">
              <div className="prog-dot">2</div>
              <span>Workspace</span>
            </div>
            <div className="prog-line" />
            <div className="prog-step">
              <div className="prog-dot">3</div>
              <span>Dashboard</span>
            </div>
          </div>
        </div>

        <div className="ob-body">
          <div className="ob-main">
            <div className="ob-eyebrow">Workspace Setup</div>
            <h1 className="ob-headline">Configure your intelligence workspace</h1>
            <p className="ob-sub">
              Select your industry and company context. This shapes competitor groupings, pricing benchmarks, and market signals.
            </p>

            <div className="section-label">Step 1 — Choose your industry</div>
            <div className="industry-grid">
              {industries.map(ind => (
                <button
                  key={ind}
                  className={`industry-btn${selectedIndustry === ind ? ' active' : ''}`}
                  onClick={() => setSelectedIndustry(ind)}
                >
                  {ind}
                </button>
              ))}
            </div>

            <div className="company-section">
              <div className="section-label">Step 2 — Your company</div>
              <input
                className="form-input"
                type="text"
                placeholder="Enter your company name"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                disabled={noCompany}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={noCompany}
                  onChange={e => { setNoCompany(e.target.checked); if (e.target.checked) setCompanyName('') }}
                />
                I'm at idea stage — no company yet
              </label>
            </div>

            <button className="btn-primary" onClick={handleContinue} disabled={!canContinue}>
              Continue to workspace →
            </button>
          </div>

          <div className="ob-panel">
            <div className="selected-preview">
              <div className="sp-label">Selected industry</div>
              {selectedIndustry
                ? <div className="sp-value">{selectedIndustry}</div>
                : <div className="sp-placeholder">None selected</div>
              }
            </div>

            <div className="preview-card">
              <div className="preview-card-title">Intelligence modules</div>
              <div className="module-list">
                {modules.map(m => (
                  <div className="module-row" key={m.name}>
                    <div className="module-icon">{m.icon}</div>
                    <div className="module-name">{m.name}</div>
                    <div className="module-status">ACTIVE</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-banner">
              <strong>Why this matters:</strong> Your industry context shapes how competitors are ranked, which pricing signals are relevant, and which whitespace zones are highlighted for you.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding