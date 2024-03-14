import { Provide, Inject } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';

@Provide()
export class CacheService {

    @Inject()
    redis: RedisService

    async get<T>(key: string, queryFunc: () => Promise<T>, ex = 3600): Promise<T> {
        const data = await this.redis.get(key)
        if (data) {
            try {
                return JSON.parse(data)
            } catch (e) {
                return data as T
            }
        }

        const dbData = await queryFunc()
        if (dbData) {
            await this.redis.set(key, JSON.stringify(dbData), 'EX', ex)
        }
        return dbData
    }
}