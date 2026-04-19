import React, { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, X, Calendar, ArrowUpCircle, ArrowDownCircle, Edit2, Check, AlertCircle, TrendingUp, Milestone } from 'lucide-react';
import { differenceInDays } from 'date-fns';

const ICONS = ['🎯', '🏠', '💻', '✈️', '🚗', '💍', '📚', '💰', '🛡️', '🎓', '🏋️', '🎸', '🎮', '📱', '🌴', '🍕', '⚡', '🌟'];
const COLORS = ['#00f2ff', '#8b5cf6', '#00ffaa', '#f59e0b', '#d946ef', '#f43f5e', '#0ea5e9', '#22c55e'];

const INPUT_STYLE = { padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '10px', outline: 'none', fontFamily: 'inherit', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
const LABEL_STYLE = { fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' };
const CARD = { background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' };

const SavingsGamified = ({ goals, addGoal, deleteGoal, depositToGoal, withdrawFromGoal, editGoal, currency = '₹' }) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [activeInput, setActiveInput] = useState(null);  // { id, mode: 'deposit'|'withdraw' }
  const [inputAmount, setInputAmount] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);  // goal object being edited
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '', deadline: '', icon: '🎯', color: '#00f2ff' });
  const [txHistory, setTxHistory] = useState([]);    // local log of adds/withdrawals

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;
    addGoal(newGoal);
    setNewGoal({ name: '', target: '', current: '', deadline: '', icon: '🎯', color: '#00f2ff' });
    setShowAddGoal(false);
  };

  const handleAction = (goalId, mode) => {
    const amt = Number(inputAmount);
    if (!amt || amt <= 0) return;
    if (mode === 'deposit') {
      depositToGoal(goalId, amt);
      setTxHistory(h => [{ goalId, mode, amount: amt, date: new Date().toISOString() }, ...h.slice(0, 19)]);
    } else {
      withdrawFromGoal ? withdrawFromGoal(goalId, amt)
        : depositToGoal(goalId, -amt);  // fallback if prop not wired
      setTxHistory(h => [{ goalId, mode, amount: amt, date: new Date().toISOString() }, ...h.slice(0, 19)]);
    }
    setInputAmount('');
    setActiveInput(null);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editingGoal) return;
    editGoal ? editGoal(editingGoal) : null;
    setEditingGoal(null);
  };

  // ── Summary ──────────────────────────────────────────────────────────────
  const totalSaved = goals.reduce((s, g) => s + Number(g.current), 0);
  const totalTarget = goals.reduce((s, g) => s + Number(g.target), 0);
  const completed = goals.filter(g => Number(g.current) >= Number(g.target)).length;
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1px' }}>Savings Goals</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>Track, deposit, and manage every financial milestone.</p>
        </div>
        <button onClick={() => setShowAddGoal(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', background: 'linear-gradient(135deg, rgba(0,255,170,0.12), rgba(0,242,255,0.08))', color: 'var(--accent-emerald)', borderRadius: '13px', fontWeight: 700, border: '1px solid rgba(0,255,170,0.25)', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,170,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,255,170,0.12), rgba(0,242,255,0.08))'}>
          <Plus size={17} /> New Goal
        </button>
      </div>

      {/* ── Add Goal Form (MOVED ABOVE KPIs) ─────────────────────────────── */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ ...CARD, border: '1px solid rgba(0,255,170,0.2)', background: 'rgba(0,255,170,0.03)', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <h3 style={{ fontWeight: 800, fontSize: '18px', color: 'var(--accent-emerald)' }}>✨ Create New Goal</h3>
                <button onClick={() => setShowAddGoal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleAddGoal}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                  {[
                    { label: 'Goal Name', type: 'text', placeholder: 'Dream Vacation', key: 'name', required: true },
                    { label: `Target Amount (${currency})`, type: 'number', placeholder: '50000', key: 'target', min: 1, required: true },
                    { label: `Already Saved (${currency})`, type: 'number', placeholder: '0', key: 'current', min: 0 },
                    { label: 'Target Date', type: 'date', key: 'deadline' },
                  ].map(({ label, type, placeholder, key, required, min }) => (
                    <div key={key}>
                      <label style={LABEL_STYLE}>{label}</label>
                      <input type={type} placeholder={placeholder} value={newGoal[key]} onChange={e => setNewGoal(p => ({ ...p, [key]: e.target.value }))} required={required} min={min} style={INPUT_STYLE} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={LABEL_STYLE}>Choose Icon</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {ICONS.map(icon => (
                      <button type="button" key={icon} onClick={() => setNewGoal(p => ({ ...p, icon }))} style={{ padding: '7px 10px', fontSize: '18px', borderRadius: '9px', border: `2px solid ${newGoal.icon === icon ? '#00ffaa' : 'rgba(255,255,255,0.08)'}`, background: newGoal.icon === icon ? 'rgba(0,255,170,0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.15s' }}>{icon}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '22px' }}>
                  <label style={LABEL_STYLE}>Accent Color</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {COLORS.map(color => (
                      <button type="button" key={color} onClick={() => setNewGoal(p => ({ ...p, color }))} style={{ width: '30px', height: '30px', borderRadius: '50%', background: color, border: `3px solid ${newGoal.color === color ? 'white' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.15s', boxShadow: newGoal.color === color ? `0 0 10px ${color}80` : 'none' }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" onClick={() => setShowAddGoal(false)} style={{ padding: '11px 20px', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', borderRadius: '11px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Cancel</button>
                  <button type="submit" style={{ padding: '11px 28px', background: 'var(--accent-emerald)', color: '#05070a', borderRadius: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Create Goal 🎯</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Summary KPIs ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Saved', value: `${currency}${totalSaved.toLocaleString()}`, color: '#00f2ff', icon: '💰' },
          { label: 'Total Target', value: `${currency}${totalTarget.toLocaleString()}`, color: '#8b5cf6', icon: '🎯' },
          { label: 'Goals Completed', value: `${completed} / ${goals.length}`, color: '#00ffaa', icon: '🏆' },
          { label: 'Overall Progress', value: `${overallPct}%`, color: '#f59e0b', icon: '📈' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{ ...CARD, padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '26px' }}>{icon}</span>
            <div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
              <p style={{ fontSize: '20px', fontWeight: 900, color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Edit Goal Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {editingGoal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
            onClick={e => { if (e.target === e.currentTarget) setEditingGoal(null); }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ ...CARD, width: '100%', maxWidth: '500px', border: `1px solid ${editingGoal.color}30` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <h3 style={{ fontWeight: 800, fontSize: '18px', color: editingGoal.color }}>✏️ Edit Goal</h3>
                <button onClick={() => setEditingGoal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleEditSave}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                  {[
                    { label: 'Goal Name', type: 'text', key: 'name', required: true },
                    { label: `Target Amount (${currency})`, type: 'number', key: 'target', min: 1, required: true },
                    { label: `Current Saved (${currency})`, type: 'number', key: 'current', min: 0 },
                    { label: 'Target Date', type: 'date', key: 'deadline' },
                  ].map(({ label, type, key, required, min }) => (
                    <div key={key}>
                      <label style={LABEL_STYLE}>{label}</label>
                      <input type={type} value={editingGoal[key] || ''} onChange={e => setEditingGoal(p => ({ ...p, [key]: e.target.value }))} required={required} min={min} style={INPUT_STYLE} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={LABEL_STYLE}>Icon</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {ICONS.map(icon => <button type="button" key={icon} onClick={() => setEditingGoal(p => ({ ...p, icon }))} style={{ padding: '6px 10px', fontSize: '17px', borderRadius: '8px', border: `2px solid ${editingGoal.icon === icon ? editingGoal.color : 'rgba(255,255,255,0.08)'}`, background: editingGoal.icon === icon ? `${editingGoal.color}15` : 'transparent', cursor: 'pointer' }}>{icon}</button>)}
                  </div>
                </div>
                <div style={{ marginBottom: '22px' }}>
                  <label style={LABEL_STYLE}>Color</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {COLORS.map(color => <button type="button" key={color} onClick={() => setEditingGoal(p => ({ ...p, color }))} style={{ width: '28px', height: '28px', borderRadius: '50%', background: color, border: `3px solid ${editingGoal.color === color ? 'white' : 'transparent'}`, cursor: 'pointer', boxShadow: editingGoal.color === color ? `0 0 8px ${color}80` : 'none' }} />)}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" onClick={() => setEditingGoal(null)} style={{ padding: '11px 18px', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', borderRadius: '11px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Cancel</button>
                  <button type="submit" style={{ padding: '11px 24px', background: editingGoal.color, color: '#05070a', borderRadius: '11px', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}><Check size={14} style={{ display: 'inline', marginRight: '6px' }} />Save Changes</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Goals Grid ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px' }}>
        {goals.map((goal, i) => {
          const pct = Math.min(100, Math.round((Number(goal.current) / Number(goal.target)) * 100));
          const isCompleted = pct >= 100;
          const remaining = Math.max(0, Number(goal.target) - Number(goal.current));
          const daysLeft = goal.deadline ? differenceInDays(new Date(goal.deadline), new Date()) : null;
          const dailyNeeded = daysLeft && daysLeft > 0 ? Math.ceil(remaining / daysLeft) : null;
          const isActive = activeInput?.id === goal.id;

          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ ...CARD, border: `1px solid ${goal.color}22`, padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative', overflow: 'hidden' }}>

              {/* Glow */}
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '130px', height: '130px', background: `radial-gradient(circle, ${goal.color}18, transparent 70%)`, pointerEvents: 'none' }} />

              {/* Title Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '34px', lineHeight: 1 }}>{goal.icon || '🎯'}</div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '17px', color: 'var(--text-primary)' }}>{goal.name}</h3>
                    {goal.deadline && (
                      <p style={{ fontSize: '11px', color: daysLeft !== null && daysLeft < 0 ? 'var(--danger)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 600 }}>
                        <Calendar size={10} />
                        {daysLeft !== null && daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : 'Overdue!'}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                  {isCompleted && <span style={{ fontSize: '18px' }}>🏆</span>}
                  <button onClick={() => setEditingGoal({ ...goal })} style={{ padding: '5px 7px', background: 'rgba(0,242,255,0.08)', border: '1px solid rgba(0,242,255,0.18)', borderRadius: '8px', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex' }}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => { if (window.confirm('Are you sure you want to delete this goal? All progress will be lost.')) deleteGoal(goal.id); }} style={{ padding: '5px 7px', background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.18)', borderRadius: '8px', color: 'var(--danger)', cursor: 'pointer', display: 'flex' }}>
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Progress Ring + Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <svg width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="44" cy="44" r="36" fill="none" stroke={isCompleted ? '#00ffaa' : goal.color} strokeWidth="8"
                      strokeDasharray={226} strokeDashoffset={226 - (226 * pct) / 100} strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 5px ${goal.color}80)` }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 900, fontSize: '16px', color: isCompleted ? '#00ffaa' : goal.color }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ fontWeight: 900, fontSize: '22px', color: 'var(--text-primary)' }}>{Number(goal.current) < 0 ? '-' : ''}{currency}{Math.abs(Number(goal.current)).toLocaleString()}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}> / {currency}{Number(goal.target).toLocaleString()}</span>
                  </div>
                  {!isCompleted && <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '3px' }}>{currency}{remaining.toLocaleString()} to go</p>}
                  {dailyNeeded && !isCompleted && <p style={{ fontSize: '11px', color: goal.color, fontWeight: 700 }}>💡 Save {currency}{dailyNeeded.toLocaleString()}/day for deadline</p>}
                  {isCompleted && <p style={{ fontSize: '13px', color: '#00ffaa', fontWeight: 800 }}>🎉 Goal Achieved!</p>}
                  {daysLeft !== null && daysLeft < 0 && !isCompleted && (
                    <p style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={11} /> Deadline passed!
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '7px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.07 + 0.3, duration: 1.2, ease: 'easeOut' }}
                  style={{ height: '100%', background: isCompleted ? '#00ffaa' : `linear-gradient(90deg, ${goal.color}cc, ${goal.color})`, boxShadow: `0 0 10px ${goal.color}60`, borderRadius: '4px' }} />
              </div>

              {/* ── Deposit / Withdraw Panel ────────────────────────────── */}
              {isActive ? (
                <div>
                  {/* Amount Row */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 700 }}>{currency}</span>
                      <input type="number" placeholder="Enter amount" value={inputAmount} min="0"
                        onChange={e => setInputAmount(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAction(goal.id, activeInput.mode); }}
                        style={{ ...INPUT_STYLE, paddingLeft: '28px' }} autoFocus />
                    </div>
                    <button onClick={() => handleAction(goal.id, activeInput.mode)}
                      style={{ padding: '10px 18px', background: activeInput.mode === 'deposit' ? goal.color : 'rgba(255,77,77,0.2)', color: activeInput.mode === 'deposit' ? '#05070a' : 'var(--danger)', borderRadius: '10px', fontWeight: 800, border: `1px solid ${activeInput.mode === 'deposit' ? 'transparent' : 'rgba(255,77,77,0.3)'}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
                      {activeInput.mode === 'deposit' ? '+ Add' : '- Remove'}
                    </button>
                    <button onClick={() => { setActiveInput(null); setInputAmount(''); }}
                      style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <X size={14} />
                    </button>
                  </div>
                  {/* Quick amounts */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[500, 1000, 2000, 5000].map(amt => (
                      <button key={amt} onClick={() => setInputAmount(String(amt))}
                        style={{ padding: '5px 12px', background: inputAmount === String(amt) ? `${goal.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${inputAmount === String(amt) ? goal.color + '40' : 'rgba(255,255,255,0.07)'}`, borderRadius: '20px', color: inputAmount === String(amt) ? goal.color : 'var(--text-muted)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                        {currency}{amt >= 1000 ? `${amt / 1000}k` : amt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* Deposit */}
                  <button onClick={() => { setActiveInput({ id: goal.id, mode: 'deposit' }); setInputAmount(''); }}
                    style={{ flex: 1, padding: '11px', background: `${goal.color}10`, color: goal.color, border: `1px solid ${goal.color}25`, borderRadius: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s', fontSize: '13px', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = `${goal.color}20`}
                    onMouseLeave={e => e.currentTarget.style.background = `${goal.color}10`}>
                    <ArrowUpCircle size={15} /> Deposit
                  </button>
                  {/* Withdraw */}
                  {Number(goal.current) > 0 && !isCompleted && (
                    <button onClick={() => { setActiveInput({ id: goal.id, mode: 'withdraw' }); setInputAmount(''); }}
                      style={{ flex: 1, padding: '11px', background: 'rgba(255,77,77,0.07)', color: 'var(--danger)', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s', fontSize: '13px', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,77,0.14)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,77,0.07)'}>
                      <ArrowDownCircle size={15} /> Withdraw
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Empty State */}
        {goals.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
            <p style={{ fontWeight: 700, fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '8px' }}>No goals yet</p>
            <p>Click "New Goal" to start building your financial future.</p>
          </div>
        )}
      </div>

      {/* ── Transaction History Log ─────────────────────────────────────── */}
      {txHistory.length > 0 && (
        <div style={{ ...CARD, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <TrendingUp size={16} /> Recent Goal Transactions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {txHistory.map((tx, i) => {
              const goal = goals.find(g => g.id === tx.goalId);
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{goal?.icon || '🎯'}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '13px' }}>{goal?.name || 'Goal'}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(tx.date).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: tx.mode === 'deposit' ? 'var(--accent-emerald)' : 'var(--danger)' }}>
                    {tx.mode === 'deposit' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SavingsGamified);
