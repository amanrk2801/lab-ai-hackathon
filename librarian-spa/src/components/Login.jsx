import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(formData.email, formData.password);
      console.log('Login successful:', response);
      navigate('/librarian-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative">
      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="text-gray-800 text-sm px-4 py-2 border border-gray-200 rounded-md bg-white transition-all duration-300 hover:border-gray-800"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h1>
          <p className="text-gray-600 text-sm">Access your library account</p>
        </div>

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="password" className="block mb-2 font-medium text-gray-800">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/forgot-password" 
            className="text-gray-800 text-sm hover:underline"
          >
            Forgot your password?
          </Link>

          <div className="my-6 text-center text-gray-600 text-sm">
            Don't have an account?
          </div>

          <Link 
            to="/register" 
            className="text-gray-800 text-sm font-medium hover:underline"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

