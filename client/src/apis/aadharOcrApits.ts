import api from './api';
import { toast } from 'react-toastify';

export const getAadhaarDetails = async (data: { img1: File; img2: File }) => {
  try {
    const formData = new FormData();
    console.log("data  :   ", data.img1, data.img2);

    formData.append('img1', data.img1);
    formData.append('img2', data.img2);

    const response = await api.post('/api/aadhaar', formData);
    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.');
    } else {
      const errorMessage = error.response?.data?.message || 'Failed to extract Aadhaar details';
      toast.error(errorMessage);
    }
    throw error;
  }
};