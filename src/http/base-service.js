import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:3000/v1/';

class BaseService {

    constructor(entity) {
        this.url = BASE_URL + entity;
        this.httpRequest = axios;
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
        return this.httpRequest(httpConfig, options);
    }

    async get(id, params = {}, options = {}) {
        const httpConfig = {
            method: 'GET',
            url: this.buildURL(id),
            params: params
        };
        return this.httpRequest(httpConfig, options);
    }

    async count(params = {}, options = {}) {
        const httpConfig = {
            method: 'GET',
            url: this.buildURL('count'),
            params: params
        };
        return this.httpRequest(httpConfig, options);
    }

    async create(entity, options = {}) {
        const httpConfig = {
            method: 'POST',
            url: this.buildURL(),
            data: entity,
            headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
        };

        console.log("create %j", httpConfig)
        return this.httpRequest(httpConfig, options);

    }


    async update(id, entity, options = {}, getEntity = true) {
        const httpConfig = {
            method: 'PUT',
            url: this.buildURL(id),
            data: entity
        };
        return this.httpRequest(httpConfig, options).then(() => {
            if(getEntity) return this.get(id);
        });
    }

    async remove(id, options = {}) {
        const httpConfig = {
            method: 'DELETE',
            url: this.buildURL(id)
        };
        return this.httpRequest(httpConfig, options);
    }

}

export default BaseService;