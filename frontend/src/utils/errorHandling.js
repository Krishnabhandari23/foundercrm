export const handleAPIError = (error, context = '') => {
  let message = 'An error occurred';
  let code = 'UNKNOWN_ERROR';
  let details = null;
  
  if (error.response) {
    const { status, data } = error.response;
    
    // Handle validation errors
    if (status === 422 && data.detail) {
      message = Array.isArray(data.detail) 
        ? data.detail.map(e => e.msg).join('. ')
        : data.detail;
      code = 'VALIDATION_ERROR';
      details = data.detail;
    }
    
    // Handle rate limiting
    else if (status === 429) {
      message = 'Too many requests. Please try again later.';
      code = 'RATE_LIMIT';
      details = {
        retryAfter: error.response.headers['retry-after']
      };
    }
    
    // Handle unauthorized
    else if (status === 401) {
      message = 'Please log in again to continue.';
      code = 'UNAUTHORIZED';
    }
    
    // Handle forbidden
    else if (status === 403) {
      message = 'You do not have permission to perform this action.';
      code = 'FORBIDDEN';
    }
    
    // Handle not found
    else if (status === 404) {
      message = 'The requested resource was not found.';
      code = 'NOT_FOUND';
    }
    
    // Handle server errors
    else if (status >= 500) {
      message = 'Server error. Please try again later.';
      code = 'SERVER_ERROR';
    }
  }
  
  // Network errors
  else if (error.request) {
    message = 'Network error. Please check your connection.';
    code = 'NETWORK_ERROR';
  }
  
  return {
    message,
    code,
    context,
    details,
    originalError: error
  };
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isValidationError = (error) => {
  return error.response?.status === 422;
};

export const isAuthError = (error) => {
  return error.response?.status === 401;
};

export const extractValidationErrors = (error) => {
  if (!isValidationError(error)) return {};
  
  const details = error.response.data.detail;
  if (!Array.isArray(details)) return {};
  
  return details.reduce((acc, error) => {
    acc[error.loc[error.loc.length - 1]] = error.msg;
    return acc;
  }, {});
};