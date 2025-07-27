import React from 'react'
import Navbar from '../component/common/Navbar'
import logo1 from "../assest/internship.jpeg"
import logo2 from "../assest/mentor.png"
import { Link } from 'react-router-dom'
import UseCard from '../component/homePage/UseCard'
import SliderData from '../component/homePage/SliderData'
import FeaturedOpportunities from '../component/homePage/FeaturedOpportunities'
import Competitions from '../component/homePage/Competitions'
import Internships from '../component/homePage/Internships'
import Jobs from '../component/homePage/Jobs'
import TopMentors from '../component/homePage/TopMentors'
import Footer from '../component/common/Footer'

function Home() {

  return (
   <div className="w-full min-h-screen overflow-x-hidden"
   style={{ 
            overflow: "auto", 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
   }}
   >
  {/* Fixed Navbar */}
  <div className="fixed w-full top-0 left-0 z-50">
    <Navbar />
  </div>

  {/* Spacer below fixed navbar (adjust height as per Navbar) */}
  <div className="h-16 sm:h-20" />

      {/* Hero Section */}
      <div className='flex flex-col lg:flex-row w-full my-6 sm:my-10 px-4 sm:px-8 lg:px-20 items-center justify-center gap-8 lg:gap-0'>
        {/* Text Content */}
        <div className='w-full lg:w-[50%] pt-[100px] pb-[70px] flex flex-col justify-center gap-5 text-center lg:text-left'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight'>
            <span className='text-blue-900'>Start</span> Your Career
          </h1>
          <p className='text-gray-400 text-sm sm:text-base lg:text-md max-w-lg mx-auto lg:mx-0'>
            Explore opportunities from across the globe to grow, showcase skills, gain CV points & get hired by your dream company.
          </p>
        </div>

        {/* Image Grid */}
        <div className='w-full lg:w-[50%] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-center justify-center max-w-4xl'>
          <Link to={"/internship"} className="flex justify-center">
           <img 
             src={logo1} 
             alt="internship" 
             className="w-full max-w-[280px] h-auto rounded-xl shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300 shadow-blue-300" 
           />
          </Link>

          <Link to={"/mentor"} className="flex justify-center">
          <img 
            src={logo2} 
            alt="mentor" 
            className="w-full max-w-[280px] h-auto rounded-xl shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300 shadow-blue-300" 
          />
          </Link>

          <Link to ={"/job"} className="flex justify-center">
          <img 
            src={logo2} 
            alt="job" 
            className="w-full max-w-[280px] h-auto rounded-xl shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300 shadow-blue-300" 
          />
          </Link>

          <Link to={"/practice"} className="flex justify-center">
          <img 
            src={logo2} 
            alt="practice" 
            className="w-full max-w-[280px] h-auto rounded-xl shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300 shadow-blue-300" 
          />
          </Link>

          <Link to = {"/competition"} className="flex justify-center">
          <img 
            src={logo2} 
            alt="competition" 
            className="w-full max-w-[280px] h-auto rounded-xl shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300 shadow-blue-300" 
          />
          </Link>

          <Link to={"/more"} className="flex justify-center">
          <img 
            src={logo2} 
            alt="more" 
            className="w-full max-w-[280px] h-auto rounded-xl shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300 shadow-blue-300" 
          />
          </Link>

        </div>
      </div>

      {/* UseCard Section */}
      <div className='flex w-full my-6 sm:my-10 px-4 sm:px-8 lg:px-20 items-start justify-start'>
        <UseCard/>
      </div>

      {/* Other Sections */}
      <div className="px-4 sm:px-8 lg:px-0">
        <SliderData/>
      </div>

      <div className="px-0 sm:px-8 lg:px-0">
        <FeaturedOpportunities/>
      </div>

      <div className="px-4 sm:px-8 lg:px-0">
        <Competitions/>
      </div>

      <div className="px-4 sm:px-8 lg:px-0">
        <Internships/>
      </div>

      <div className="px-4 sm:px-8 lg:px-0">
        <Jobs/>
      </div>

      <div className="px-4 sm:px-8 lg:px-0">
        <TopMentors/>
      </div>

      <Footer/>

    </div>
  )
}

export default Home