import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity("user_profile")
export class UserProfile {
    @PrimaryGeneratedColumn()
    id_userprofile!: number; //chave primária

    @Column()
    name!: string; //Admin, Colaborador, Aprovador

    @Column({ default: true })
    active!: boolean; //status ativo/inativo

    @OneToMany(() => User, (user) => user.userProfile)
    users!: User[];
}    
