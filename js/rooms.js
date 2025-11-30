class RoomsAPI {
    // Get all rooms
    static async getAllRooms() {
        try {
            console.log('🔄 RoomsAPI: Fetching all rooms...');
            const response = await apiRequest('/Rooms');
            console.log('✅ RoomsAPI: Rooms fetched successfully', response);
            return response;
        } catch (error) {
            console.error('❌ RoomsAPI: Failed to fetch rooms:', error);
            throw error;
        }
    }

    // Get room by ID
    static async getRoomById(id) {
        try {
            console.log(`🔄 RoomsAPI: Fetching room ${id}...`);
            const response = await apiRequest(`/Rooms/${id}`);
            return response;
        } catch (error) {
            console.error(`❌ RoomsAPI: Failed to fetch room ${id}:`, error);
            throw error;
        }
    }

    // Get available rooms
    static async getAvailableRooms(hotelId, checkIn, checkOut) {
        try {
            const params = new URLSearchParams({
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString()
            });
            console.log(`🔄 RoomsAPI: Fetching available rooms for hotel ${hotelId}...`);
            const response = await apiRequest(`/Rooms/available/${hotelId}?${params}`);
            return response;
        } catch (error) {
            console.error('❌ RoomsAPI: Failed to fetch available rooms:', error);
            throw error;
        }
    }
}