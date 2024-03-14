import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CacheService } from '../service/cache.service';
import { TrackBody } from '../entity/TrackBody';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { AppInfo } from '../db_entity/AppInfo';
import * as crypto from 'crypto';
import { TrackService } from '../service/track.service';

@Controller('/api')
export class TrackController {
  @Inject()
  ctx: Context;

  @Inject()
  cacheService: CacheService;
  @Inject()
  trackService: TrackService;
  @InjectEntityModel(AppInfo)
  appInfoModel: Repository<AppInfo>;


  @Post('/track')
  async addTrack(@Body() track: TrackBody) {
    const app = await this.cacheService.get<AppInfo>(`app_info:${track.app_key}`, async () => {
        const appInfo = await this.appInfoModel.findOne({
            where: {
                appKey: track.app_key,
                appStatus: 1
            }
        })
        return appInfo
    })

    if (!app) {
        return { success: false }
    }

    const sign = crypto.createHash('sha256').update(`${track.app_key}${track.t}${app.appSecret}`).digest('hex')
    if (track.signature !== sign) {
        return { success: false }
    }

    await this.trackService.add(track.app_key, track.user_id, track.track_id, track.data_list);
    return { success: true }
  }
}