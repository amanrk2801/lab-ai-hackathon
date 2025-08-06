import { Link } from 'react-router-dom';
import ConnectionTest from './ConnectionTest';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-800">
              Library Management System
            </div>
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="px-6 py-3 border-2 border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md transition-all duration-300 hover:bg-gray-600"
              >
                Join Library
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="text-center py-16 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <h1 className="text-5xl font-bold mb-4 text-gray-800">
              Welcome to Our Library
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A comprehensive digital solution for managing library operations,
              book circulation, and member services with ease and efficiency.
            </p>
            <Link 
              to="/login" 
              className="inline-block px-6 py-3 bg-gray-800 text-white font-medium rounded-md transition-all duration-300 hover:bg-gray-600"
            >
              Get Started
            </Link>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-center mb-8 text-3xl font-bold text-gray-800">
              System Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  For Members
                </h3>
                <p className="text-gray-600">
                  Search and discover books, check availability, manage borrowed
                  items, and track your reading history.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  For Librarians
                </h3>
                <p className="text-gray-600">
                  Complete library operations including book management, member
                  services, payment collection, and circulation control.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  For Owners
                </h3>
                <p className="text-gray-600">
                  Business oversight with financial reports, asset tracking, and
                  comprehensive analytics for informed decision making.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Connection Test Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-center mb-8 text-3xl font-bold text-gray-800">
              System Status
            </h2>
            <div className="max-w-2xl mx-auto">
              <ConnectionTest />
            </div>
          </div>
        </section>

        <section className="text-center py-16 bg-gray-800 text-white">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8">
              Join our library community and experience seamless book management
            </p>
            <Link 
              to="/register" 
              className="inline-block px-6 py-3 border-2 border-white text-white font-medium rounded-md transition-all duration-300 hover:bg-white hover:text-gray-800"
            >
              Create Account
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-600">
        <div className="max-w-6xl mx-auto px-5">
          <p>&copy; 2025 Library Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

