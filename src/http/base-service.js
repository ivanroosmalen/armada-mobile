import axios from 'axios';

//const BASE_URL = 'http://10.0.2.2:3000/v1/';
const BASE_URL = 'https://user.armadama.com/v1/';
import { store } from '../redux/store.js';

class BaseService {

    constructor(entity, baseUrl) {
        this.url = (baseUrl || BASE_URL) + entity;
//        this.url = (BASE_URL) + entity;
        this.httpRequest = axios;
    }

    async makeRequest(httpConfig, options) {
        const state = store.getState();

        let constHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ state.users.jwt
        }

        httpConfig.headers = Object.assign(httpConfig.headers || {}, constHeaders);
        return await this.httpRequest(httpConfig, options).then(res => {
            return res;
        }).catch(e => {
            console.log('Failed request', e);
            return e.response;
        });
    }

    buildURL(urlParams) {
        if(!urlParams) return this.url;

        return `${this.url}/${urlParams.join('/')}`;
    }

    async list(params, options = {}) {
        const httpConfig = {
            method: 'GET',
            url: this.buildURL(),
            params: params
        };

        return this.makeRequest(httpConfig, options);
    }

    async get(id, params = {}, options = {}) {
        const httpConfig = {
            method: 'GET',
            url: this.buildURL([id]),
            params: params
        };

        return this.makeRequest(httpConfig, options);
    }

    async count(params = {}, options = {}) {
        const httpConfig = {
            method: 'GET',
            url: this.buildURL('count'),
            params: params
        };
        return this.makeRequest(httpConfig, options);
    }

    async create(entity, options = {}) {
        const httpConfig = {
            method: 'POST',
            url: this.buildURL(),
            data: entity
        };

        return this.makeRequest(httpConfig, options);
    }


    async update(id, entity, options = {}, getEntity = true) {
        const httpConfig = {
            method: 'PUT',
            url: this.buildURL([ id ]),
            data: entity
        };

        return this.makeRequest(httpConfig, options).then(() => {
            if(getEntity) return this.get(id);
        });
    }

    async remove(id, options = {}) {
        const httpConfig = {
            method: 'DELETE',
            url: this.buildURL([id])
        };
        return this.makeRequest(httpConfig, options);
    }

}

export default BaseService;