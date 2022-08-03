import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Therapist } from 'src/entities/therapist.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Therapist])],
  providers: [],
  exports: [],
})
export class TherapistModule {}
