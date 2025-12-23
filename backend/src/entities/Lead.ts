import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("leads")
 export class Lead {
    @PrimaryGeneratedColumn()
    id_lead! : number;

    @CreateDateColumn()
    created_at!: string;

    @Column()
    name_lead!: string;

    @Column() registration_number!: string; @Column("decimal", { precision: 10, scale: 2 }) earnings!: number; @Column("decimal", { precision: 10, scale: 2 }) loan_value!: number; @Column({ default: false }) loan_approved!: boolean; @Column({ default: false }) deleted!: boolean;

    @ManyToOne(() => User, { nullable: true})
    id_user_approve!: User;

    @ManyToOne(() => User)
    id_user_register!: User;

 }