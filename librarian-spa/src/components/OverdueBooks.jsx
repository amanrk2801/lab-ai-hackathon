import { useState } from 'react';
import { Link } from 'react-router-dom';

const OverdueBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample overdue books data
  const overdueBooks = [
    {
      id: 1,
      copyId: 'C005',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      memberId: 'M002',
      memberName: 'Jane Smith',
      memberEmail: 'jane.smith@email.com',
      memberPhone: '+1-555-0102',
      issueDate: '2024-12-20',
      dueDate: '2025-01-03',
      daysOverdue: 2,
      fine: 2.00,
      lastNotified: '2025-01-04'
    },
    {
      id: 2,
      copyId: 'C012',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      memberId: 'M005',
      memberName: 'Robert Brown',
      memberEmail: 'robert.brown@email.com',
      memberPhone: '+1-555-0105',
      issueDate: '2024-12-10',
      dueDate: '2024-12-24',
      daysOverdue: 12,
      fine: 12.00,
      lastNotified: '2024-12-25'
    },
    {
      id: 3,
      copyId: 'C018',
      title: 'Lord of the Flies',
      author: 'William Golding',
      memberId: 'M007',
      memberName: 'Emily Davis',
      memberEmail: 'emily.davis@email.com',
      memberPhone: '+1-555-0107',
      issueDate: '2024-12-05',
      dueDate: '2024-12-19',
      daysOverdue: 17,
      fine: 17.00,
      lastNotified: '2024-12-20'
    },
    {
      id: 4,
      copyId: 'C025',
      title: 'Brave New World',
      author: 'Aldous Huxley',
      memberId: 'M009',
      memberName: 'David Wilson',
      memberEmail: 'david.wilson@email.com',
      memberPhone: '+1-555-0109',
      issueDate: '2024-11-28',
      dueDate: '2024-12-12',
      daysOverdue: 24,
      fine: 24.00,
      lastNotified: '2024-12-13'
    }
  ];

  const filteredBooks = overdueBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.copyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFines = overdueBooks.reduce((sum, book) => sum + book.fine, 0);

  const sendReminder = (book) => {
    console.log('Sending reminder to:', book.memberName);
    alert(`Reminder sent to ${book.memberName} (Demo functionality)`);
  };

  const sendAllReminders = () => {
    console.log('Sending reminders to all overdue members');
    alert('Reminders sent to all overdue members (Demo functionality)');
  };

  const getDaysOverdueColor = (days) => {
    if (days <= 7) return 'text-yellow-600';
    if (days <= 14) return 'text-orange-600';
    return 'text-red-600';
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Overdue Books</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Search by book, member, or copy ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={sendAllReminders}
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-md transition-colors duration-300 hover:bg-red-700"
                >
                  Send All Reminders
                </button>
                <button className="px-6 py-3 border-2 border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white">
                  Export Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-800">{overdueBooks.length}</div>
                <div className="text-sm text-red-600">Overdue Books</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-800">
                  {Math.round(overdueBooks.reduce((sum, book) => sum + book.daysOverdue, 0) / overdueBooks.length)}
                </div>
                <div className="text-sm text-orange-600">Avg Days Late</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-800">${totalFines.toFixed(2)}</div>
                <div className="text-sm text-yellow-600">Total Fines</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-800">
                  {overdueBooks.filter(book => book.daysOverdue > 14).length}
                </div>
                <div className="text-sm text-blue-600">Critical (&gt;14 days)</div>
              </div>
            </div>

            {overdueBooks.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
                <h3 className="font-semibold text-red-800 mb-2">⚠ Attention Required</h3>
                <p className="text-red-700 text-sm">
                  {overdueBooks.length} books are overdue. Please follow up with members to ensure timely returns.
                  Total outstanding fines: ${totalFines.toFixed(2)}
                </p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Copy ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Book Details</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Member</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Days Overdue</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Fine</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Last Notified</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-mono text-sm font-medium text-gray-800">{book.copyId}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{book.title}</div>
                        <div className="text-sm text-gray-600">{book.author}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{book.memberName}</div>
                        <div className="text-sm text-gray-600">{book.memberId}</div>
                        <div className="text-xs text-gray-500">{book.memberEmail}</div>
                        <div className="text-xs text-gray-500">{book.memberPhone}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{book.dueDate}</td>
                      <td className="py-4 px-4">
                        <span className={`font-bold ${getDaysOverdueColor(book.daysOverdue)}`}>
                          {book.daysOverdue} days
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-red-600 font-medium">${book.fine.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{book.lastNotified}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => sendReminder(book)}
                            className="px-3 py-1 text-sm bg-yellow-600 text-white rounded transition-colors duration-300 hover:bg-yellow-700"
                          >
                            Remind
                          </button>
                          <Link 
                            to="/return-book" 
                            className="px-3 py-1 text-sm border border-green-600 text-green-600 rounded transition-all duration-300 hover:bg-green-600 hover:text-white"
                          >
                            Return
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBooks.length === 0 && searchTerm && (
              <div className="text-center py-8 text-gray-500">
                No overdue books found matching your search criteria.
              </div>
            )}

            {overdueBooks.length === 0 && (
              <div className="text-center py-8 text-green-600">
                🎉 Great! No books are currently overdue.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OverdueBooks;

