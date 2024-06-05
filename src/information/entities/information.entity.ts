import { User } from "../../user/entities/user.entity";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Information {
    @PrimaryGeneratedColumn()
    idInformation: number;

    @Column()
    hostname: string;

    @Column()
    IP: string;

    @Column()
    date: Date;

    @Column()
    titreInfo: string;

    @Column()
    corpsInfo: string;

    @Column({name: 'userId'})
    userId: number;

    @Column ({type: 'longblob'  , nullable:true})
    imageData: string;

    @ManyToOne(() => User, user => user.information)
      @JoinColumn({name: 'userId'})
    user: User;

  

}
