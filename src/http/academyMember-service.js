import BaseService from './base-service.js';

class AcademyMemberService extends BaseService {

    constructor(entity) {
        super(entity, 'https://misc.armadama.com/v1/');
    }

}

export default AcademyMemberService;