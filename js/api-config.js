// API Configuration
const API_BASE_URL = 'https://cozyhotel.runasp.net/api';
const STRIPE_PUBLISHABLE_KEY = "pk_test_REPLACE_ME";

// Auth token management
class AuthService {
    static getToken() {
        return localStorage.getItem('authToken');
    }

    static setToken(token) {
        localStorage.setItem('authToken', token);
    }

    static removeToken() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    static getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    static setUserData(userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static isAdmin() {
        const userData = this.getUserData();
        return userData && userData.roles && userData.roles.includes('Admin');
    }

    static async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getToken();
        
        const defaultOptions = {
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (response.status === 401) {
            this.removeToken();
            window.location.href = 'login.html';
            throw new Error('Authentication required');
        }
        
        return response;
    }
}

// Common API request function
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    try {
        const response = await AuthService.makeAuthenticatedRequest(url, options);
        
        console.log(`📨 API Response: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                console.error('❌ API Error details:', errorData);
            } catch (e) {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        // Check if response has content
        const contentLength = response.headers.get('content-length');
        if (contentLength === '0' || response.status === 204) {
            return null;
        }
        
        const result = await response.json();
        console.log('✅ API Success:', result);
        return result;
    } catch (error) {
        console.error('❌ API request failed:', error);
        throw error;
    }
}

// Utility function for public requests (no auth required)
async function publicApiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`🌐 Public API Request: ${options.method || 'GET'} ${url}`);
    
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        console.log(`📨 Public API Response: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                console.error('❌ Public API Error details:', errorData);
            } catch (e) {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        console.log('✅ Public API Success:', result);
        return result;
    } catch (error) {
        console.error('❌ Public API request failed:', error);
        throw error;
    }
}