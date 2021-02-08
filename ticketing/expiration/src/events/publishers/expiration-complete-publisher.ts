import { Publisher, Subjects, ExpirationCompleteEvent } from '@gittix-js/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}