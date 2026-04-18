import React, { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Repeat, Download, ArrowUpRight, ArrowDownRight, Edit2, Check } from 'lucide-react';

const COLORS = { income: 'var(--accent-emerald)', expense: 'var(--danger)' };

const LABEL = { fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' };

// ─── IMPORTANT: defined OUTSIDE the parent so React never re-creates this
//     component type on re-render, which would unmount the DOM and lose focus.
const FormRow = memo(({ data, setData, onSubmit, onCancel, isEdit, categories, currency = '₹' }) => {
  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '11px 14px',
    background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-primary)', borderRadius: '10px', fontFamily: 'inherit',
    fontSize: '14px', outline: 'none',
  };

  return (
    <div style={{
      background: isEdit ? 'rgba(0,255,170,0.03)' : 'rgba(0,242,255,0.03)',
      border: `1px solid ${isEdit ? 'rgba(0,255,170,0.2)' : 'rgba(0,242,255,0.2)'}`,
      borderRadius: '16px', padding: '24px', marginBottom: '8px'
    }}>
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px', marginBottom: '14px' }}>

          <div><label style={LABEL}>Type</label>
            <select value={data.type} style={inputStyle}
              onChange={e => setData(p => ({ ...p, type: e.target.value, category: e.target.value === 'income' ? (categories?.income?.[0] || 'Salary') : (categories?.expense?.[0] || 'Groceries') }))}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div><label style={LABEL}>Amount ({currency})</label>
            <input type="number" placeholder="0.00" value={data.amount} style={inputStyle}
              onChange={e => setData(p => ({ ...p, amount: e.target.value }))}
              required min="0" step="0.01" />
          </div>

          <div style={{ gridColumn: 'span 2' }}><label style={LABEL}>Description</label>
            <input type="text" placeholder="e.g. Chai & Samosa" value={data.description} style={inputStyle}
              onChange={e => setData(p => ({ ...p, description: e.target.value }))}
              required />
          </div>

          <div><label style={LABEL}>Category</label>
            <select value={data.category} style={inputStyle}
              onChange={e => setData(p => ({ ...p, category: e.target.value }))}>
              {(data.type === 'income' ? categories?.income : categories?.expense)?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div><label style={LABEL}>Date</label>
            <input type="date" value={data.date} style={inputStyle}
              onChange={e => setData(p => ({ ...p, date: e.target.value }))} />
          </div>

          <div><label style={LABEL}>Recurring</label>
            <select value={data.recurring} style={inputStyle}
              onChange={e => setData(p => ({ ...p, recurring: e.target.value }))}>
              <option value="none">One-time</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={LABEL}>Note (optional)</label>
          <input type="text" placeholder="Tag, merchant info, etc." value={data.note || ''} style={{ ...inputStyle, width: '100%' }}
            onChange={e => setData(p => ({ ...p, note: e.target.value }))} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" onClick={onCancel}
            style={{ padding: '11px 20px', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', borderRadius: '11px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            Cancel
          </button>
          <button type="submit"
            style={{ padding: '12px 28px', background: isEdit ? 'var(--accent-emerald)' : 'linear-gradient(135deg,#0ea5e9,#8b5cf6)', color: isEdit ? '#05070a' : 'white', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {isEdit ? '✓ Save Changes' : '+ Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
});

// ─── Main component ────────────────────────────────────────────────────────────
const TransactionManager = ({ transactions, addTransaction, deleteTransaction, editTransaction, categories, currency = '₹' }) => {
  const BLANK = useCallback(() => ({
    amount: '', category: categories?.expense?.[0] || 'Groceries',
    description: '', note: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense', recurring: 'none'
  }), [categories]);

  const [searchTerm,     setSearchTerm]     = useState('');
  const [filterType,     setFilterType]     = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAdding,       setIsAdding]       = useState(false);
  const [editingId,      setEditingId]      = useState(null);
  const [sortConfig,     setSortConfig]     = useState({ key: 'date', direction: 'desc' });
  const [formData,       setFormData]       = useState(BLANK);
  const [editData,       setEditData]       = useState(null);
  const [showSuccess,    setShowSuccess]    = useState(false);
  const isMobile = window.innerWidth <= 768;

  // ── Stable handlers (no inline arrows passed to FormRow) ──────────────────
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    addTransaction(formData);
    setIsAdding(false);
    setFormData(BLANK());
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  }, [formData, addTransaction, BLANK]);

  const handleCancelAdd = useCallback(() => setIsAdding(false), []);

  const handleEdit = useCallback((t) => {
    setEditingId(t.id);
    setEditData({ ...t });
  }, []);

  const handleEditSubmit = useCallback((e) => {
    e.preventDefault();
    setEditData(ed => {
      if (ed && ed.amount && ed.description) editTransaction(ed);
      return null;
    });
    setEditingId(null);
  }, [editTransaction]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditData(null);
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  }, []);

  const exportCSV = useCallback(() => {
    if (!transactions.length) return;
    const rows = [['Date','Description','Category','Type','Amount','Recurring','Note']];
    transactions.forEach(t => rows.push([t.date, `"${t.description}"`, t.category, t.type, t.amount, t.recurring, `"${t.note || ''}"`]));
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Transactions_${new Date().toLocaleDateString('en-CA')}.csv`;
    link.click();
  }, [transactions]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const allCategories = [...(categories?.income || []), ...(categories?.expense || [])];

  const filtered = transactions
    .filter(t => {
      const s = searchTerm.toLowerCase();
      return (t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s))
        && (filterType === 'all' || t.type === filterType)
        && (filterCategory === 'all' || t.category === filterCategory);
    })
    .sort((a, b) => {
      const av = sortConfig.key === 'amount' ? Number(a.amount) : a[sortConfig.key];
      const bv = sortConfig.key === 'amount' ? Number(b.amount) : b[sortConfig.key];
      return av < bv ? (sortConfig.direction === 'asc' ? -1 : 1)
           : av > bv ? (sortConfig.direction === 'asc' ? 1 : -1) : 0;
    });

  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1px' }}>Transactions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>{transactions.length} records · All financial activity</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => { setIsAdding(v => !v); setFormData(BLANK()); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', background: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)', color: 'white', borderRadius: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 18px rgba(14,165,233,0.28)' }}>
            <Plus size={17} /> New Entry
          </button>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,255,170,0.1)', border: '1px solid rgba(0,255,170,0.3)', borderRadius: '12px', padding: '14px 20px', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Check size={17} /> Transaction added successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Form — plain conditional, NO AnimatePresence (prevents remount/focus loss) */}
      {isAdding && (
        <FormRow
          data={formData}
          setData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancelAdd}
          isEdit={false}
          categories={categories}
          currency={currency}
        />
      )}

      {/* Summary Bar */}
      <div className="adaptive-grid" style={{ '--grid-cols': 'repeat(3, 1fr)', gap: '14px' }}>
        {[
          { label: 'Total Income',   value: totalIncome,                  color: 'var(--accent-emerald)' },
          { label: 'Total Expenses', value: totalExpense,                  color: 'var(--danger)' },
          { label: 'Net Flow',       value: totalIncome - totalExpense,    color: totalIncome >= totalExpense ? 'var(--accent-cyan)' : 'var(--warning)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: isMobile ? '14px' : '18px', textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</p>
            <p style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 800, color }}>{value >= 0 ? '+' : ''}{currency}{Math.abs(value).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>

        {/* Filters */}
        <div style={{ padding: '18px 22px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '180px', background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '11px', border: '1px solid var(--glass-border)' }}>
            <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 500, width: '100%', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto' }}>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              style={{ flex: 1, padding: '10px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '11px', fontWeight: 600, cursor: 'pointer' }}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              style={{ flex: 1, padding: '10px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '11px', fontWeight: 600, cursor: 'pointer' }}>
              <option value="all">All Categories</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginLeft: isMobile ? '0' : 'auto' }}>{filtered.length} results</span>
        </div>

        {/* Table Header (Hidden on Mobile) */}
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.9fr 1.1fr 100px', padding: '11px 22px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
            {[['description','Transaction'], ['category','Category'], ['date','Date'], ['amount','Amount']].map(([key, label]) => (
              <button key={key} onClick={() => handleSort(key)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', textAlign: key === 'amount' ? 'right' : 'left', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: key === 'amount' ? 'flex-end' : 'flex-start', padding: 0 }}>
                {label}
                <span style={{ color: sortConfig.key === key ? 'var(--accent-cyan)' : 'transparent', fontSize: '9px' }}>
                  {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
                </span>
              </button>
            ))}
            <div />
          </div>
        )}

        {/* Rows */}
        <div>
          {filtered.map((t, i) => (
            <div key={t.id}>
              {editingId === t.id ? (
                <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,255,170,0.02)' }}>
                  <FormRow
                    data={editData}
                    setData={setEditData}
                    onSubmit={handleEditSubmit}
                    onCancel={handleCancelEdit}
                    isEdit={true}
                    categories={categories}
                    currency={currency}
                  />
                </div>
              ) : (
                <div 
                  style={{ 
                    display: isMobile ? 'flex' : 'grid', 
                    flexDirection: isMobile ? 'column' : 'row',
                    gridTemplateColumns: isMobile ? 'none' : '2fr 0.8fr 0.9fr 1.1fr 100px', 
                    padding: isMobile ? '16px' : '15px 22px', 
                    borderBottom: '1px solid var(--glass-border)', 
                    alignItems: isMobile ? 'stretch' : 'center', 
                    transition: 'background 0.15s',
                    gap: isMobile ? '12px' : '0'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Icon + Desc Section */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: t.type === 'income' ? 'rgba(0,255,170,0.1)' : 'rgba(255,77,77,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS[t.type], flexShrink: 0 }}>
                      {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{t.description}</p>
                      <div style={{ display: 'flex', gap: '7px', marginTop: '3px', alignItems: 'center' }}>
                        <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>{t.category}</span>
                        {t.recurring !== 'none' && <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', textTransform: 'uppercase' }}><Repeat size={9} /> {t.recurring}</span>}
                      </div>
                    </div>
                    {isMobile && (
                      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <p style={{ fontWeight: 800, fontSize: '16px', color: COLORS[t.type] }}>{t.type === 'income' ? '+' : '-'}{currency}{Number(t.amount).toLocaleString()}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(t.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    )}
                  </div>

                  {!isMobile && (
                    <>
                      <div><span style={{ padding: '4px 11px', background: 'var(--bg-tertiary)', borderRadius: '20px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>{t.category}</span></div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{new Date(t.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '15px', color: COLORS[t.type], paddingRight: '12px' }}>{t.type === 'income' ? '+' : '-'}{currency}{Number(t.amount).toLocaleString()}</div>
                    </>
                  )}

                  <div style={{ display: 'flex', gap: '8px', justifyContent: isMobile ? 'flex-start' : 'flex-end', paddingTop: isMobile ? '8px' : '0', borderTop: isMobile ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                    <button onClick={() => handleEdit(t)}
                      style={{ flex: isMobile ? 1 : 'none', padding: '8px 12px', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px', color: 'var(--info)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                      <Edit2 size={13} /> {isMobile && 'Edit'}
                    </button>
                    <button onClick={() => deleteTransaction(t.id)}
                      style={{ flex: isMobile ? 1 : 'none', padding: '8px 12px', background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '8px', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                      <Trash2 size={13} /> {isMobile && 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Search size={38} style={{ margin: '0 auto 14px', opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>{transactions.length === 0 ? 'No transactions yet. Click "New Entry" to add one.' : 'No transactions match your filters.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TransactionManager);
