import BaseService from './base-service.js';

class AccountService extends BaseService {

    async login(token) {
            const httpConfig = {
                method: 'POST',
                url: this.buildURL(['login']),
                data: { token }
            };
            return this.httpRequest(httpConfig, {});
    }

    async sendToken(email) {
                const httpConfig = {
                    method: 'POST',
                    url: this.buildURL(['sendToken']),
                    data: { email: email }
                };
                return this.httpRequest(httpConfig, {});
            }
}

export default AccountService;