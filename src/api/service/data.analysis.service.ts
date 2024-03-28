import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { TrackStatistics } from '../db_entity/TrackStatistics';
import moment from 'moment';
import { RedisService } from '@midwayjs/redis';
import { AppUser } from '../db_entity/AppUser';

@Provide()
export class DataAnalysisService {

    @InjectEntityModel(TrackStatistics)
    statisticsRepo: Repository<TrackStatistics>;
    @InjectEntityModel(AppUser)
    appUserRepo: Repository<AppUser>;
    @Inject()
    redis: RedisService

    async getDashboard(appKey: string) {
        const statistics = await this.statisticsRepo.findBy({
            dataTime: MoreThanOrEqual(moment().subtract(30, 'days').toDate()),
            appKey
        })
        const dauKey = `${appKey}:dau`;
        const nuKey = `${appKey}:nu`;
        const nu = Number(await this.redis.get(nuKey) || 0);
        const dau = await this.redis.bitcount(dauKey) || 0;
        const tu = await this.appUserRepo.countBy({
            appKey
        })
        statistics.map(item => {
            item.dataTime = moment(item.dataTime).format('MM-DD') as any;
        })
        return {
            nu,
            dau,
            tu,
            statistics
        }
    }

    
}
