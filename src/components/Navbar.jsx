import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const profileMenuRef = useRef(null);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/menu', label: 'Menu' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setShowProfileMenu((prev) => !prev);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    await signOut();
  };

  const userInitial =
    user?.user_metadata?.first_name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    '?';

  return (
    <>
      <nav className="bg-white bg-opacity-90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Driftwood Cafe Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Link>

            {/* Right side: nav links + profile icon + mobile hamburger */}
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium transition-colors duration-200 ${
                      isActive(link.path)
                        ? 'text-accent-blue border-b-2 border-accent-blue'
                        : 'text-subheading hover:text-accent-blue'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Profile Icon */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center justify-center rounded-full transition-all hover:ring-2 hover:ring-accent-blue/30 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                  aria-label={user ? 'Profile menu' : 'Sign in or create account'}
                >
                  {user ? (
                    <div className="w-9 h-9 rounded-full bg-accent-blue flex items-center justify-center text-white font-semibold text-sm select-none">
                      {userInitial}
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-paper border border-gray-200 flex items-center justify-center text-subheading hover:text-accent-blue hover:border-accent-blue/40 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Profile dropdown (signed in) */}
                {user && showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-3 px-4 min-w-[210px] z-50">
                    <p className="text-sm font-semibold text-heading truncate">
                      {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                    </p>
                    <p className="text-xs text-subheading truncate mb-3">{user.email}</p>
                    <hr className="border-gray-100 mb-3" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-paper transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6 text-heading"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-64 pb-4' : 'max-h-0'
            }`}
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-accent-blue bg-opacity-10 text-accent-blue'
                      : 'text-subheading hover:bg-paper'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

export default Navbar;
