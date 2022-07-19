import { Allow } from "class-validator";

export class CreateSessionDto {
    @Allow()
    patientDoctorId: number
    @Allow()
    startTime: string;
    @Allow()
    endTime: string;
    @Allow()
    month: number;
}