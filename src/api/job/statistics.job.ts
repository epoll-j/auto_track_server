import { Job, IJob } from '@midwayjs/cron';
import { FORMAT, Inject } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { AppInfo } from '../db_entity/AppInfo';
import { TrackStatistics } from '../db_entity/TrackStatistics';
import { UserTrack } from '../db_entity/UserTrack';
import moment from 'moment';

@Job({
    cronTime: FORMAT.CRONTAB.EVERY_DAY,
    start: true,
})
export class DataStatisticsJob implements IJob {

    @Inject()
    redis: RedisService
    @InjectEntityModel(AppInfo)
    appInfoModel: Repository<AppInfo>;
    @InjectEntityModel(TrackStatistics)
    statisticsModel: Repository<TrackStatistics>;
    @InjectEntityModel(UserTrack)
    userTrackModel: Repository<UserTrack>;

    async onTick() {
        const apps = await this.appInfoModel.findBy({
            appStatus: 1
        })

        for (const app of apps) {
            const appKey = app.appKey;
            const dauKey = `${appKey}:dau`;
            const nuKey = `${appKey}:nu`;

            const dau = await this.redis.bitcount(dauKey) || 0;
            const nu = await this.redis.get(nuKey) || 0;

            const trackCount = await this.userTrackModel.createQueryBuilder('user_track')
                .select('user_track.trackType', 'track_type')
                .addSelect('COUNT(user_track.trackType)', 'num')
                .where('DATE(user_track.createTime) = CURDATE()')
                .groupBy('user_track.trackType')
                .getRawMany();

            const statistics = new TrackStatistics();
            statistics.appKey = appKey;
            statistics.appDau = Number(dau || 0);
            statistics.appNu = Number(nu || 0);
            statistics.otherParams = JSON.stringify(trackCount);
            statistics.dataTime = moment().subtract(1, 'days').toDate();
            await this.statisticsModel.insert(statistics);
            await this.redis.del(dauKey);
            await this.redis.del(nuKey);
        }
    }
}