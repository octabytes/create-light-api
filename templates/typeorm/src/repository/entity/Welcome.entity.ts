import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class WelcomeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;
}

export default WelcomeEntity;
