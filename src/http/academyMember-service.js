import BaseService from './base-service.js';

class AcademyMemberService extends BaseService {

    constructor(entity) {
        super(entity, 'https://misc.armadama.com/v1/');
    }

    async linkUser(id, entity, options = {}, getEntity = true) {
        const httpConfig = {
            method: 'PUT',
            url: this.buildURL([ 'linkUser', id ]),
            data: entity
        };

        return this.makeRequest(httpConfig, options).then(() => {
            if(getEntity) return this.get(id);
        });
    }

}

export default AcademyMemberService;