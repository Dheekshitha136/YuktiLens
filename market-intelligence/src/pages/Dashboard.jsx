import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const API_BASE = 'http://127.0.0.1:8000'
const competitors = ['KreditBee', 'LazyPay', 'CASHe', 'MoneyTap']

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-root {
    min-height: 100vh;
    background: #0d1117;
    font-family: 'DM Sans', sans-serif;
    color: #e6edf3;
    display: flex;
  }

  .dash-sidebar {
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

  .sidebar-user {
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-top: 1px solid #21262d;
    margin-top: 8px;
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%; background: #21262d;
    display: flex; align-items: center; justify-content: center; font-size: 13px;
  }
  .user-info { display: flex; flex-direction: column; }
  .user-name { font-size: 12px; font-weight: 600; color: #e6edf3; }
  .user-role { font-size: 11px; color: #484f58; }

  /* Main */
  .dash-main { flex: 1; overflow-y: auto; }

  .dash-topbar {
    padding: 0 32px;
    height: 56px;
    border-bottom: 1px solid #21262d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0d1117;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .topbar-title { font-size: 15px; font-weight: 600; color: #e6edf3; }
  .topbar-tabs { display: flex; }
  .topbar-tab { padding: 0 18px; height: 56px; display: flex; align-items: center; font-size: 14px; font-weight: 500; color: #7d8590; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.15s; border-top: none; border-left: none; border-right: none; background: none; font-family: 'DM Sans', sans-serif; }
  .topbar-tab.active { color: #e6edf3; border-bottom-color: #1f6feb; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .search-bar { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: #161b22; border: 1px solid #21262d; border-radius: 8px; font-size: 13px; color: #484f58; width: 200px; }
  .run-sim-btn { padding: 8px 18px; background: #1f6feb; border: none; border-radius: 8px; color: white; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
  .run-sim-btn:hover { background: #388bfd; }

  .dash-content { padding: 36px 32px; }

  .page-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #4a9eff; margin-bottom: 8px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 32px; color: #e6edf3; margin-bottom: 6px; letter-spacing: -0.4px; }
  .page-sub { font-size: 13px; color: #7d8590; margin-bottom: 8px; }
  .updated-line { font-size: 12px; color: #484f58; margin-bottom: 32px; display: flex; align-items: center; gap: 12px; }
  .signal-alert { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(31,111,235,0.1); border: 1px solid rgba(31,111,235,0.2); border-radius: 100px; font-size: 12px; font-weight: 600; color: #4a9eff; }

  /* Correlation score cards */
  .corr-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }

  .corr-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 20px;
    transition: border-color 0.15s;
  }
  .corr-card:hover { border-color: #30363d; }

  .corr-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .corr-name { font-size: 14px; font-weight: 600; color: #e6edf3; margin-bottom: 3px; }
  .corr-tier { font-size: 11px; color: #484f58; }
  .corr-icon { width: 32px; height: 32px; border-radius: 8px; background: #0d1117; border: 1px solid #30363d; display: flex; align-items: center; justify-content: center; font-size: 14px; }

  .corr-score { font-size: 28px; font-weight: 800; color: #e6edf3; margin-bottom: 4px; }
  .corr-delta-pos { font-size: 12px; font-weight: 600; color: #3fb950; }
  .corr-delta-neg { font-size: 12px; font-weight: 600; color: #f85149; }
  .corr-delta-flat { font-size: 12px; font-weight: 600; color: #7d8590; }

  .corr-sparkline {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 32px;
    margin: 12px 0;
  }

  .corr-spark-bar { flex: 1; border-radius: 2px 2px 0 0; min-height: 4px; }

  .corr-badges { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
  .corr-badge { padding: 3px 8px; border-radius: 100px; font-size: 11px; font-weight: 500; }
  .badge-blue { background: rgba(74,158,255,0.1); border: 1px solid rgba(74,158,255,0.2); color: #4a9eff; }
  .badge-orange { background: rgba(240,136,62,0.1); border: 1px solid rgba(240,136,62,0.2); color: #f0883e; }
  .badge-green { background: rgba(63,185,80,0.1); border: 1px solid rgba(63,185,80,0.2); color: #3fb950; }

  /* Two-col layout */
  .dash-grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
  .dash-left { display: flex; flex-direction: column; gap: 20px; }
  .dash-right { display: flex; flex-direction: column; gap: 16px; }

  /* Engine feed */
  .module-card { background: #161b22; border: 1px solid #21262d; border-radius: 12px; padding: 24px; }
  .module-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #4a9eff; margin-bottom: 4px; }
  .module-sublabel { font-size: 12px; color: #484f58; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }

  .export-link { font-size: 12px; font-weight: 500; color: #4a9eff; cursor: pointer; }

  .feed-item { padding: 14px 0; border-bottom: 1px solid #21262d; display: flex; gap: 12px; }
  .feed-item:last-child { border-bottom: none; }
  .feed-left-bar { width: 3px; border-radius: 2px; flex-shrink: 0; }
  .feed-body { flex: 1; }
  .feed-engine { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #484f58; margin-bottom: 3px; display: flex; align-items: center; justify-content: space-between; }
  .feed-time { font-size: 11px; color: #484f58; }
  .feed-title { font-size: 14px; font-weight: 600; color: #e6edf3; margin-bottom: 4px; }
  .feed-desc { font-size: 13px; color: #7d8590; line-height: 1.6; }
  .feed-actions { display: flex; gap: 8px; margin-top: 8px; }
  .feed-action { font-size: 12px; color: #484f58; cursor: pointer; }

  /* Detection status */
  .status-card { background: #0d1117; border: 1px solid #21262d; border-radius: 12px; padding: 20px; }
  .status-title { font-size: 14px; font-weight: 600; color: #e6edf3; margin-bottom: 16px; }
  .status-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #161b22; }
  .status-row:last-child { border-bottom: none; }
  .status-name { font-size: 13px; color: #8d96a0; }
  .status-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 4px; letter-spacing: 0.5px; }
  .badge-active { background: rgba(35,134,54,0.15); color: #3fb950; border: 1px solid rgba(35,134,54,0.3); }
  .badge-standby { background: rgba(72,79,88,0.3); color: #7d8590; border: 1px solid #30363d; }
  .badge-alert { background: rgba(248,81,73,0.1); color: #f85149; border: 1px solid rgba(248,81,73,0.2); }

  .ask-ai-btn {
    width: 100%;
    margin-top: 16px;
    padding: 12px;
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    color: #8d96a0;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.15s;
  }
  .ask-ai-btn:hover { background: #1c2128; color: #e6edf3; border-color: #4a9eff; }

  .risk-alpha-row { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 14px; border-top: 1px solid #21262d; }
  .risk-alpha-label { font-size: 12px; color: #484f58; }
  .risk-alpha-val { font-size: 13px; font-weight: 700; color: #e6edf3; }
  .risk-alpha-bar { height: 4px; background: #21262d; border-radius: 2px; margin-top: 6px; overflow: hidden; }
  .risk-alpha-fill { height: 100%; background: #1f6feb; border-radius: 2px; }

  /* Regional variance */
  .region-card { background: #161b22; border: 1px solid #21262d; border-radius: 12px; padding: 20px; }
  .region-title { font-size: 14px; font-weight: 600; color: #e6edf3; margin-bottom: 16px; }
  .region-row { margin-bottom: 14px; }
  .region-label-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .region-name { font-size: 13px; color: #8d96a0; }
  .region-pct { font-size: 13px; font-weight: 600; color: #e6edf3; }
  .region-bar { height: 6px; background: #21262d; border-radius: 3px; overflow: hidden; }
  .region-fill-na { height: 100%; border-radius: 3px; background: #1f6feb; }
  .region-fill-eu { height: 100%; border-radius: 3px; background: #388bfd; }
  .region-fill-ap { height: 100%; border-radius: 3px; background: #3fb950; }

  .view-heatmap-btn {
    width: 100%;
    margin-top: 14px;
    padding: 10px;
    background: transparent;
    border: 1px solid #21262d;
    border-radius: 8px;
    color: #7d8590;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .view-heatmap-btn:hover { border-color: #30363d; color: #e6edf3; }

  /* Competitor selector */
  .comp-selector { background: #161b22; border: 1px solid #21262d; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; }
  .comp-selector-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #4a9eff; margin-bottom: 14px; }
  .comp-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
  .comp-tab { padding: 8px 16px; border-radius: 8px; border: 1px solid #21262d; background: transparent; color: #7d8590; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .comp-tab:hover { border-color: #30363d; color: #e6edf3; }
  .comp-tab.active { border-color: #1f6feb; background: rgba(31,111,235,0.1); color: #4a9eff; font-weight: 600; }

  /* Module cards 2-col */
  .module-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .section-label-row { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #4a9eff; margin-bottom: 18px; }
  .section-title-main { font-size: 18px; font-weight: 600; color: #e6edf3; margin-bottom: 4px; }
  .confidence-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .confidence-score { font-size: 36px; font-weight: 800; color: #e6edf3; }
  .confidence-label { font-size: 12px; color: #484f58; }

  .mini-chart {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 60px;
    margin-bottom: 8px;
  }
  .mini-bar { flex: 1; border-radius: 2px 2px 0 0; }

  .predicted-badge { display: inline-flex; padding: 3px 10px; background: #0d1117; border: 1px solid #30363d; border-radius: 4px; font-size: 10px; font-weight: 700; color: #4a9eff; letter-spacing: 1px; margin-bottom: 14px; }

  .info-row { display: flex; gap: 20px; margin-bottom: 16px; }
  .info-item { display: flex; flex-direction: column; gap: 3px; }
  .info-item-label { font-size: 11px; color: #484f58; font-weight: 500; }
  .info-item-value { font-size: 13px; font-weight: 600; color: #e6edf3; }
  .info-item-value.green { color: #3fb950; }

  .reasoning-list { display: flex; flex-direction: column; gap: 8px; }
  .reasoning-item { display: flex; gap: 10px; }
  .reasoning-num { width: 20px; height: 20px; border-radius: 4px; background: rgba(31,111,235,0.1); border: 1px solid rgba(31,111,235,0.2); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #4a9eff; flex-shrink: 0; margin-top: 1px; }
  .reasoning-text { font-size: 13px; color: #7d8590; line-height: 1.6; }

  /* Decision sim */
  .sim-textarea {
    width: 100%;
    padding: 14px 16px;
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 8px;
    color: #e6edf3;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;
    line-height: 1.6;
  }
  .sim-textarea:focus { border-color: #4a9eff; }

  .btn-run {
    margin-top: 12px;
    padding: 10px 20px;
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
  .btn-run:hover { background: #388bfd; }
  .btn-run:disabled { background: #21262d; color: #484f58; cursor: not-allowed; }

  .outcome-box { padding: 16px; background: #0d1117; border: 1px solid #21262d; border-radius: 10px; margin: 16px 0; }
  .outcome-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #484f58; margin-bottom: 8px; }
  .outcome-text { font-size: 14px; color: #e6edf3; line-height: 1.6; }

  .error-banner { background: rgba(248,81,73,0.08); border: 1px solid rgba(248,81,73,0.2); border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #f85149; margin-bottom: 20px; }

  .empty-state { font-size: 13px; color: #484f58; font-style: italic; }

  /* Whitespace map */
  .wspace-map {
    position: relative;
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 10px;
    height: 240px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .wspace-axis-x { position: absolute; bottom: 16px; left: 0; right: 0; text-align: center; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #484f58; }
  .wspace-axis-y { position: absolute; top: 0; bottom: 0; left: 12px; display: flex; align-items: center; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #484f58; writing-mode: vertical-rl; transform: rotate(180deg); }

  .wspace-node {
    position: absolute;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 600;
    color: #e6edf3;
    border: 1px solid;
    text-align: center;
    line-height: 1.4;
  }

  .wspace-legend { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
  .wspace-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #7d8590; }
  .wspace-dot { width: 8px; height: 8px; border-radius: 50%; }

  .opp-card { background: #0d1117; border: 1px solid #21262d; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
  .opp-name { font-size: 13px; font-weight: 600; color: #e6edf3; margin-bottom: 4px; }
  .opp-desc { font-size: 12px; color: #7d8590; line-height: 1.6; margin-bottom: 8px; }
  .opp-footer { display: flex; justify-content: space-between; font-size: 12px; }
  .opp-region { color: #4a9eff; font-weight: 500; }
  .opp-conf { color: #3fb950; font-weight: 500; }

  .logout-btn { padding: 8px 16px; background: transparent; border: 1px solid #21262d; border-radius: 8px; color: #7d8590; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .logout-btn:hover { border-color: #30363d; color: #e6edf3; }
`

function Dashboard({ session }) {
  const navigate = useNavigate()
  const onboardingData = useMemo(() => JSON.parse(localStorage.getItem('yuktilens_onboarding') || '{}'), [])
  const [selectedCompany, setSelectedCompany] = useState('KreditBee')
  const [strategyData, setStrategyData] = useState(null)
  const [weakPhaseData, setWeakPhaseData] = useState(null)
  const [whitespaceData, setWhitespaceData] = useState(null)
  const [simulationInput, setSimulationInput] = useState('Launch a trust-first lending product with transparent fees and stronger customer support')
  const [simulationData, setSimulationData] = useState(null)
  const [loadingStrategy, setLoadingStrategy] = useState(false)
  const [loadingWeakPhase, setLoadingWeakPhase] = useState(false)
  const [loadingWhitespace, setLoadingWhitespace] = useState(false)
  const [loadingSimulation, setLoadingSimulation] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/login' }

  const fetchStrategy = async (company) => {
    try { setLoadingStrategy(true); setError('')
      const res = await fetch(`${API_BASE}/predict-strategy/${encodeURIComponent(company)}`, { method: 'POST' })
      const data = await res.json(); setStrategyData(data.prediction || null)
    } catch { setError('Failed to fetch strategy prediction.') } finally { setLoadingStrategy(false) }
  }

  const fetchWeakPhase = async (company) => {
    try { setLoadingWeakPhase(true); setError('')
      const res = await fetch(`${API_BASE}/predict-weak-phase/${encodeURIComponent(company)}`, { method: 'POST' })
      const data = await res.json(); setWeakPhaseData(data.weak_phase_prediction || null)
    } catch { setError('Failed to fetch weak phase prediction.') } finally { setLoadingWeakPhase(false) }
  }

  const fetchWhitespace = async () => {
    try { setLoadingWhitespace(true); setError('')
      const res = await fetch(`${API_BASE}/map-whitespace`, { method: 'POST' })
      const data = await res.json(); setWhitespaceData(data.whitespace_map || null)
    } catch { setError('Failed to fetch whitespace map.') } finally { setLoadingWhitespace(false) }
  }

  const runSimulation = async () => {
    try { setLoadingSimulation(true); setError('')
      const res = await fetch(`${API_BASE}/simulate-decision`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ company: onboardingData.companyName || 'YuktiLens', proposed_action: simulationInput }) })
      const data = await res.json(); setSimulationData(data.simulation || null)
    } catch { setError('Failed to run decision simulation.') } finally { setLoadingSimulation(false) }
  }

  useEffect(() => { fetchStrategy(selectedCompany); fetchWeakPhase(selectedCompany); fetchWhitespace() }, [selectedCompany])

  const corrCards = [
    { name: 'YuktiLens', tier: 'Core Competitor', score: 88.4, delta: '+2.4%', deltaType: 'pos', icon: '👁', bars: [40,55,45,52,48,58,72,68,80], badges: [{ label: 'Pricing Signal', type: 'blue' }, { label: 'Web Updates', type: 'blue' }] },
    { name: 'LazyPay', tier: 'Secondary Watch', score: 62.1, delta: '-4.1%', deltaType: 'neg', icon: '📱', bars: [80,72,68,60,55,40,38,45,30], badges: [{ label: 'Campaign Alert', type: 'orange' }] },
    { name: 'MoneyTap', tier: 'Strategic Tier', score: 75.8, delta: '0.0%', deltaType: 'flat', icon: '💳', bars: [60,62,58,65,60,58,62,65,60], badges: [{ label: 'Reviews', type: 'blue' }, { label: 'Stability', type: 'blue' }] },
    { name: 'Jupiter', tier: 'Emerging Rival', score: 92.3, delta: '+8.9%', deltaType: 'pos', icon: '🚀', bars: [40,45,52,60,65,72,78,85,92], badges: [{ label: 'High Momentum', type: 'green' }] },
  ]

  const engineFeed = [
    { engine: 'Pricing Engine', time: '14:20 PM', title: `${selectedCompany} reduced 'Enterprise' tier by 15%`, desc: 'Direct pricing update detected via automated web scraping. Correlates with upcoming fiscal quarter end.', barColor: '#4a9eff' },
    { engine: 'Campaign Engine', time: '12:05 PM', title: 'LazyPay launched \'Instant Refund\' social push', desc: 'Ad spend increased by 40% across Twitter and LinkedIn targeting \'Digital Nomads\' demographic.', barColor: '#f0883e' },
    { engine: 'Website Engine', time: '09:15 AM', title: 'MoneyTap Landing Page structural revamp', desc: "New CTA placement focus: 'Low-Interest Loans'. Simplified navigation indicates segment pivot.", barColor: '#7d8590' },
  ]

  const miniBarHeights = [30, 40, 35, 50, 45, 55, 60, 48, 52, 55, 58, 72]

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">
        <aside className="dash-sidebar">
          <div className="sidebar-brand">
            <div className="brand-name">YuktiLens</div>
            <div className="brand-role">Market Intelligence</div>
          </div>
          <nav className="sidebar-nav">
            {[
              { icon: '⊞', label: 'Dashboard', active: true },
              { icon: '◎', label: 'Competitors' },
              { icon: '⊿', label: 'Simulations' },
              { icon: '△', label: 'Risk Tracker' },
            ].map(n => (
              <button key={n.label} className={`nav-item${n.active ? ' active' : ''}`}
                onClick={() => n.label === 'Competitors' ? navigate('/workspace') : null}>
                <span className="nav-icon">{n.icon}</span> {n.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="new-analysis-btn">+ New Analysis</button>
            <button className="nav-item"><span className="nav-icon">⚙</span> Settings</button>
            <button className="nav-item"><span className="nav-icon">?</span> Support</button>
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <div className="user-name">{onboardingData.companyName || 'Analyst'}</div>
              <div className="user-role">Senior Analyst</div>
            </div>
          </div>
        </aside>

        <div className="dash-main">
          <div className="dash-topbar">
            <div className="topbar-title">Market Intelligence</div>
            <div className="topbar-tabs">
              {['Portfolio', 'Signals', 'Reports'].map(t => (
                <button key={t} className={`topbar-tab${t === 'Portfolio' ? ' active' : ''}`}>{t}</button>
              ))}
            </div>
            <div className="topbar-right">
              <div className="search-bar">🔍 Search insights…</div>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
              <button className="run-sim-btn">Run Simulation</button>
            </div>
          </div>

          <div className="dash-content">
            <div className="page-eyebrow">Executive Summary</div>
            <h1 className="page-title">Cross-Platform Correlation</h1>
            <div className="updated-line">
              <span>🕐 Updated 4 minutes ago</span>
              <span className="signal-alert">⚡ 12 New Market Signals Detected</span>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* Correlation cards */}
            <div className="corr-cards">
              {corrCards.map(c => (
                <div className="corr-card" key={c.name}>
                  <div className="corr-card-top">
                    <div>
                      <div className="corr-name">{c.name}</div>
                      <div className="corr-tier">{c.tier}</div>
                    </div>
                    <div className="corr-icon">{c.icon}</div>
                  </div>
                  <div className="corr-score">
                    {c.score}
                    {' '}
                    <span className={c.deltaType === 'pos' ? 'corr-delta-pos' : c.deltaType === 'neg' ? 'corr-delta-neg' : 'corr-delta-flat'} style={{ fontSize: '13px' }}>
                      {c.deltaType === 'pos' ? '↗' : c.deltaType === 'neg' ? '↘' : '→'} {c.delta}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#484f58', marginBottom: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>Correlation Score</div>
                  <div className="corr-sparkline">
                    {c.bars.map((h, i) => (
                      <div key={i} className="corr-spark-bar"
                        style={{ height: `${h * 0.32}px`, background: i === c.bars.length - 1 ? (c.deltaType === 'neg' ? '#f85149' : '#3fb950') : '#21262d' }} />
                    ))}
                  </div>
                  <div className="corr-badges">
                    {c.badges.map(b => (
                      <span key={b.label} className={`corr-badge badge-${b.type}`}>{b.label}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="comp-selector">
              <div className="comp-selector-label">Competitor Focus</div>
              <div className="comp-tabs">
                {competitors.map(c => (
                  <button key={c} className={`comp-tab${selectedCompany === c ? ' active' : ''}`}
                    onClick={() => setSelectedCompany(c)}>{c}</button>
                ))}
              </div>
            </div>

            <div className="dash-grid">
              <div className="dash-left">

                {/* Engine Intelligence Feed */}
                <div className="module-card">
                  <div className="module-label">Engine Intelligence Feed</div>
                  <div className="module-sublabel">
                    <span>Real-time signal detection across 5 primary engines</span>
                    <span className="export-link">Export Report</span>
                  </div>
                  {engineFeed.map(f => (
                    <div className="feed-item" key={f.title}>
                      <div className="feed-left-bar" style={{ background: f.barColor }} />
                      <div className="feed-body">
                        <div className="feed-engine">
                          <span>{f.engine}</span>
                          <span className="feed-time">{f.time}</span>
                        </div>
                        <div className="feed-title">{f.title}</div>
                        <div className="feed-desc">{f.desc}</div>
                        <div className="feed-actions">
                          <span className="feed-action">◎</span>
                          <span className="feed-action">↑</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2-col module grid */}
                <div className="module-2col">
                  {/* Strategy Prediction */}
                  <div className="module-card">
                    <div className="section-label-row">Strategy Prediction</div>
                    {loadingStrategy ? (
                      <div className="empty-state">Loading prediction…</div>
                    ) : strategyData ? (
                      <>
                        <div className="section-title-main">{strategyData.predicted_strategy}</div>
                        <div className="confidence-row">
                          <div className="confidence-score">
                            {typeof strategyData.confidence === 'number'
                              ? `${Math.round(strategyData.confidence * 100)}%`
                              : strategyData.confidence}
                          </div>
                          <div className="confidence-label">CONFIDENCE<br />SCORE</div>
                        </div>
                        <div className="mini-chart">
                          {miniBarHeights.map((h, i) => (
                            <div key={i} className="mini-bar"
                              style={{ height: `${h * 0.8}px`, background: i === miniBarHeights.length - 1 ? '#1f6feb' : '#21262d' }} />
                          ))}
                        </div>
                        <div className="info-row">
                          <div className="info-item">
                            <span className="info-item-label">Timeframe</span>
                            <span className="info-item-value">Next 4–6 Months</span>
                          </div>
                          <div className="info-item">
                            <span className="info-item-label">Market Impact</span>
                            <span className="info-item-value green">High Consolidation</span>
                          </div>
                        </div>
                        {strategyData.reasoning?.length > 0 && (
                          <div className="reasoning-list">
                            {strategyData.reasoning.slice(0, 3).map((r, i) => (
                              <div className="reasoning-item" key={i}>
                                <div className="reasoning-num">{String(i + 1).padStart(2, '0')}</div>
                                <div className="reasoning-text">{r}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="empty-state">Awaiting data from API…</div>
                    )}
                  </div>

                  {/* Weak Phase */}
                  <div className="module-card">
                    <div className="section-label-row">Weak Phase Prediction</div>
                    {loadingWeakPhase ? (
                      <div className="empty-state">Analyzing…</div>
                    ) : weakPhaseData ? (
                      <>
                        <div className="section-title-main">{weakPhaseData.weak_phase_risk} Risk Level</div>
                        <div className="confidence-row">
                          <div className="confidence-score">
                            {typeof weakPhaseData.confidence === 'number'
                              ? `${Math.round(weakPhaseData.confidence * 100)}%`
                              : weakPhaseData.confidence}
                          </div>
                          <div className="confidence-label">CONFIDENCE<br />SCORE</div>
                        </div>
                        <div className="outcome-box">
                          <div className="outcome-label">Summary</div>
                          <div className="outcome-text" style={{ fontSize: '13px' }}>{weakPhaseData.summary}</div>
                        </div>
                        {weakPhaseData.strategic_opportunity && (
                          <div style={{ fontSize: '13px', color: '#3fb950', lineHeight: '1.6', marginTop: '10px' }}>
                            <strong style={{ color: '#e6edf3' }}>Opportunity: </strong>{weakPhaseData.strategic_opportunity}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="empty-state">Awaiting data from API…</div>
                    )}
                  </div>
                </div>

                {/* Decision Simulation */}
                <div className="module-card">
                  <div className="section-label-row">Decision Simulation Engine</div>
                  <div style={{ fontSize: '12px', color: '#484f58', marginBottom: '16px' }}>Target Entity: {onboardingData.companyName || 'YuktiLens'}</div>
                  <div style={{ fontSize: '12px', color: '#8d96a0', marginBottom: '8px', fontWeight: 500, letterSpacing: '0.5px' }}>Proposed Action</div>
                  <textarea className="sim-textarea" rows={3} value={simulationInput} onChange={e => setSimulationInput(e.target.value)} />
                  <button className="btn-run" onClick={runSimulation} disabled={loadingSimulation || !simulationInput.trim()}>
                    {loadingSimulation ? 'Simulating…' : 'Run Simulation'}
                  </button>

                  {simulationData && (
                    <div style={{ marginTop: '20px' }}>
                      <div className="predicted-badge">PREDICTED</div>
                      <div className="outcome-box">
                        <div className="outcome-label">Projected Outcome</div>
                        <div className="outcome-text">{simulationData.likely_outcome}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-item">
                          <span className="info-item-label">Confidence</span>
                          <span className="info-item-value green">{typeof simulationData.confidence === 'number' ? `${Math.round(simulationData.confidence * 100)}%` : simulationData.confidence || '82%'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-item-label">Risk Level</span>
                          <span className="info-item-value">{simulationData.risk_level}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-item-label">Recommendation</span>
                          <span className="info-item-value">{simulationData.recommendation}</span>
                        </div>
                      </div>
                      {simulationData.reasoning?.length > 0 && (
                        <div className="reasoning-list">
                          {simulationData.reasoning.slice(0, 3).map((r, i) => (
                            <div className="reasoning-item" key={i}>
                              <div className="reasoning-num">{String(i + 1).padStart(2, '0')}</div>
                              <div className="reasoning-text">{r}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!simulationData && !loadingSimulation && (
                    <div style={{ marginTop: '16px' }} className="empty-state">Enter a proposed action and run the simulation engine.</div>
                  )}
                </div>

                {/* Whitespace Opportunity */}
                <div className="module-card">
                  <div className="section-label-row">Whitespace Opportunity Mapping</div>

                  <div className="wspace-legend">
                    <div className="wspace-legend-item"><div className="wspace-dot" style={{ background: '#3fb950' }} /> High Opportunity</div>
                    <div className="wspace-legend-item"><div className="wspace-dot" style={{ background: '#484f58' }} /> Saturated</div>
                    <div className="wspace-legend-item"><div className="wspace-dot" style={{ background: '#d29922' }} /> Emerging Risk</div>
                  </div>

                  <div className="wspace-map">
                    <div className="wspace-axis-x">Market Potential →</div>
                    <div className="wspace-axis-y">Competition Density →</div>
                    {/* Mock nodes */}
                    <div className="wspace-node" style={{ background: 'rgba(72,79,88,0.3)', border: '1px solid #484f58', top: '40px', left: '140px', width: '120px' }}>
                      Digital Lending<br /><span style={{ fontSize: '10px', color: '#7d8590' }}>9.4/10 Density</span>
                    </div>
                    <div className="wspace-node" style={{ background: 'rgba(72,79,88,0.2)', border: '1px solid #30363d', top: '90px', left: '280px', width: '100px' }}>
                      Wealth Mgmt<br /><span style={{ fontSize: '10px', color: '#7d8590' }}>7.1/10</span>
                    </div>
                    <div className="wspace-node" style={{ background: 'rgba(63,185,80,0.15)', border: '2px solid #3fb950', top: '120px', left: '450px', width: '130px' }}>
                      Agri-Fintech<br />Tier 3<br /><span style={{ fontSize: '10px', color: '#3fb950' }}>2.1/10 Density</span><br /><span style={{ fontSize: '9px', padding: '2px 6px', background: '#3fb950', color: '#0d1117', borderRadius: '3px', fontWeight: 700 }}>OPTIMAL</span>
                    </div>
                    <div className="wspace-node" style={{ background: 'rgba(210,153,34,0.15)', border: '1px solid #d29922', top: '150px', left: '600px', width: '120px' }}>
                      Gig Economy<br />Insurance<br /><span style={{ fontSize: '10px', color: '#d29922' }}>1.8 Density</span>
                    </div>
                  </div>

                  {loadingWhitespace ? (
                    <div className="empty-state">Mapping market zones…</div>
                  ) : whitespaceData ? (
                    <div>
                      {whitespaceData.opportunity_recommendation?.map((opp, i) => (
                        <div className="opp-card" key={i}>
                          <div className="opp-name">{opp.opportunity}</div>
                          <div className="opp-desc">{opp.why_it_matters}</div>
                          <div className="opp-footer">
                            <span className="opp-region">↳ {opp.recommended_positioning}</span>
                            <span className="opp-conf">Confidence: {opp.confidence}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {[
                        { name: 'Micro-lending Gap', desc: 'Credit access for street vendors shows 45% unmet demand with zero organized competitors.' },
                        { name: 'Embedded ESG', desc: 'Green-linked savings accounts show high search intent but only 2 active beta products.' },
                        { name: 'Silver-Tech Banking', desc: 'Simplified UI banking for users 65+ represents a whitespace of $4B in managed assets.' },
                      ].map(o => (
                        <div key={o.name} style={{ flex: '1 1 200px', background: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '14px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#e6edf3', marginBottom: '6px' }}>{o.name}</div>
                          <div style={{ fontSize: '12px', color: '#7d8590', lineHeight: 1.6 }}>{o.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right column */}
              <div className="dash-right">
                <div className="status-card">
                  <div className="status-title">Engine Detection Status</div>
                  {[
                    { name: 'Pricing Engine', status: 'ACTIVE', type: 'active' },
                    { name: 'Campaigns', status: 'ACTIVE', type: 'active' },
                    { name: 'Reviews/Sentiment', status: 'ALERT (2)', type: 'alert' },
                    { name: 'Social Matrix', status: 'STANDBY', type: 'standby' },
                  ].map(s => (
                    <div className="status-row" key={s.name}>
                      <span className="status-name">{s.name}</span>
                      <span className={`status-badge badge-${s.type}`}>{s.status}</span>
                    </div>
                  ))}
                  <button className="ask-ai-btn">🤖 Ask Analyst AI</button>
                  <div className="risk-alpha-row">
                    <div>
                      <div className="risk-alpha-label">Risk Correlation Alpha</div>
                      <div className="risk-alpha-val">0.92</div>
                      <div className="risk-alpha-bar"><div className="risk-alpha-fill" style={{ width: '92%' }} /></div>
                    </div>
                  </div>
                </div>

                <div className="region-card">
                  <div className="region-title">Regional Variance</div>
                  {[
                    { name: 'North America', pct: 78, fillClass: 'region-fill-na' },
                    { name: 'European Union', pct: 42, fillClass: 'region-fill-eu' },
                    { name: 'APAC Market', pct: 91, fillClass: 'region-fill-ap' },
                  ].map(r => (
                    <div className="region-row" key={r.name}>
                      <div className="region-label-row">
                        <span className="region-name">{r.name}</span>
                        <span className="region-pct">{r.pct}%</span>
                      </div>
                      <div className="region-bar">
                        <div className={r.fillClass} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                  <button className="view-heatmap-btn">View Market Heatmap</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard