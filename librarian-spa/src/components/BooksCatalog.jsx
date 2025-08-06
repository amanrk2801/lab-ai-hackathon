import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const BooksCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBooks();
      setBooks(response.books || response || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getBookCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // If this fails, we'll just not show category filter
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await apiService.deleteBook(bookId);
      // Refresh the books list
      fetchBooks();
      alert('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book. Please try again.');
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn?.includes(searchTerm);
    const matchesCategory = filterCategory === '' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Books Catalog</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  {/* Fallback options if categories aren't loaded */}
                  {categories.length === 0 && (
                    <>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Science">Science</option>
                      <option value="Technology">Technology</option>
                      <option value="History">History</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading books...' : `Showing ${filteredBooks.length} of ${books.length} books`}
              </p>
              <Link 
                to="/add-book" 
                className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md transition-colors duration-300 hover:bg-gray-600"
              >
                Add New Book
              </Link>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">Loading books...</div>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-600 mb-4">No books found in the catalog.</div>
                <Link 
                  to="/add-book" 
                  className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md transition-colors duration-300 hover:bg-gray-600"
                >
                  Add Your First Book
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Author</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">ISBN</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Publication Year</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.book_id || book.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">{book.title}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{book.author}</td>
                        <td className="py-4 px-4 text-gray-600 font-mono text-sm">{book.isbn}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {book.category || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{book.publication_year || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Link 
                              to={`/edit-book/${book.book_id || book.id}`}
                              className="px-3 py-1 text-sm border border-gray-800 text-gray-800 rounded transition-all duration-300 hover:bg-gray-800 hover:text-white"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDeleteBook(book.book_id || book.id)}
                              className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded transition-all duration-300 hover:bg-red-600 hover:text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredBooks.length === 0 && books.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                No books found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BooksCatalog;

