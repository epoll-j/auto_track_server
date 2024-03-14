import { Column, Index, PrimaryGeneratedColumn, Entity } from "typeorm";

@Index("app_key", ["appKey"], {})
@Index("user_id", ["userId"], {})
@Index("track_id", ["trackId"], {})
@Entity("user_track", { schema: "track" })
export class UserTrack {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "app_key", length: 200 })
  appKey: string;

  @Column("varchar", { name: "user_id", nullable: true, length: 200 })
  userId: string | null;

  @Column("varchar", { name: "track_id", length: 200 })
  trackId: string;

  @Column("varchar", { name: "track_type", length: 200 })
  trackType: string;

  @Column("datetime", { name: "track_time" })
  trackTime: Date;

  @Column("longtext", { name: "track_params" })
  trackParams: string;

  @Column("datetime", {
    name: "create_time",
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date;
}
