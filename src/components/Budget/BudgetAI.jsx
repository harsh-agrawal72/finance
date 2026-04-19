import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertCircle, TrendingUp, ShieldCheck, Zap, Edit2, Check, X } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// ─── BudgetProgress Component (Defined outside to prevent focus loss) ────────
const BudgetProgress = memo(({ title, current, target, suggested, icon: Icon, color, delay, onSaveBudget, currency = '₹', isInverse = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(target);

  const handleEditSave = () => {
    const val = Number(tempValue);
    if (val >= 0) onSaveBudget(title, val);
    setIsEditing(false);
  };

  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  // For normal budgets (needs/wants), current > target is bad.
  // For inverse budgets (savings), current > target is good.
  const isExceeded = target > 0 && current > target;
  const isNegative = isInverse ? (target > 0 && current < target) : isExceeded;
  const remaining = Math.max(0, target - current);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
      className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: `1px solid ${isNegative ? (isInverse ? 'rgba(245,158,11,0.3)' : 'rgba(255,77,77,0.3)') : 'var(--glass-border)'}`, position: 'relative', overflow: 'hidden', padding: '28px' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: isNegative ? (isInverse ? 'var(--warning)' : 'var(--danger)') : (isInverse && isExceeded ? 'var(--accent-cyan)' : color), opacity: 0.8 }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: `${color}15`, borderRadius: '16px', color, border: `1px solid ${color}35`, boxShadow: `0 8px 20px ${color}10` }}>
            <Icon size={26} />
          </div>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', marginBottom: '4px' }}>{title}</h3>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 0.8 }}>{isInverse ? 'Savings Target' : 'Budget Limit'}</span>
          </div>
        </div>

        {/* Editable Budget Amount */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" value={tempValue} onChange={e => setTempValue(e.target.value)}
                min="0" autoFocus onKeyDown={e => e.key === 'Enter' && handleEditSave()}
                style={{ width: '110px', padding: '8px 12px', background: 'var(--bg-secondary)', border: `2px solid ${color}`, color: 'var(--text-primary)', borderRadius: '10px', fontWeight: 800, fontSize: '18px', fontFamily: 'inherit', outline: 'none', boxShadow: `0 0 15px ${color}20` }} />
              <button onClick={handleEditSave} style={{ background: color, border: 'none', borderRadius: '8px', color: '#05070a', cursor: 'pointer', padding: '8px', display: 'flex' }}><Check size={16} /></button>
              <button onClick={() => setIsEditing(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', display: 'flex' }}><X size={16} /></button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 900, fontSize: '24px', color: 'var(--text-primary)' }}>{currency}{target.toLocaleString()}</span>
              <button onClick={() => { setIsEditing(true); setTempValue(target); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', display: 'flex', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                <Edit2 size={14} />
              </button>
            </div>
          )}
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '8px' }}>{currency}{current.toLocaleString()} saved</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        <div style={{ height: '14px', background: 'var(--bg-secondary)', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--glass-border)', padding: '2px' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${target === 0 ? 0 : percentage}%` }} transition={{ delay: delay + 0.3, duration: 1.2, ease: 'easeOut' }}
            style={{ height: '100%', background: isNegative ? (isInverse ? 'var(--warning)' : 'var(--danger)') : (isInverse && isExceeded ? 'var(--accent-cyan)' : color), boxShadow: `0 0 15px ${isNegative ? (isInverse ? 'var(--warning)' : 'var(--danger)') : color}60`, borderRadius: '5px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          <span style={{ color: isNegative ? (isInverse ? 'var(--warning)' : 'var(--danger)') : (isInverse && isExceeded ? 'var(--accent-cyan)' : 'inherit'), display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isNegative && !isInverse && <AlertCircle size={12} />} {target === 0 ? 'Not set' : `${percentage}% achieved`}
          </span>
          <span style={{ color: isNegative ? (isInverse ? 'var(--warning)' : 'var(--danger)') : (isInverse && isExceeded ? 'var(--accent-cyan)' : 'var(--text-secondary)') }}>
            {isInverse 
              ? (isExceeded ? `BONUS ${currency}${(current - target).toLocaleString()} SAVED! 🚀` : `${currency}${remaining.toLocaleString()} more to reach target`)
              : (isExceeded ? `${currency}${(current - target).toLocaleString()} OVER LIMIT!` : target === 0 ? `${currency}${current.toLocaleString()} tracked` : `${currency}${remaining.toLocaleString()} left`)
            }
          </span>
        </div>
      </div>

      {/* Footer: status + calibrate */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', marginTop: '4px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', 
          background: isInverse 
            ? (isExceeded ? 'rgba(0,242,255,0.12)' : (percentage >= 80 ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)')) 
            : (isExceeded ? 'rgba(255,77,77,0.12)' : 'rgba(34,197,94,0.12)'), 
          color: isInverse 
            ? (isExceeded ? 'var(--accent-cyan)' : (percentage >= 80 ? 'var(--success)' : 'var(--warning)'))
            : (isExceeded ? 'var(--danger)' : 'var(--success)'), 
          border: `1px solid ${isInverse 
            ? (isExceeded ? 'rgba(0,242,255,0.2)' : (percentage >= 80 ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'))
            : (isExceeded ? 'rgba(255,77,77,0.2)' : 'rgba(34,197,94,0.2)')}` 
        }}>
          <Zap size={13} fill="currentColor" />
          {isInverse 
            ? (isExceeded ? 'Elite Saver' : (percentage >= 80 ? 'Near Target' : 'Growing')) 
            : (isExceeded ? 'Over Budget' : 'On Track')
          }
        </div>
        <button onClick={() => onSaveBudget(title, suggested)}
          style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-cyan)', background: 'rgba(0,242,255,0.04)', border: '1px solid rgba(0,242,255,0.15)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.2px', padding: '8px 14px', borderRadius: '10px', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,242,255,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,242,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          AI Suggest: {currency}{suggested.toLocaleString()}
        </button>
      </div>
    </motion.div>
  );
});

