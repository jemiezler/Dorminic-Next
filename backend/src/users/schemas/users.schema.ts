import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Object, required: true })
  name: {
    first: string;
    last: string;
  };

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: [String] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(Users);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
