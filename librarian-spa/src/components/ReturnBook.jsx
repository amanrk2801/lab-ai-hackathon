import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ReturnBook = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [returnCondition, setReturnCondition] = useState('good');
  const [notes, setNotes] = useState('');
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [stats, setStats] = useState({
    booksIssued: 0,
    overdueBooks: 0,
    pendingFines: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssuedBooks();
    fetchStats();
  }, []);

  const fetchIssuedBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/issues').then(r => r.json());
      const issues = response.issues || [];
      
      // Filter only issued and overdue books
      const activeIssues = issues.filter(issue => 
        issue.status === 'issued' || issue.status === 'overdue'
      );
      
      setIssuedBooks(activeIssues);
    } catch (error) {
      console.error('Error fetching issued books:', error);
      setError('Failed to load issued books');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/issues/stats').then(r => r.json());
      
      // Also get detailed issue data for pending fines calculation
      const issuesResponse = await fetch('http://localhost:3000/api/issues').then(r => r.json());
      const allIssues = issuesResponse.issues || [];
      
      // Calculate pending fines from active issues only
      const pendingFines = allIssues
        .filter(issue => issue.status === 'issued' || issue.status === 'overdue')
        .reduce((sum, issue) => sum + (parseFloat(issue.fine_amount || 0) || 0), 0);

      setStats({
        booksIssued: response.active_issues || 0,
        overdueBooks: response.overdue_issues || 0,
        pendingFines: pendingFines
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const filteredBooks = issuedBooks.filter(book => 
    (book.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.copy_id || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${book.first_name || ''} ${book.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.member_id || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReturn = (book) => {
    setSelectedReturn(book);
  };

  const calculateDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateFine = (daysOverdue) => {
    return daysOverdue * 1.00; // ₹1.00 per day
  };

  const handleConfirmReturn = async () => {
    if (!selectedReturn) return;

    setLoading(true);
    setError('');

    try {
      const returnData = {
        return_date: new Date().toISOString().split('T')[0],
        condition: returnCondition,
        notes: notes
      };

      const response = await fetch(`http://localhost:3000/api/issues/${selectedReturn.issue_id}/return`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(returnData)
      });

      if (!response.ok) {
        throw new Error('Failed to return book');
      }
      
      alert('Book returned successfully!');
      setSelectedReturn(null);
      setReturnCondition('good');
      setNotes('');
      await fetchIssuedBooks(); // Refresh the list
      await fetchStats(); // Refresh statistics
    } catch (error) {
      console.error('Error returning book:', error);
      setError(error.message || 'Failed to return book. Please try again.');
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Return Book</h1>
            
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by book title, author, copy ID, member name, or member ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-800">{stats.booksIssued}</div>
                <div className="text-sm text-blue-600">Books Issued</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-800">{stats.overdueBooks}</div>
                <div className="text-sm text-red-600">Overdue Books</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-800">₹{stats.pendingFines.toFixed(2)}</div>
                <div className="text-sm text-green-600">Pending Fines</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Copy ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Book Details</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Member</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Issue Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        Loading issued books...
                      </td>
                    </tr>
                  ) : filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        No issued books found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => {
                      const daysOverdue = calculateDaysOverdue(book.due_date);
                      const isOverdue = book.status === 'overdue' || daysOverdue > 0;
                      const fine = parseFloat(book.fine_amount || 0) || (isOverdue ? calculateFine(daysOverdue) : 0);
                      
                      return (
                        <tr key={book.issue_id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-mono text-sm font-medium text-gray-800">{book.copy_id}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-800">{book.title}</div>
                            <div className="text-sm text-gray-600">{book.author}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-800">{book.first_name} {book.last_name}</div>
                            <div className="text-sm text-gray-600">ID: {book.member_id}</div>
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">
                            {new Date(book.issue_date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">
                            {new Date(book.due_date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            {isOverdue ? (
                              <div>
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                  Overdue
                                </span>
                                <div className="text-xs text-red-600 mt-1">
                                  {daysOverdue} days late
                                </div>
                                <div className="text-xs text-red-600">
                                  Fine: ₹{fine.toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                On Time
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => handleReturn(book)}
                              className="px-4 py-2 bg-green-600 text-white rounded transition-colors duration-300 hover:bg-green-700"
                            >
                              Return
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Return Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Process Return</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">{selectedReturn.title}</h3>
              <p className="text-gray-600">{selectedReturn.author}</p>
              <p className="text-sm text-gray-600">Copy: {selectedReturn.copy_id}</p>
              <p className="text-sm text-gray-600">Member: {selectedReturn.first_name} {selectedReturn.last_name} (ID: {selectedReturn.member_id})</p>
            </div>

            {(selectedReturn.status === 'overdue' || calculateDaysOverdue(selectedReturn.due_date) > 0) && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
                <p className="text-red-800 font-medium">Overdue Return</p>
                <p className="text-red-700 text-sm">
                  {calculateDaysOverdue(selectedReturn.due_date)} days late - Fine: ₹{(parseFloat(selectedReturn.fine_amount || 0) || calculateFine(calculateDaysOverdue(selectedReturn.due_date))).toFixed(2)}
                </p>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="returnCondition" className="block mb-2 font-medium text-gray-800">
                Book Condition
              </label>
              <select
                id="returnCondition"
                value={returnCondition}
                onChange={(e) => setReturnCondition(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="returnNotes" className="block mb-2 font-medium text-gray-800">
                Notes
              </label>
              <textarea
                id="returnNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about the return condition"
                rows="3"
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400 resize-y"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleConfirmReturn}
                disabled={loading}
                className={`flex-1 py-2 border-none rounded-md font-medium cursor-pointer transition-colors duration-300 ${
                  loading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Processing...' : 'Process Return'}
              </button>
              <button 
                onClick={() => {
                  setSelectedReturn(null);
                  setReturnCondition('good');
                  setNotes('');
                  setError('');
                }}
                className="flex-1 py-2 border-2 border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnBook;

