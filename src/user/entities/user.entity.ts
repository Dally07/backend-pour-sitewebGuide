import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Departement } from "../../departement/entities/departement.entity";
import { Information } from "../../information/entities/information.entity";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    username: string;

    @Column()
    password: string;

    
    @Column()
    salt: string;

   

    @ManyToOne(() => Departement, departement => departement.user)
    departement: Departement;

    @OneToMany(() => Information, information => information.user)
    information: Information[];

}

