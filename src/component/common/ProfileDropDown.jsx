import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/operation/auth';

function ProfileDropDown({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleLinkClick = () => {
    // Close dropdown when navigating
    onClose?.();
  };

  async function logoutHandler() {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    try {
      await dispatch(logout({ token, navigate }));
      onClose?.(); // Close dropdown after successful logout
    } catch (error) {
      console.error("Logout error:", error);
      // You might want to show a toast notification here
      // toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div
      className="w-52 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-200"
      role="menu"
      aria-label="Profile menu"
    >
      {/* User Info Section (optional) */}
      {user && (
        <>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.firstName || user.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.email || 'user@example.com'}
            </p>
          </div>
        </>
      )}

      <div className="py-1">
        <Link
          to="/dashboard"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium focus:outline-none focus:bg-blue-50 focus:text-blue-700"
          onClick={handleLinkClick}
          role="menuitem"
        >
          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
          </svg>
          Dashboard
        </Link>
        
        <Link
          to="/dashboard/my-profile"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium focus:outline-none focus:bg-blue-50 focus:text-blue-700"
          onClick={handleLinkClick}
          role="menuitem"
        >
          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          My Profile
        </Link>

        <Link
          to="/dashboard/settings"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium focus:outline-none focus:bg-blue-50 focus:text-blue-700"
          onClick={handleLinkClick}
          role="menuitem"
        >
          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Link>
      </div>
      
      <div className="border-t border-gray-100 my-1"></div>
      
      <div className="py-1">
        <button
          className={`w-full flex items-center text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium focus:outline-none focus:bg-red-50 focus:text-red-700 ${
            isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={logoutHandler}
          disabled={isLoggingOut}
          role="menuitem"
        >
          {isLoggingOut ? (
            <>
              <svg className="w-4 h-4 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Logging out...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProfileDropDown;