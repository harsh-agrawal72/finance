import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, BarChart2, PieChart, AlertTriangle, Repeat, BrainCircuit, Target, Send, RefreshCw, DollarSign, Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

const CARD = { borderRadius: '20px', overflow: 'hidden' };
const tooltipStyle = { backgroundColor: '#0d1117', titleFont: { family: 'Outfit', size: 13 }, bodyFont: { family: 'Outfit', size: 13 }, padding: 14, borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1 };
const tickStyle = { color: '#475569', font: { family: 'Outfit', size: 11 } };

const NEON = ['#00f2ff', '#8b5cf6', '#00ffaa', '#f59e0b', '#d946ef', '#f43f5e', '#0ea5e9', '#22c55e'];

const Analytics = ({
  monthlyHistory, categoryBreakdown, totals, getAnomalies,
  getSpendingForecast, getRecurringExpenses, getNetWorth, askAI, transactions,
  currency = '₹'
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: "Hi Harsh! I'm your **Personal Finance AI Advisor** 🤖\n\nI'm connected to your real financial data and can give you personalized answers. Try asking me:\n\n• *How much should I spend on food?*\n• *Will I overspend this month?*\n• *Where should I invest?*\n• *How to pay off my debt faster?*", suggestions: ['How much should I spend on food?', 'What is my savings rate?', 'Investment tips for me'] }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const forecast = getSpendingForecast();
  const recurring = getRecurringExpenses();
  const netWorthData = getNetWorth();
  const anomalies = getAnomalies();

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const sendMessage = (message) => {
    if (!message.trim() || isTyping) return;
    setChatInput('');
    setChatHistory(h => [...h, { role: 'user', text: message }]);
    setIsTyping(true);
    setTimeout(() => {
      const response = askAI(message);
      // response is now { text, suggestions } or a plain string (backward compat)
      const text = typeof response === 'string' ? response : response.text;
      const suggestions = typeof response === 'string' ? [] : (response.suggestions || []);
      setChatHistory(h => [...h, { role: 'ai', text, suggestions }]);
      setIsTyping(false);
    }, 500 + Math.random() * 500);
  };

  const handleChat = (e) => { e.preventDefault(); sendMessage(chatInput); };

  const QUICK_CATEGORIES = [
    { label: '🍕 Food & Dining', questions: ['How much should I spend on food?', 'Show my grocery spending', 'Tips to save on food'] },
    { label: '🏠 Housing & Rent', questions: ['How much should I spend on rent?', 'Is my rent too high?'] },
    { label: '📊 Spending', questions: ['Show my spending breakdown', 'Where am I overspending?', 'Compare this month to last month'] },
    { label: '💰 Savings', questions: ['How much should I save?', 'What is my savings rate?', 'Show my savings goals'] },
    { label: '📈 Investments', questions: ['Where should I invest?', 'SIP investment tips', 'How to build wealth?'] },
    { label: '🔮 Forecasts', questions: ['Will I overspend this month?', 'Forecast my end of month', 'Show my daily burn rate'] },
    { label: '💳 Debt', questions: ['How to pay off my loan faster?', 'What is my debt-to-asset ratio?'] },
    { label: '🔄 Recurring', questions: ['List all my subscriptions', 'How much are my recurring expenses?'] },
  ];
  const [expandedCategory, setExpandedCategory] = useState(null);

  // ── Chart data ────────────────────────────────────────────────────────
  const labels = monthlyHistory.map(m => m.label);

  const lineData = {
    labels,
    datasets: [
      { fill: true, label: 'Income', data: monthlyHistory.map(m => m.income), borderColor: '#00ffaa', borderWidth: 2.5, backgroundColor: ctx => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250); g.addColorStop(0, 'rgba(0,255,170,0.18)'); g.addColorStop(1, 'transparent'); return g; }, tension: 0.4, pointBackgroundColor: '#00ffaa', pointRadius: 4 },
      { fill: true, label: 'Expenses', data: monthlyHistory.map(m => m.expenses), borderColor: '#ff4d4d', borderWidth: 2.5, backgroundColor: ctx => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250); g.addColorStop(0, 'rgba(255,77,77,0.12)'); g.addColorStop(1, 'transparent'); return g; }, tension: 0.4, pointBackgroundColor: '#ff4d4d', pointRadius: 4 },
      { label: 'Savings', data: monthlyHistory.map(m => m.savings), borderColor: '#00f2ff', borderWidth: 2, borderDash: [5, 4], backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
    ],
  };

  const barData = {
    labels,
    datasets: [
      { label: 'Income', data: monthlyHistory.map(m => m.income), backgroundColor: 'rgba(0,255,170,0.65)', borderRadius: 8, borderSkipped: false },
      { label: 'Expenses', data: monthlyHistory.map(m => m.expenses), backgroundColor: 'rgba(255,77,77,0.65)', borderRadius: 8, borderSkipped: false },
    ],
  };

  const doughnutData = {
    labels: categoryBreakdown.slice(0, 7).map(c => c.name),
    datasets: [{ data: categoryBreakdown.slice(0, 7).map(c => c.amount), backgroundColor: NEON, borderWidth: 0, hoverOffset: 14 }],
  };

  const radarData = {
    labels: ['Savings Rate', 'Budget Control', 'Low Debt', 'Goal Progress', 'Income Diversity', 'Emergency Fund'],
    datasets: [{
      label: 'Your Score',
      data: [
        Math.max(0, Math.min(100, totals.savingsRate * 5)),
        Math.max(0, 100 - Math.round((totals.expenses / Math.max(totals.income, 1)) * 100)),
        Math.max(0, 100 - Math.round((netWorthData.totalLiabilities / Math.max(netWorthData.totalAssets, 1)) * 100)),
        Math.min(100, 60),
        50,
        Math.min(100, 40),
      ],
      borderColor: '#00f2ff',
      backgroundColor: 'rgba(0,242,255,0.12)',
      borderWidth: 2,
      pointBackgroundColor: '#00f2ff',
    }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#64748b', font: { family: 'Outfit', size: 12 }, usePointStyle: true, padding: 16 } }, tooltip: { ...tooltipStyle, callbacks: { label: (ctx) => ` ${ctx.raw < 0 ? '-' : ''}${currency}${Math.abs(Number(ctx.raw)).toLocaleString()}` } } },
    scales: { y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { ...tickStyle, callback: v => `${v < 0 ? '-' : ''}${currency}${Math.abs(v) >= 1000 ? Math.round(Math.abs(v) / 1000) + 'k' : Math.abs(v)}` }, border: { display: false } }, x: { grid: { display: false }, ticks: tickStyle, border: { display: false } } },
  };

  const doughnutOpts = {
    cutout: '70%',
    plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 }, usePointStyle: true, padding: 14, generateLabels: (chart) => { const data = chart.data; return data.labels.map((label, i) => ({ text: `${label}  ${currency}${data.datasets[0].data[i].toLocaleString()}`, fillStyle: data.datasets[0].backgroundColor[i], hidden: false, index: i })); } } }, tooltip: tooltipStyle },
  };

  const radarOpts = {
    responsive: true, maintainAspectRatio: false,
    scales: { r: { angleLines: { color: 'rgba(255,255,255,0.06)' }, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#475569', font: { family: 'Outfit', size: 10 }, backdropColor: 'transparent' }, pointLabels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }, min: 0, max: 100 } },
    plugins: { legend: { display: false }, tooltip: tooltipStyle },
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'ai', label: 'AI Advisor', icon: BrainCircuit },
    { id: 'health', label: 'Financial Health', icon: Activity },
    { id: 'recurring', label: 'Recurring', icon: Repeat },
  ];

  const formatMd = (text) => {
    // very simple markdown: **bold**, \n newlines
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return <span key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--accent-cyan)' }}>{p}</strong> : p)}<br /></span>;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: isMobile ? '28px' : '34px', fontWeight: 800, letterSpacing: '-1px' }}>Analytics & AI</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '13px' : '15px', marginTop: '4px' }}>Deep insights, forecasts, and your personal AI Financial Advisor.</p>
      </div>

      {/* Section Tabs */}
      <div className="no-scrollbar" style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, auto)',
        gap: isMobile ? '8px' : '6px',
        background: 'rgba(255,255,255,0.03)',
        padding: '6px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        width: isMobile ? '100%' : 'fit-content'
      }}>
        {sections.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveSection(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: isMobile ? '12px' : '9px 18px', 
              borderRadius: '11px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', 
              fontWeight: 700, fontSize: isMobile ? '12.5px' : '13px', transition: 'all 0.2s',
              background: activeSection === id ? 'rgba(0,242,255,0.12)' : 'transparent',
              color: activeSection === id ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.4)',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

          {/* ── OVERVIEW ─────────────────────────────────────── */}
          {activeSection === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Alert Anomalies */}
              {anomalies.length > 0 && (
                <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '14px', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                    <span style={{ fontWeight: 700, color: 'var(--warning)', fontSize: '14px' }}>Spending Anomalies Detected</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {anomalies.map(a => (
                      <div key={a.category} style={{ padding: '8px 14px', background: 'rgba(251,191,36,0.08)', borderRadius: '10px', border: '1px solid rgba(251,191,36,0.2)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--warning)' }}>{a.category}</strong> up {a.increase}% vs last month
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mini KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', width: '100%' }}>
                {[
                  { label: 'Projected Spend', value: `${currency}${forecast.projected.toLocaleString()}`, color: forecast.projected > totals.income ? 'var(--danger)' : 'var(--accent-cyan)', icon: TrendingUp },
                  { label: 'Safe to Spend', value: `${currency}${forecast.safeToSpend.toLocaleString()}`, color: 'var(--accent-emerald)', icon: DollarSign },
                  { label: 'Net Worth', value: `${netWorthData.netWorth < 0 ? '-' : ''}${currency}${Math.abs(netWorthData.netWorth).toLocaleString()}`, color: netWorthData.netWorth >= 0 ? 'var(--accent-violet)' : 'var(--danger)', icon: Activity },
                  { label: 'Days Left', value: `${forecast.daysLeft}d`, color: '#f59e0b', icon: Target },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="glass-card" style={{ ...CARD, display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '14px', padding: isMobile ? '16px 12px' : '24px' }}>
                    <div style={{ padding: isMobile ? '8px' : '10px', background: `${color}18`, borderRadius: '10px', color }}><Icon size={isMobile ? 18 : 20} /></div>
                    <div>
                      <p style={{ fontSize: isMobile ? '10px' : '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>{label}</p>
                      <p style={{ fontWeight: 800, fontSize: isMobile ? '15px' : '18px', color }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Line Chart + Doughnut */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: isMobile ? '16px' : '20px' }}>
                <div className="glass-card" style={CARD}>
                  <h3 style={{ fontWeight: 700, fontSize: isMobile ? '15px' : '17px', marginBottom: isMobile ? '12px' : '20px' }}>6-Month Income vs Expenses</h3>
                  <div style={{ height: isMobile ? '200px' : '280px' }}><Line options={chartOpts} data={lineData} /></div>
                </div>
                <div className="glass-card" style={CARD}>
                  <h3 style={{ fontWeight: 700, fontSize: isMobile ? '15px' : '17px', marginBottom: isMobile ? '12px' : '20px' }}>This Month's Spend</h3>
                  <div style={{ height: isMobile ? '280px' : '280px' }}>
                    {categoryBreakdown.length > 0 ? (
                      <Doughnut
                        options={{
                          ...doughnutOpts,
                          plugins: {
                            ...doughnutOpts.plugins,
                            legend: {
                              ...doughnutOpts.plugins.legend,
                              position: 'bottom',
                              display: true,
                              labels: {
                                ...doughnutOpts.plugins.legend.labels,
                                boxWidth: isMobile ? 10 : 12,
                                padding: isMobile ? 8 : 14,
                                font: { family: 'Outfit', size: isMobile ? 10 : 12 }
                              }
                            }
                          }
                        }}
                        data={doughnutData}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>No expense data yet</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="glass-card" style={CARD}>
                <h3 style={{ fontWeight: 700, fontSize: isMobile ? '15px' : '17px', marginBottom: isMobile ? '12px' : '20px' }}>Monthly Comparison</h3>
                <div style={{ height: isMobile ? '180px' : '260px' }}><Bar options={chartOpts} data={barData} /></div>
              </div>

              {/* Spending Forecast Bar */}
              <div className="glass-card" style={{ ...CARD, background: 'rgba(0,242,255,0.04)', border: '1px solid rgba(0,242,255,0.15)' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '12px' : '0', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: isMobile ? '15px' : '17px' }}>Month-End Forecast</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: isMobile ? '11px' : '13px', marginTop: '2px' }}>
                      Projected: {currency}{forecast.projected.toLocaleString()} vs {currency}{totals.income.toLocaleString()} income
                    </p>
                  </div>
                  <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <p style={{ fontSize: isMobile ? '10px' : '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Daily burn rate</p>
                    <p style={{ fontWeight: 800, fontSize: isMobile ? '18px' : '20px', color: 'var(--accent-cyan)' }}>{currency}{forecast.dailyRate.toLocaleString()}/day</p>
                  </div>
                </div>
                <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.round((forecast.projected / Math.max(totals.income, 1)) * 100))}%` }} transition={{ duration: 1.2 }}
                    style={{ height: '100%', background: forecast.projected > totals.income ? 'var(--danger)' : 'var(--accent-cyan)', boxShadow: '0 0 12px rgba(0,242,255,0.4)', borderRadius: '6px', transition: 'background 0.3s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: isMobile ? '10px' : '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <span>{currency}0</span>
                  <span style={{ color: forecast.projected > totals.income ? 'var(--danger)' : 'var(--accent-emerald)', textAlign: 'center', padding: '0 10px' }}>
                    {forecast.projected > totals.income ? '⚠️ Over budget!' : `✅ ${currency}${forecast.safeToSpend.toLocaleString()} remaining`}
                  </span>
                  <span>{currency}{totals.income.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ai' && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: '24px' }}>
              {/* Chat Window */}
              <div style={{ ...CARD, display: 'flex', flexDirection: 'column', border: '1px solid rgba(139,92,246,0.2)', minHeight: isMobile ? '500px' : '640px', padding: isMobile ? '16px' : '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ padding: '10px', background: 'rgba(139,92,246,0.15)', borderRadius: '12px', color: 'var(--accent-violet)' }}><BrainCircuit size={22} /></div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '18px' }}>Finance AI Advisor</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                        style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00ffaa', boxShadow: '0 0 6px #00ffaa' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Online · Analyzing your real data</span>
                    </div>
                  </div>
                  <button onClick={() => setChatHistory([{ role: 'ai', text: "Hi Harsh! I'm your **Personal Finance AI Advisor** 🤖\n\nI'm connected to your real financial data and can give you personalized answers. Try asking me:\n\n• *How much should I spend on food?*\n• *Will I overspend this month?*\n• *Where should I invest?*\n• *How to pay off my debt faster?*", suggestions: ['How much should I spend on food?', 'What is my savings rate?', 'Investment tips for me'] }])} style={{ marginLeft: 'auto', padding: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <RefreshCw size={14} />
                  </button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px', maxHeight: '460px' }}>
                  {chatHistory.map((msg, i) => (
                    <div key={i}>
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', gap: '10px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.role === 'ai' ? 'rgba(139,92,246,0.2)' : 'rgba(0,242,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '15px', border: msg.role === 'ai' ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(0,242,255,0.3)' }}>
                          {msg.role === 'ai' ? '🤖' : '👤'}
                        </div>
                        <div style={{ maxWidth: isMobile ? '88%' : '82%', padding: isMobile ? '10px 14px' : '13px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.role === 'user' ? 'rgba(0,242,255,0.10)' : 'rgba(139,92,246,0.07)', border: `1px solid ${msg.role === 'user' ? 'rgba(0,242,255,0.18)' : 'rgba(139,92,246,0.13)'}`, fontSize: isMobile ? '13px' : '13.5px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                          {formatMd(msg.text)}
                        </div>
                      </motion.div>
                      {/* Suggestion chips below AI messages */}
                      {msg.role === 'ai' && msg.suggestions?.length > 0 && i === chatHistory.length - 1 && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                          style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '10px', marginLeft: isMobile ? '10px' : '42px' }}>
                          {msg.suggestions.map(s => (
                            <button key={s} onClick={() => sendMessage(s)}
                              style={{ padding: '6px 13px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', color: 'var(--accent-violet)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; }}>
                              {s}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', border: '1px solid rgba(139,92,246,0.3)' }}>🤖</div>
                      <div style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                        {[0, 1, 2].map(d => <motion.div key={d} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: d * 0.18 }} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#8b5cf6' }} />)}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleChat} style={{ marginTop: '20px', display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask: How much should I spend on food?" disabled={isTyping}
                    style={{ flex: 1, padding: '13px 18px', background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', borderRadius: '14px', fontFamily: 'inherit', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <button type="submit" disabled={!chatInput.trim() || isTyping}
                    style={{ padding: '13px 18px', background: chatInput.trim() && !isTyping ? 'linear-gradient(135deg,#8b5cf6,#0ea5e9)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '14px', cursor: chatInput.trim() && !isTyping ? 'pointer' : 'default', color: chatInput.trim() && !isTyping ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                    <Send size={18} />
                  </button>
                </form>
              </div>

              {/* Quick Topics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: isMobile ? 'visible' : 'auto', maxHeight: isMobile ? 'none' : '700px' }}>
                <div className="glass-card" style={CARD}>
                  <h3 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BrainCircuit size={14} style={{ color: 'var(--accent-violet)' }} /> {isMobile ? 'Quick Topics' : 'Topic Browser'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {QUICK_CATEGORIES.map(cat => (
                      <div key={cat.label}>
                        <button onClick={() => setExpandedCategory(expandedCategory === cat.label ? null : cat.label)}
                          style={{ width: '100%', padding: '9px 12px', background: expandedCategory === cat.label ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${expandedCategory === cat.label ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', color: expandedCategory === cat.label ? 'var(--accent-violet)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '13px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
                          {cat.label}
                          <span style={{ fontSize: '10px', opacity: 0.5 }}>{expandedCategory === cat.label ? '▲' : '▼'}</span>
                        </button>
                        <AnimatePresence>
                          {expandedCategory === cat.label && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '6px 0 4px 8px' }}>
                                {cat.questions.map(q => (
                                  <button key={q} onClick={() => sendMessage(q)}
                                    style={{ padding: '7px 12px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: '12px', fontWeight: 500, borderRadius: '8px', transition: 'all 0.15s', borderLeft: '2px solid rgba(139,92,246,0.3)' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                                    {q}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FINANCIAL HEALTH ─────────────────────────────── */}
          {activeSection === 'health' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                {/* Radar Chart */}
                <div className="glass-card" style={CARD}>
                  <h3 style={{ fontWeight: 700, fontSize: isMobile ? '15px' : '17px', marginBottom: '4px' }}>Financial Health Radar</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>AI-scored across 6 dimensions</p>
                  <div style={{ height: isMobile ? '260px' : '300px' }}>
                    <Radar
                      options={{
                        ...radarOpts,
                        scales: {
                          ...radarOpts.scales,
                          r: {
                            ...radarOpts.scales.r,
                            pointLabels: {
                              ...radarOpts.scales.r.pointLabels,
                              font: { ...radarOpts.scales.r.pointLabels.font, size: isMobile ? 9 : 11 }
                            }
                          }
                        }
                      }}
                      data={radarData}
                    />
                  </div>
                </div>

                {/* Net Worth Breakdown */}
                <div className="glass-card" style={CARD}>
                  <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '20px' }}>Net Worth Breakdown</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '16px', background: 'rgba(0,255,170,0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,170,0.15)' }}>
                      <p style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Total Assets</p>
                      <p style={{ fontWeight: 800, fontSize: '26px', color: 'var(--accent-emerald)' }}>{currency}{netWorthData.totalAssets.toLocaleString()}</p>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(255,77,77,0.05)', borderRadius: '12px', border: '1px solid rgba(255,77,77,0.15)' }}>
                      <p style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Total Liabilities</p>
                      <p style={{ fontWeight: 800, fontSize: '26px', color: 'var(--danger)' }}>{currency}{netWorthData.totalLiabilities.toLocaleString()}</p>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(139,92,246,0.05)', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <p style={{ fontSize: '12px', color: 'var(--accent-violet)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Net Worth</p>
                      <p style={{ fontWeight: 900, fontSize: isMobile ? '26px' : '32px', color: netWorthData.netWorth >= 0 ? 'var(--accent-violet)' : 'var(--danger)' }}>
                        {netWorthData.netWorth < 0 ? '-' : ''}{currency}{Math.abs(netWorthData.netWorth).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {[
                  { label: 'Savings Rate', score: Math.min(100, totals.savingsRate * 5), desc: `${totals.savingsRate}% of income saved`, color: '#00ffaa' },
                  { label: 'Expense Control', score: Math.max(0, 100 - Math.round((totals.expenses / Math.max(totals.income, 1)) * 100)), desc: `${Math.round((totals.expenses / Math.max(totals.income, 1)) * 100)}% of income spent`, color: '#00f2ff' },
                  { label: 'Debt Ratio', score: Math.max(0, 100 - Math.round((netWorthData.totalLiabilities / Math.max(netWorthData.totalAssets, 1)) * 100)), desc: isMobile ? 'Liabilities' : `${currency}${netWorthData.totalLiabilities.toLocaleString()} in liabilities`, color: '#8b5cf6' },
                  { label: 'Overall', score: Math.max(0, Math.min(100, Math.round((totals.income - totals.expenses) / Math.max(totals.income, 1) * 100))), desc: isMobile ? 'Composite score' : 'Composite financial health', color: '#f59e0b' },
                ].map(({ label, score, desc, color }) => (
                  <div key={label} className="glass-card" style={{ ...CARD, padding: isMobile ? '16px 14px' : '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <p style={{ fontWeight: 700, fontSize: isMobile ? '13px' : '14px', color: 'var(--text-secondary)' }}>{label}</p>
                      <span style={{ fontWeight: 900, fontSize: isMobile ? '18px' : '22px', color }}>{score}</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.2 }}
                        style={{ height: '100%', background: color, borderRadius: '4px', boxShadow: `0 0 10px ${color}60` }} />
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RECURRING ────────────────────────────────────── */}
          {activeSection === 'recurring' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="glass-card" style={{ ...CARD, padding: isMobile ? '16px 14px' : '24px' }}>
                  <p style={{ fontSize: isMobile ? '10px' : '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Monthly Total</p>
                  <p style={{ fontWeight: 800, fontSize: isMobile ? '20px' : '26px', color: 'var(--danger)' }}>{currency}{recurring.reduce((s, t) => s + Number(t.amount), 0).toLocaleString()}</p>
                </div>
                <div className="glass-card" style={{ ...CARD, padding: isMobile ? '16px 14px' : '24px' }}>
                  <p style={{ fontSize: isMobile ? '10px' : '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Active Subs</p>
                  <p style={{ fontWeight: 800, fontSize: isMobile ? '20px' : '26px', color: 'var(--accent-violet)' }}>{recurring.length}</p>
                </div>
                <div className="glass-card" style={{ ...CARD, padding: isMobile ? '16px 14px' : '24px' }}>
                  <p style={{ fontSize: isMobile ? '10px' : '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Annual Cost</p>
                  <p style={{ fontWeight: 800, fontSize: isMobile ? '20px' : '26px', color: 'var(--warning)' }}>{currency}{(recurring.reduce((s, t) => s + Number(t.amount), 0) * 12).toLocaleString()}</p>
                </div>
                <div className="glass-card" style={{ ...CARD, padding: isMobile ? '16px 14px' : '24px' }}>
                  <p style={{ fontSize: isMobile ? '10px' : '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>% of Income</p>
                  <p style={{ fontWeight: 800, fontSize: isMobile ? '20px' : '26px', color: 'var(--accent-cyan)' }}>{totals.income > 0 ? Math.round((recurring.reduce((s, t) => s + Number(t.amount), 0) / totals.income) * 100) : 0}%</p>
                </div>
              </div>

              <div className="glass-card" style={CARD}>
                <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '20px' }}>All Recurring Transactions</h3>
                {recurring.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {recurring.map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '12px' : '14px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '12px' }}>
                          <div style={{ padding: isMobile ? '6px' : '8px', background: 'rgba(139,92,246,0.12)', borderRadius: '10px', color: 'var(--accent-violet)' }}><Repeat size={isMobile ? 14 : 16} /></div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: isMobile ? '13px' : '14px' }}>{t.description}</p>
                            <p style={{ fontSize: isMobile ? '11px' : '12px', color: 'var(--text-muted)' }}>{t.category} {isMobile ? '' : `· ${t.recurring}`}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 800, fontSize: isMobile ? '14px' : '16px', color: 'var(--danger)' }}>-{currency}{Number(t.amount).toLocaleString()}</p>
                          <p style={{ fontSize: isMobile ? '10px' : '11px', color: 'var(--text-muted)' }}>{currency}{(Number(t.amount) * 12).toLocaleString()}/yr</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <Repeat size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p>No recurring transactions yet. Mark transactions as recurring when adding them.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default React.memo(Analytics);