// ─── Main BudgetAI Component ────────────────────────────────────────────────
const BudgetAI = ({ totals, budgets, setBudget, currency = '₹' }) => {
  const needs = budgets['Needs'] || { amount: 0, spent: 0 };
  const wants = budgets['Wants'] || { amount: 0, spent: 0 };
  const savings = budgets['Savings'] || { amount: 0, spent: 0 };

  const suggestedNeeds = Math.round(totals.income * 0.5);
  const suggestedWants = Math.round(totals.income * 0.3);
  const suggestedSavings = Math.round(totals.income * 0.2);

  const handleSaveBudget = useCallback((category, amount) => {
    setBudget(category, amount);
  }, [setBudget]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>Budget Planner</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>50/30/20 rule • Click the pencil icon to edit limits.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,242,255,0.05)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(0,242,255,0.15)' }}>
          <div style={{ padding: '10px', background: 'rgba(0,242,255,0.1)', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Disposable Income</span>
            <span style={{ fontWeight: 800, fontSize: '22px', color: (totals.income - totals.expenses) >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
              {(totals.income - totals.expenses) < 0 ? '-' : ''}{currency}{Math.abs(totals.income - totals.expenses).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="adaptive-grid" style={{ '--grid-cols': 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        <BudgetProgress title="Needs" current={needs.spent} target={needs.amount} suggested={suggestedNeeds} icon={AlertCircle} color="var(--accent-cyan)" delay={0} onSaveBudget={handleSaveBudget} currency={currency} />
        <BudgetProgress title="Wants" current={wants.spent} target={wants.amount} suggested={suggestedWants} icon={TrendingUp} color="var(--accent-violet)" delay={0.1} onSaveBudget={handleSaveBudget} currency={currency} />
        <BudgetProgress title="Savings" current={savings.spent} target={savings.amount} suggested={suggestedSavings} icon={Target} color="var(--accent-emerald)" delay={0.2} onSaveBudget={handleSaveBudget} currency={currency} isInverse={true} />
      </div>

      {/* Doughnut + Info */}
      <div className="glass-card responsive-stack" style={{ display: 'flex', flexDirection: window.innerWidth <= 768 ? 'column' : 'row', flexWrap: 'nowrap', gap: '40px', alignItems: 'center', padding: window.innerWidth <= 768 ? '24px' : '36px' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '14px', background: 'rgba(139,92,246,0.15)', borderRadius: '16px', color: 'var(--accent-violet)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 800 }}>Allocation Plan</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>Based on {currency}{totals.income.toLocaleString()} monthly income</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Essential Needs', value: suggestedNeeds, pct: 50, color: 'var(--accent-cyan)' },
              { label: 'Personal Wants', value: suggestedWants, pct: 30, color: 'var(--accent-violet)' },
              { label: 'Future Wealth', value: suggestedSavings, pct: 20, color: 'var(--accent-emerald)' },
            ].map(({ label, value, pct, color }) => (
              <div key={label} style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '14px' }}>{label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, color }}>{pct}%</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', marginLeft: '8px' }}>{currency}{value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: window.innerWidth <= 768 ? '0 0 200px' : '0 0 260px' }}>
          <div style={{ width: window.innerWidth <= 768 ? '200px' : '260px', height: window.innerWidth <= 768 ? '200px' : '260px' }}>
            <Doughnut
              data={{
                labels: ['Needs', 'Wants', 'Savings'],
                datasets: [{
                  data: [needs.spent || 0.01, wants.spent || 0.01, savings.spent || 0.01],
                  backgroundColor: ['#00f2ff', '#8b5cf6', '#00ffaa'],
                  borderColor: ['rgba(0,242,255,0.3)', 'rgba(139,92,246,0.3)', 'rgba(0,255,170,0.3)'],
                  borderWidth: 2,
                  hoverOffset: 12,
                }]
              }}
              options={{
                cutout: '72%',
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 }, padding: 20, usePointStyle: true, pointStyleWidth: 10 } },
                  tooltip: { backgroundColor: '#0d1117', titleFont: { family: 'Outfit', size: 13 }, bodyFont: { family: 'Outfit', size: 13 }, padding: 14, borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, callbacks: { label: (ctx) => ` ${currency}${ctx.raw.toLocaleString()}` } }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BudgetAI);
