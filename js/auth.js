class AuthAPI {
    // Register new user
    static async register(userData) {
        const response = await publicApiRequest('/Auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        return response;
    }

    // Login user
    static async login(credentials) {
        const response = await publicApiRequest('/Auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.success && response.token) {
            AuthService.setToken(response.token);
            AuthService.setUserData(response);
        }
        
        return response;
    }

    // Verify OTP
    static async verifyOtp(otpData) {
        const response = await publicApiRequest('/Auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify(otpData)
        });
        
        if (response.success && response.token) {
            AuthService.setToken(response.token);
            AuthService.setUserData(response);
        }
        
        return response;
    }

    // Resend OTP
    static async resendOtp(email) {
        return await publicApiRequest('/Auth/resend-otp', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    // Forgot password
    static async forgotPassword(email) {
        return await publicApiRequest('/Auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    // Reset password
    static async resetPassword(resetData) {
        return await publicApiRequest('/Auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(resetData)
        });
    }

    // Logout
    static logout() {
        AuthService.removeToken();
        window.location.href = 'index.html';
    }
}