import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Check if token will expire in the next 5 minutes
    return decoded.exp * 1000 < Date.now() + 5 * 60 * 1000;
  } catch {
    return true;
  }
};

export const refreshToken = async (currentToken: string, refreshToken: string): Promise<string | null> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/Auth/refresh-token`, {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}; 