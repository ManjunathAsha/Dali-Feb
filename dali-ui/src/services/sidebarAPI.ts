import axios from 'axios';
import { FilterResponse, FilterDocumentResponse, FilterParams } from '../data/interface';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

export const sidebarAPI = {
  // Fetch initial filters
  getFilters: async (collectionId: number): Promise<FilterResponse> => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${BASE_URL}/Document/collection/${collectionId}/filters`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw error;
    }
  },

  // Fetch filtered sections based on selected section IDs
  getFilteredSections: async (collectionId: number, sectionIds: number[]): Promise<FilterResponse> => {
    try {
      const headers = getAuthHeaders();
      const queryParams = sectionIds.map(id => `sectionIds=${id}`).join('&');
      const response = await axios.get(
        `${BASE_URL}/Document/collection/${collectionId}/sections/filters?${queryParams}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered sections:', error);
      throw error;
    }
  },

  // Fetch filtered documents based on selected filters
  getFilteredDocuments: async (collectionId: number, filterParams: FilterParams): Promise<FilterDocumentResponse> => {
    try {
      const headers = getAuthHeaders();
      const queryParams = Object.entries(filterParams)
        .flatMap(([key, values]: [string, number[]]) => 
          values.map((value: number) => `${key}=${value}`))
        .join('&');
      
      const response = await axios.get(
        `${BASE_URL}/Document/collection/${collectionId}/filtered-documents?${queryParams}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered documents:', error);
      throw error;
    }
  },

  // Fetch document files
  getDocumentFiles: async (documentId: string): Promise<any> => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${BASE_URL}/DocumentDetails/files/${documentId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching document files:', error);
      throw error;
    }
  },

  // Fetch document links
  getDocumentLinks: async (documentId: string): Promise<any> => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${BASE_URL}/DocumentDetails/links/${documentId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching document links:', error);
      throw error;
    }
  }
}; 