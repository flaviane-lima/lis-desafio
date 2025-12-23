import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm";
import { UserProfile } from "./UserProfile";

@Entity("user")
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  pass!: string;

  @ManyToOne(() => UserProfile, (profile) => profile.users, { eager: true})
  userProfile!: UserProfile;
}