import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const IssueBook = () => {
  const today = new Date().toISOString().split('T')[0];
  const defaultDueDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  })();

  const [formData, setFormData] = useState({
    member_id: '',
    book_id: '',
    copy_id: '',
    issue_date: today,
    due_date: defaultDueDate,
    notes: ''
  });
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
    fetchBooks();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/members').then(r => r.json());
      setMembers(response.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/books').then(r => r.json());
      setBooks(response.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleBookSelect = async (bookId) => {
    if (bookId) {
      try {
        const response = await fetch(`http://localhost:3000/api/copies/book/${bookId}/available`).then(r => r.json());
        setCopies(response || []);
      } catch (error) {
        console.error('Error fetching available copies:', error);
        setCopies([]);
      }
    } else {
      setCopies([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'book_id') {
      // Clear copy selection when book changes
      setFormData({
        ...formData,
        [name]: value,
        copy_id: ''
      });
      handleBookSelect(value);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.member_id || !formData.copy_id) {
      setError('Please select both a member and a book copy');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.issueBook(formData);
      alert('Book issued successfully!');
      navigate('/issue-history');
    } catch (error) {
      console.error('Error issuing book:', error);
      setError(error.message || 'Failed to issue book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate due date (14 days from issue date)
  const calculateDueDate = (issueDate) => {
    const date = new Date(issueDate);
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  // Update due date when issue date changes
  const handleIssueDateChange = (e) => {
    const issueDate = e.target.value;
    setFormData({
      ...formData,
      issue_date: issueDate,
      due_date: calculateDueDate(issueDate)
    });
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Issue Book</h1>
              <p className="text-gray-600 text-lg">
                Issue a book to a library member
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
                  Member Information
                </h2>
                
                <div className="mb-6">
                  <label htmlFor="member_id" className="block mb-2 font-medium text-gray-800">
                    Select Member <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="member_id"
                    name="member_id"
                    value={formData.member_id}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                    required
                  >
                    <option value="">Select a member...</option>
                    {members.map((member) => (
                      <option key={member.member_id} value={member.member_id}>
                        {member.first_name} {member.last_name} - {member.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                  Book Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="book_id" className="block mb-2 font-medium text-gray-800">
                      Select Book <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="book_id"
                      name="book_id"
                      value={formData.book_id || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                      required
                    >
                      <option value="">Select a book...</option>
                      {books.map((book) => (
                        <option key={book.book_id} value={book.book_id}>
                          {book.title} - {book.author}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="copy_id" className="block mb-2 font-medium text-gray-800">
                      Select Copy <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="copy_id"
                      name="copy_id"
                      value={formData.copy_id}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                      required
                      disabled={!copies.length}
                    >
                      <option value="">Select a copy...</option>
                      {copies.map((copy) => (
                        <option key={copy.copy_id} value={copy.copy_id}>
                          Copy #{copy.copy_id} - Rack: {copy.rack_number || 'N/A'}, Shelf: {copy.shelf_number || 'N/A'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                  Issue Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="issue_date" className="block mb-2 font-medium text-gray-800">
                      Issue Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      id="issue_date"
                      name="issue_date"
                      value={formData.issue_date}
                      onChange={handleIssueDateChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="due_date" className="block mb-2 font-medium text-gray-800">
                      Due Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                      required
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
                    placeholder="Any additional notes about this issue"
                    rows="3"
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400 resize-y min-h-20"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Issue Summary</h3>
                <div className="text-sm text-blue-700">
                  <p>• Standard loan period: 14 days</p>
                  <p>• Late return fee: $1.00 per day</p>
                  <p>• Maximum renewals: 2 times</p>
                  <p>• Member can hold up to 5 books at once</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`flex-1 py-3 border-none rounded-md text-base font-medium cursor-pointer transition-colors duration-300 ${
                    loading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gray-800 text-white hover:bg-gray-600'
                  }`}
                >
                  {loading ? 'Issuing Book...' : 'Issue Book'}
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

export default IssueBook;

