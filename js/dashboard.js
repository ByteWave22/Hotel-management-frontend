class DashboardAPI {
    // User stats
    static async getUserStats() {
        return await apiRequest('/Dashboard/user/stats');
    }

    // User recent bookings
    static async getUserRecentBookings(count = 5) {
        return await apiRequest(`/Dashboard/user/recent-bookings?count=${count}`);
    }

    // User upcoming bookings
    static async getUserUpcomingBookings() {
        return await apiRequest('/Dashboard/user/upcoming-bookings');
    }

    // User spending summary
    static async getUserSpendingSummary() {
        return await apiRequest('/Dashboard/user/spending-summary');
    }

    // Admin stats
    static async getAdminStats() {
        return await apiRequest('/Dashboard/admin/stats');
    }

    // Admin recent bookings
    static async getAdminRecentBookings(count = 10) {
        return await apiRequest(`/Dashboard/admin/recent-bookings?count=${count}`);
    }

    // Admin revenue by month
    static async getAdminRevenueByMonth(year = new Date().getFullYear()) {
        return await apiRequest(`/Dashboard/admin/revenue-by-month?year=${year}`);
    }

    // Admin room type stats
    static async getAdminRoomTypeStats() {
        return await apiRequest('/Dashboard/admin/room-type-stats');
    }

    // Admin booking status summary
    static async getAdminBookingStatusSummary() {
        return await apiRequest('/Dashboard/admin/booking-status-summary');
    }

    // Admin top customers
    static async getAdminTopCustomers(count = 10) {
        return await apiRequest(`/Dashboard/admin/top-customers?count=${count}`);
    }
}