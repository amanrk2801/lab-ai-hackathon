import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AddMember = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    date_of_birth: '',
    membership_type: 'standard',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('Please fill in all required fields (first name, last name, email)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.addMember(formData);
      alert('Member added successfully!');
      navigate('/user-management');
    } catch (error) {
      console.error('Error adding member:', error);
      setError(error.message || 'Failed to add member. Please try again.');
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Member</h1>
              <p className="text-gray-600 text-lg">
                Register a new library member
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
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="first_name" className="block mb-2 font-medium text-gray-800">
                      First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block mb-2 font-medium text-gray-800">
                      Last Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-800">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium text-gray-800">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="date_of_birth" className="block mb-2 font-medium text-gray-800">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="membership_type" className="block mb-2 font-medium text-gray-800">
                      Membership Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="membership_type"
                      name="membership_type"
                      value={formData.membership_type}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800"
                      required
                    >
                      <option value="standard">Standard ($20/year)</option>
                      <option value="premium">Premium ($50/year)</option>
                      <option value="student">Student ($10/year)</option>
                      <option value="senior">Senior ($15/year)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                  Address Information
                </h2>
                
                <div className="mb-6">
                  <label htmlFor="address" className="block mb-2 font-medium text-gray-800">
                    Street Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter street address"
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label htmlFor="city" className="block mb-2 font-medium text-gray-800">
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block mb-2 font-medium text-gray-800">
                      State <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="zip_code" className="block mb-2 font-medium text-gray-800">
                      ZIP Code <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="zip_code"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                      placeholder="Enter ZIP code"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                  Emergency Contact
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="emergency_contact_name" className="block mb-2 font-medium text-gray-800">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                      placeholder="Enter emergency contact name"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="emergency_contact_phone" className="block mb-2 font-medium text-gray-800">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      id="emergency_contact_phone"
                      name="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                      placeholder="Enter emergency contact phone"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="notes" className="block mb-2 font-medium text-gray-800">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes about the member"
                    rows="3"
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400 resize-y min-h-20"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Membership Benefits</h3>
                <div className="text-sm text-blue-700">
                  <p>• Borrow up to 5 books at once</p>
                  <p>• 14-day loan period with 2 renewals</p>
                  <p>• Access to digital resources</p>
                  <p>• Free holds and reservations</p>
                  <p>• Member-only events and programs</p>
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
                  {loading ? 'Adding Member...' : 'Add Member'}
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

export default AddMember;

