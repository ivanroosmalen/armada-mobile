import BaseService from './base-service.js';
import { Buffer } from 'buffer';

class S3Service extends BaseService {

    async uploadImage(file, signedUrl) {

            const httpConfig = {
                method: 'PUT',
                url: signedUrl,
                data: Buffer.from(file.data.replace(/^data:image\/\w+;base64,/, ""),'base64'),
                headers: {
                     'Content-Type': 'multipart-formdata',
                     'X-Amz-ACL': 'public-read',
                     'Content-Encoding': 'base64'
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
