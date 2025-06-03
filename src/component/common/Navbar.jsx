import React, { useState, useRef, useEffect } from 'react';
import NavLink from '../data/NavLink';
import { Link } from 'react-router-dom';
import logo from '../../assest/logo.png';
import { BiMessageRoundedDetail } from "react-icons/bi";
import { MdOutlineNotifications } from "react-icons/md";
import { useSelector } from 'react-redux';
import ProfileDropDown from './ProfileDropDown';

function Navbar() {
    const { token } = useSelector((state) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const profileButtonRef = useRef(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                !profileButtonRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // Close dropdown when pressing Escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showDropdown]);

    const handleProfileClick = () => {
        setShowDropdown((prev) => !prev);
    };
    
    return (
        <div className='w-full bg-white border-b border-gray-200 sticky top-0 z-40'>
            <nav className="w-[90vw] max-w-7xl py-4 mx-auto flex justify-between items-center">
                {/* Logo and Search Section */}
                <div className='flex items-center justify-center gap-4'>
                    <Link to="/" className="flex-shrink-0">
                        <img 
                            src={logo} 
                            alt='Company Logo' 
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                    <div className="hidden md:block">
                        <input 
                            type="text" 
                            placeholder="Search Opportunities.." 
                            className='border border-gray-400 py-2 px-4 rounded-full min-w-[250px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                            aria-label="Search opportunities"
                        />
                    </div>
                </div>

                {/* Navigation Links and Actions */}
                <div className='flex gap-4 items-center'>
                    {/* Desktop Navigation Links */}
                    <ul className='hidden lg:flex gap-2 items-center'>
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

                    <div className='hidden lg:block w-[1px] h-[30px] bg-gray-300' />

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
                                    <div ref={dropdownRef} className='absolute right-0 mt-2 z-50'>
                                        {/* Dropdown Arrow */}
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

                    <div className='hidden lg:block w-[1px] h-[30px] bg-gray-300' />

                    {/* Host Button */}
                    <Link 
                        to="/jobs" 
                        className='text-sm border-2 border-gray-400 py-2 px-4 rounded-full hover:bg-gray-100 hover:border-gray-500 font-semibold transition-all duration-200'
                    >
                        + Host
                    </Link>

                    {/* Mobile Menu Button (you can add this later) */}
                    {/* <button className='lg:hidden p-2'>
                        <MenuIcon />
                    </button> */}
                </div>
            </nav>

            {/* Mobile Search (show on smaller screens) */}
            <div className="md:hidden px-4 pb-4">
                <input 
                    type="text" 
                    placeholder="Search Opportunities.." 
                    className='w-full border border-gray-400 py-2 px-4 rounded-full focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200' 
                    aria-label="Search opportunities"
                />
            </div>
        </div>
    );
}

export default Navbar;