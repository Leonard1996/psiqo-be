import { Injectable } from '@nestjs/common';
import { fromEvent } from "rxjs";
import { EventEmitter } from "events";


@Injectable()
export class SessionCreatedEventService {

    private readonly emitter = new EventEmitter();

    subscribe(doctorId: number) {
        return fromEvent(this.emitter, `sessions/new/${doctorId}`);
    }

    async emit(doctorId: number, type: string) {
        this.emitter.emit(`sessions/new/${doctorId}`, { data: type });
    }

}