import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';

const Login = () => {
  const { login, signup, sendResetOtp, verifyResetOtp } = useAppContext();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [forgotStep, setForgotStep] = useState(1); // 1 (enter email), 2 (enter otp + password)
  const [otpCode, setOtpCode] = useState('');
  const [simulatedInfo, setSimulatedInfo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/setup');
      } else if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name');
          return;
        }
        await signup(name.trim(), email, password);
        navigate('/setup');
      } else if (mode === 'forgot') {
        if (forgotStep === 1) {
          const res = await sendResetOtp(email);
          if (res.simulated) {
            setSimulatedInfo(`Simulated OTP Code: ${res.code}`);
            setSuccess('OTP verification code generated (Simulation).');
          } else {
            setSimulatedInfo('');
            setSuccess('Verification OTP code sent to your email.');
          }
          setForgotStep(2);
        } else {
          if (!otpCode.trim() || otpCode.trim().length !== 6) {
            setError('Please enter a valid 6-digit OTP code');
            return;
          }
          if (!password || password.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
          }
          await verifyResetOtp(email, otpCode.trim(), password);
          setSuccess('Password updated successfully! Please sign in with your new password.');
          setMode('login');
          setPassword('');
          setOtpCode('');
          setForgotStep(1);
          setSimulatedInfo('');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5fa] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="card w-full max-w-md p-8 relative z-10 mx-4">
        {mode === 'forgot' && (
          <button 
            onClick={() => { 
              setMode('login'); 
              setError(''); 
              setSuccess(''); 
              setForgotStep(1);
              setSimulatedInfo('');
            }} 
            className="text-catalyst-muted hover:text-catalyst-dark flex items-center gap-1 text-sm font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>
        )}
        
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size={56} className="mb-3 drop-shadow-md animate-bounce" />
          <h1 className="text-4xl font-black text-catalyst-dark mb-2 tracking-tight">Catalyst<span className="text-catalyst-primary">.</span></h1>
          <p className="text-catalyst-muted text-xs font-bold uppercase tracking-wider">
            {mode === 'forgot' ? 'Reset your password.' : 'Track every step towards success'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-bold text-red-600 text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-bold text-emerald-700 text-center break-words">
            {success}
          </div>
        )}

        {simulatedInfo && (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-150 rounded-xl text-center">
            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Demo Verification Code</p>
            <p className="text-xl font-black text-indigo-900 tracking-wider font-mono">{simulatedInfo.replace('Simulated OTP Code: ', '')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-bold text-catalyst-dark mb-1.5">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-catalyst-border focus:border-catalyst-primary focus:outline-none transition-colors bg-catalyst-bg font-medium"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-catalyst-dark mb-1.5">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={mode === 'forgot' && forgotStep === 2}
              className="w-full px-4 py-3 rounded-xl border-2 border-catalyst-border focus:border-catalyst-primary focus:outline-none transition-colors bg-catalyst-bg font-medium disabled:opacity-60"
              required
            />
          </div>
          
          {mode === 'forgot' && forgotStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-catalyst-dark mb-1.5">6-Digit OTP Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="123456" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-catalyst-border focus:border-catalyst-primary focus:outline-none transition-colors bg-catalyst-bg font-bold tracking-widest text-center text-lg focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-catalyst-dark mb-1.5">New Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-catalyst-border focus:border-catalyst-primary focus:outline-none transition-colors bg-catalyst-bg font-medium focus:border-indigo-500"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}
          
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-catalyst-dark">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => { 
                      setMode('forgot'); 
                      setError(''); 
                      setSuccess(''); 
                      setPassword(''); 
                      setOtpCode('');
                      setForgotStep(1);
                      setSimulatedInfo('');
                    }}
                    className="text-xs font-bold text-catalyst-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-catalyst-border focus:border-catalyst-primary focus:outline-none transition-colors bg-catalyst-bg font-medium"
                required
                minLength={6}
              />
            </div>
          )}
          
          <button type="submit" className="w-full btn-primary py-3.5 text-base mt-2">
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : forgotStep === 1 ? 'Send Reset OTP' : 'Reset Password'}
          </button>
        </form>
        
        {mode !== 'forgot' && (
          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-catalyst-muted">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                  setSuccess('');
                }} 
                className="text-catalyst-primary font-bold hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
