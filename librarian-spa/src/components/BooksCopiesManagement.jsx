import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const BooksCopiesManagement = () => {
  const [bookCopies, setBookCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch book copies on component mount
  useEffect(() => {
    const fetchBookCopies = async () => {
      try {
        setLoading(true);
        const copies = await apiService.getCopies();
        setBookCopies(copies);
      } catch (error) {
        console.error('Error fetching book copies:', error);
        setError('Failed to load book copies.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookCopies();
  }, []);

  const filteredCopies = bookCopies.filter(copy => 
    copy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    copy.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    copy.copyId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Issued':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Excellent':
        return 'bg-blue-100 text-blue-800';
      case 'Good':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fair':
        return 'bg-orange-100 text-orange-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-gray-800">
              Library Management System
            </div>
            <Link 
              to="/librarian-dashboard" 
              className="text-gray-800 px-4 py-2 border border-gray-200 rounded-md transition-all duration-300 hover:border-gray-800"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-5">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-xl mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Book Copies Management</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Search by title, author, or copy ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <Link 
                  to="/add-book-copy" 
                  className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md transition-colors duration-300 hover:bg-gray-600"
                >
                  Add Copy
                </Link>
                <button className="px-6 py-3 border-2 border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white">
                  Export Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-800">156</div>
                <div className="text-sm text-gray-600">Total Copies</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-800">124</div>
                <div className="text-sm text-green-600">Available</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-800">28</div>
                <div className="text-sm text-blue-600">Issued</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-800">4</div>
                <div className="text-sm text-yellow-600">Maintenance</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Copy ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Book Details</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Condition</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Last Activity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCopies.map((copy) => (
                    <tr key={copy.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-mono text-sm font-medium text-gray-800">{copy.copyId}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{copy.title}</div>
                        <div className="text-sm text-gray-600">{copy.author}</div>
                        {copy.issuedTo && (
                          <div className="text-xs text-blue-600">Issued to: {copy.issuedTo}</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getConditionColor(copy.condition)}`}>
                          {copy.condition}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(copy.status)}`}>
                          {copy.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{copy.rack}-{copy.shelf}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{copy.lastIssued}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm border border-gray-800 text-gray-800 rounded transition-all duration-300 hover:bg-gray-800 hover:text-white">
                            Edit
                          </button>
                          {copy.status === 'Available' && (
                            <Link 
                              to="/issue-book" 
                              className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded transition-all duration-300 hover:bg-blue-600 hover:text-white"
                            >
                              Issue
                            </Link>
                          )}
                          {copy.status === 'Issued' && (
                            <Link 
                              to="/return-book" 
                              className="px-3 py-1 text-sm border border-green-600 text-green-600 rounded transition-all duration-300 hover:bg-green-600 hover:text-white"
                            >
                              Return
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCopies.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No book copies found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BooksCopiesManagement;

