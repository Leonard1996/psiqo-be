import { Allow } from 'class-validator'

export class CreateSessionDto {
  @Allow()
  patientId: number
  @Allow()
  startTime: string
  @Allow()
  endTime: string
  @Allow()
  month: number
}
