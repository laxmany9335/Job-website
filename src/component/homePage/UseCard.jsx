import React, { useState } from 'react'
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { GrAchievement } from "react-icons/gr";

import card from "../data/CardData"

function UseCard() {
  const [showMore, setShowMore] = useState(false);
  
  return (
    <div className='flex flex-col gap-y-4 w-full'>
      <div className='text-lg sm:text-xl text-gray-700 font-bold px-2 sm:px-0'>
        Who's using Future Jobs?
      </div>

      {/* Cards Container */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 w-full px-2 sm:px-0'>
        {
          card.map((items, index) => (
            <div 
              key={index}
              className='flex flex-col items-center justify-center border border-gray-200 p-3 sm:p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
            >
              {/* Card Header */}
              <div className='flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-2'>
                <div className='flex flex-col flex-1 text-center sm:text-left'>
                  <h1 className='text-sm sm:text-md text-gray-600 font-bold leading-tight'>
                    {items.title}
                  </h1>
                  <p className='text-xs text-gray-400 mt-1 line-clamp-2'>
                    {items.Description}
                  </p>
                </div>
                <div className='flex-shrink-0'>
                  <img 
                    src={items.image} 
                    alt="cardImage" 
                    className='object-cover w-16 h-12 sm:w-20 sm:h-16 lg:w-[100px] lg:h-[80px] rounded' 
                  />
                </div>
              </div>

              {/* Expandable Content */}
              {showMore && (
                <div className='w-full text-gray-400 text-xs sm:text-sm mt-4 space-y-2'>
                  <p className='flex gap-2 sm:gap-3 items-center justify-start'>
                    <span className='flex-shrink-0'><GrAchievement /></span>
                    <span className='text-left'>Access tailored jobs and internships</span>
                  </p>
                  <p className='flex gap-2 sm:gap-3 items-center justify-start'>
                    <span className='flex-shrink-0'><GrAchievement /></span>
                    <span className='text-left'>Showcase your profile to top recruiters</span>
                  </p>
                  <p className='flex gap-2 sm:gap-3 items-center justify-start'>
                    <span className='flex-shrink-0'><GrAchievement /></span>
                    <span className='text-left'>Participate in exciting competitions</span>
                  </p>
                  <p className='flex gap-2 sm:gap-3 items-center justify-start'>
                    <span className='flex-shrink-0'><GrAchievement /></span>
                    <span className='text-left'>Upskill with mentorships & workshops</span>
                  </p>
                </div>
              )}
            </div>
          ))
        }
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setShowMore(!showMore)} 
        className='flex justify-center items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 py-2 px-4 rounded-md hover:bg-blue-50 mx-auto text-sm sm:text-base'
      >
        {!showMore ? (
          <>
            <span>Show More</span>
            <MdKeyboardDoubleArrowDown fontSize={"20px"} className="sm:text-2xl" />
          </>
        ) : (
          <>
            <span>Show Less</span>
            <MdKeyboardDoubleArrowUp fontSize={"20px"} className="sm:text-2xl" />
          </>
        )}
      </button>
    </div>
  )
}

export default UseCard