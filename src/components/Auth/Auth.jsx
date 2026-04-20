import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Mail, Lock, User, ArrowRight, LogIn } from 'lucide-react';

const Auth = ({ initialMode = 'login', onBack }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Initialize user document in Firestore with the name
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          userName: name,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle at top right, rgba(0, 242, 255, 0.05), transparent), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.05), transparent)',
      padding: '20px',
      position: 'relative',
      fontFamily: 'var(--font-main)',
      backgroundColor: '#05070a'
    }}>
      {/* Background Blobs */}
      <div style={{ position: 'fixed', top: '20%', right: '10%', width: '300px', height: '300px', background: 'var(--accent-cyan)', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--accent-violet)', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none' }} />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          fontWeight: 600,
          background: 'rgba(255,255,255,0.03)',
          padding: '10px 18px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
      >
        <ArrowRight size={16} style={{ rotate: '180deg' }} />
        Back to Home
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '40px', 
          borderRadius: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', 
            borderRadius: '18px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 20px',
            boxShadow: '0 8px 20px rgba(0, 242, 255, 0.3)'
          }}>
            <LogIn size={32} color="white" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back' : 'Join Ledzo'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {isLogin ? 'Manage your wealth with Ledzo' : 'Start your journey to financial freedom'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ 
                  width: '100%', padding: '14px 16px 14px 48px', 
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '14px', color: 'white', outline: 'none', transition: 'all 0.2s',
                  fontSize: '14px'
                }} 
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', padding: '14px 16px 14px 48px', 
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '14px', color: 'white', outline: 'none', transition: 'all 0.2s',
                fontSize: '14px'
              }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', padding: '14px 16px 14px 48px', 
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '14px', color: 'white', outline: 'none', transition: 'all 0.2s',
                fontSize: '14px'
              }} 
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', background: 'rgba(255,77,77,0.1)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,77,77,0.2)' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', 
              color: 'white', border: 'none', borderRadius: '16px', fontWeight: 700, 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s', boxShadow: '0 10px 20px -5px rgba(0, 242, 255, 0.3)'
            }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ margin: '32px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <button 
          onClick={handleGoogleSignIn}
          style={{ 
            width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', 
            color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s'
          }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google" />
          Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: 700, cursor: 'pointer', marginLeft: '6px' }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
