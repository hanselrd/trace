import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Length } from 'class-validator';
import BaseModel from './BaseModel';
import { User } from './';

@ObjectType()
@Entity()
export default class Message extends BaseModel {
  @Field(type => ID)
  readonly id: number;

  @Field() readonly createdAt: Date;

  @Field()
  @Column({ type: 'text' })
  @Length(1, 256)
  text: string;

  @Column() userId: number;

  @Field(type => User)
  @ManyToOne(type => User)
  user: User;
}
