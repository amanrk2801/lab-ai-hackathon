import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IssueHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    totalIssues: 0,
    returned: 0,
    overdue: 0,
    totalFines: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/issues').then(r => r.json());
      setIssues(response.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError('Failed to load issue history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/issues/stats').then(r => r.json());

      setStats({
        totalIssues: response.total_issues || 0,
        returned: response.returned_issues || 0,
        overdue: response.overdue_issues || 0,
        totalFines: parseFloat(response.total_fines || 0)
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const filteredHistory = issues.filter(record => {
    const memberName = `${record.first_name || ''} ${record.last_name || ''}`.trim();
    const matchesSearch = (record.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.copy_id || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.member_id || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || record.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Returned':
        return 'bg-green-100 text-green-800';
      case 'Issued':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Returned Late':
        return 'bg-orange-100 text-orange-800';
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Issue History</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">Loading issue history...</div>
              </div>
            ) : (
              <>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Search by book, member, or copy ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                >
                  <option value="">All Status</option>
                  <option value="Issued">Currently Issued</option>
                  <option value="Returned">Returned</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Returned Late">Returned Late</option>
                </select>
              </div>
              <div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-800">{stats.totalIssues}</div>
                <div className="text-sm text-blue-600">Total Issues</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-800">{stats.returned}</div>
                <div className="text-sm text-green-600">Returned</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-800">{stats.overdue}</div>
                <div className="text-sm text-red-600">Overdue</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-800">₹{stats.totalFines.toFixed(2)}</div>
                <div className="text-sm text-orange-600">Total Fines</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredHistory.length} of {issues.length} records
              </p>
              <button className="px-6 py-3 border-2 border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white">
                Export Report
              </button>
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
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Return Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((record) => (
                    <tr key={record.issue_id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-mono text-sm font-medium text-gray-800">{record.copy_id}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{record.title}</div>
                        <div className="text-sm text-gray-600">{record.author}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{record.first_name} {record.last_name}</div>
                        <div className="text-sm text-gray-600">ID: {record.member_id}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {record.issue_date ? new Date(record.issue_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {record.due_date ? new Date(record.due_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {record.return_date ? new Date(record.return_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {(parseFloat(record.fine_amount || 0) || 0) > 0 ? (
                          <span className="text-red-600 font-medium">₹{(parseFloat(record.fine_amount || 0) || 0).toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No issue records found matching your search criteria.
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueHistory;

