import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { competitorData } from '../data/competitors'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ws-root {
    min-height: 100vh;
    background: #0d1117;
    font-family: 'DM Sans', sans-serif;
    color: #e6edf3;
    display: flex;
  }

  /* Sidebar */
  .ws-sidebar {
    width: 200px;
    flex-shrink: 0;
    background: #0d1117;
    border-right: 1px solid #21262d;
    display: flex;
    flex-direction: column;
    padding: 28px 0;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .sidebar-brand {
    padding: 0 24px 28px;
    border-bottom: 1px solid #21262d;
    margin-bottom: 16px;
  }

  .brand-name { font-family: 'DM Serif Display', serif; font-size: 18px; color: #e6edf3; }
  .brand-role { font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #4a9eff; margin-top: 3px; }

  .sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 12px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #7d8590;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }

  .nav-item:hover { background: #161b22; color: #e6edf3; }
  .nav-item.active { background: #161b22; color: #e6edf3; }

  .nav-icon { font-size: 15px; width: 18px; text-align: center; }

  .sidebar-footer {
    padding: 16px 12px 0;
    border-top: 1px solid #21262d;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .new-analysis-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: #1f6feb;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    border: none;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
    transition: background 0.15s;
    margin: 12px 0;
  }
  .new-analysis-btn:hover { background: #388bfd; }

  /* Main content */
  .ws-main {
    flex: 1;
    overflow-y: auto;
  }

  .ws-topbar {
    padding: 0 32px;
    height: 56px;
    border-bottom: 1px solid #21262d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: #0d1117;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .topbar-tabs {
    display: flex;
    gap: 0;
  }

  .topbar-tab {
    padding: 0 18px;
    height: 56px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: #7d8590;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.15s;
    border-top: none;
    border-left: none;
    border-right: none;
    background: none;
    font-family: 'DM Sans', sans-serif;
  }

  .topbar-tab.active {
    color: #e6edf3;
    border-bottom-color: #1f6feb;
  }

  .topbar-title {
    font-size: 15px;
    font-weight: 600;
    color: #e6edf3;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 8px;
    font-size: 13px;
    color: #484f58;
    cursor: pointer;
    width: 200px;
  }

  .run-sim-btn {
    padding: 8px 18px;
    background: #1f6feb;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .run-sim-btn:hover { background: #388bfd; }

  .ws-content {
    padding: 36px 32px;
  }

  .page-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #4a9eff;
    margin-bottom: 12px;
  }

  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 32px;
    color: #e6edf3;
    margin-bottom: 8px;
    letter-spacing: -0.4px;
  }

  .page-sub {
    font-size: 14px;
    color: #7d8590;
    margin-bottom: 36px;
    line-height: 1.7;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #e6edf3;
  }

  .section-meta {
    font-size: 13px;
    color: #484f58;
  }

  /* Competitor grid */
  .comp-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .comp-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
    color: inherit;
    font-family: inherit;
    width: 100%;
  }

  .comp-card:hover {
    border-color: #30363d;
    background: #1c2128;
    transform: translateY(-1px);
  }

  .comp-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .comp-number {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #484f58;
    margin-bottom: 8px;
  }

  .comp-name {
    font-family: 'DM Serif Display', serif;
    font-size: 24px;
    color: #e6edf3;
    margin-bottom: 6px;
    letter-spacing: -0.3px;
  }

  .comp-tag {
    font-size: 13px;
    color: #7d8590;
  }

  .comp-avatar {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    background: #0d1117;
    border: 1px solid #30363d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: #e6edf3;
    flex-shrink: 0;
  }

  .comp-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }

  .comp-stat {
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 8px;
    padding: 12px 14px;
  }

  .comp-stat-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #484f58;
    margin-bottom: 6px;
  }

  .comp-stat-value {
    font-size: 17px;
    font-weight: 700;
    color: #e6edf3;
  }

  .comp-trend {
    background: rgba(31,111,235,0.06);
    border: 1px solid rgba(31,111,235,0.15);
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 14px;
  }

  .comp-trend-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #4a9eff;
    margin-bottom: 6px;
  }

  .comp-trend-text {
    font-size: 13px;
    color: #8d96a0;
    line-height: 1.6;
  }

  .comp-summary {
    font-size: 13px;
    color: #7d8590;
    line-height: 1.7;
    margin-bottom: 14px;
  }

  .comp-features {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }

  .feature-chip {
    padding: 4px 10px;
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 100px;
    font-size: 12px;
    color: #7d8590;
  }

  .comp-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .comp-alert {
    font-size: 12px;
    font-weight: 500;
    color: #f0883e;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .comp-cta {
    font-size: 13px;
    font-weight: 600;
    color: #4a9eff;
  }

  .divider { height: 1px; background: #21262d; margin: 36px 0; }

  .context-row {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
  }

  .context-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 8px;
    font-size: 13px;
    color: #8d96a0;
  }

  .context-badge strong { color: #e6edf3; }
`

function Workspace() {
  const navigate = useNavigate()
  const savedData = JSON.parse(localStorage.getItem('yuktilens_onboarding') || '{}')
  const selectedIndustry = savedData.industry || 'SaaS'
  const companyName = savedData.noCompany ? 'Idea stage' : savedData.companyName || 'Your Company'

  const competitors = useMemo(() => {
    return competitorData[selectedIndustry] || competitorData['SaaS']
  }, [selectedIndustry])

  return (
    <>
      <style>{styles}</style>
      <div className="ws-root">
        <aside className="ws-sidebar">
          <div className="sidebar-brand">
            <div className="brand-name">YuktiLens</div>
            <div className="brand-role">Market Intelligence</div>
          </div>
          <nav className="sidebar-nav">
            {[
              { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
              { icon: '◎', label: 'Competitors', path: '/workspace', active: true },
              { icon: '⊿', label: 'Simulations', path: '/dashboard' },
              { icon: '△', label: 'Risk Tracker', path: '/dashboard' },
            ].map(n => (
              <button key={n.label} className={`nav-item${n.active ? ' active' : ''}`} onClick={() => navigate(n.path)}>
                <span className="nav-icon">{n.icon}</span> {n.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="new-analysis-btn">+ New Analysis</button>
            <button className="nav-item"><span className="nav-icon">⚙</span> Settings</button>
            <button className="nav-item"><span className="nav-icon">?</span> Support</button>
          </div>
        </aside>

        <div className="ws-main">
          <div className="ws-topbar">
            <div className="topbar-title">Market Intelligence</div>
            <div className="topbar-tabs">
              {['Portfolio', 'Signals', 'Reports'].map(t => (
                <button key={t} className={`topbar-tab${t === 'Signals' ? ' active' : ''}`}>{t}</button>
              ))}
            </div>
            <div className="topbar-right">
              <div className="search-bar">🔍 Search markets…</div>
              <button className="run-sim-btn">Run Simulation</button>
            </div>
          </div>

          <div className="ws-content">
            <div className="page-eyebrow">Competitive Intelligence</div>
            <h1 className="page-title">Competitor landscape for {selectedIndustry}</h1>
            <p className="page-sub">
              Structured strategic intelligence across top competitors — pricing signals, sentiment, trend indicators, and real-time alerts.
            </p>

            <div className="context-row">
              <div className="context-badge"><strong>Industry:</strong> {selectedIndustry}</div>
              <div className="context-badge"><strong>Company:</strong> {companyName}</div>
              <div className="context-badge"><strong>Modules:</strong> 5 active</div>
            </div>

            <div className="section-header">
              <div className="section-title">Top competitor overview</div>
              <div className="section-meta">{competitors.length} competitors tracked</div>
            </div>

            <div className="comp-grid">
              {competitors.map((competitor, index) => (
                <button
                  key={competitor.id}
                  className="comp-card"
                  onClick={() => navigate(`/workspace/company/${competitor.id}`)}
                >
                  <div className="comp-card-top">
                    <div>
                      <div className="comp-number">Competitor {index + 1}</div>
                      <div className="comp-name">{competitor.name}</div>
                      <div className="comp-tag">{competitor.tag}</div>
                    </div>
                    <div className="comp-avatar">{competitor.name.charAt(0)}</div>
                  </div>

                  <div className="comp-stats">
                    <div className="comp-stat">
                      <div className="comp-stat-label">Pricing</div>
                      <div className="comp-stat-value">{competitor.price}</div>
                    </div>
                    <div className="comp-stat">
                      <div className="comp-stat-label">Sentiment</div>
                      <div className="comp-stat-value">{competitor.sentiment}</div>
                    </div>
                  </div>

                  <div className="comp-trend">
                    <div className="comp-trend-label">Trend Signal</div>
                    <div className="comp-trend-text">{competitor.trend}</div>
                  </div>

                  <div className="comp-summary">{competitor.summary}</div>

                  <div className="comp-features">
                    {competitor.features.map(f => (
                      <span className="feature-chip" key={f}>{f}</span>
                    ))}
                  </div>

                  <div className="comp-footer">
                    <div className="comp-alert">⚠ {competitor.alert}</div>
                    <div className="comp-cta">View intelligence →</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Workspace