import { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = () => {
    if (email) {
      alert('Thank you for subscribing to our newsletter!');
      setEmail('');
    }
  };
  
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Career Search</h3>
            <p className="text-gray-300 mb-4">
              Helping you take your career to the next level. Find thousands of jobs on our platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Jobs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Companies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Main Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span>info@careersearch.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Stay updated with the latest job postings and career tips
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2 rounded text-gray-800 focus:outline-none"
              />
              <button 
                onClick={handleSubscribe}
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-4 rounded transition duration-300"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-blue-800 mt-12 pt-6 text-center md:text-left md:flex md:justify-between">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Career Search. All rights reserved.
          </p>
          <div className="mt-2 md:mt-0">
            <a href="#" className="text-sm text-gray-300 hover:text-white mr-4">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}