import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import LibrarianDashboard from './components/LibrarianDashboard';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import AddBookCopy from './components/AddBookCopy';
import BooksCatalog from './components/BooksCatalog';
import BooksCopiesManagement from './components/BooksCopiesManagement';
import IssueBook from './components/IssueBook';
import ReturnBook from './components/ReturnBook';
import IssueHistory from './components/IssueHistory';
import OverdueBooks from './components/OverdueBooks';
import AddMember from './components/AddMember';
import UserManagement from './components/UserManagement';
import CollectPayment from './components/CollectPayment';
import MemberPaymentStatus from './components/MemberPaymentStatus';
import PaymentReports from './components/PaymentReports';
import RackManagement from './components/RackManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/edit-book/:id" element={<EditBook />} />
          <Route path="/add-book-copy" element={<AddBookCopy />} />
          <Route path="/books-catalog" element={<BooksCatalog />} />
          <Route path="/books-copies-management" element={<BooksCopiesManagement />} />
          <Route path="/issue-book" element={<IssueBook />} />
          <Route path="/return-book" element={<ReturnBook />} />
          <Route path="/issue-history" element={<IssueHistory />} />
          <Route path="/overdue-books" element={<OverdueBooks />} />
          <Route path="/add-member" element={<AddMember />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/collect-payment" element={<CollectPayment />} />
          <Route path="/member-payment-status" element={<MemberPaymentStatus />} />
          <Route path="/payment-reports" element={<PaymentReports />} />
          <Route path="/rack-management" element={<RackManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

