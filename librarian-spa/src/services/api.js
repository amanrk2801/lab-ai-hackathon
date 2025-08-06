// API service for Library Management System

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to get headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Helper method to handle responses
  async handleResponse(response) {
    if (!response.ok) {
      // If unauthorized, clear token
      if (response.status === 401 || response.status === 403) {
        this.logout();
      }
      
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  }

  // Authentication methods
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse(response);
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('authToken', data.token);
    }

    return data;
  }

  async register(email, password, role = 'librarian') {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password, role }),
    });

    return this.handleResponse(response);
  }

  async verifyToken() {
    if (!this.token) return { valid: false };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      this.logout();
      return { valid: false };
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Books methods
  async getBooks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/books?${queryString}`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async getBook(id) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async addBook(bookData) {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(bookData),
    });

    return this.handleResponse(response);
  }

  async updateBook(id, bookData) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(bookData),
    });

    return this.handleResponse(response);
  }

  async deleteBook(id) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getBookCategories() {
    const response = await fetch(`${API_BASE_URL}/books/categories`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async getBookLanguages() {
    const response = await fetch(`${API_BASE_URL}/books/languages`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  // Members methods
  async getMembers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/members?${queryString}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getMember(id) {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async addMember(memberData) {
    const response = await fetch(`${API_BASE_URL}/members`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(memberData),
    });

    return this.handleResponse(response);
  }

  async updateMember(id, memberData) {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(memberData),
    });

    return this.handleResponse(response);
  }

  async deleteMember(id) {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getMemberStats() {
    const response = await fetch(`${API_BASE_URL}/members/stats/overview`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Issues methods
  async getIssues(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/issues?${queryString}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getIssue(id) {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async issueBook(issueData) {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(issueData),
    });

    return this.handleResponse(response);
  }

  async returnBook(issueId, returnData) {
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/return`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(returnData),
    });

    return this.handleResponse(response);
  }

  async updateIssue(id, issueData) {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(issueData),
    });

    return this.handleResponse(response);
  }

  async getOverdueBooks() {
    const response = await fetch(`${API_BASE_URL}/issues/overdue`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async getIssueStats() {
    const response = await fetch(`${API_BASE_URL}/issues/stats/overview`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Payments methods
  async getPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/payments?${queryString}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getPayment(id) {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async recordPayment(paymentData) {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(paymentData),
    });

    return this.handleResponse(response);
  }

  async updatePayment(id, paymentData) {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(paymentData),
    });

    return this.handleResponse(response);
  }

  async deletePayment(id) {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getPaymentReports(dateRange = 'month') {
    const response = await fetch(`${API_BASE_URL}/payments/reports/summary?date_range=${dateRange}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getMemberPaymentStatus(memberId) {
    const response = await fetch(`${API_BASE_URL}/payments/members/${memberId}/status`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Racks methods
  async getRacks() {
    const response = await fetch(`${API_BASE_URL}/racks`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getRack(id) {
    const response = await fetch(`${API_BASE_URL}/racks/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async addRack(rackData) {
    const response = await fetch(`${API_BASE_URL}/racks`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(rackData),
    });

    return this.handleResponse(response);
  }

  async updateRack(id, rackData) {
    const response = await fetch(`${API_BASE_URL}/racks/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(rackData),
    });

    return this.handleResponse(response);
  }

  async deleteRack(id) {
    const response = await fetch(`${API_BASE_URL}/racks/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getRackUtilization() {
    const response = await fetch(`${API_BASE_URL}/racks/stats/utilization`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Book copies methods
  async getCopies(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/copies?${queryString}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getCopy(id) {
    const response = await fetch(`${API_BASE_URL}/copies/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async addCopy(copyData) {
    const response = await fetch(`${API_BASE_URL}/copies`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(copyData),
    });

    return this.handleResponse(response);
  }

  async updateCopy(id, copyData) {
    const response = await fetch(`${API_BASE_URL}/copies/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(copyData),
    });

    return this.handleResponse(response);
  }

  async deleteCopy(id) {
    const response = await fetch(`${API_BASE_URL}/copies/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getAvailableCopies(bookId) {
    const response = await fetch(`${API_BASE_URL}/copies/book/${bookId}/available`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }
}

export default new ApiService();
