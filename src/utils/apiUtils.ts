import { isTokenExpired, refreshToken } from './tokenUtils';

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let userToken = localStorage.getItem('userToken');
  const refreshTokenValue = localStorage.getItem('refreshToken');

  if (!userToken || !refreshTokenValue) {
    throw new Error('No authentication tokens found');
  }

  // Check if token is expired or about to expire
  if (isTokenExpired(userToken)) {
    // Try to refresh the token
    const newToken = await refreshToken(userToken, refreshTokenValue);
    if (!newToken) {
      // If refresh failed, throw error
      throw new Error('Session expired. Please login again.');
    }
    // Update the token in localStorage
    localStorage.setItem('userToken', newToken);
    userToken = newToken;
  }

  // Add authorization header
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${userToken}`);

  // Return fetch with updated headers
  return fetch(url, {
    ...options,
    headers
  });
}; 