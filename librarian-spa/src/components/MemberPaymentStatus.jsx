import { useState } from 'react';
import { Link } from 'react-router-dom';

const MemberPaymentStatus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Sample payment status data
  const memberPayments = [
    {
      id: 1,
      memberId: 'M001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      membershipType: 'Standard',
      membershipExpiry: '2025-01-15',
      status: 'Current',
      lastPayment: '2024-01-15',
      nextDue: '2025-01-15',
      amountDue: 0,
      paymentHistory: [
        { date: '2024-01-15', amount: 20.00, type: 'Membership', method: 'Card' }
      ]
    },
    {
      id: 2,
      memberId: 'M002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      membershipType: 'Premium',
      membershipExpiry: '2025-03-22',
      status: 'Current',
      lastPayment: '2024-12-20',
      nextDue: '2025-03-22',
      amountDue: 2.00,
      paymentHistory: [
        { date: '2024-12-20', amount: 2.00, type: 'Late Fee', method: 'Cash' },
        { date: '2024-03-22', amount: 50.00, type: 'Membership', method: 'Card' }
      ]
    },
    {
      id: 3,
      memberId: 'M003',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@email.com',
      membershipType: 'Student',
      membershipExpiry: '2025-09-10',
      status: 'Current',
      lastPayment: '2024-09-10',
      nextDue: '2025-09-10',
      amountDue: 0,
      paymentHistory: [
        { date: '2024-09-10', amount: 10.00, type: 'Membership', method: 'Cash' }
      ]
    },
    {
      id: 4,
      memberId: 'M004',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@email.com',
      membershipType: 'Senior',
      membershipExpiry: '2024-11-05',
      status: 'Expired',
      lastPayment: '2023-11-05',
      nextDue: '2024-11-05',
      amountDue: 35.00,
      paymentHistory: [
        { date: '2023-11-05', amount: 15.00, type: 'Membership', method: 'Check' }
      ]
    },
    {
      id: 5,
      memberId: 'M005',
      firstName: 'Robert',
      lastName: 'Brown',
      email: 'robert.brown@email.com',
      membershipType: 'Standard',
      membershipExpiry: '2024-06-18',
      status: 'Expired',
      lastPayment: '2023-06-18',
      nextDue: '2024-06-18',
      amountDue: 32.00,
      paymentHistory: [
        { date: '2023-06-18', amount: 20.00, type: 'Membership', method: 'Card' }
      ]
    }
  ];

  const filteredMembers = memberPayments.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || member.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Current':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const currentMembers = memberPayments.filter(m => m.status === 'Current').length;
  const expiredMembers = memberPayments.filter(m => m.status === 'Expired').length;
  const expiringSoon = memberPayments.filter(m => isExpiringSoon(m.membershipExpiry)).length;
  const totalOutstanding = memberPayments.reduce((sum, member) => sum + member.amountDue, 0);

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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Member Payment Status</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Search by member name, email, or member ID..."
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
                  <option value="Current">Current</option>
                  <option value="Expired">Expired</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-800">{currentMembers}</div>
                <div className="text-sm text-green-600">Current Members</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-800">{expiringSoon}</div>
                <div className="text-sm text-yellow-600">Expiring Soon</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-800">{expiredMembers}</div>
                <div className="text-sm text-red-600">Expired</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-800">${totalOutstanding.toFixed(2)}</div>
                <div className="text-sm text-blue-600">Outstanding</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredMembers.length} of {memberPayments.length} members
              </p>
              <div className="flex gap-2">
                <Link 
                  to="/collect-payment" 
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-md transition-colors duration-300 hover:bg-green-700"
                >
                  Collect Payments
                </Link>
                <button className="px-6 py-3 border-2 border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white">
                  Export Report
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Member</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Membership</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Expiry Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Last Payment</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Amount Due</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => {
                    const expiringSoon = isExpiringSoon(member.membershipExpiry);
                    const displayStatus = expiringSoon ? 'Expiring Soon' : member.status;
                    
                    return (
                      <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">{member.firstName} {member.lastName}</div>
                          <div className="text-sm text-gray-600">{member.memberId}</div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {member.membershipType}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(displayStatus)}`}>
                            {displayStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-800">{member.membershipExpiry}</div>
                          {expiringSoon && (
                            <div className="text-xs text-yellow-600">
                              Expires in {Math.ceil((new Date(member.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24))} days
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{member.lastPayment}</div>
                          {member.paymentHistory.length > 0 && (
                            <div className="text-xs text-gray-500">
                              ${member.paymentHistory[0].amount.toFixed(2)} ({member.paymentHistory[0].type})
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {member.amountDue > 0 ? (
                            <span className="text-red-600 font-medium">${member.amountDue.toFixed(2)}</span>
                          ) : (
                            <span className="text-green-600 font-medium">Paid</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm border border-gray-800 text-gray-800 rounded transition-all duration-300 hover:bg-gray-800 hover:text-white">
                              View History
                            </button>
                            {member.amountDue > 0 && (
                              <Link 
                                to="/collect-payment" 
                                className="px-3 py-1 text-sm border border-green-600 text-green-600 rounded transition-all duration-300 hover:bg-green-600 hover:text-white"
                              >
                                Collect
                              </Link>
                            )}
                            {(member.status === 'Expired' || expiringSoon) && (
                              <button className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded transition-all duration-300 hover:bg-blue-600 hover:text-white">
                                Renew
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No members found matching your search criteria.
              </div>
            )}
          </div>

          {/* Payment History Section */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Payment Activity</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Member</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {memberPayments
                    .flatMap(member => 
                      member.paymentHistory.map(payment => ({
                        ...payment,
                        memberName: `${member.firstName} ${member.lastName}`,
                        memberId: member.memberId
                      }))
                    )
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10)
                    .map((payment, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">{payment.date}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{payment.memberName}</div>
                          <div className="text-xs text-gray-500">{payment.memberId}</div>
                        </td>
                        <td className="py-3 px-4 text-green-600 font-medium">${payment.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {payment.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{payment.method}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberPaymentStatus;

