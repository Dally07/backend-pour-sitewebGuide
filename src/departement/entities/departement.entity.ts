import { User } from "src/user/entities/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Departement {
    @PrimaryGeneratedColumn()
    idDepartement: number;

    @Column()
    nomDepartement: string;

    @OneToMany(() => User, user => user.departement)
    user: User[];
}
