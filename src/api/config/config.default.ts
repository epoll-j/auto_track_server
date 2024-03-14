export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'track',
        synchronize: false,
        logging: false,
        entities: [
          '**/db_entity/*{.ts,.js}'
        ]
      }
    }
  },
  redis: {
    client: {
      port: 6379,
      host: "127.0.0.1", 
      // password: "auth",
      db: 0,
    },
  },
}
