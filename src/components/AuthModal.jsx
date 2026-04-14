import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('signin');
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setError('');
    setSuccessMsg('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn({ email: form.email, password: form.password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onClose();
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signUp({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg(
        'Account created! Check your email to confirm your account, then sign in.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-subheading hover:text-heading transition-colors p-1 rounded-lg hover:bg-paper"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Driftwood Cafe"
            className="h-10 w-auto mx-auto mb-3"
            onError={(e) => (e.target.style.display = 'none')}
          />
          <h2 className="text-2xl font-serif text-heading">Welcome</h2>
          <p className="text-sm text-subheading mt-1">Driftwood Cafe</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-paper p-1 mb-6">
          <button
            onClick={() => switchTab('signin')}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${
              tab === 'signin'
                ? 'bg-white text-heading shadow-sm'
                : 'text-subheading hover:text-heading'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab('signup')}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${
              tab === 'signup'
                ? 'bg-white text-heading shadow-sm'
                : 'text-subheading hover:text-heading'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Success state */}
        {successMsg ? (
          <div className="text-center py-4">
            <svg
              className="w-12 h-12 text-green-500 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-heading font-medium mb-4">{successMsg}</p>
            <button
              onClick={() => switchTab('signin')}
              className="btn-primary text-sm px-4 py-2"
            >
              Go to Sign In
            </button>
          </div>
        ) : tab === 'signin' ? (
          /* Sign In Form */
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-subheading mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/40 text-heading placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-subheading mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/40 text-heading placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <p className="text-center text-sm text-subheading">
              No account?{' '}
              <button
                type="button"
                onClick={() => switchTab('signup')}
                className="text-accent-blue hover:underline font-medium"
              >
                Create one
              </button>
            </p>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-subheading mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/40 text-heading placeholder-gray-400"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-subheading mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/40 text-heading placeholder-gray-400"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-subheading mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/40 text-heading placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-subheading mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/40 text-heading placeholder-gray-400"
                placeholder="••••••••"
              />
              <p className="text-xs text-subheading mt-1">Minimum 6 characters</p>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-subheading">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('signin')}
                className="text-accent-blue hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
