import { User } from "../../user/entities/user.entity";
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Information {
    @PrimaryColumn()
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

    @ManyToOne(() => User, user => user.information)
      @JoinColumn({name: 'userId'})
    user: User;

  

}
