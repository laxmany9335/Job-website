import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/operation/auth';

function ProfileDropDown({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
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
      await dispatch(logout(token, navigate));
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
      className="w-48 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-200"
      role="menu"
      aria-label="Profile menu"
    >
      <Link
        to="/dashboard"
        className="block px-5 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium focus:outline-none focus:bg-blue-50"
        onClick={handleLinkClick}
        role="menuitem"
      >
        Dashboard
      </Link>
      
      <Link
        to="/dashboard/my-profile"
        className="block px-5 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium focus:outline-none focus:bg-blue-50"
        onClick={handleLinkClick}
        role="menuitem"
      >
        My Profile
      </Link>
      
      <div className="border-t border-gray-100 my-1"></div>
      
      <button
        className={`w-full text-left px-5 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium focus:outline-none focus:bg-red-50 ${
          isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={logoutHandler}
        disabled={isLoggingOut}
        role="menuitem"
      >
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default ProfileDropDown;