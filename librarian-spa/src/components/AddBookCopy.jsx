import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AddBookCopy = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bookId: '',
    copyNumber: '',
    condition: 'new',
    rackNumber: '',
    shelfNumber: '',
    notes: ''
  });

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const booksData = await apiService.getBooks();
        setBooks(booksData.books || booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to load books.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookId || !formData.copyNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.addCopy(formData);
      alert('Book copy added successfully!');
      navigate('/books-copies-management');
    } catch (error) {
      console.error('Error adding book copy:', error);
      setError(error.message || 'Failed to add book copy. Please try again.');
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
              to="/books-copies-management" 
              className="text-gray-800 px-4 py-2 border border-gray-200 rounded-md transition-all duration-300 hover:border-gray-800"
            >
              ← Back to Copies Management
            </Link>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-5">
          <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Book Copy</h1>
              <p className="text-gray-600 text-lg">
                Add a new copy of an existing book to the library
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="bookId" className="block mb-2 font-medium text-gray-800">
                  Select Book <span className="text-red-600">*</span>
                </label>
                <select
                  id="bookId"
                  name="bookId"
                  value={formData.bookId}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                  required
                  disabled={loading}
                >
                  <option value="">Select a book</option>
                  {books.map((book) => (
                    <option key={book.book_id || book.id} value={book.book_id || book.id}>
                      {book.title} - {book.author}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="copyNumber" className="block mb-2 font-medium text-gray-800">
                    Copy Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="copyNumber"
                    name="copyNumber"
                    value={formData.copyNumber}
                    onChange={handleChange}
                    placeholder="e.g., C001"
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="condition" className="block mb-2 font-medium text-gray-800">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                  >
                    <option value="new">New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              </div>

              <div className="mb-6">
                <label htmlFor="notes" className="block mb-2 font-medium text-gray-800">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes about this copy"
                  rows="3"
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400 resize-y min-h-20"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-gray-800 text-white border-none rounded-md text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-gray-600"
                >
                  Add Copy
                </button>
                <Link 
                  to="/books-copies-management" 
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

export default AddBookCopy;

