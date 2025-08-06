import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.register(formData.email, formData.password, 'librarian');
      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 relative">
      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="text-gray-800 text-sm px-4 py-2 border border-gray-200 rounded-md bg-white transition-all duration-300 hover:border-gray-800"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-xl w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Join Library</h1>
          <p className="text-gray-600 text-sm">Create your library account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="firstName" className="block mb-2 font-medium text-gray-800">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-2 font-medium text-gray-800">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium text-gray-800">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block mb-2 font-medium text-gray-800">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="address" className="block mb-2 font-medium text-gray-800">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium text-gray-800">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-800">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 text-white border-none rounded-md text-base font-medium cursor-pointer transition-colors duration-300 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-800 hover:bg-gray-600'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="text-gray-600 text-sm mb-4">
            Already have an account?
          </div>
          <Link 
            to="/login" 
            className="text-gray-800 text-sm font-medium hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

