import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ArrowUpRight, ArrowDownRight, Wallet, BrainCircuit, TrendingUp, Plus, Receipt, Activity, X, Check } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const Dashboard = ({ totals, healthScore, insights, recentTransactions, addTransaction, categories, monthlyHistory, categoryBreakdown, currency = '₹' }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [chartMode, setChartMode] = useState('line');
  const [form, setForm] = useState({ amount: '', category: categories?.expense?.[0] || 'Groceries', description: '', date: new Date().toISOString().split('T')[0], type: 'expense', recurring: 'none', note: '' });
  const [success, setSuccess] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    addTransaction(form);
    setForm({ amount: '', category: categories?.expense?.[0] || 'Groceries', description: '', date: new Date().toISOString().split('T')[0], type: 'expense', recurring: 'none', note: '' });
    setShowQuickAdd(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const labels = monthlyHistory?.map(m => m.label) || [];
  const lineData = {
    labels,
    datasets: [
      { fill: true, label: 'Income', data: monthlyHistory?.map(m => m.income) || [], borderColor: '#00ffaa', borderWidth: 2, pointBackgroundColor: '#00ffaa', backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, 'rgba(0,255,170,0.15)'); g.addColorStop(1, 'rgba(0,255,170,0)'); return g; }, tension: 0.4 },
      { fill: true, label: 'Expenses', data: monthlyHistory?.map(m => m.expenses) || [], borderColor: '#ff4d4d', borderWidth: 2, pointBackgroundColor: '#ff4d4d', backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, 'rgba(255,77,77,0.1)'); g.addColorStop(1, 'rgba(255,77,77,0)'); return g; }, tension: 0.4 },
    ],
  };

  const barData = {
    labels,
    datasets: [
      { label: 'Income', data: monthlyHistory?.map(m => m.income) || [], backgroundColor: 'rgba(0,255,170,0.6)', borderRadius: 6 },
      { label: 'Expenses', data: monthlyHistory?.map(m => m.expenses) || [], backgroundColor: 'rgba(255,77,77,0.6)', borderRadius: 6 },
      { label: 'Savings', data: monthlyHistory?.map(m => m.savings) || [], backgroundColor: 'rgba(0,242,255,0.5)', borderRadius: 6 },
    ],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true, labels: { color: '#64748b', font: { family: 'Outfit', size: 12 }, usePointStyle: true } }, tooltip: { backgroundColor: '#0d1117', titleFont: { family: 'Outfit', size: 13 }, bodyFont: { family: 'Outfit', size: 13 }, padding: 12, borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, callbacks: { label: (ctx) => ` ${ctx.raw < 0 ? '-' : ''}${currency}${Math.abs(Number(ctx.raw)).toLocaleString()}` } } },
    scales: { y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { family: 'Outfit', size: 11 }, callback: (v) => `${v < 0 ? '-' : ''}${currency}${Math.abs(v) >= 1000 ? Math.round(Math.abs(v) / 1000) + 'k' : Math.abs(v)}` } }, x: { grid: { display: false }, ticks: { color: '#475569', font: { family: 'Outfit', size: 12 } } } },
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, delay, prefix = currency }) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }} whileHover={{ y: -4 }}
      style={{ flex: 1, minWidth: isMobile ? '100%' : '180px', background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden', transition: 'all 0.3s', cursor: 'default' }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: `radial-gradient(circle, ${color}18, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ padding: '10px', background: `${color}18`, borderRadius: '12px', color, border: `1px solid ${color}25` }}><Icon size={22} /></div>
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: trend >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(255,77,77,0.1)', color: trend >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>{title}</p>
      <h3 style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: 800, letterSpacing: '-0.5px' }}>
        {value < 0 ? '-' : ''}{prefix}{Math.abs(typeof value === 'number' ? value : 0).toLocaleString()}
      </h3>
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <h1 style={{ fontSize: isMobile ? '28px' : '34px', fontWeight: 800, letterSpacing: '-1px' }}>{greeting()}, Harsh! 👋</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>Based on {currency}{totals.income.toLocaleString()} monthly income</p>
        </div>
        <button onClick={() => setShowQuickAdd(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', background: 'rgba(0,255,170,0.08)', color: 'var(--accent-emerald)', borderRadius: '12px', fontWeight: 700, border: '1px solid rgba(0,255,170,0.2)', cursor: 'pointer', fontSize: '14px' }}>
          <Plus size={16} /> Quick Log
        </button>
      </div>

      {/* Quick Add Form */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ background: 'rgba(0,242,255,0.03)', border: '1px solid rgba(0,242,255,0.15)', borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={18} /> Log Quick Transaction</h3>
                <button onClick={() => setShowQuickAdd(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleAdd} className="adaptive-grid" style={{ '--grid-cols': 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value, category: e.target.value === 'income' ? (categories?.income?.[0] || 'Salary') : (categories?.expense?.[0] || 'Groceries') }))}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount ({currency})</label>
                  <input type="number" placeholder={`${currency}0`} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required min="0" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: isMobile ? 'auto' : 'span 2' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</label>
                  <input type="text" placeholder="Coffee, Lunch..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', color: 'white', borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ Add</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="adaptive-grid" style={{ '--grid-cols': 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <StatCard title="Income" value={totals.income} icon={ArrowUpRight} color="var(--accent-emerald)" trend={5.2} delay={0.1} />
        <StatCard title="Expenses" value={totals.expenses} icon={ArrowDownRight} color="var(--danger)" trend={-2.4} delay={0.2} />
        <StatCard title="Savings" value={totals.income - totals.expenses} icon={Wallet} color="var(--accent-cyan)" trend={totals.savingsRate} delay={0.3} />
        <StatCard title="Health Score" value={healthScore} icon={Activity} color="var(--accent-violet)" prefix="" delay={0.4} />
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,255,170,0.1)', border: '1px solid rgba(0,255,170,0.3)', borderRadius: '12px', padding: '14px 20px', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Check size={16} /> Transaction logged!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts and Insights Row */}
      <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '24px' }}>

        {/* Main Chart */}
        <div style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: isMobile ? '20px' : '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '18px' }}>Spending Pattern</h3>
            <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-secondary)', borderRadius: '10px', padding: '4px' }}>
              {['line', 'bar'].map(m => (
                <button key={m} onClick={() => setChartMode(m)} style={{ padding: '6px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px', textTransform: 'capitalize', background: chartMode === m ? 'rgba(0,242,255,0.15)' : 'transparent', color: chartMode === m ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>{m}</button>
              ))}
            </div>
          </div>
          <div style={{ height: '300px' }}>
            {chartMode === 'line' ? <Line options={chartOptions} data={lineData} /> : <Bar options={chartOptions} data={barData} />}
          </div>
        </div>

        {/* Side Panel: AI + Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* AI Insights */}
          <div style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', background: 'rgba(139,92,246,0.15)', borderRadius: '10px', color: 'var(--accent-violet)' }}><BrainCircuit size={20} /></div>
              <h3 style={{ fontWeight: 700, fontSize: '16px' }}>AI Insights</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {insights?.slice(0, 3).map((insight, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(139,92,246,0.05)', fontSize: '13px', color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-violet)' }}>
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Top Spending */}
          {categoryBreakdown?.length > 0 && (
            <div style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '22px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '14px' }}>Top Spending</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {categoryBreakdown.slice(0, 3).map((cat, i) => (
                  <div key={cat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{cat.name}</span>
                      <span style={{ fontWeight: 700 }}>{currency}{cat.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${(cat.amount / categoryBreakdown[0].amount) * 100}%`, background: 'var(--accent-cyan)', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Receipt size={18} style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ fontWeight: 700, fontSize: '16px' }}>Recent Activity</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentTransactions?.slice(0, 5).map((t, i) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: t.type === 'income' ? 'rgba(0,255,170,0.1)' : 'rgba(255,77,77,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.type === 'income' ? 'var(--accent-emerald)' : 'var(--danger)' }}>
                  {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>{t.description}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.category} · {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <span style={{ fontWeight: 800, color: t.type === 'income' ? 'var(--accent-emerald)' : 'var(--danger)' }}>
                {t.type === 'income' ? '+' : '-'}{currency}{Math.abs(Number(t.amount)).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
