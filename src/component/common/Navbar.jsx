import React from 'react';
import NavLink from '../data/NavLink';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import unstop from '../../Assests/unstop-logo.svg'
import { BiMessageRoundedDetail } from "react-icons/bi"
import { MdOutlineNotifications } from "react-icons/md";

function Navbar() {

    return (
        <div className='w-full bg-white border-b-1'>
            <nav className="w-[90vw] py-4 mx-auto flex justify-between items-center">
                <div className='flex items-center justify-center gap-2'>
                    <img src={unstop} alt='this is a image' height={"50px"} width={"70px"} />
                    <input type="text" placeholder="Search Opportunities.." className='border border-gray-400 py-2 rounded-full text-center focus:border-blue-300 focus:outline-none' />
                </div>
                <ul className='flex gap-2 items-evenly'>
                    {NavLink.map((item, id) => (
                        <li key={id} >
                            <Link to={item.path} className='hover:bg-gray-500 hover:text-white p-2 rounded-full transition-all duration-200'>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                       <div className='w-[2px] bg-gray-300'/>
                       {
                    true ? (<div className='flex items-center gap-2'>
                               <BiMessageRoundedDetail fontSize={"24px"} className='hover:text-blue-400'/>
                               <MdOutlineNotifications fontSize={"24px"}/>
                            </div>) :
                            (<div>

                          </div>)
                }
                </ul>
             
            </nav>
        </div>
    );
}

export default Navbar;