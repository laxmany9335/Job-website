import { useState, useRef, useEffect } from 'react';
const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

const FeaturedOpportunities = () => {
  const date = getCurrentDate();
  const data = [
    {
      id: 1,
      imageUrl: "",
      companyName: "TCS",
      jobPosition: "Full-stack",
      postDate: date,
      currentApplication: "400+",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequu ates ipsa pariatur'
    },
    {
      id: 2,
      imageUrl: "/api/placeholder/400/80",
      companyName: "Microsoft",
      jobPosition: "Frontend",
      postDate: date,
      currentApplication: "320+",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequu ates ipsa pariatur'
    },
    {
      id: 3,
      imageUrl: "/api/placeholder/400/80",
      companyName: "Google",
      jobPosition: "Backend",
      postDate: date,
      currentApplication: "580+",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequu ates ipsa pariatur'
    },
    {
      id: 4,
      imageUrl: "/api/placeholder/400/80",
      companyName: "Amazon",
      jobPosition: "DevOps",
      postDate: date,
      currentApplication: "290+",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequu ates ipsa pariatur'
    },
    {
      id: 5,
      imageUrl: "/api/placeholder/400/80",
      companyName: "Meta",
      jobPosition: "UI/UX",
      postDate: date,
      currentApplication: "350+",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequu ates ipsa pariatur'
    }
  ];

  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // Calculate maxScroll on component mount and window resize
  useEffect(() => {
    if (containerRef.current) {
      const calculateMaxScroll = () => {
        const container = containerRef.current;
        setMaxScroll(container.scrollWidth - container.clientWidth);
      };
      
      calculateMaxScroll();
      window.addEventListener('resize', calculateMaxScroll);
      
      return () => window.removeEventListener('resize', calculateMaxScroll);
    }
  }, []);

  // Update scroll position state when scrolling
  useEffect(() => {
    if (containerRef.current) {
      const handleScroll = () => {
        setScrollPosition(containerRef.current.scrollLeft);
      };
      
      containerRef.current.addEventListener('scroll', handleScroll);
      
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, []);

  const scrollLeft = () => {
    if (containerRef.current) {
      const newPosition = Math.max(scrollPosition - 400, 0);
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const newPosition = Math.min(scrollPosition + 400, maxScroll);
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-yellow-50 p-8">
      <div className="flex justify-between items-center px-4 py-6">
        <div className="flex flex-col max-w-lg">
          <h1 className="text-gray-700 text-2xl font-bold">Featured Opportunities</h1>
          <p className="text-gray-500 text-sm mt-1">
            Check out the curated opportunities handpicked for you from top organizations.
          </p>
        </div>

        <div className="flex bg-gray-200 items-center justify-center w-32 h-12 gap-x-4 rounded-md">
          <button
            onClick={scrollLeft}
            className={`p-1 rounded-full transition-all ${scrollPosition <= 0 ? 'text-gray-400' : 'text-blue-600 hover:bg-gray-300'}`}
            disabled={scrollPosition <= 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </button>
          
          <button 
            onClick={scrollRight}
            className={`p-1 rounded-full transition-all ${scrollPosition >= maxScroll ? 'text-gray-400' : 'text-blue-600 hover:bg-gray-300'}`}
            disabled={scrollPosition >= maxScroll}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div 
        className="flex flex-row gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-4 py-2"
        ref={containerRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {data.map((item) => (
          <div
            className="max-w-[400px] flex-shrink-0 border border-gray-300 p-5 rounded-lg bg-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            key={item.id}
          >
            <div className="flex flex-col h-full">
              <img src="signup1.jpg" alt={`${item.companyName} logo`} className="h-30 object-cover rounded mb-3" />
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <p className="text-gray-900 font-bold text-xl">{item.companyName}</p>
                <h1 className="font-bold text-lg text-blue-700">{item.jobPosition}</h1>
              </div>
              
              <div className="flex flex-col gap-y-2 py-3 flex-grow">
                <p className="text-blue-500 font-semibold">{item.currentApplication} applications</p>
                <p className="text-gray-700">Application Date: {item.postDate}</p>
                <p className="mt-1">
                  <span className="text-gray-800 font-semibold">About job: </span>
                  <span className="text-gray-600">{item.description}</span>
                </p>
              </div>
              
              <button className="w-full bg-gray-200 text-gray-800 font-bold rounded-md py-2 mt-3 hover:bg-yellow-500 hover:text-gray-900 transition-colors duration-300">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FeaturedOpportunities;