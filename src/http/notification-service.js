import BaseService from './base-service.js';

class NotificationService extends BaseService {

    constructor(entity) {
        super(entity, 'https://misc.armadama.com/v1/');
    }
}

export default NotificationService;