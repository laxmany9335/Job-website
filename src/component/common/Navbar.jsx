import React, { useState, useRef, useEffect } from 'react';
import NavLink from '../data/NavLink';
import { Link } from 'react-router-dom';
import logo from '../../assest/logo.png';
import { BiMessageRoundedDetail } from "react-icons/bi";
import { MdOutlineNotifications, MdMenu, MdClose } from "react-icons/md";
import { useSelector } from 'react-redux';
import ProfileDropDown from './ProfileDropDown';

function Navbar() {
    const { token } = useSelector((state) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const dropdownRef = useRef(null);
    const profileButtonRef = useRef(null);
    const mobileMenuRef = useRef(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                !profileButtonRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            
            if (mobileMenuRef.current && 
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('.mobile-menu-trigger')) {
                setShowMobileMenu(false);
            }
        }

        if (showDropdown || showMobileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown, showMobileMenu]);

    // Close dropdown when pressing Escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setShowDropdown(false);
                setShowMobileMenu(false);
                setShowMobileSearch(false);
            }
        };

        if (showDropdown || showMobileMenu || showMobileSearch) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showDropdown, showMobileMenu, showMobileSearch]);

    const handleProfileClick = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleMobileMenuToggle = () => {
        setShowMobileMenu((prev) => !prev);
        setShowDropdown(false); // Close profile dropdown when opening mobile menu
    };

    const closeMobileMenu = () => {
        setShowMobileMenu(false);
    };
    
    return (
        <div className='w-full bg-white border-b border-gray-200 sticky top-0 z-40'>
            <nav className="w-[95vw] sm:w-[90vw] max-w-7xl py-3 sm:py-4 mx-auto">
                {/* Main Navigation Bar */}
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div className='flex items-center gap-2 sm:gap-4'>
                        <Link to="/" className="flex-shrink-0">
                            <img 
                                src={logo} 
                                alt='Company Logo' 
                                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                            />
                        </Link>
                        
                        {/* Desktop Search */}
                        <div className="hidden lg:block">
                            <input 
                                type="text" 
                                placeholder="Search Opportunities.." 
                                className='border border-gray-400 py-2 px-4 rounded-full min-w-[250px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                                aria-label="Search opportunities"
                            />
                        </div>
                    </div>

                    {/* Desktop Navigation Links and Actions */}
                    <div className='hidden lg:flex gap-4 items-center'>
                        {/* Navigation Links */}
                        <ul className='flex gap-2 items-center'>
                            {NavLink.map((item, id) => (
                                <li key={id}>
                                    <Link 
                                        to={item.path} 
                                        className='hover:bg-gray-100 hover:text-gray-800 px-3 py-2 rounded-lg transition-all duration-200 font-medium'
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className='w-[1px] h-[30px] bg-gray-300' />

                        {/* User Actions */}
                        {token ? (
                            <div className='flex items-center gap-2'>
                                {/* Messages */}
                                <button 
                                    className='p-2 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-200'
                                    aria-label="Messages"
                                >
                                    <BiMessageRoundedDetail size={24} />
                                </button>
                                
                                {/* Notifications */}
                                <button 
                                    className='p-2 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-200'
                                    aria-label="Notifications"
                                >
                                    <MdOutlineNotifications size={24} />
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button 
                                        ref={profileButtonRef}
                                        onClick={handleProfileClick}
                                        className='w-10 h-10 border-2 border-gray-300 rounded-full hover:border-blue-400 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-200'
                                        aria-label="Profile menu"
                                        aria-expanded={showDropdown}
                                        aria-haspopup="true"
                                    >
                                        <img 
                                            src={logo} 
                                            alt="Profile" 
                                            className='object-cover w-full h-full'
                                        />
                                    </button>
                                    
                                      {showDropdown && (
                                        <div className='absolute right-0 mt-2 z-50'>
                                            <div className='absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45'></div>
                                            <ProfileDropDown onClose={() => setShowDropdown(!showDropdown)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className='bg-blue-600 text-white text-sm py-2 px-5 rounded-full hover:bg-blue-700 transition-all duration-200 font-medium'
                            >
                                Login
                            </Link>
                        )}

                        <div className='w-[1px] h-[30px] bg-gray-300' />

                        {/* Host Button */}
                        <Link 
                            to="/jobs" 
                            className='text-sm border-2 border-gray-400 py-2 px-4 rounded-full hover:bg-gray-100 hover:border-gray-500 font-semibold transition-all duration-200'
                        >
                            + Host
                        </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className='lg:hidden flex items-center gap-2'>
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setShowMobileSearch(!showMobileSearch)}
                            className='p-2 hover:bg-gray-100 rounded-full transition-all duration-200'
                            aria-label="Toggle search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Mobile Messages & Notifications (only if logged in) */}
                        {token && (
                            <>
                                <button 
                                    className='p-2 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-200'
                                    aria-label="Messages"
                                >
                                    <BiMessageRoundedDetail size={20} />
                                </button>
                                
                                <button 
                                    className='p-2 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-200'
                                    aria-label="Notifications"
                                >
                                    <MdOutlineNotifications size={20} />
                                </button>

                                {/* Mobile Profile */}
                                <div className="relative">
                                    <button 
                                        ref={profileButtonRef}
                                        onClick={handleProfileClick}
                                        className='w-8 h-8 border-2 border-gray-300 rounded-full hover:border-blue-400 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-200'
                                        aria-label="Profile menu"
                                        aria-expanded={showDropdown}
                                        aria-haspopup="true"
                                    >
                                        <img 
                                            src={logo} 
                                            alt="Profile" 
                                            className='object-cover w-full h-full'
                                        />
                                    </button>
                                    
                                    {showDropdown && (
                                        <div ref={dropdownRef} className='absolute right-0 mt-2 z-50'>
                                            <div className='absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45'></div>
                                            <ProfileDropDown onClose={() => setShowDropdown(!showDropdown)} />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={handleMobileMenuToggle}
                            className='mobile-menu-trigger p-2 hover:bg-gray-100 rounded-full transition-all duration-200 ml-1'
                            aria-label="Toggle menu"
                            aria-expanded={showMobileMenu}
                        >
                            {showMobileMenu ? <MdClose size={24} /> : <MdMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {showMobileSearch && (
                    <div className="lg:hidden mt-3 px-1">
                        <input 
                            type="text" 
                            placeholder="Search Opportunities.." 
                            className='w-full border border-gray-400 py-2.5 px-4 rounded-full focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                            aria-label="Search opportunities"
                            autoFocus
                        />
                    </div>
                )}
            </nav>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div className="lg:hidden fixed inset-0 backdrop-blur-xs bg-opacity-50 z-50" onClick={closeMobileMenu}>
                    <div 
                        ref={mobileMenuRef}
                        className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                            <button 
                                onClick={closeMobileMenu}
                                className='p-2 hover:bg-gray-100 rounded-full transition-all duration-200'
                                aria-label="Close menu"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Mobile Menu Content */}
                        <div className="p-4">
                            {/* Navigation Links */}
                            <ul className='space-y-2 mb-6'>
                                {NavLink.map((item, id) => (
                                    <li key={id}>
                                        <Link 
                                            to={item.path} 
                                            onClick={closeMobileMenu}
                                            className='block hover:bg-gray-100 hover:text-gray-800 px-4 py-3 rounded-lg transition-all duration-200 font-medium'
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className='border-t border-gray-200 pt-4'>
                                {/* Host Button */}
                                <Link 
                                    to="/jobs" 
                                    onClick={closeMobileMenu}
                                    className='block w-full text-center border-2 border-gray-400 py-3 px-4 rounded-full hover:bg-gray-100 hover:border-gray-500 font-semibold transition-all duration-200 mb-4'
                                >
                                    + Host
                                </Link>

                                {/* Login Button (only if not logged in) */}
                                {!token && (
                                    <Link 
                                        to="/login" 
                                        onClick={closeMobileMenu}
                                        className='block w-full text-center bg-blue-600 text-white py-3 px-5 rounded-full hover:bg-blue-700 transition-all duration-200 font-medium'
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;