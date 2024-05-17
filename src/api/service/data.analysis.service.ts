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
                select: ['id', 'trackId', 'appVersion', 'userId', 'deviceId', 'trackTime', 'trackIp', 'uniqueId', 'trackType', 'trackKey', 'trackParams'],
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
            select: ['id', 'trackId', 'appVersion', 'userId', 'deviceId', 'trackTime', 'trackIp', 'uniqueId', 'trackType', 'trackKey', 'trackParams']
        })
        return trackInfo
    }

    async getFunnelData(appKey: string, events: string[], time: string) {
        const trackList = await this.userTrackRepo.find({
            select: ['userId', 'trackId', 'trackKey', 'trackTime'],
            where: {
                appKey,
                trackTime: Between(new Date(time.split(',')[0]), new Date(time.split(',')[1]))
            },
            order: {
                trackTime: 'ASC'
            },
        })

        return await this.calculateFunnelConversion(trackList, events);
    }

    async calculateFunnelConversion(eventsData, events) {
        // 使用一个Map对象来为每个会话track_id独立跟踪事件路径
        let trackIdFunnelPaths = new Map();

        // 初始化Map中每个track_id的事件集合
        eventsData.forEach(data => {
            const { trackId } = data;
            if (!trackIdFunnelPaths.has(trackId)) {
                let trackIdEvents = events.reduce((acc, event) => {
                    acc[event] = false; // 初始时，没有事件发生
                    return acc;
                }, {});
                trackIdFunnelPaths.set(trackId, trackIdEvents);
            }
        });

        // 处理每个会话的事件数据，确保事件的顺序是在之前事件发生之后
        eventsData.forEach(data => {
            const { trackId, trackKey } = data;
            let trackIdEvents = trackIdFunnelPaths.get(trackId);
            if (events.indexOf(trackKey) !== -1) {
                // 如果是序列中的第一个事件，无条件标记为发生
                if (events.indexOf(trackKey) === 0) {
                    trackIdEvents[trackKey] = true;
                } else {
                    // 如果当前事件发生在之前所有事件之后，标记为发生
                    let previousEventKey = events[events.indexOf(trackKey) - 1];
                    if (trackIdEvents[previousEventKey]) {
                        trackIdEvents[trackKey] = true;
                    }
                }
            }
            trackIdFunnelPaths.set(trackId, trackIdEvents);
        });

        // 计算总的事件发生次数和转换率
        let funnelTotals = events.reduce((acc, event) => {
            acc[event] = 0;
            return acc;
        }, {});

        trackIdFunnelPaths.forEach(trackIdEvents => {
            let hasPassedPreviousEvent = true;

            events.forEach((event, index) => {
                // 如果此前的事件都通过了，则累加此事件的发生次数
                if (hasPassedPreviousEvent) {
                    if (trackIdEvents[event]) {
                        funnelTotals[event] += 1;
                    } else {
                        hasPassedPreviousEvent = false; // 事件未发生，后面的事件不再记录
                    }
                }
            });
        });

        // 计算转换率
        let conversionRates = events.map((event, index) => {
            if (index === 0) return '100%'; // 第一个事件没有转化率
            let previousEventCount = index > 0 ? funnelTotals[events[index - 1]] : 0;
            let eventCount = funnelTotals[event];
            return previousEventCount > 0 ? ((eventCount / previousEventCount) * 100).toFixed(2) + '%' : '0%';
        });

        return { funnelTotals, conversionRates };
    }
}
