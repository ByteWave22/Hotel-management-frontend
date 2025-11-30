class BookingsAPI {
    // Create booking
    static async createBooking(bookingData) {
        return await apiRequest('/Bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    // Get user's bookings
    static async getMyBookings() {
        return await apiRequest('/Bookings/my-bookings');
    }

    // Get booking by ID
    static async getBookingById(id) {
        return await apiRequest(`/Bookings/${id}`);
    }

    // Cancel booking
    static async cancelBooking(id) {
        return await apiRequest(`/Bookings/${id}/cancel`, {
            method: 'PUT'
        });
    }

    // Update booking status
    static async updateBookingStatus(id, status) {
        return await apiRequest(`/Bookings/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify(status)
        });
    }

    // Admin: Get all bookings
    static async getAllBookings(status = '') {
        const endpoint = status ? `/Admin/bookings?status=${status}` : '/Admin/bookings';
        return await apiRequest(endpoint);
    }

    // Admin: Approve booking
    static async approveBooking(id) {
        return await apiRequest(`/Admin/bookings/${id}/approve`, {
            method: 'PUT'
        });
    }

    // Admin: Reject booking
    static async rejectBooking(id) {
        return await apiRequest(`/Admin/bookings/${id}/reject`, {
            method: 'PUT'
        });
    }

    // Admin: Complete booking
    static async completeBooking(id) {
        return await apiRequest(`/Admin/bookings/${id}/complete`, {
            method: 'PUT'
        });
    }
}