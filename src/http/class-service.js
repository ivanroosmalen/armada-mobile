import BaseService from './base-service.js';

class ClassService extends BaseService {

    constructor(entity) {
        super(entity, 'https://academy.armadama.com/v1/');
    }

    async attend(data) {
            const httpConfig = {
                method: 'PATCH',
                url: this.buildURL(['attend']),
                data: data
            };
            return this.makeRequest(httpConfig, {});
    }

    async unattend(data) {
            const httpConfig = {
                method: 'PATCH',
                url: this.buildURL(['unattend']),
                data: data
            };
            return this.makeRequest(httpConfig, {});
    }
}

export default ClassService;