import BaseService from './base-service.js';

class AcademyRequestService extends BaseService {
    async getByAcademyId(id, params = {}, options = {}) {
        const httpConfig = {
            method: 'GET',
            url: this.buildURL(['byAcademyId', id]),
            params: params
        };

        return this.makeRequest(httpConfig, options);
    }

    async approve(id, data = {}, options = {}) {
        const httpConfig = {
            method: 'PATCH',
            url: this.buildURL(['approve', id]),
            data: data
        };

        return this.makeRequest(httpConfig, options);
    }
}

export default AcademyRequestService;