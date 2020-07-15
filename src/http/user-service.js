import BaseService from './base-service.js';

class UserService extends BaseService {

    async login(entity) {
            const httpConfig = {
                method: 'POST',
                url: this.buildURL(['login']),
                data: entity
            };
            return this.makeRequest(httpConfig, {});
    }

    async logout() {
                const httpConfig = {
                    method: 'GET',
                    url: this.buildURL(['logout'])
                };
                return this.makeRequest(httpConfig, {});
        }

    async register(entity) {
                const httpConfig = {
                    method: 'POST',
                    url: this.buildURL(['register']),
                    data: entity
                };
                return this.makeRequest(httpConfig, {});
            }
}

export default UserService;