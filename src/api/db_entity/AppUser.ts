import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity("app_user", { schema: "track" })
export class AppUser {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "user_id", length: 255 })
  userId: string;

  @Column("varchar", { name: "app_key", length: 255 })
  appKey: string;

  @Column("varchar", { name: "login_ip", length: 50 })
  loginIp: string;

  @Column("datetime", {
    name: "create_time",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date | null;

  @Column("datetime", { name: "update_time", nullable: true })
  updateTime: Date | null;
}
