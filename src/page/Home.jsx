import React from 'react'
import Navbar from '../component/common/Navbar'
import logo1 from "../assest/internship.jpeg"
import logo2 from "../assest/mentor.png"
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='w-[100vw] h-screen mx-auto'>
      <Navbar />

      <div className='flex w-full my-10 px-20 items-center justify-center'>
        <div className='w-[50%] flex flex-col justify-center  gap-5'>
          <h1 className='text-5xl font-bold'>
            <span className='text-blue-900'>Start</span> Your Career
          </h1>
          <p className='text-gray-400 text-md'>
            Explore opportunities from across the globe to grow, showcase skills, gain CV points & get hired by your dream company.
          </p>
        </div>

        <div className='flex w-[50%] gap-4 flex-wrap items-center justify-center'>
          <Link to={"/login"}>
           <img src={logo1} alt="internship" className="w-[280px] h-30 rounded-xl shadow-lg border-1 border-gray-200 hover:scale-110 transtion-all duration-2000 shadow-blue-300" />
          </Link>

          <Link>
          <img src={logo2} alt="internship" className="w-[280px] h-30 rounded-xl shadow-lg border-1 border-gray-200 hover:scale-110 transtion-all duration-2000 shadow-blue-300" />
          </Link>

          <Link>
          <img src={logo2} alt="internship" className="w-[280px] h-30 rounded-xl shadow-lg border-1 border-gray-200 hover:scale-110 transtion-all duration-2000 shadow-blue-300" />
          </Link>

          <Link>
          <img src={logo2} alt="internship" className="w-[280px] h-30 rounded-xl shadow-lg border-1 border-gray-200 hover:scale-110 transtion-all duration-1000 shadow-blue-300" />
          </Link>

          <Link>
          <img src={logo2} alt="internship" className="w-[280px] h-30 rounded-xl shadow-lg border-1 border-gray-200 hover:scale-110 transtion-all duration-2000 shadow-blue-300" />
          </Link>

          <Link>
          <img src={logo2} alt="internship" className="w-[280px] h-30 rounded-xl shadow-lg border-1 border-gray-200 hover:scale-110 transtion-all duration-2000 shadow-blue-300" />
          </Link>

        </div>
      </div>

      
    </div>
  )
}

export default Home
