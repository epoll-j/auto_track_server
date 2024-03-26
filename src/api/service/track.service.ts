import { TrackBody } from './../entity/TrackBody';
import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserTrack } from '../db_entity/UserTrack';
import { AppUser } from '../db_entity/AppUser';
import { CacheService } from './cache.service';
import { Context } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';

@Provide()
export class TrackService {
    @Inject()
    ctx: Context;
    @Inject()
    cacheService: CacheService;
    @Inject()
    redis: RedisService
    @InjectEntityModel(UserTrack)
    userTrackModel: Repository<UserTrack>;
    @InjectEntityModel(AppUser)
    appUserModel: Repository<AppUser>;

    async add(track: TrackBody) {
        const { app_key, user_id, track_id, data_list, device_info, app_version } = track;
        const { ip } = this.ctx;
        const rows: UserTrack[] = [];
        for (const data of data_list) {
            const userTrack = new UserTrack();
            userTrack.appKey = app_key;
            userTrack.userId = user_id;
            userTrack.trackId = track_id;
            userTrack.trackTime = new Date(data.time)
            userTrack.trackType = data.type
            userTrack.trackKey = data.key
            userTrack.trackParams = JSON.stringify(data.params)
            rows.push(userTrack);
        }

        await this.userTrackModel.insert(rows);
        if (user_id && user_id !== '') {
            const userKey = `${app_key}:user:${user_id}`;
            let user = await this.cacheService.get<AppUser>(userKey, async () => {
                const dbUSer = await this.appUserModel.findOne({
                    where: {
                        appKey: app_key,
                        userId: user_id
                    }
                })

                if (dbUSer) {
                    dbUSer.appVersion = app_version
                    dbUSer.deviceInfo = JSON.stringify(device_info)
                    dbUSer.loginIp = ip
                    return await this.appUserModel.save(dbUSer)
                }

                return dbUSer
            });

            if (!user) {
                const newUser = new AppUser()
                newUser.appKey = app_key
                newUser.userId = user_id
                newUser.loginIp = ip
                newUser.appVersion = app_version
                newUser.deviceInfo = JSON.stringify(device_info)
                user = await this.appUserModel.save(newUser)
                const nuKey = `${app_key}:nu`;
                await this.redis.incr(nuKey);
            }
            const dauKey = `${app_key}:dau`;
            await this.redis.setbit(dauKey, user.id, 1);
        }
        
    }
}
