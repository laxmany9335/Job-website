import React from 'react'
import { Link } from 'react-router-dom';
import { FiArrowRightCircle } from "react-icons/fi";

const date = Date.now();
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
];

function TopMentors() {
  return (
    <div className="bg-yellow-50 p-8 mt-20">
      <div className="flex flex-col px-4 py-6 gap-10">
        <div className="flex justify-between lg:px-10 items-start w-full ">
          <div className='flex flex-col max-w-lg'>
            <h1 className="text-gray-900 text-2xl font-bold">TopMentors</h1>
            <p className="text-gray-700 text-sm mt-1">
              Check out the curated opportunities handpicked for you from top organizations.
            </p>
          </div>
          <div>
            <Link to ="/competitions" className='flex items-center justify-center gap-x-2 bg-gray-600 rounded-md text-white p-2 hover:bg-yellow-400 hover:text-black'>
             <span className='text-sm'>Explore More</span>
             <FiArrowRightCircle fontSize={"24px"}/>
            </Link>
          </div>
        </div>

        <div className='flex flex-row flex-wrap gap-5 items-center justify-center'>
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
      </div>
    </div>
  )
}

export default TopMentors
