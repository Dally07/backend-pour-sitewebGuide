import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
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

    @Column({ name: 'departementIdDepartement' })
    departementIdDepartement: number;

   @ManyToOne(() => Departement, departement => departement.user)
    @JoinColumn({name: 'departementIdDepartement'})
    departement: Departement;

    @OneToMany(() => Information, information => information.user)
    information: Information[];

}

