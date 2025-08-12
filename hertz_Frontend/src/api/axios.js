import axios from "axios";

// ✅ Create axios instance with base configuration
const api = axios.create({
  baseURL:
    import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1",
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging (remove in production)
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    });

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor to handle common responses and errors
api.interceptors.response.use(
  (response) => {
    // Log successful response for debugging (remove in production)
    console.log(
      `[API Response] ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`,
      {
        status: response.status,
        data: response.data,
      }
    );

    return response;
  },
  (error) => {
    // Log error for debugging
    console.error("[API Response Error]", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.warn(
            "[Auth Error] Token expired or invalid, redirecting to login..."
          );

          // Clear stored auth data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");

          // Redirect to login page (adjust path as needed)
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;

        case 403:
          // Forbidden - insufficient permissions
          console.warn("[Auth Error] Insufficient permissions");
          alert("You do not have permission to perform this action.");
          break;

        case 404:
          // Not found
          console.warn("[API Error] Resource not found");
          break;

        case 409:
          // Conflict - usually duplicate data
          console.warn("[API Error] Conflict - resource already exists");
          break;

        case 422:
          // Validation error
          console.warn("[API Error] Validation failed");
          break;

        case 500:
          // Server error
          console.error("[Server Error] Internal server error");
          alert("Server error occurred. Please try again later.");
          break;

        default:
          console.error(
            `[API Error] HTTP ${status}:`,
            data?.message || error.message
          );
      }

      // Return a properly formatted error object
      const errorMessage = data?.message || `HTTP ${status} Error`;
      const errorObject = new Error(errorMessage);
      errorObject.status = status;
      errorObject.data = data;

      return Promise.reject(errorObject);
    } else if (error.request) {
      // Network error - no response received
      console.error("[Network Error] No response received from server");
      alert(
        "Network error. Please check your internet connection and try again."
      );
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    } else {
      // Other error
      console.error("[API Error] Request setup error:", error.message);
      return Promise.reject(error);
    }
  }
);

// ✅ Helper functions for common API operations

/**
 * Set authentication token for future requests
 * @param {string} token - JWT access token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("accessToken");
    delete api.defaults.headers.common["Authorization"];
  }
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  delete api.defaults.headers.common["Authorization"];
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} - User object or null
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

/**
 * Store user data in localStorage
 * @param {Object} user - User object
 */
export const setCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// ✅ API endpoint helpers for common operations

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post("/auth/refresh-token"),
  getCurrentUser: () => api.get("/auth/me"),
};

export const categoriesAPI = {
  getAll: (params = {}) => api.get("/categories", { params }),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post("/categories", data),
  update: (slug, data) => api.put(`/categories/${slug}`, data),
  delete: (slug) => api.delete(`/categories/${slug}`),

  // Subcategory operations
  getSubcategories: (categoryId) =>
    api.get(`/categories/${categoryId}/subcategories`),
  addSubcategory: (categoryId, data) =>
    api.post(`/categories/${categoryId}/subcategories`, data),
  updateSubcategory: (categoryId, subcategoryId, data) =>
    api.put(`/categories/${categoryId}/subcategories/${subcategoryId}`, data),
  deleteSubcategory: (categoryId, subcategoryId) =>
    api.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`),
};

// Export the configured axios instance as default
export default api;
