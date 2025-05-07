import React, { useRef, useEffect, useState } from 'react';

const InfiniteScroll = () => {
  // Example logos - replace with your actual content
  const logos = [
    { id: 1, name: "Company 1" },
    { id: 2, name: "Company 2" },
    { id: 3, name: "Company 3" },
    { id: 4, name: "Company 4" },
    { id: 5, name: "Company 5" },
    { id: 6, name: "Company 6" },
    { id: 7, name: "Company 7" },
    { id: 8, name: "Company 8" },
  ];

  const [duplicatedLogos, setDuplicatedLogos] = useState([]);
  const contentRef = useRef(null);
  
  // Duplicate items to ensure seamless looping
  useEffect(() => {
    // Create enough duplicates to fill the scroll space
    setDuplicatedLogos([...logos, ...logos, ...logos]);
  }, []);
  
  return (
    <div className="flex items-center w-full h-32 bg-gray-100 overflow-hidden mb-20">
      <div className="text-gray-700 px-8 font-semibold w-48">
        <p>Industry veterans</p>
        <p>Trust us</p>
      </div>
      
      <div className="relative flex-1 overflow-hidden">
        <div 
          ref={contentRef}
          className="flex gap-x-12 animate-scroll whitespace-nowrap"
        >
          {duplicatedLogos.map((logo, index) => (
            <div 
              key={`${logo.id}-${index}`} 
              className="flex items-center justify-center min-w-32 h-16 bg-white rounded-lg shadow px-4"
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-scroll {
          animation: scroll 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default InfiniteScroll;