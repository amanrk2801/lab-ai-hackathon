import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function UserManagement() {
  const [members, setMembers] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMembership, setFilterMembership] = useState('');

  // Fetch members on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch('http://localhost:3000/api/members').then(r => r.json());
        // Handle API response structure that has members array
        setMembers(response.members || response || []);
      } catch (error) {
        console.error('Error fetching members:', error);
        setError('Failed to load members data.');
        setMembers([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = (members || []).filter(member => {
    const firstName = member.firstName || member.first_name || '';
    const lastName = member.lastName || member.last_name || '';
    const email = member.email || '';
    const memberId = member.memberId || member.member_id || '';
    const status = member.status || '';
    const membershipType = member.membershipType || member.membership_type || '';
    
    const matchesSearch = firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memberId.toString().toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || status === filterStatus;
    const matchesMembership = filterMembership === '' || membershipType === filterMembership;
    
    return matchesSearch && matchesStatus && matchesMembership;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipColor = (type) => {
    switch (type) {
      case 'Premium':
        return 'bg-purple-100 text-purple-800';
      case 'Student':
        return 'bg-blue-100 text-blue-800';
      case 'Senior':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const suspendedMembers = members.filter(m => m.status === 'Suspended').length;
  const totalFines = (members || []).reduce((sum, member) => {
    const fines = parseFloat(member.total_fines || member.totalFines || 0);
    return sum + (isNaN(fines) ? 0 : fines);
  }, 0);

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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Search members..."
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div>
                <select
                  value={filterMembership}
                  onChange={(e) => setFilterMembership(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                >
                  <option value="">All Memberships</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Student">Student</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <div>
                <Link 
                  to="/add-member" 
                  className="w-full inline-block text-center px-6 py-3 bg-gray-800 text-white font-medium rounded-md transition-colors duration-300 hover:bg-gray-600"
                >
                  Add Member
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-800">{totalMembers}</div>
                <div className="text-sm text-blue-600">Total Members</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-800">{activeMembers}</div>
                <div className="text-sm text-green-600">Active Members</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-800">{suspendedMembers}</div>
                <div className="text-sm text-red-600">Suspended</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-800">₹{totalFines.toFixed(2)}</div>
                <div className="text-sm text-yellow-600">Total Fines</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredMembers.length} of {totalMembers} members
              </p>
              <button className="px-6 py-3 border-2 border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white">
                Export Report
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Member ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Membership</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Books</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Fines</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.member_id || member.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-mono text-sm font-medium text-gray-800">{member.member_id || member.memberId}</div>
                        <div className="text-xs text-gray-500">Joined: {member.join_date || member.joinDate || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{member.first_name || member.firstName} {member.last_name || member.lastName}</div>
                        <div className="text-xs text-gray-500">Last active: {member.last_activity || member.lastActivity || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">{member.email}</div>
                        <div className="text-sm text-gray-600">{member.phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getMembershipColor(member.membership_type || member.membershipType || 'Basic')}`}>
                          {member.membership_type || member.membershipType || 'Basic'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-800">
                          {member.books_issued || member.booksIssued || 0} issued
                        </div>
                        {(member.books_overdue || member.overdueBooks || 0) > 0 && (
                          <div className="text-xs text-red-600">
                            {member.books_overdue || member.overdueBooks || 0} overdue
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {(parseFloat(member.total_fines || member.totalFines || 0) || 0) > 0 ? (
                          <span className="text-red-600 font-medium">₹{(parseFloat(member.total_fines || member.totalFines || 0) || 0).toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm border border-gray-800 text-gray-800 rounded transition-all duration-300 hover:bg-gray-800 hover:text-white">
                            Edit
                          </button>
                          {member.status === 'Active' && (
                            <button className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded transition-all duration-300 hover:bg-red-600 hover:text-white">
                              Suspend
                            </button>
                          )}
                          {member.status === 'Suspended' && (
                            <button className="px-3 py-1 text-sm border border-green-600 text-green-600 rounded transition-all duration-300 hover:bg-green-600 hover:text-white">
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No members found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;

