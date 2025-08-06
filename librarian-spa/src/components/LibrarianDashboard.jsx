import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const LibrarianDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalIssues: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch real data from backend APIs without authentication for dashboard
      const [booksData, membersData, issuesData, overdueData] = await Promise.allSettled([
        fetch(`http://localhost:3000/api/books?limit=1`).then(r => r.json()),
        fetch(`http://localhost:3000/api/members?limit=1`).then(r => r.json()),
        fetch(`http://localhost:3000/api/issues?limit=1`).then(r => r.json()),
        fetch(`http://localhost:3000/api/issues/overdue`).then(r => r.json())
      ]);
      
      // Update stats with real data - access pagination.total for count endpoints
      setStats({
        totalBooks: booksData.status === 'fulfilled' ? (booksData.value.pagination?.total || 0) : 0,
        totalMembers: membersData.status === 'fulfilled' ? (membersData.value.pagination?.total || 0) : 0,
        totalIssues: issuesData.status === 'fulfilled' ? (issuesData.value.pagination?.total || 0) : 0,
        overdueBooks: overdueData.status === 'fulfilled' ? (Array.isArray(overdueData.value) ? overdueData.value.length : 0) : 0
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    // In a real app, you might want to redirect to login
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-gray-800">
              Library Management System
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium uppercase">
                Librarian
              </span>
              <Link 
                to="/" 
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-5">
          <section className="bg-white p-8 rounded-lg border border-gray-200 mb-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              Welcome back, Librarian!
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your library operations efficiently from this dashboard
            </p>
          </section>

          <section className="mb-8">
            {loading ? (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md">
                Loading dashboard data...
              </div>
            ) : (
              <>
                {stats.overdueBooks > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-4 flex items-center gap-3">
                    <span className="font-bold text-lg">⚠</span>
                    <span>{stats.overdueBooks} books are overdue and require immediate attention</span>
                  </div>
                )}
                {stats.totalIssues > 10 && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md mb-4 flex items-center gap-3">
                    <span className="font-bold text-lg">📚</span>
                    <span>Library is active with {stats.totalIssues} current book issues</span>
                  </div>
                )}
                {stats.totalBooks === 0 && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md flex items-center gap-3">
                    <span className="font-bold text-lg">!</span>
                    <span>No books found in the catalog. Start by adding some books!</span>
                  </div>
                )}
              </>
            )}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {loading ? '...' : stats.totalBooks}
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wide mb-2">Total Books</div>
              <div className="text-gray-600 text-xs">Updated from API</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {loading ? '...' : stats.totalMembers}
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wide mb-2">Active Members</div>
              <div className="text-gray-600 text-xs">Live data</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {loading ? '...' : stats.totalIssues}
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wide mb-2">Books Issued</div>
              <div className="text-gray-600 text-xs">Current</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {loading ? '...' : stats.overdueBooks}
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wide mb-2">Overdue Books</div>
              <div className="text-gray-600 text-xs">Requires attention</div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                <h2 className="text-gray-800 mb-4 pb-2 border-b border-gray-200 font-semibold">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link 
                    to="/issue-book" 
                    className="p-4 border-2 border-gray-200 rounded-lg text-center transition-all duration-300 hover:border-gray-800 hover:bg-gray-50 text-gray-800"
                  >
                    <h3 className="mb-2 text-gray-800 font-medium">Issue Book</h3>
                    <p className="text-gray-600 text-sm">Lend books to members</p>
                  </Link>
                  <Link 
                    to="/return-book" 
                    className="p-4 border-2 border-gray-200 rounded-lg text-center transition-all duration-300 hover:border-gray-800 hover:bg-gray-50 text-gray-800"
                  >
                    <h3 className="mb-2 text-gray-800 font-medium">Return Book</h3>
                    <p className="text-gray-600 text-sm">Process book returns</p>
                  </Link>
                  <Link 
                    to="/add-book" 
                    className="p-4 border-2 border-gray-200 rounded-lg text-center transition-all duration-300 hover:border-gray-800 hover:bg-gray-50 text-gray-800"
                  >
                    <h3 className="mb-2 text-gray-800 font-medium">Add Book</h3>
                    <p className="text-gray-600 text-sm">Add new books to catalog</p>
                  </Link>
                  <Link 
                    to="/add-member" 
                    className="p-4 border-2 border-gray-200 rounded-lg text-center transition-all duration-300 hover:border-gray-800 hover:bg-gray-50 text-gray-800"
                  >
                    <h3 className="mb-2 text-gray-800 font-medium">Add Member</h3>
                    <p className="text-gray-600 text-sm">Register new members</p>
                  </Link>
                  <Link 
                    to="/collect-payment" 
                    className="p-4 border-2 border-gray-200 rounded-lg text-center transition-all duration-300 hover:border-gray-800 hover:bg-gray-50 text-gray-800"
                  >
                    <h3 className="mb-2 text-gray-800 font-medium">Collect Payment</h3>
                    <p className="text-gray-600 text-sm">Process member payments</p>
                  </Link>
                  <Link 
                    to="/books-catalog" 
                    className="p-4 border-2 border-gray-200 rounded-lg text-center transition-all duration-300 hover:border-gray-800 hover:bg-gray-50 text-gray-800"
                  >
                    <h3 className="mb-2 text-gray-800 font-medium">View Catalog</h3>
                    <p className="text-gray-600 text-sm">Browse book collection</p>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                <h2 className="text-gray-800 mb-4 pb-2 border-b border-gray-200 font-semibold">
                  Pending Tasks
                </h2>
                <ul className="space-y-0">
                  <li className="py-3 border-b border-gray-200 flex justify-between items-center last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 mb-1">Process overdue returns</div>
                      <div className="text-xs text-gray-600">5 books overdue</div>
                    </div>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium uppercase bg-red-100 text-red-800">
                      High
                    </span>
                  </li>
                  <li className="py-3 border-b border-gray-200 flex justify-between items-center last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 mb-1">Update book inventory</div>
                      <div className="text-xs text-gray-600">Monthly review due</div>
                    </div>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium uppercase bg-yellow-100 text-yellow-800">
                      Medium
                    </span>
                  </li>
                  <li className="py-3 border-b border-gray-200 flex justify-between items-center last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 mb-1">Member payment follow-up</div>
                      <div className="text-xs text-gray-600">3 pending payments</div>
                    </div>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium uppercase bg-yellow-100 text-yellow-800">
                      Medium
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                <h2 className="text-gray-800 mb-4 pb-2 border-b border-gray-200 font-semibold">
                  Management Tools
                </h2>
                <div className="space-y-3">
                  <Link 
                    to="/user-management" 
                    className="block p-3 border border-gray-200 rounded-md text-gray-800 hover:border-gray-800 hover:bg-gray-50 transition-all duration-300"
                  >
                    User Management
                  </Link>
                  <Link 
                    to="/payment-reports" 
                    className="block p-3 border border-gray-200 rounded-md text-gray-800 hover:border-gray-800 hover:bg-gray-50 transition-all duration-300"
                  >
                    Payment Reports
                  </Link>
                  <Link 
                    to="/rack-management" 
                    className="block p-3 border border-gray-200 rounded-md text-gray-800 hover:border-gray-800 hover:bg-gray-50 transition-all duration-300"
                  >
                    Rack Management
                  </Link>
                  <Link 
                    to="/issue-history" 
                    className="block p-3 border border-gray-200 rounded-md text-gray-800 hover:border-gray-800 hover:bg-gray-50 transition-all duration-300"
                  >
                    Issue History
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LibrarianDashboard;

