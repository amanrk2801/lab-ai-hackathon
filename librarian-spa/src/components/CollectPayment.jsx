import { useState, useEffect } from 'react';

const CollectPayment = () => {
  const [membersWithDues, setMembersWithDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentType, setPaymentType] = useState('fine');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch members with dues on component mount
  useEffect(() => {
    fetchMembersWithDues();
  }, []);

  const fetchMembersWithDues = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:3000/api/members').then(r => r.json());
      const members = response.members || [];
      
      // Filter members who have outstanding fines or overdue books
      const membersWithOutstandingDues = members.filter(member => 
        parseFloat(member.total_fines || 0) > 0 || parseInt(member.books_overdue || 0) > 0
      );
      
      setMembersWithDues(membersWithOutstandingDues);
    } catch (error) {
      console.error('Error fetching members with dues:', error);
      setError('Failed to load members with outstanding payments.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = membersWithDues.filter(member => 
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.member_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayment = (member) => {
    setSelectedMember(member);
    setPaymentAmount((parseFloat(member.total_fines || 0)).toFixed(2));
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMember || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    setPaymentLoading(true);
    setError('');

    try {
      const paymentData = {
        member_id: selectedMember.member_id,
        amount: parseFloat(paymentAmount),
        payment_type: paymentType,
        payment_method: paymentMethod,
        notes: paymentNotes
      };

      const response = await fetch('http://localhost:3000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }

      alert(`Payment of ₹${paymentAmount} processed successfully!`);
      setSelectedMember(null);
      setShowPaymentModal(false);
      setPaymentAmount('');
      setPaymentMethod('cash');
      setPaymentType('fine');
      setPaymentNotes('');
      
      // Refresh the members list
      await fetchMembersWithDues();
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const totalOutstanding = membersWithDues.reduce((sum, member) => sum + (parseFloat(member.total_fines || 0)), 0);
  const totalLateFees = totalOutstanding; // In our system, all fines are late fees
  const overdueMembers = membersWithDues.filter(member => parseInt(member.books_overdue || 0) > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-gray-800">
              Library Management System
            </div>
            <button 
              onClick={() => window.history.back()}
              className="text-gray-800 px-4 py-2 border border-gray-200 rounded-md transition-all duration-300 hover:border-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-5">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-xl mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Collect Payment</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading members with outstanding payments...</div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search by member name, email, or member ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-800">{membersWithDues.length}</div>
                    <div className="text-sm text-red-600">Members with Dues</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-800">₹{totalOutstanding.toFixed(2)}</div>
                    <div className="text-sm text-yellow-600">Total Outstanding</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-800">
                      {overdueMembers}
                    </div>
                    <div className="text-sm text-orange-600">Overdue Members</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-800">
                      ₹{totalLateFees.toFixed(2)}
                    </div>
                    <div className="text-sm text-blue-600">Late Fees</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Member</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Contact</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Books Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Outstanding Fines</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Last Activity</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => {
                        const totalFines = parseFloat(member.total_fines || 0);
                        const booksIssued = parseInt(member.books_issued || 0);
                        const booksOverdue = parseInt(member.books_overdue || 0);
                        
                        return (
                          <tr key={member.member_id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="font-medium text-gray-800">
                                {member.first_name} {member.last_name}
                              </div>
                              <div className="text-sm text-gray-600">ID: {member.member_id}</div>
                              {booksOverdue > 0 && (
                                <div className="text-xs text-red-600">
                                  {booksOverdue} overdue book{booksOverdue > 1 ? 's' : ''}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-600">{member.email}</div>
                              <div className="text-sm text-gray-600">{member.phone}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mr-1">
                                  {booksIssued} issued
                                </span>
                                {booksOverdue > 0 && (
                                  <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                    {booksOverdue} overdue
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {totalFines > 0 ? (
                                <span className="text-red-600 font-bold text-lg">₹{totalFines.toFixed(2)}</span>
                              ) : (
                                <span className="text-gray-400">No fines</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-600">
                                {member.last_activity 
                                  ? new Date(member.last_activity).toLocaleDateString()
                                  : 'No activity'
                                }
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <button 
                                onClick={() => handlePayment(member)}
                                className="px-4 py-2 bg-green-600 text-white rounded transition-colors duration-300 hover:bg-green-700"
                                disabled={totalFines <= 0}
                              >
                                Collect Payment
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredMembers.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-gray-500">
                    No members found matching your search criteria.
                  </div>
                )}

                {membersWithDues.length === 0 && !loading && (
                  <div className="text-center py-8 text-green-600">
                    🎉 Great! No outstanding payments at this time.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Collect Payment</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {selectedMember.first_name} {selectedMember.last_name}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Member ID: {selectedMember.member_id}</div>
                    <div>Email: {selectedMember.email}</div>
                    <div>Phone: {selectedMember.phone}</div>
                    <div className="text-red-600 font-semibold mt-2">
                      Total Outstanding: ₹{parseFloat(selectedMember.total_fines).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={parseFloat(selectedMember.total_fines)}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Maximum: ₹{parseFloat(selectedMember.total_fines).toFixed(2)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select payment method</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type *
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select payment type</option>
                    <option value="fine">Late Fee/Fine</option>
                    <option value="membership_fee">Membership Fee</option>
                    <option value="replacement_fee">Book Replacement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={paymentLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {paymentLoading ? 'Processing...' : 'Collect Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectPayment;