import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react';

const CARD = { background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' };
const LABEL = { fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '5px' };
const INPUT = { width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', borderRadius: '9px', fontFamily: 'inherit', fontSize: '14px', outline: 'none' };

// ─── Defined OUTSIDE to prevent re-mount and focus loss on every keystroke ───
const InputRow = memo(({ form, setForm, onSubmit, onCancel, isLiability, currency = '₹' }) => (
  <form onSubmit={onSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px', alignItems: 'flex-end' }}>
    <div style={{ flex: '1 1 140px' }}>
      <label style={LABEL}>Name</label>
      <input type="text" placeholder={isLiability ? 'e.g. Car Loan' : 'e.g. Fixed Deposit'}
        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        required style={INPUT} />
    </div>
    <div style={{ flex: '1 1 110px' }}>
      <label style={LABEL}>Value ({currency})</label>
      <input type="number" placeholder="50000"
        value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
        required min="0" style={INPUT} />
    </div>
    <div style={{ flex: '1 1 110px' }}>
      <label style={LABEL}>Type</label>
      <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ ...INPUT, cursor: 'pointer' }}>
        {isLiability
          ? ['short-term', 'long-term', 'other'].map(t => <option key={t} value={t}>{t}</option>)
          : ['liquid', 'investments', 'property', 'other'].map(t => <option key={t} value={t}>{t}</option>)
        }
      </select>
    </div>
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button type="submit"
        style={{ padding: '9px 18px', background: isLiability ? 'rgba(255,77,77,0.15)' : 'rgba(0,255,170,0.15)', border: `1px solid ${isLiability ? 'rgba(255,77,77,0.3)' : 'rgba(0,255,170,0.3)'}`, color: isLiability ? 'var(--danger)' : 'var(--accent-emerald)', borderRadius: '9px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
        Add
      </button>
      <button type="button" onClick={onCancel}
        style={{ padding: '9px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
        <X size={15} />
      </button>
    </div>
  </form>
));

// ─── Main component ────────────────────────────────────────────────────────────
const NetWorth = ({ assets, liabilities, addAsset, deleteAsset, addLiability, deleteLiability, getNetWorth, currency = '₹' }) => {
  const [showAddAsset,     setShowAddAsset]     = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);
  const [assetForm,        setAssetForm]        = useState({ name: '', value: '', type: 'liquid' });
  const [liabilityForm,    setLiabilityForm]    = useState({ name: '', value: '', type: 'short-term' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nw = getNetWorth();

  const handleAddAsset = useCallback((e) => {
    e.preventDefault();
    if (!assetForm.name || !assetForm.value) return;
    addAsset(assetForm);
    setAssetForm({ name: '', value: '', type: 'liquid' });
    setShowAddAsset(false);
  }, [assetForm, addAsset]);

  const handleAddLiability = useCallback((e) => {
    e.preventDefault();
    if (!liabilityForm.name || !liabilityForm.value) return;
    addLiability(liabilityForm);
    setLiabilityForm({ name: '', value: '', type: 'short-term' });
    setShowAddLiability(false);
  }, [liabilityForm, addLiability]);

  const cancelAsset     = useCallback(() => setShowAddAsset(false), []);
  const cancelLiability = useCallback(() => setShowAddLiability(false), []);

  const ASSET_TYPE_COLORS     = { liquid: '#00f2ff', investments: '#00ffaa', property: '#f59e0b', other: '#8b5cf6' };
  const LIABILITY_TYPE_COLORS = { 'short-term': '#d946ef', 'long-term': '#ff4d4d', other: '#f59e0b' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: isMobile ? '28px' : '34px', fontWeight: 800, letterSpacing: '-1px' }}>Net Worth Tracker</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>Track your total wealth: assets minus liabilities.</p>
      </div>

      {/* Summary Row */}
      <div className="adaptive-grid" style={{ '--grid-cols': 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Assets',       value: nw.totalAssets,       color: 'var(--accent-emerald)', icon: TrendingUp },
          { label: 'Total Liabilities',  value: nw.totalLiabilities,  color: 'var(--danger)',         icon: TrendingDown },
          { label: 'Net Worth',          value: nw.netWorth,           color: nw.netWorth >= 0 ? 'var(--accent-violet)' : 'var(--danger)', icon: DollarSign },
        ].map(({ label, value, color, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ ...CARD, textAlign: 'center', padding: isMobile ? '16px' : '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{ padding: '12px', background: `${color}15`, borderRadius: '14px', color }}><Icon size={isMobile ? 20 : 24} /></div>
            </div>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{label}</p>
            <p style={{ fontWeight: 900, fontSize: isMobile ? '20px' : '28px', color }}>{value < 0 ? '-' : ''}{currency}{Math.abs(value).toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* Assets + Liabilities columns */}
      <div className="adaptive-grid" style={{ '--grid-cols': '1fr 1fr', gap: '24px' }}>

        {/* ASSETS */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '18px' }}>Assets</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Everything you own of value</p>
            </div>
            <button onClick={() => setShowAddAsset(v => !v)}
              style={{ padding: '8px 16px', background: 'rgba(0,255,170,0.1)', border: '1px solid rgba(0,255,170,0.25)', color: 'var(--accent-emerald)', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Add Asset
            </button>
          </div>

          {/* Form — plain conditional, no AnimatePresence to avoid remounts */}
          {showAddAsset && (
            <InputRow
              form={assetForm}
              setForm={setAssetForm}
              onSubmit={handleAddAsset}
              onCancel={cancelAsset}
              isLiability={false}
              currency={currency}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(assets || []).map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 14px', background: 'rgba(0,255,170,0.03)', borderRadius: '11px', border: '1px solid rgba(0,255,170,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ASSET_TYPE_COLORS[a.type] || '#00ffaa', boxShadow: `0 0 6px ${ASSET_TYPE_COLORS[a.type] || '#00ffaa'}`, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{a.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{a.type}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <p style={{ fontWeight: 800, fontSize: '15px', color: 'var(--accent-emerald)' }}>{currency}{Number(a.value).toLocaleString()}</p>
                  <button onClick={() => deleteAsset(a.id)}
                    style={{ padding: '5px', background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.15)', borderRadius: '7px', color: 'var(--danger)', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {!(assets || []).length && <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No assets yet. Add your first asset above.</p>}
          </div>
        </div>

        {/* LIABILITIES */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '18px' }}>Liabilities</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Debts and obligations you owe</p>
            </div>
            <button onClick={() => setShowAddLiability(v => !v)}
              style={{ padding: '8px 16px', background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.25)', color: 'var(--danger)', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Add Debt
            </button>
          </div>

          {/* Form — plain conditional */}
          {showAddLiability && (
            <InputRow
              form={liabilityForm}
              setForm={setLiabilityForm}
              onSubmit={handleAddLiability}
              onCancel={cancelLiability}
              isLiability={true}
              currency={currency}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(liabilities || []).map(l => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 14px', background: 'rgba(255,77,77,0.03)', borderRadius: '11px', border: '1px solid rgba(255,77,77,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: LIABILITY_TYPE_COLORS[l.type] || '#ff4d4d', boxShadow: `0 0 6px ${LIABILITY_TYPE_COLORS[l.type] || '#ff4d4d'}`, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{l.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{l.type}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <p style={{ fontWeight: 800, fontSize: '15px', color: 'var(--danger)' }}>{currency}{Number(l.value).toLocaleString()}</p>
                  <button onClick={() => deleteLiability(l.id)}
                    style={{ padding: '5px', background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.15)', borderRadius: '7px', color: 'var(--danger)', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {!(liabilities || []).length && <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No liabilities. Keep it that way! 🎉</p>}
          </div>
        </div>
      </div>

      {/* Debt-to-Asset Ratio */}
      {nw.totalAssets > 0 && (
        <div style={{ ...CARD, background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}>
          <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '8px' }}>Debt-to-Asset Ratio</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>Lower is healthier. Below 50% is generally considered safe.</p>
          <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', marginBottom: '8px' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.round((nw.totalLiabilities / nw.totalAssets) * 100))}%` }} transition={{ duration: 1.2 }}
              style={{ height: '100%', background: nw.totalLiabilities / nw.totalAssets > 0.5 ? 'var(--danger)' : 'var(--accent-violet)', borderRadius: '5px' }} />
          </div>
          <p style={{ fontWeight: 800, fontSize: '20px', color: nw.totalLiabilities / nw.totalAssets > 0.5 ? 'var(--danger)' : 'var(--accent-violet)' }}>
            {Math.round((nw.totalLiabilities / nw.totalAssets) * 100)}% {nw.totalLiabilities / nw.totalAssets > 0.5 ? '⚠️ High — work on paying down debt' : '✅ Healthy ratio'}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(NetWorth);
