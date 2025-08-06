import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (email) {
      console.log('Password reset request for:', email);
      alert('Password reset functionality will be implemented with backend integration');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative">
      <div className="absolute top-8 left-8">
        <Link 
          to="/login" 
          className="text-gray-800 text-sm px-4 py-2 border border-gray-200 rounded-md bg-white transition-all duration-300 hover:border-gray-800"
        >
          ← Back to Sign In
        </Link>
      </div>

      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600 text-sm">
            Enter your email address and we'll send you a link to reset your password
          </p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-gray-800 text-white border-none rounded-md text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-gray-600"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/login" 
            className="text-gray-800 text-sm hover:underline"
          >
            Remember your password? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

