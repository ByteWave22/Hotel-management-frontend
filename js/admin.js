class AdminAPI {
    // Get all users
    static async getAllUsers() {
        return await apiRequest('/Admin/users');
    }

    // Get user by ID
    static async getUserById(id) {
        return await apiRequest(`/Admin/users/${id}`);
    }

    // Assign role to user
    static async assignRole(userId, roleName) {
        return await apiRequest(`/Admin/users/${userId}/assign-role`, {
            method: 'POST',
            body: JSON.stringify({ roleName })
        });
    }

    // Remove role from user
    static async removeRole(userId, roleName) {
        return await apiRequest(`/Admin/users/${userId}/remove-role`, {
            method: 'POST',
            body: JSON.stringify({ roleName })
        });
    }

    // Get user roles
    static async getUserRoles(userId) {
        return await apiRequest(`/Admin/users/${userId}/roles`);
    }
}