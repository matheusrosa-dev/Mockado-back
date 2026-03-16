import { IDomainEvent } from "../../shared/events/domain-event.interface";

export class StatusCodeModifiedEvent implements IDomainEvent {
  readonly occurredOn: Date;
  readonly eventVersion: number;

  constructor() {
    this.occurredOn = new Date();
    this.eventVersion = 1;
  }
}
