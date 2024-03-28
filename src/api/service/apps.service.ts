import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { AppInfo } from '../db_entity/AppInfo';
import { Repository } from 'typeorm';

@Provide()
export class AppService {

    @InjectEntityModel(AppInfo)
    appInfoRepo: Repository<AppInfo>;

    async getApps() {
        return await this.appInfoRepo.find()
    }

    
}