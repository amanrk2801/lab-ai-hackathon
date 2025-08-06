import { useState } from 'react';
import apiService from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Not tested');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing...');
    
    try {
      // Test basic API connection
      const response = await fetch('http://localhost:3000/health');
      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Backend Connected - ${data.status}`);
      } else {
        setStatus('❌ Backend not responding');
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setStatus('Testing authentication...');
    
    try {
      // Try to verify token (should fail if not logged in)
      const result = await apiService.verifyToken();
      if (result.valid) {
        setStatus('✅ Authentication working - User logged in');
      } else {
        setStatus('⚠️ Authentication working - No user logged in');
      }
    } catch (error) {
      setStatus(`❌ Auth test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 mr-2"
          >
            Test Backend Connection
          </button>
          
          <button
            onClick={testAuth}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Test Authentication
          </button>
        </div>
        
        <div className="p-3 bg-gray-100 rounded border">
          <strong>Status:</strong> {status}
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;
