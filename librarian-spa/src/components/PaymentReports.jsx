import { useState } from 'react';
import { Link } from 'react-router-dom';

const PaymentReports = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('summary');

  // Sample payment data for reports
  const paymentData = {
    summary: {
      totalRevenue: 1250.00,
      membershipFees: 850.00,
      lateFees: 320.00,
      otherFees: 80.00,
      transactionCount: 45,
      averageTransaction: 27.78
    },
    monthly: [
      { month: 'Jan 2025', revenue: 1250.00, transactions: 45 },
      { month: 'Dec 2024', revenue: 980.00, transactions: 38 },
      { month: 'Nov 2024', revenue: 1120.00, transactions: 42 },
      { month: 'Oct 2024', revenue: 890.00, transactions: 35 },
      { month: 'Sep 2024', revenue: 1340.00, transactions: 48 },
      { month: 'Aug 2024', revenue: 1180.00, transactions: 41 }
    ],
    recentTransactions: [
      {
        id: 1,
        date: '2025-01-05',
        memberId: 'M002',
        memberName: 'Jane Smith',
        amount: 2.00,
        type: 'Late Fee',
        method: 'Cash',
        status: 'Completed'
      },
      {
        id: 2,
        date: '2025-01-04',
        memberId: 'M006',
        memberName: 'Lisa Anderson',
        amount: 10.00,
        type: 'Membership',
        method: 'Card',
        status: 'Completed'
      },
      {
        id: 3,
        date: '2025-01-03',
        memberId: 'M007',
        memberName: 'Mark Davis',
        amount: 50.00,
        type: 'Membership',
        method: 'Online',
        status: 'Completed'
      },
      {
        id: 4,
        date: '2025-01-02',
        memberId: 'M008',
        memberName: 'Anna Wilson',
        amount: 15.00,
        type: 'Membership',
        method: 'Check',
        status: 'Pending'
      },
      {
        id: 5,
        date: '2025-01-01',
        memberId: 'M009',
        memberName: 'Tom Brown',
        amount: 5.00,
        type: 'Late Fee',
        method: 'Cash',
        status: 'Completed'
      }
    ],
    paymentMethods: [
      { method: 'Cash', count: 18, amount: 425.00, percentage: 34.0 },
      { method: 'Card', count: 15, amount: 520.00, percentage: 41.6 },
      { method: 'Online', count: 8, amount: 240.00, percentage: 19.2 },
      { method: 'Check', count: 4, amount: 65.00, percentage: 5.2 }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Membership':
        return 'bg-blue-100 text-blue-800';
      case 'Late Fee':
        return 'bg-red-100 text-red-800';
      case 'Other':
        return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Reports</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="dateRange" className="block mb-2 font-medium text-gray-800">
                  Date Range
                </label>
                <select
                  id="dateRange"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div>
                <label htmlFor="reportType" className="block mb-2 font-medium text-gray-800">
                  Report Type
                </label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                >
                  <option value="summary">Summary</option>
                  <option value="detailed">Detailed</option>
                  <option value="trends">Trends</option>
                  <option value="methods">Payment Methods</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-6 py-3 bg-gray-800 text-white font-medium rounded-md transition-colors duration-300 hover:bg-gray-600">
                  Generate Report
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-800">${paymentData.summary.totalRevenue.toFixed(2)}</div>
                <div className="text-sm text-green-600">Total Revenue</div>
                <div className="text-xs text-green-500 mt-1">This Month</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-800">{paymentData.summary.transactionCount}</div>
                <div className="text-sm text-blue-600">Transactions</div>
                <div className="text-xs text-blue-500 mt-1">This Month</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-800">${paymentData.summary.averageTransaction.toFixed(2)}</div>
                <div className="text-sm text-purple-600">Avg Transaction</div>
                <div className="text-xs text-purple-500 mt-1">This Month</div>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-800">${paymentData.summary.lateFees.toFixed(2)}</div>
                <div className="text-sm text-orange-600">Late Fees</div>
                <div className="text-xs text-orange-500 mt-1">This Month</div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Membership Fees</span>
                    <span className="font-medium text-gray-800">${paymentData.summary.membershipFees.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(paymentData.summary.membershipFees / paymentData.summary.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Late Fees</span>
                    <span className="font-medium text-gray-800">${paymentData.summary.lateFees.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(paymentData.summary.lateFees / paymentData.summary.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Other Fees</span>
                    <span className="font-medium text-gray-800">${paymentData.summary.otherFees.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(paymentData.summary.otherFees / paymentData.summary.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  {paymentData.paymentMethods.map((method, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600">{method.method}</span>
                        <span className="font-medium text-gray-800">${method.amount.toFixed(2)} ({method.count})</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Revenue Trends</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Month</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Revenue</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Transactions</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Avg per Transaction</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData.monthly.map((month, index) => {
                      const prevMonth = paymentData.monthly[index + 1];
                      const change = prevMonth ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue * 100) : 0;
                      const avgTransaction = month.revenue / month.transactions;
                      
                      return (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{month.month}</td>
                          <td className="py-3 px-4 text-green-600 font-medium">${month.revenue.toFixed(2)}</td>
                          <td className="py-3 px-4 text-gray-600">{month.transactions}</td>
                          <td className="py-3 px-4 text-gray-600">${avgTransaction.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            {change !== 0 && (
                              <span className={`font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {change > 0 ? '+' : ''}{change.toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
                <Link 
                  to="/member-payment-status" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Member</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Method</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData.recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">{transaction.date}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{transaction.memberName}</div>
                          <div className="text-xs text-gray-500">{transaction.memberId}</div>
                        </td>
                        <td className="py-3 px-4 text-green-600 font-medium">${transaction.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{transaction.method}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button className="px-8 py-3 border-2 border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white">
                Export Full Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentReports;

