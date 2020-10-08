import BaseService from './base-service.js';

class PaymentService extends BaseService {

    constructor(entity) {
        super(entity, 'https://user.armadama.com/v1/');
    }

    async listPaymentMethods(options) {
                const httpConfig = {
                    method: 'GET',
                    url: this.buildURL(['paymentMethod'])
                };

                return this.makeRequest(httpConfig, options)
            }

    async createPaymentMethod(data, options) {
                const httpConfig = {
                    method: 'POST',
                    url: this.buildURL(['paymentMethod']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

    async updatePaymentMethod(data, options) {
                const httpConfig = {
                    method: 'PUT',
                    url: this.buildURL(['paymentMethod']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

    async createSubscription(data, options) {
                const httpConfig = {
                    method: 'POST',
                    url: this.buildURL(['subscription']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

    async updateSubscription(data, options) {
                const httpConfig = {
                    method: 'PUT',
                    url: this.buildURL(['subscription']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

    async cancelSubscription(data, options) {
                const httpConfig = {
                    method: 'DELETE',
                    url: this.buildURL(['subscription']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

    async getProductsAndPricing(options) {
                const httpConfig = {
                    method: 'GET',
                    url: this.buildURL(['productsAndPricing'])
                };

                return this.makeRequest(httpConfig, options)
            }

    async getUserAcademyPayment(id, options) {
                const httpConfig = {
                    method: 'GET',
                    url: this.buildURL(['userAcademyPayment', id])
                };

                return this.makeRequest(httpConfig, options)
            }
}

export default PaymentService;