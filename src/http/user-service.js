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

    async updateProfileImage(id, data, options) {
                const httpConfig = {
                    method: 'POST',
                    url: this.buildURL([id, 'profile']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

    async updateThumbnailImage(id, data, options) {
                const httpConfig = {
                    method: 'POST',
                    url: this.buildURL([id, 'thumbnail']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

async updatePassword(id, data, options) {
                const httpConfig = {
                    method: 'PATCH',
                    url: this.buildURL(['updatePassword', id]),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }

async forgotPassword(data, options) {
                const httpConfig = {
                    method: 'POST',
                    url: this.buildURL(['forgotPassword']),
                    data
                };

                return this.makeRequest(httpConfig, options)
            }
}

export default UserService;