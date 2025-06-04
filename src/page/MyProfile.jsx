import Navbar from '../component/common/Navbar'
import SoicalMedia from '../component/profile/SoicalMedia'
import UserDetails from '../component/profile/UserDetails'

function MyProfile() {
  return (
    <div>
      <Navbar />
      <div className='bg-gray-50'>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Details
          </h1>
          <p className="text-gray-600">
            Manage your personal information and social media connections
          </p>
        </div>
        <div className='w-full flex flex-row'>
          <div className='w-[70%]'>
            <UserDetails />
          </div>
          <div className='w-[30%]'>
            <SoicalMedia />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile