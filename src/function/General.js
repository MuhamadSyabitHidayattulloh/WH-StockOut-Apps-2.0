export const readFormatQRLocation = code => {
  const bunit = code.slice(2, 6);
  const line = code.slice(6, 16);
  const pos = code.slice(17, 26);
  const partNumber = code.slice(28, 41);

  const result = {
    bunit: bunit,
    line: line,
    pos: pos,
    partNumber: partNumber,
  };
  return result;
};

// Validation utilities
export const validateNPK = (npk) => {
  if (!npk || typeof npk !== 'string') {
    return { isValid: false, message: 'NPK is required' };
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(npk)) {
    return { isValid: false, message: 'NPK must contain only letters and numbers' };
  }
  
  if (npk.length < 3 || npk.length > 20) {
    return { isValid: false, message: 'NPK must be between 3 and 20 characters' };
  }
  
  return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (/\s/.test(password)) {
    return { isValid: false, message: 'Password must not contain spaces' };
  }
  
  if (password.length < 4) {
    return { isValid: false, message: 'Password must be at least 4 characters' };
  }
  
  return { isValid: true, message: '' };
};

export const validateEmail = (email) => {
  if (!email || email === '-') {
    return { isValid: true, message: '' }; // Optional field
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }
  
  return { isValid: true, message: '' };
};

export const validateRequiredField = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true, message: '' };
};

// API response handling utilities
export const handleApiResponse = (response, successMessage = 'Success') => {
  if (response.data && response.data.msg) {
    return {
      success: response.data.msg.includes('success') || response.data.msg.includes('Success'),
      message: response.data.msg,
      data: response.data.data || response.data
    };
  }
  
  return {
    success: true,
    message: successMessage,
    data: response.data
  };
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response?.data?.msg) {
    return {
      success: false,
      message: error.response.data.msg,
      status: error.response.status
    };
  }
  
  if (error.response?.status === 401) {
    return {
      success: false,
      message: 'Unauthorized access. Please login again.',
      status: 401
    };
  }
  
  if (error.response?.status === 404) {
    return {
      success: false,
      message: 'Service not found. Please check your connection.',
      status: 404
    };
  }
  
  return {
    success: false,
    message: 'Network error. Please check your connection.',
    status: error.response?.status || 500
  };
};
