import Footer from '../component/common/Footer';
import Navbar from '../component/common/Navbar';
import logo1 from '../assest/cardImage/intership_hero_page.webp';
import Internships from '../component/homePage/Internships';

function InternshipsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="flex flex-col-reverse lg:flex-row w-full px-4 sm:px-8 lg:px-20 items-center justify-center gap-12 py-16">
                {/* Text Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                        <span className="text-blue-900">Unlock </span>Your Career
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-6">
                        Apply to a wide range of hiring opportunities and work with your dream tech companies!
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <button className="bg-blue-900 text-white px-6 py-2 rounded-3xl hover:bg-blue-700 transition duration-300">
                            Explore Internships
                        </button>
                        <button className="bg-gray-100 text-black border border-gray-300 px-6 py-2 rounded-3xl hover:bg-blue-200 transition duration-300">
                            + Post Internships
                        </button>
                    </div>
                </div>

                {/* Image */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <img
                        src={logo1}
                        alt="Internship"
                        className="w-full max-w-md "
                    />
                </div>
            </div>

            {/* Internship Categories Section */}
            <div className=" w-full px-4 sm:px-8 lg:px-20 ">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center lg:text-left">
                    Internship Categories
                </h2>

                <div className="flex flex-wrap gap-4 justify-center justify-center">
                    {['Human Resources', 'Software Development', 'Marketing', 'Operations', 'Finance'].map((category, index) => (
                        <button
                            key={index}
                            className="bg-gray-100 text-gray-800 border border-gray-300 px-6 py-3 rounded-lg hover:bg-blue-200 transition duration-300"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <Internships />

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default InternshipsPage;
