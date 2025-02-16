// API URL Configuration
const isProd = process.env.NODE_ENV === 'production';
export const API_URL = isProd 
  ? 'http://185.84.140.118:8080/api'
  : (process.env.REACT_APP_API_URL || 'http://localhost:8080/api');

// Log environment info for debugging
console.log('Environment:', {
  nodeEnv: process.env.NODE_ENV,
  apiUrl: API_URL,
  isProd
});

// Ensure API URL is set globally
if (typeof window !== 'undefined') {
  (window as any).API_URL = API_URL;
}

export const getApiUrl = () => {
  return API_URL;
};
