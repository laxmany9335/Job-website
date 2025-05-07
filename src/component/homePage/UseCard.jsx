
import React, { useState } from 'react'
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { GrAchievement } from "react-icons/gr";


import card from "../data/CardData"
function UseCard() {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='text-xl text-gray-700 font-bold'>Who's using Future Jobs?</div>

      <div className='flex flex-row gap-x-5 w-full'>
        {
          card.map((items) => (
            (
              <div className='items-center justify-center border-1 border-gray-200 p-4 rounded-md'>
                <div className='flex flex-row ' >
                  <div className='flex flex-col'>
                    <h1 className='text-md text-gray-600 font-bold'>{items.title}</h1>
                    <p className='text-xs text-gray-400 '>{items.Description}</p>
                  </div>
                  <div>
                    <img src={items.image} alt="cardImage" className='object-fit w-[100px] h-[80px]' />
                  </div>
                </div>
                {
                  showMore && <div className='w-full text-gray-400 text-sm'>
                    <p className='flex gap-3 items-center justify-start'>
                      <span><GrAchievement /></span>
                      <span>Access tailored jobs and internships</span>
                    </p>
                    <p className='flex gap-3 items-center justify-start'>
                      <span><GrAchievement /></span>
                      <span>Showcase your profile to top recruiters</span>
                    </p>
                    <p className='flex gap-3 items-center justify-start'>
                      <span><GrAchievement /></span>
                      <span>Participate in exciting competitions</span>
                    </p>
                    <p className='flex gap-3 items-center justify-start'>
                      <span><GrAchievement /></span>
                      <span>Upskill with mentorships & workshop</span>
                    </p>
                  </div>
                }
              </div>
            ))
          )
        }
      </div>
      <button onClick={() => (setShowMore(!showMore))} className='flex justify-center items-center'>
        {!showMore ? (
          <>
            <p>show More </p>
            <MdKeyboardDoubleArrowDown fontSize={"25px"} />
          </>
        ) : (
          <>
            <p>show less</p>
            <MdKeyboardDoubleArrowUp />
          </>
        )}
      </button>
    </div>
  )
}

export default UseCard