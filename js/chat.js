class ChatAPI {
    // Send message to chat bot
    static async sendMessage(message) {
        return await apiRequest('/Chat/message', {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    }

    // Get chat status
    static async getChatStatus() {
        return await apiRequest('/Chat/status');
    }

    // Get available commands
    static async getChatCommands() {
        return await apiRequest('/Chat/commands');
    }
}