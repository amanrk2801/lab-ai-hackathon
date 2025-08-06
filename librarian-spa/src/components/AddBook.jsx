import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: '',
    category: '',
    language: '',
    description: '',
    rackNumber: '',
    shelfNumber: '',
    copies: '1'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.isbn) {
      setError('Please fill in all required fields (title, author, ISBN)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.addBook(formData);
      alert('Book added successfully!');
      navigate('/books-catalog');
    } catch (error) {
      console.error('Error adding book:', error);
      setError(error.message || 'Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-5">
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
        <div className="max-w-4xl mx-auto px-5">
          <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Book</h1>
              <p className="text-gray-600 text-lg">
                Enter book details to add to the library catalog
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                  Book Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="title" className="block mb-2 font-medium text-gray-800">
                      Book Title <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter book title"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="author" className="block mb-2 font-medium text-gray-800">
                      Author <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Enter author name"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="isbn" className="block mb-2 font-medium text-gray-800">
                      ISBN <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      placeholder="Enter ISBN number"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="publisher" className="block mb-2 font-medium text-gray-800">
                      Publisher
                    </label>
                    <input
                      type="text"
                      id="publisher"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleChange}
                      placeholder="Enter publisher name"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label htmlFor="publication_year" className="block mb-2 font-medium text-gray-800">
                      Publication Year
                    </label>
                    <input
                      type="number"
                      id="publication_year"
                      name="publication_year"
                      value={formData.publication_year}
                      onChange={handleChange}
                      placeholder="YYYY"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block mb-2 font-medium text-gray-800">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                    >
                      <option value="">Select category</option>
                      <option value="fiction">Fiction</option>
                      <option value="non-fiction">Non-Fiction</option>
                      <option value="science">Science</option>
                      <option value="technology">Technology</option>
                      <option value="history">History</option>
                      <option value="biography">Biography</option>
                      <option value="education">Education</option>
                      <option value="reference">Reference</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="language" className="block mb-2 font-medium text-gray-800">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                    >
                      <option value="">Select language</option>
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="description" className="block mb-2 font-medium text-gray-800">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter book description"
                    rows="4"
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400 resize-y min-h-24"
                  />
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                  Location & Inventory
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label htmlFor="rackNumber" className="block mb-2 font-medium text-gray-800">
                      Rack Number
                    </label>
                    <input
                      type="text"
                      id="rackNumber"
                      name="rackNumber"
                      value={formData.rackNumber}
                      onChange={handleChange}
                      placeholder="e.g., A1"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="shelfNumber" className="block mb-2 font-medium text-gray-800">
                      Shelf Number
                    </label>
                    <input
                      type="text"
                      id="shelfNumber"
                      name="shelfNumber"
                      value={formData.shelfNumber}
                      onChange={handleChange}
                      placeholder="e.g., 3"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="copies" className="block mb-2 font-medium text-gray-800">
                      Number of Copies <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      id="copies"
                      name="copies"
                      value={formData.copies}
                      onChange={handleChange}
                      placeholder="1"
                      min="1"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-gray-800 text-white border-none rounded-md text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-gray-600"
                >
                  Add Book to Catalog
                </button>
                <Link 
                  to="/librarian-dashboard" 
                  className="flex-1 py-3 border-2 border-gray-800 bg-transparent text-gray-800 text-center font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddBook;

