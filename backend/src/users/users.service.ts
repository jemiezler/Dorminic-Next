import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersDocument, Users } from './schemas/users.schema';
import { Model } from 'mongoose';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  async create(registerDTO: RegisterDTO): Promise<Users> {
    const newUser = new this.userModel(registerDTO).toObject();
    return await newUser.save();
  }

  async findByEmail(email: string): Promise<UsersDocument> {
    return await this.userModel.findOne({ email }).lean();
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<UsersDocument> {
    return await this.userModel
      .findOne({
        $or: [{ email: email }, { username: username }],
      })
      .lean();
  }
}
