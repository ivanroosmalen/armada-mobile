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
}

export default AcademyService;