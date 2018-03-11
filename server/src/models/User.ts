import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsIn,
  Length,
  MinLength,
  MinDate,
  MaxDate
} from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BaseModel from './BaseModel';
import { Friend, Message, Role } from './';

@Entity()
export default class User extends BaseModel {
  @Column({ unique: true })
  @Length(3, 25)
  @IsAlphanumeric()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(6)
  password: string;

  @Column({ type: 'date' })
  @MinDate(new Date('1900-01-01'))
  @MaxDate(new Date())
  @IsDate()
  dob: Date;

  @Column({ default: 'en' })
  @IsIn(['en', 'es'])
  language: string;

  @Column({ default: false })
  online: boolean;

  @Column({ nullable: true })
  roleId: number;

  @ManyToOne(type => Role)
  role: Role;

  @OneToMany(type => Message, message => message.user)
  messages: Message[];

  @BeforeInsert()
  @BeforeUpdate()
  async _beforeSave() {
    const user = await User.findOneById(this.id);
    if (!user || user.password !== this.password) {
      this.password = await bcrypt.hash(this.password, 15);
    }
  }

  get friends() {
    return (async () => {
      const friendships = await Friend.createQueryBuilder('friend')
        .leftJoinAndSelect('friend.user1', 'user1')
        .leftJoinAndSelect('friend.user2', 'user2')
        .where('("user1Id" = :id OR "user2Id" = :id) AND accepted = true', {
          id: this.id
        })
        .getMany();
      return friendships.map(friendship => {
        const user =
          friendship.user1.id !== this.id ? friendship.user1 : friendship.user2;
        return user;
      });
    })();
  }

  get pendingFriends() {
    return (async () => {
      const friendships = await Friend.createQueryBuilder('friend')
        .leftJoinAndSelect('friend.user1', 'user1')
        .where('"user2Id" = :id AND accepted = false', { id: this.id })
        .getMany();
      return friendships.map(friendship => friendship.user1);
    })();
  }

  authenticate(password: string) {
    return bcrypt.compare(password, this.password);
  }

  changePassword(password: string) {
    this.password = password;
    return this.save();
  }

  generateToken() {
    return jwt.sign(
      { sub: this.id, iss: 'Trace' },
      this.password + process.env.SECRET,
      { expiresIn: '7d' }
    );
  }
}