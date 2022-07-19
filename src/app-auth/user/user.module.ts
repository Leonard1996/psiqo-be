import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Therapist } from 'src/entities/therapist.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Therapist])],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule { }
