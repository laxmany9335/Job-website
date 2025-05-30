import React, { useRef, useEffect, useState } from 'react';

const InfiniteScroll = () => {
  // Example logos - replace with your actual content
  const logos = [
    { id: 1, name: "TCS" },
    { id: 2, name: "Amazon" },
    { id: 3, name: "Microsoft" },
    { id: 4, name: "Google" },
    { id: 5, name: "Accenture" },
    { id: 6, name: "Samsung " },
    { id: 7, name: "Deloite" },
    { id: 8, name: "HCL-Tech" },
    { id: 9, name: "Zoho" },
    { id: 10, name: "Phone pay" },
    { id: 11, name: "Paytem" },
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