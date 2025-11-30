class PaymentAPI {
    // Create payment intent
    static async createPaymentIntent(paymentData) {
        return await apiRequest('/Payment/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    // Process card payment
    static async processCardPayment(paymentIntentId) {
        return await apiRequest(`/Payment/process-card-payment?PaymentIntentId=${paymentIntentId}`, {
            method: 'POST'
        });
    }

    // Check payment status
    static async checkPaymentStatus(paymentIntentId) {
        return await apiRequest(`/Payment/check-payment-status/${paymentIntentId}`, {
            method: 'POST'
        });
    }

    // Get payment status
    static async getPaymentStatus(paymentIntentId) {
        return await apiRequest(`/Payment/status/${paymentIntentId}`);
    }

    // Refund payment
    static async refundPayment(paymentIntentId, amount) {
        return await apiRequest(`/Payment/refund/${paymentIntentId}?amount=${amount}`, {
            method: 'POST'
        });
    }
}