import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { competitorData } from '../data/competitors'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cd-root {
    min-height: 100vh;
    background: #0d1117;
    font-family: 'DM Sans', sans-serif;
    color: #e6edf3;
    display: flex;
  }

  /* Sidebar identical to Workspace */
  .cd-sidebar {
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
  .sidebar-brand { padding: 0 24px 28px; border-bottom: 1px solid #21262d; margin-bottom: 16px; }
  .brand-name { font-family: 'DM Serif Display', serif; font-size: 18px; color: #e6edf3; }
  .brand-role { font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #4a9eff; margin-top: 3px; }
  .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 0 12px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; color: #7d8590; cursor: pointer; transition: all 0.15s; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .nav-item:hover { background: #161b22; color: #e6edf3; }
  .nav-item.active { background: #161b22; color: #e6edf3; }
  .nav-icon { font-size: 15px; width: 18px; text-align: center; }
  .sidebar-footer { padding: 16px 12px 0; border-top: 1px solid #21262d; margin-top: 8px; display: flex; flex-direction: column; gap: 2px; }
  .new-analysis-btn { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #1f6feb; border-radius: 8px; font-size: 13px; font-weight: 600; color: white; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; width: 100%; transition: background 0.15s; margin: 12px 0; }
  .new-analysis-btn:hover { background: #388bfd; }

  /* Main */
  .cd-main { flex: 1; overflow-y: auto; }

  .cd-topbar {
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

  .topbar-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #7d8590;
  }

  .breadcrumb-sep { color: #484f58; }
  .breadcrumb-current { color: #e6edf3; font-weight: 500; }

  .topbar-tabs { display: flex; }
  .topbar-tab { padding: 0 18px; height: 56px; display: flex; align-items: center; font-size: 14px; font-weight: 500; color: #7d8590; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.15s; border-top: none; border-left: none; border-right: none; background: none; font-family: 'DM Sans', sans-serif; }
  .topbar-tab.active { color: #e6edf3; border-bottom-color: #1f6feb; }

  .live-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: rgba(35,134,54,0.1);
    border: 1px solid rgba(35,134,54,0.25);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    color: #3fb950;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3fb950;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .cd-content { padding: 36px 32px; }

  /* Hero section */
  .cd-hero {
    margin-bottom: 32px;
  }

  .hero-breadcrumb {
    font-size: 12px;
    color: #484f58;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
  }

  .hero-name {
    font-family: 'DM Serif Display', serif;
    font-size: 42px;
    color: #e6edf3;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
  }

  .hero-sub {
    font-size: 15px;
    color: #7d8590;
    max-width: 640px;
    line-height: 1.7;
    margin-bottom: 24px;
  }

  .hero-stats {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .hero-stat {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 10px;
    padding: 16px 20px;
    min-width: 140px;
  }

  .hero-stat-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #484f58;
    margin-bottom: 8px;
  }

  .hero-stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #e6edf3;
  }

  /* Content grid */
  .cd-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
    align-items: start;
  }

  .cd-left { display: flex; flex-direction: column; gap: 20px; }
  .cd-right { display: flex; flex-direction: column; gap: 16px; }

  /* Modules */
  .module-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 24px;
  }

  .module-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #4a9eff;
    margin-bottom: 20px;
  }

  /* Signal breakdown chart (mock) */
  .signal-chart {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    height: 120px;
    margin: 0 0 12px;
  }

  .signal-bar-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .signal-bar {
    width: 100%;
    border-radius: 6px 6px 0 0;
    min-height: 8px;
    transition: height 0.3s;
  }

  .signal-bar-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #484f58;
    text-align: center;
    white-space: nowrap;
  }

  /* Risk signals */
  .signals-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .signal-card {
    background: #0d1117;
    border-radius: 8px;
    padding: 16px;
    border-top: 3px solid transparent;
  }

  .signal-card.critical { border-top-color: #f85149; }
  .signal-card.warning { border-top-color: #f0883e; }
  .signal-card.significant { border-top-color: #d29922; }

  .signal-severity {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .signal-card.critical .signal-severity { color: #f85149; }
  .signal-card.warning .signal-severity { color: #f0883e; }
  .signal-card.significant .signal-severity { color: #d29922; }

  .signal-title {
    font-size: 13px;
    font-weight: 600;
    color: #e6edf3;
    margin-bottom: 6px;
  }

  .signal-desc {
    font-size: 12px;
    color: #7d8590;
    line-height: 1.6;
  }

  /* Analyst summary */
  .analyst-summary {
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 10px;
    padding: 20px;
    margin-top: 4px;
  }

  .analyst-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }

  .analyst-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #21262d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .analyst-title {
    font-size: 14px;
    font-weight: 600;
    color: #e6edf3;
  }

  .analyst-text {
    font-size: 13px;
    color: #7d8590;
    line-height: 1.8;
    margin-bottom: 14px;
  }

  .analyst-metrics {
    display: flex;
    gap: 16px;
  }

  .analyst-metric {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .metric-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  /* Historical timeline */
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .timeline-item {
    display: flex;
    gap: 16px;
    padding-bottom: 24px;
    position: relative;
  }

  .timeline-item:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 18px;
    bottom: 0;
    width: 1px;
    background: #21262d;
  }

  .timeline-dot {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    border: 2px solid #30363d;
    background: #0d1117;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .timeline-content { flex: 1; }

  .timeline-date {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #484f58;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .timeline-title {
    font-size: 14px;
    font-weight: 600;
    color: #e6edf3;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .timeline-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 100px;
    letter-spacing: 0.5px;
  }

  .badge-success { background: rgba(35,134,54,0.15); border: 1px solid rgba(35,134,54,0.3); color: #3fb950; }
  .badge-stalled { background: rgba(248,81,73,0.1); border: 1px solid rgba(248,81,73,0.2); color: #f85149; }

  .timeline-desc {
    font-size: 13px;
    color: #7d8590;
    line-height: 1.6;
  }

  /* Right panel */
  .strategy-alpha-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 20px;
  }

  .alpha-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .alpha-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #4a9eff;
  }

  .alpha-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid #30363d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
  }

  .alpha-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    color: #e6edf3;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .alpha-desc {
    font-size: 13px;
    color: #7d8590;
    line-height: 1.7;
    margin-bottom: 16px;
  }

  .alpha-checks {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .alpha-check {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #e6edf3;
  }

  .check-icon { color: #3fb950; font-size: 14px; }

  .btn-generate {
    width: 100%;
    padding: 12px;
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
  .btn-generate:hover { background: #388bfd; }

  /* Market signals feed */
  .signals-feed-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 20px;
  }

  .feed-title {
    font-size: 13px;
    font-weight: 600;
    color: #e6edf3;
    margin-bottom: 16px;
  }

  .feed-item {
    padding: 12px 0;
    border-bottom: 1px solid #21262d;
  }

  .feed-item:last-child { border-bottom: none; }

  .feed-category {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #4a9eff;
    margin-bottom: 4px;
  }

  .feed-name {
    font-size: 13px;
    font-weight: 600;
    color: #e6edf3;
    margin-bottom: 3px;
  }

  .feed-desc {
    font-size: 12px;
    color: #7d8590;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .feed-time {
    font-size: 11px;
    color: #484f58;
  }

  /* Correlation scores */
  .correlation-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .correlation-label { font-size: 13px; color: #8d96a0; }

  .correlation-bar {
    flex: 1;
    height: 4px;
    background: #21262d;
    border-radius: 2px;
    margin: 0 12px;
    overflow: hidden;
  }

  .correlation-fill {
    height: 100%;
    border-radius: 2px;
    background: #1f6feb;
  }

  .correlation-val { font-size: 13px; font-weight: 600; color: #e6edf3; min-width: 32px; text-align: right; }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: transparent;
    border: 1px solid #21262d;
    border-radius: 8px;
    color: #7d8590;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 24px;
    transition: all 0.15s;
  }
  .back-btn:hover { border-color: #30363d; color: #e6edf3; }
`

function CompetitorDetail() {
  const navigate = useNavigate()
  const { competitorId } = useParams()
  const savedData = JSON.parse(localStorage.getItem('yuktilens_onboarding') || '{}')
  const selectedIndustry = savedData.industry || 'SaaS'

  const competitor = useMemo(() => {
    const list = competitorData[selectedIndustry] || []
    return list.find(item => item.id === competitorId)
  }, [selectedIndustry, competitorId])

  if (!competitor) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', padding: '40px', fontFamily: 'DM Sans, sans-serif' }}>
          <button className="back-btn" onClick={() => navigate('/workspace')}>← Back</button>
          <h1>Competitor not found</h1>
        </div>
      </>
    )
  }

  const signalBars = [
    { label: 'GROWTH', height: 55, color: '#484f58' },
    { label: 'CHURN RISK', height: 95, color: '#f85149' },
    { label: 'VOLUME', height: 72, color: '#7d8590' },
    { label: 'NEG. SENTIMENT', height: 80, color: '#d29922' },
  ]

  const mockTimeline = [
    { date: 'JAN 2024', title: 'Pivot to Multi-Product Ecosystem', badge: 'success', badgeLabel: 'SUCCESSFUL PIVOT', desc: 'Shifted from single-product focus to comprehensive platform strategy.' },
    { date: 'OCT 2023', title: 'Identity Transition Phase I', badge: 'stalled', badgeLabel: 'STALLED', desc: 'Initial rebranding efforts encountered significant user friction.' },
    { date: 'JUN 2023', title: 'Aggressive Series B Expansion', badge: null, desc: 'Scaled operations across Tier 2 markets with high acquisition costs.' },
  ]

  return (
    <>
      <style>{styles}</style>
      <div className="cd-root">
        <aside className="cd-sidebar">
          <div className="sidebar-brand">
            <div className="brand-name">YuktiLens</div>
            <div className="brand-role">Market Intelligence</div>
          </div>
          <nav className="sidebar-nav">
            {[
              { icon: '⊞', label: 'Dashboard' },
              { icon: '◎', label: 'Competitors', active: true },
              { icon: '⊿', label: 'Simulations' },
              { icon: '△', label: 'Risk Tracker' },
            ].map(n => (
              <button key={n.label} className={`nav-item${n.active ? ' active' : ''}`} onClick={() => navigate('/workspace')}>
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

        <div className="cd-main">
          <div className="cd-topbar">
            <div className="topbar-breadcrumb">
              <span>Market Intelligence</span>
              <span className="breadcrumb-sep">›</span>
              <span>Competitors</span>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">{competitor.name.toUpperCase()}</span>
            </div>
            <div className="topbar-tabs">
              {['Portfolio', 'Signals', 'Reports'].map(t => (
                <button key={t} className={`topbar-tab${t === 'Signals' ? ' active' : ''}`}>{t}</button>
              ))}
            </div>
            <div className="live-badge">
              <div className="live-dot" />
              LIVE FEED: ACTIVE
            </div>
          </div>

          <div className="cd-content">
            <button className="back-btn" onClick={() => navigate('/workspace')}>← Back to workspace</button>

            <div className="cd-hero">
              <div className="hero-breadcrumb">COMPETITORS › {competitor.name.toUpperCase()}</div>
              <div className="hero-name">{competitor.name} Strategy Analysis</div>
              <p className="hero-sub">
                Behavioral modeling and predictive strategic outcomes. {competitor.summary}
              </p>

              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-label">Pricing</div>
                  <div className="hero-stat-value">{competitor.price}</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-label">Sentiment</div>
                  <div className="hero-stat-value">{competitor.sentiment}</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-label">Active Signal</div>
                  <div className="hero-stat-value" style={{ fontSize: '14px', paddingTop: '4px', color: '#f0883e' }}>{competitor.alert}</div>
                </div>
              </div>
            </div>

            <div className="cd-grid">
              <div className="cd-left">

                {/* Risk Signals */}
                <div className="module-card">
                  <div className="module-label">Risk & Momentum Signals</div>
                  <div className="signals-grid">
                    <div className="signal-card critical">
                      <div className="signal-severity">Critical</div>
                      <div className="signal-title">User Complaints</div>
                      <div className="signal-desc">340% increase in negative mentions over 30 days.</div>
                    </div>
                    <div className="signal-card warning">
                      <div className="signal-severity">Warning</div>
                      <div className="signal-title">Policy Shift</div>
                      <div className="signal-desc">Silent shift in grace period from 3 days to 0 days detected.</div>
                    </div>
                    <div className="signal-card significant">
                      <div className="signal-severity">Significant</div>
                      <div className="signal-title">Hiring Signals</div>
                      <div className="signal-desc">Aggressive 3rd party agency hiring spikes in LinkedIn data.</div>
                    </div>
                  </div>

                  {/* Signal Breakdown Chart */}
                  <div className="module-label" style={{ marginTop: '4px' }}>Signal Breakdown: Sentiment & Activity</div>
                  <div className="signal-chart">
                    {signalBars.map(b => (
                      <div className="signal-bar-wrap" key={b.label}>
                        <div className="signal-bar" style={{ height: `${b.height}px`, background: b.color }} />
                        <div className="signal-bar-label">{b.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Analyst summary */}
                  <div className="analyst-summary">
                    <div className="analyst-header">
                      <div className="analyst-icon">💡</div>
                      <div className="analyst-title">Analyst Summary: The Erosion of Trust</div>
                    </div>
                    <div className="analyst-text">
                      While {competitor.name} continues to show top-line user growth, our momentum indicators signal a critical erosion of brand trust. The decoupling of user volume and sentiment is often a precursor to mass-churn. Aggressive collection behavior and immediate auto-debits suggest a liquidity crunch or a pivot toward short-term extraction over long-term retention.
                    </div>
                    <div className="analyst-metrics">
                      <div className="analyst-metric">
                        <div className="metric-dot" style={{ background: '#3fb950' }} />
                        <span style={{ color: '#3fb950', fontSize: '12px' }}>Trust Index: 3.2/10</span>
                      </div>
                      <div className="analyst-metric">
                        <div className="metric-dot" style={{ background: '#f0883e' }} />
                        <span style={{ color: '#f0883e', fontSize: '12px' }}>Stability: Declining</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Historical Behavioral Pattern */}
                <div className="module-card">
                  <div className="module-label">Historical Behavioral Pattern</div>
                  <div className="timeline">
                    {mockTimeline.map((item, i) => (
                      <div className="timeline-item" key={i}>
                        <div className="timeline-dot" />
                        <div className="timeline-content">
                          <div className="timeline-date">{item.date}</div>
                          <div className="timeline-title">
                            {item.title}
                            {item.badge && (
                              <span className={`timeline-badge badge-${item.badge}`}>{item.badgeLabel}</span>
                            )}
                          </div>
                          <div className="timeline-desc">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cross-platform correlation */}
                <div className="module-card">
                  <div className="module-label">Cross-Platform Correlation</div>
                  {[
                    { label: 'Pricing Signal', val: '88', pct: 88 },
                    { label: 'Campaign Activity', val: '62', pct: 62 },
                    { label: 'Review Sentiment', val: '45', pct: 45 },
                    { label: 'Social Momentum', val: '71', pct: 71 },
                  ].map(c => (
                    <div className="correlation-row" key={c.label}>
                      <span className="correlation-label">{c.label}</span>
                      <div className="correlation-bar">
                        <div className="correlation-fill" style={{ width: `${c.pct}%` }} />
                      </div>
                      <span className="correlation-val">{c.val}</span>
                    </div>
                  ))}
                </div>

              </div>

              <div className="cd-right">
                {/* Strategy Alpha */}
                <div className="strategy-alpha-card">
                  <div className="alpha-header">
                    <div className="alpha-label">Strategic Alpha</div>
                    <div className="alpha-icon">◎</div>
                  </div>
                  <div className="alpha-title">Opportunity: Transparent Fee Offensive</div>
                  <div className="alpha-desc">
                    Capitalize on the competitor's opacity. Launch a targeted campaign highlighting your Zero Hidden Penalties and Human-First Support.
                  </div>
                  <div className="alpha-checks">
                    <div className="alpha-check">
                      <span className="check-icon">✓</span>
                      Target {competitor.name}'s 'Power Users'
                    </div>
                    <div className="alpha-check">
                      <span className="check-icon">✓</span>
                      Highlight "No-Surprise" Debits
                    </div>
                    <div className="alpha-check">
                      <span className="check-icon">✓</span>
                      Lead with trust metrics
                    </div>
                  </div>
                  <button className="btn-generate">Generate Campaign Strategy</button>
                </div>

                {/* Market Signals Feed */}
                <div className="signals-feed-card">
                  <div className="feed-title">Market Signals Feed</div>
                  {[
                    { cat: 'Regulatory', name: 'Shadow Banking Probe', desc: 'New guidelines impacting BNPL lending structures being drafted.', time: '42m ago' },
                    { cat: 'Executive', name: 'CTO Departure Signal', desc: 'Key infrastructure lead exit after 4 years. Potential tech-debt risk.', time: '2h ago' },
                    { cat: 'Social', name: 'Viral Thread: Policy', desc: 'Discussion on Reward points devaluation gaining significant traction (4k+ RTs).', time: '5h ago' },
                  ].map(f => (
                    <div className="feed-item" key={f.name}>
                      <div className="feed-category">{f.cat}</div>
                      <div className="feed-name">{f.name}</div>
                      <div className="feed-desc">{f.desc}</div>
                      <div className="feed-time">{f.time}</div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="strategy-alpha-card">
                  <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#484f58', marginBottom: '12px' }}>Key capabilities</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {competitor.features?.map(f => (
                      <span key={f} style={{ padding: '4px 10px', background: '#0d1117', border: '1px solid #21262d', borderRadius: '100px', fontSize: '12px', color: '#7d8590' }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CompetitorDetail