# Library Management System - React SPA

A modern, responsive Single Page Application (SPA) built with React and Vite for comprehensive library management operations.

## Features

### Core Functionality
- **User Authentication**: Secure login system for librarians
- **Book Management**: Add, edit, and manage book catalog
- **Member Management**: Register and manage library members
- **Book Circulation**: Issue and return books with tracking
- **Payment Processing**: Collect payments and manage fines
- **Reporting**: Comprehensive reports and analytics

### Key Pages
- **Home Page**: Landing page with system overview
- **Login/Register**: User authentication
- **Librarian Dashboard**: Central control panel
- **Book Catalog**: Browse and search books
- **Issue/Return Books**: Circulation management
- **Member Management**: User administration
- **Payment Reports**: Financial tracking
- **Rack Management**: Physical organization

## Technology Stack

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM 7.1.3
- **State Management**: Zustand 5.0.7
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Project Structure

```
librarian-spa/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── LibrarianDashboard.jsx
│   │   ├── AddBook.jsx
│   │   ├── EditBook.jsx
│   │   ├── BooksCatalog.jsx
│   │   ├── IssueBook.jsx
│   │   ├── ReturnBook.jsx
│   │   ├── AddMember.jsx
│   │   ├── UserManagement.jsx
│   │   ├── CollectPayment.jsx
│   │   ├── PaymentReports.jsx
│   │   ├── RackManagement.jsx
│   │   ├── IssueHistory.jsx
│   │   ├── OverdueBooks.jsx
│   │   └── ...
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── dist/                 # Production build
├── package.json
├── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation
1. Extract the project files
2. Navigate to the project directory:
   ```bash
   cd librarian-spa
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Development
Start the development server:
```bash
pnpm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
Build for production:
```bash
pnpm run build
```
The built files will be in the `dist/` directory.

### Preview Production Build
Preview the production build locally:
```bash
pnpm run preview
```

## Usage

### Demo Credentials
For testing purposes, use these credentials:
- **Email**: librarian@library.com
- **Password**: password123

### Navigation
- **Home Page**: Overview of the library system
- **Sign In**: Access the librarian dashboard
- **Dashboard**: Central hub for all operations
- **Quick Actions**: Common tasks like issuing books, adding members
- **Management Tools**: Advanced features like user management, reports

### Key Features

#### Book Management
- Add new books with complete metadata
- Edit existing book information
- Manage book copies and inventory
- Track book locations (rack/shelf)

#### Member Management
- Register new library members
- View and edit member information
- Track membership status and payments
- Manage member permissions

#### Circulation
- Issue books to members
- Process book returns
- Track overdue books
- Generate circulation reports

#### Financial Management
- Collect payments and fines
- Generate payment reports
- Track revenue and transactions
- Monitor outstanding dues

## Design Features

### Responsive Design
- Mobile-first approach
- Optimized for desktop, tablet, and mobile
- Touch-friendly interface elements

### User Experience
- Intuitive navigation
- Consistent design language
- Clear visual hierarchy
- Accessible color schemes

### Performance
- Fast loading with Vite
- Optimized bundle size
- Efficient routing
- Minimal dependencies

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

### Code Organization
- Components are organized by functionality
- Consistent naming conventions
- Modular architecture
- Reusable UI components

### Styling
- Tailwind CSS for utility-first styling
- Consistent color palette
- Responsive breakpoints
- Custom component styles

### State Management
- Zustand for lightweight state management
- Local component state for UI interactions
- Persistent authentication state

## Deployment

### Static Hosting
The built application can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

### Build Output
The `dist/` folder contains all necessary files for deployment:
- `index.html` - Main HTML file
- `assets/` - CSS and JavaScript bundles
- Static assets

## Contributing

### Development Workflow
1. Make changes to source files
2. Test in development mode
3. Build for production
4. Test the production build
5. Deploy

### Code Style
- Use consistent indentation (2 spaces)
- Follow React best practices
- Use meaningful component and variable names
- Add comments for complex logic

## License

This project is created for educational and demonstration purposes.

## Support

For issues or questions about the application:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure you're using a supported browser
4. Check the network tab for failed requests

---

**Built with ❤️ using React and Vite**

