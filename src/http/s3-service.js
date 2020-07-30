import BaseService from './base-service.js';
import { Buffer } from 'buffer';

class S3Service extends BaseService {

    async uploadImage(file, uploadUrl) {
            let signedUrl = uploadUrl.split('?')[0];
            const httpConfig = {
                method: 'PUT',
                url: uploadUrl,
                data: Buffer.from(file.data.replace(/^data:image\/\w+;base64,/, ""),'base64'),
                headers: {
                    'Content-Type': file.type,
                    'x-amz-acl': 'public-read'
                }
            };

            return this.httpRequest(httpConfig).then(res => {
                        return res;
                    }).catch(e => {
                        console.error("Failed to upload image", e);
                        return e.response;
                    });
    }
}

export default S3Service;
