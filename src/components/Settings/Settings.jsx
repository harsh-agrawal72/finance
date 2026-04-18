import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, DollarSign, Bell, Download, Upload, RefreshCw, Trash2, Check, Plus, X, Palette } from 'lucide-react';

const CARD  = { background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' };
const INPUT = { padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '10px', outline: 'none', fontFamily: 'inherit', fontSize: '14px', boxSizing: 'border-box', width: '100%' };
const LABEL = { fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' };
const BTN   = (color='var(--accent-cyan)') => ({ padding: '10px 18px', background: `${color}15`, border: `1px solid ${color}30`, color, borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s' });

const Settings = ({ data, updateSettings, categories, addCategory, exportJSON, importJSON, resetData, importFromLocal }) => {
  const [profile, setProfile]     = useState({ userName: data.userName || '', currency: data.currency || '₹' });
  const [saved, setSaved]         = useState(false);
  const [newCategory, setNewCat]  = useState({ type: 'expense', name: '' });
  const [catAdded, setCatAdded]   = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [syncing, setSyncing]     = useState(false);

  const handleSaveProfile = () => {
    updateSettings({ userName: profile.userName, currency: profile.currency });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleCloudSync = async () => {
    if (!window.confirm('This will import all your old local transactions and settings to your online account. Continue?')) return;
    setSyncing(true);
    try {
      await importFromLocal();
      alert('Cloud sync complete! Your data is now safe in the cloud.');
    } catch (e) {
      alert('Sync failed. Make sure you have an active internet connection.');
    } finally {
      setSyncing(false);
    }
  };


  // Sync local state if data prop changes (e.g. from import or reset)
  React.useEffect(() => {
    setProfile({ userName: data.userName || 'Harsh', currency: data.currency || '₹' });
  }, [data.userName, data.currency]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    const normalised = newCategory.name.trim();
    if (categories[newCategory.type]?.includes(normalised)) return;
    addCategory(newCategory.type, normalised);
    setNewCat(p => ({ ...p, name: '' }));
    setCatAdded(true);
    setTimeout(() => setCatAdded(false), 2000);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const result = importJSON(importText);
    setImportStatus(result?.success ? 'success' : 'error');
    setTimeout(() => setImportStatus(''), 3000);
  };

  const CURRENCY_OPTIONS = ['₹', '$', '€', '£', '¥', '₩', 'AED'];

  const Section = ({ title, icon: Icon, color = 'var(--accent-cyan)', children }) => (
    <div style={{ ...CARD }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '8px', background: `${color}15`, borderRadius: '10px', color }}><Icon size={18} /></div>
        <h3 style={{ fontWeight: 800, fontSize: '17px' }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>Customize your Ledzo experience.</p>
      </div>

      {/* ── Profile ─────────────────────────────────────────────────────── */}
      <Section title="Profile & Preferences" icon={User} color="var(--accent-cyan)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={LABEL}>Your Name</label>
            <input value={profile.userName} onChange={e => setProfile(p => ({ ...p, userName: e.target.value }))} placeholder="e.g. Harsh" style={INPUT} />
          </div>
          <div>
            <label style={LABEL}>Currency Symbol</label>
            <select value={profile.currency} onChange={e => setProfile(p => ({ ...p, currency: e.target.value }))}
              style={{ ...INPUT, cursor: 'pointer' }}>
              {CURRENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSaveProfile}
          style={{ ...BTN('var(--accent-emerald)'), background: saved ? 'rgba(0,255,170,0.15)' : 'rgba(0,255,170,0.08)', border: `1px solid ${saved ? 'rgba(0,255,170,0.5)' : 'rgba(0,255,170,0.2)'}` }}>
          <Check size={15} /> {saved ? 'Saved!' : 'Save Profile'}
        </button>
      </Section>

      {/* ── Category Manager ─────────────────────────────────────────────── */}
      <Section title="Category Manager" icon={Palette} color="var(--accent-violet)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {['income', 'expense'].map(type => (
            <div key={type}>
              <h4 style={{ fontWeight: 700, fontSize: '13px', color: type === 'income' ? 'var(--accent-emerald)' : 'var(--danger)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                {type === 'income' ? '💰 Income' : '💸 Expense'} Categories
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {(categories?.[type] || []).map(cat => (
                  <span key={cat} style={{ padding: '5px 12px', background: type === 'income' ? 'rgba(0,255,170,0.08)' : 'rgba(255,77,77,0.08)', border: `1px solid ${type === 'income' ? 'rgba(0,255,170,0.2)' : 'rgba(255,77,77,0.2)'}`, borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: type === 'income' ? 'var(--accent-emerald)' : 'var(--danger)' }}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 100px' }}>
            <label style={LABEL}>Category Type</label>
            <select value={newCategory.type} onChange={e => setNewCat(p => ({ ...p, type: e.target.value }))} style={{ ...INPUT }}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div style={{ flex: '2 1 160px' }}>
            <label style={LABEL}>Category Name</label>
            <input value={newCategory.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Crypto, Rent..." style={INPUT} />
          </div>
          <button type="submit" style={{ ...BTN('var(--accent-violet)'), alignSelf: 'flex-end', whiteSpace: 'nowrap' }}>
            <Plus size={14} /> {catAdded ? 'Added!' : 'Add Category'}
          </button>
        </form>
      </Section>

      {/* ── Data Management ──────────────────────────────────────────────── */}
      <Section title="Data Management" icon={Download} color="var(--accent-emerald)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Cloud Migration */}
          <div style={{ padding: '20px', background: 'rgba(139,92,246,0.06)', borderRadius: '14px', border: '1px solid rgba(139,92,246,0.25)' }}>
            <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-violet)', marginBottom: '8px' }}>☁️ Cloud Migration</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.6' }}>Found old data in this browser? Move it to your permanent cloud account now.</p>
            <button onClick={handleCloudSync} disabled={syncing} style={BTN('var(--accent-violet)')}>
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Syncing...' : 'Sync Local to Cloud'}
            </button>
          </div>

          {/* Export */}
          <div style={{ padding: '20px', background: 'rgba(0,255,170,0.04)', borderRadius: '14px', border: '1px solid rgba(0,255,170,0.15)' }}>
            <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-emerald)', marginBottom: '8px' }}>📤 Export Backup</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.6' }}>Download all your financial data as a JSON file. Use this to backup or transfer your data.</p>
            <button onClick={exportJSON} style={BTN('var(--accent-emerald)')}>
              <Download size={14} /> Download Backup
            </button>
          </div>

          {/* Import */}
          <div style={{ padding: '20px', background: 'rgba(0,242,255,0.04)', borderRadius: '14px', border: '1px solid rgba(0,242,255,0.15)' }}>
            <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>📥 Import Data</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: '1.6' }}>Paste your JSON backup below to restore data.</p>
            <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder='Paste JSON backup here...' rows={3}
              style={{ ...INPUT, resize: 'vertical', marginBottom: '10px', fontSize: '12px' }} />
            <button onClick={handleImport} style={BTN('var(--accent-cyan)')}>
              <Upload size={14} /> Import Data
            </button>
            {importStatus === 'success' && <p style={{ fontSize: '12px', color: 'var(--accent-emerald)', marginTop: '8px', fontWeight: 700 }}>✅ Data imported successfully!</p>}
            {importStatus === 'error' && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '8px', fontWeight: 700 }}>❌ Invalid JSON. Please check the file.</p>}
          </div>

          {/* Stats */}
          <div style={{ padding: '20px', background: 'rgba(139,92,246,0.04)', borderRadius: '14px', border: '1px solid rgba(139,92,246,0.15)' }}>
            <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-violet)', marginBottom: '8px' }}>📊 Data Summary</h4>
            {[
              { label: 'Transactions', value: data.transactions?.length || 0 },
              { label: 'Savings Goals', value: data.goals?.length || 0 },
              { label: 'Assets', value: data.assets?.length || 0 },
              { label: 'Liabilities', value: data.liabilities?.length || 0 },
              { label: 'Custom Categories', value: ((data.categories?.income?.length || 0) + (data.categories?.expense?.length || 0)) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Danger Zone ──────────────────────────────────────────────────── */}
      <div style={{ ...CARD, background: 'rgba(255,77,77,0.04)', border: '1px solid rgba(255,77,77,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '8px', background: 'rgba(255,77,77,0.12)', borderRadius: '10px', color: 'var(--danger)' }}><Trash2 size={18} /></div>
          <h3 style={{ fontWeight: 800, fontSize: '17px', color: 'var(--danger)' }}>Danger Zone</h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.7' }}>
          Resetting will permanently delete all your transactions, goals, assets, and settings, reverting everything to the default sample data. <strong style={{ color: 'var(--danger)' }}>This action cannot be undone.</strong>
        </p>
        <button onClick={() => { if (window.confirm('⚠️ Are you absolutely sure? All your data will be permanently deleted.')) resetData(); }}
          style={{ padding: '11px 22px', background: 'rgba(255,77,77,0.12)', border: '1px solid rgba(255,77,77,0.3)', color: 'var(--danger)', borderRadius: '11px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,77,77,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,77,77,0.12)'}>
          <Trash2 size={15} /> Reset All Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
