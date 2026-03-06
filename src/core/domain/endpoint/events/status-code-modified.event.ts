import { IDomainEvent } from "../../shared/events/domain-event.interface";

export class StatusCodeModifiedEvent implements IDomainEvent {
  readonly occurred_on: Date;
  readonly event_version: number;

  constructor() {
    this.occurred_on = new Date();
    this.event_version = 1;
  }
}
