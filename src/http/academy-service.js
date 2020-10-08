import BaseService from './base-service.js';

class AcademyService extends BaseService {

    constructor(entity) {
        super(entity, 'https://academy.armadama.com/v1/');
    }

    async updateProfileImage(id, data, options) {
                const httpConfig = {
                    method: 'POST',
                    url: this.buildURL([id, 'profile']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

    async getUserAcademies(id, options) {
                const httpConfig = {
                    method: 'GET',
                    url: this.buildURL(['byUser', id])
                };

                return this.makeRequest(httpConfig, options)
            }

    async cancelMembership(id, options) {
                const httpConfig = {
                    method: 'PATCH',
                    url: this.buildURL(['cancel', id])
                };

                return this.makeRequest(httpConfig, options)
            }
}

export default AcademyService;