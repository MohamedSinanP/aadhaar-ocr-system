import api from './api';
import { toast } from 'react-toastify';

export const getAadhaarDetails = async (data: { img1: File; img2: File }) => {
  try {
    if (!data.img1 || !data.img2) {
      throw new Error('Both front and back images are required.');
    }

    const formData = new FormData();
    console.log("data  :   ", data.img1, data.img2);

    formData.append('img1', data.img1);
    formData.append('img2', data.img2);

    const response = await api.post('/api/aadhaar', formData);
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Failed to extract Aadhaar details. Please try again.';

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please check your internet connection and try again.';
    } else if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred.';

      if (status === 400) {
        errorMessage = message;
      } else if (status === 500) {
        errorMessage = 'Server error. Please try again later or contact support.';
      } else {
        errorMessage = `Error ${status}: ${message}`;
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your internet connection and try again.';
    }

    console.error('API error:', error.message, error.stack);
    toast.error(errorMessage, { autoClose: 5000 });
    throw new Error(errorMessage);
  }
};