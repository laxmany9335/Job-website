import Navbar from '../component/common/Navbar'
import SoicalMedia from '../component/profile/SoicalMedia'
import UserDetails from '../component/profile/UserDetails'

function MyProfile() {
  return (
    <div className="min-h-screen">
      {/* Fixed Navbar */}
      <div className="fixed w-full top-0 left-0 z-50">
        <Navbar />
      </div>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16 sm:h-20" />
      
      <div className='bg-gray-50 min-h-screen'>
        {/* Header Section */}
        <div className="px-4 sm:px-6 lg:px-8 pt-20 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Profile Details
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your personal information and social media connections
          </p>
        </div>
        
        {/* Main Content */}
        <div className='w-full flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 pb-8'>
          {/* User Details Section */}
          <div className='w-full lg:w-[70%] order-1 lg:order-1'>
            <UserDetails />
          </div>
          
          {/* Social Media Section */}
          <div className='w-full lg:w-[30%] order-2 lg:order-2'>
            <SoicalMedia />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile