import React from 'react';
import NavLink from '../data/NavLink';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../../assest/logo.png'
import { BiMessageRoundedDetail } from "react-icons/bi"
import { MdOutlineNotifications } from "react-icons/md";

function Navbar() {
    const islogin = false;
    return (
        <div className='w-full bg-white border-b-1'>
            <nav className="w-[90vw] py-4 mx-auto flex justify-between items-center">
                <div className='flex items-center justify-center gap-2'>
                    <img src={logo} alt='this is a image' height={"50px"} width={"120px"}  />
                    <input type="text" placeholder="Search Opportunities.." className='border border-gray-400 py-2 rounded-full text-center focus:border-blue-300 focus:outline-none' />
                </div>
                <ul className='flex gap-2 items-center justify-center'>
                    {NavLink.map((item, id) => (
                        <li key={id} >
                            <Link to={item.path} className='hover:bg-gray-500 hover:text-white p-2 rounded-full transition-all duration-200'>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                    <div className='w-[2px] h-[40px] bg-gray-300' />
                    {
                       islogin ? (
                            <div className='h-[35px] flex items-center justify-center gap-2'>
                                <BiMessageRoundedDetail fontSize={"40px"} className='h-full  hover:bg-blue-50 hover:text-blue-400 rounded-full p-1' />
                                 <MdOutlineNotifications fontSize={"40px"} className='h-full  hover:bg-blue-50 hover:text-blue-400 rounded-full p-1' />
                                 <div className='h-full w-[35px] border-2 border-gray-400 rounded-full'>
                                        <img src={logo} className='object-fit h-full w-full rounded-full p-1'/>
                                </div>
                            </div>
                        ) :
                            (<div>
                               <Link to={"/login"} className='bg-blue-600 text-white text-md py-2 px-5 rounded-full hover:bg-blue-700'>
                                login
                               </Link>
                            </div>)
                    }
                     <div className='w-[2px] h-[40px] bg-gray-300' />

                     <Link to={"/jobs"} className='text-md border-2 border-gray-400 py-1 px-5 rounded-full hover:bg-gray-200 font-bold'>
                           + Host
                     </Link>
                     
                    <button>

                    </button>
                </ul>

            </nav>
        </div>
    );
}

export default Navbar;