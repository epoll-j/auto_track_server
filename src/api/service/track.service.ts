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

    async add(appKey: string, userId: string | null, trackId: string, dataList: any) {
        const rows: UserTrack[] = [];
        for (const data of dataList) {
            const userTrack = new UserTrack();
            userTrack.appKey = appKey;
            userTrack.userId = userId;
            userTrack.trackId = trackId;
            userTrack.trackTime = new Date(data.time)
            userTrack.trackType = data.type
            userTrack.trackKey = data.key
            userTrack.trackParams = JSON.stringify(data.params)
            rows.push(userTrack);
        }

        await this.userTrackModel.insert(rows);
        if (userId && userId !== '') {
            const userKey = `${appKey}:user:${userId}`;
            let user = await this.cacheService.get<AppUser>(userKey, async () => {
                return await this.appUserModel.findOne({
                    where: {
                        appKey,
                        userId
                    }
                })
            });

            if (!user) {
                const newUser = new AppUser()
                newUser.appKey = appKey
                newUser.userId = userId
                newUser.loginIp = this.ctx.ip
                user = await this.appUserModel.save(newUser)
                const nuKey = `${appKey}:nu`;
                await this.redis.incr(nuKey);
            }
            const dauKey = `${appKey}:dau`;
            await this.redis.setbit(dauKey, user.id, 1);
        }
        
    }
}