import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RackManagement = () => {
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRack, setSelectedRack] = useState(null);
  const [selectedRackBooks, setSelectedRackBooks] = useState([]);

  // Fetch racks on component mount
  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:3000/api/racks').then(r => r.json());
      setRacks(response || []);
    } catch (error) {
      console.error('Error fetching racks:', error);
      setError('Failed to load racks data.');
      setRacks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRackDetails = async (rackId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/racks/${rackId}`).then(r => r.json());
      setSelectedRackBooks(response.books || []);
    } catch (error) {
      console.error('Error fetching rack details:', error);
      setSelectedRackBooks([]);
    }
  };

  const filteredRacks = racks.filter(rack => {
    const rackNumber = rack.rack_number || '';
    const location = rack.location || '';
    
    return rackNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getOccupancyColor = (totalBooks, capacity) => {
    const percentage = (totalBooks / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOccupancyBgColor = (totalBooks, capacity) => {
    const percentage = (totalBooks / capacity) * 100;
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 75) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const totalOccupied = racks.reduce((sum, rack) => sum + (parseInt(rack.total_books) || 0), 0);
  const totalShelves = racks.reduce((sum, rack) => sum + (parseInt(rack.shelves) || 0), 0);
  const overCapacityRacks = racks.filter(rack => {
    const totalBooks = parseInt(rack.total_books) || 0;
    const capacity = parseInt(rack.capacity) || 1;
    return (totalBooks / capacity) >= 0.9;
  }).length;

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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Rack Management</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading rack data...</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Search by rack number or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-base transition-colors duration-300 focus:outline-none focus:border-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md transition-colors duration-300 hover:bg-gray-600">
                      Add New Rack
                    </button>
                    <button className="px-6 py-3 border-2 border-gray-800 bg-transparent text-gray-800 font-medium rounded-md transition-all duration-300 hover:bg-gray-800 hover:text-white">
                      Export Layout
                    </button>
                  </div>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-800">{racks.length}</div>
                <div className="text-sm text-blue-600">Total Racks</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-800">{totalOccupied}</div>
                <div className="text-sm text-green-600">Books Stored</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-800">{totalShelves}</div>
                <div className="text-sm text-purple-600">Total Shelves</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-800">{overCapacityRacks}</div>
                <div className="text-sm text-red-600">Near Capacity</div>
              </div>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {filteredRacks.map((rack) => {
                    const totalBooks = parseInt(rack.total_books) || 0;
                    const capacity = parseInt(rack.capacity) || 1;
                    const occupancyPercentage = (totalBooks / capacity) * 100;

                    return (
                      <div 
                        key={rack.rack_id} 
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedRack?.rack_id === rack.rack_id 
                            ? 'border-gray-800 bg-gray-50' 
                            : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                        onClick={() => {
                          setSelectedRack(rack);
                          fetchRackDetails(rack.rack_id);
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">Rack {rack.rack_number}</h3>
                            <p className="text-sm text-gray-600">{rack.location}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getOccupancyBgColor(totalBooks, capacity)} ${getOccupancyColor(totalBooks, capacity)}`}>
                            {occupancyPercentage.toFixed(0)}% Full
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Occupancy</span>
                            <span>{totalBooks}/{capacity}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                occupancyPercentage >= 90 ? 'bg-red-600' :
                                occupancyPercentage >= 75 ? 'bg-yellow-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Books by Status:</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Available: {rack.available_books || 0}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Issued: {rack.issued_books || 0}
                            </span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p>Shelves: {rack.shelves}</p>
                          <p>Available Space: {capacity - totalBooks} books</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {new Date(rack.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredRacks.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    No racks found matching your search criteria.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Rack Details Panel */}
          {selectedRack && (
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Rack {selectedRack.rack_number} - Detailed View
                </h2>
                <button 
                  onClick={() => {
                    setSelectedRack(null);
                    setSelectedRackBooks([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Rack Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-800">{selectedRack.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Capacity:</span>
                      <span className="text-gray-800">{selectedRack.capacity} books</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currently Occupied:</span>
                      <span className="text-gray-800">{selectedRack.total_books} books</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Space:</span>
                      <span className="text-gray-800">{selectedRack.capacity - selectedRack.total_books} books</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Shelves:</span>
                      <span className="text-gray-800">{selectedRack.shelves}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Book Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Books:</span>
                      <span className="text-green-800 font-medium">{selectedRack.available_books}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued Books:</span>
                      <span className="text-blue-800 font-medium">{selectedRack.issued_books}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupancy Rate:</span>
                      <span className="text-gray-800 font-medium">
                        {((selectedRack.total_books / selectedRack.capacity) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-800">{new Date(selectedRack.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-800">{new Date(selectedRack.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Books in this Rack</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Copy ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Title</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Author</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Shelf</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRackBooks.map((book) => (
                        <tr key={book.copy_id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm font-medium text-gray-800">{book.copy_id}</td>
                          <td className="py-3 px-4 font-medium text-gray-800">{book.title}</td>
                          <td className="py-3 px-4 text-gray-600">{book.author}</td>
                          <td className="py-3 px-4 text-gray-600">Shelf {book.shelf_number}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              book.status === 'available' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {book.status === 'available' ? 'Available' : 'Issued'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-sm border border-gray-800 text-gray-800 rounded transition-all duration-300 hover:bg-gray-800 hover:text-white">
                                Move
                              </button>
                              <Link 
                                to={`/edit-book/${book.book_id}`}
                                className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded transition-all duration-300 hover:bg-blue-600 hover:text-white"
                              >
                                Edit
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {selectedRackBooks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No books currently stored in this rack.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md transition-colors duration-300 hover:bg-gray-600">
                  Edit Rack Details
                </button>
                <button className="px-6 py-3 border-2 border-blue-600 bg-transparent text-blue-600 font-medium rounded-md transition-all duration-300 hover:bg-blue-600 hover:text-white">
                  Reorganize Books
                </button>
                <button className="px-6 py-3 border-2 border-red-600 bg-transparent text-red-600 font-medium rounded-md transition-all duration-300 hover:bg-red-600 hover:text-white">
                  Remove Rack
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RackManagement;

