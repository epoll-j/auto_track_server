import { createConfiguration, hooks } from '@midwayjs/hooks';
import * as Koa from '@midwayjs/koa';
import * as orm from '@midwayjs/typeorm';
import * as redis from '@midwayjs/redis';
import * as cron from '@midwayjs/cron';
import { join } from 'path';

/**
 * setup midway server
 */
export default createConfiguration({
  imports: [Koa, orm, cron, redis, hooks()],
  importConfigs: [join(__dirname, './config'), { default: { keys: 'session_keys' } }],
});