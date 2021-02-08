import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from '@gittix-js/common'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    const expirationTime = new Date(data.expiresAt).getTime()
    const nowTime = new Date().getTime()
    const delay = expirationTime - nowTime

    await expirationQueue.add({
      orderId: data.id
    }, { delay })

    msg.ack()
  }
}