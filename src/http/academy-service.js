import BaseService from './base-service.js';

class AcademyService extends BaseService {

    async updateProfileImage(id, data, options) {
                const httpConfig = {
                    method: 'POST',
                    url: this.buildURL([id, 'profile']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

    async getUserAcademies(id, params, options) {
                const httpConfig = {
                    method: 'GET',
                    url: this.buildURL(['byUser', id]),
                    params
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