// API URL Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Ensure API URL is set globally
if (typeof window !== 'undefined') {
  (window as any).API_URL = API_URL;
}

export const getApiUrl = () => {
  return API_URL;
};
