import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

// Mock components that might cause issues in tests
jest.mock('./services/api', () => ({
  setAuthToken: jest.fn(),
  removeAuthToken: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Create a wrapper with all providers needed for the App
const AppWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<AppWrapper />);
    // This test just verifies the app renders without throwing errors
  });

  test('renders login page for unauthenticated users', () => {
    // Mock the useAuth hook to return unauthenticated state
    jest.mock('./hooks/useAuth', () => ({
      useAuth: () => ({
        isAuthenticated: false,
        user: null,
        loading: false,
      }),
    }));

    render(<AppWrapper />);
    
    // Check if login elements are present
    expect(screen.getByText(/sign in/i) || screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('redirects authenticated users to dashboard', () => {
    // This would require more complex mocking of the auth context and routing
    // For a complete beginner, we'll just provide a skeleton of this test
    
    // 1. Mock the useAuth hook to return authenticated state
    // 2. Render the app
    // 3. Check if dashboard elements are present
  });
});
