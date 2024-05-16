import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { TrackStatistics } from '../db_entity/TrackStatistics';
import moment from 'moment';
import { RedisService } from '@midwayjs/redis';
import { AppUser } from '../db_entity/AppUser';
import { UserTrack } from '../db_entity/UserTrack';

@Provide()
export class DataAnalysisService {

    @InjectEntityModel(TrackStatistics)
    statisticsRepo: Repository<TrackStatistics>;
    @InjectEntityModel(AppUser)
    appUserRepo: Repository<AppUser>;
    @InjectEntityModel(UserTrack)
    userTrackRepo: Repository<UserTrack>;
    @Inject()
    redis: RedisService

    async getUserOverview(appKey: string) {
        const statistics = await this.statisticsRepo.find({
            where: {
                dataTime: MoreThanOrEqual(moment().subtract(30, 'days').toDate()),
                appKey,
            },
            order: {
                dataTime: 'DESC'
            },
            select: ['dataTime', 'appTu', 'appNu', 'appDau', 'otherParams']
        })
        const dauKey = `${appKey}:dau`;
        const nuKey = `${appKey}:nu`;
        const nu = Number(await this.redis.get(nuKey) || 0);
        const dau = await this.redis.bitcount(dauKey) || 0;
        const tu = await this.appUserRepo.countBy({
            appKey
        })
        statistics.map(item => {
            item.dataTime = moment(item.dataTime).format('YYYY-MM-DD') as any
        })
        return {
            nu,
            dau,
            tu,
            statistics
        }
    }

    async getUserAppVersionOverview(appKey: string) {
        const versionData = await this.appUserRepo.createQueryBuilder('appUser')
            .select('appUser.appVersion', 'appVersion')
            .addSelect('COUNT(appUser.id)', 'count')
            .where('appUser.appKey = :appKey', { appKey })
            .groupBy('appUser.appVersion')
            .orderBy('count', 'DESC')
            .getRawMany()

        return versionData
    }

    async getUserRegionOverview(appKey: string) {
        const regionData = await this.appUserRepo.createQueryBuilder('appUser')
            .select('appUser.ipRegion', 'ipRegion')
            .addSelect('COUNT(appUser.id)', 'count')
            .where('appUser.appKey = :appKey', { appKey })
            .groupBy('appUser.ipRegion')
            .orderBy('count', 'DESC')
            .getRawMany()

        return regionData
    }

    async getTrackList(appKey: string, time?: string, userId?: string, uniqueId?: string, deviceId?: string, page: number = 1, size: number = 10) {
        const [trackList, total] = await this.userTrackRepo.findAndCount(
            {
                where: {
                    appKey,
                    ...(userId && { userId: userId }),
                    ...(uniqueId && { uniqueId: uniqueId }),
                    ...(deviceId && { deviceId: deviceId }),
                    ...(time && {
                        trackTime: Between(new Date(time.split(',')[0]), new Date(time.split(',')[1])),
                    })
                },
                select: ['id', 'trackId', 'appVersion', 'userId', 'deviceId', 'trackTime', 'trackIp', 'uniqueId' ,'trackType', 'trackKey', 'trackParams'],
                order: {
                    trackTime: 'DESC'
                },
                skip: (page - 1) * size,
                take: size
            }
        )
        return {
            total,
            page,
            size,
            list: trackList
        }
    }

    async getTrackInfo(appKey: string, trackId: string) {
        const trackInfo = await this.userTrackRepo.find({
            where: {
                appKey,
                trackId
            },
            select: ['id', 'trackId', 'appVersion', 'userId', 'deviceId', 'trackTime', 'trackIp', 'uniqueId' ,'trackType', 'trackKey', 'trackParams']
        })
        return trackInfo
    }
}
