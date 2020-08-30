import BaseService from './base-service.js';

class ScheduleItemService extends BaseService {

    constructor(entity) {
        super(entity, 'https://academy.armadama.com/v1/');
    }
}

export default ScheduleItemService;