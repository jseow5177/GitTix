import { Message, Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  // Name of the channel this listener will listen to
  abstract subject: T['subject']
  // Name of the queue group this listener will join
  abstract queueGroupName: string
  // Function to run when message is received
  abstract onMessage(data: T['data'], msg: Message): void
  // Pre-initialized NATS client
  private client: Stan
  // Number of seconds this listener has to ack a message
  protected ackWait = 5 * 1000

  constructor(client: Stan) {
    this.client = client // A pre-initialized client
  }

  private subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true) // Requires the listener to manually acknowledge the receive of an event
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName) // Common practice to set durable name as queue group name
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject, // Channel name
      this.queueGroupName, // Queue group name
      this.subscriptionOptions() // Subscription options
    )

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received from subject ${this.subject} and queue group ${this.queueGroupName}`
      )

      const parsedData = this.parseMessage(msg)

      this.onMessage(parsedData, msg)
    })
  }

  private parseMessage(msg: Message) {
    const data = msg.getData()

    return typeof data === 'string'
      ? JSON.parse(data) // Parse string
      : JSON.parse(data.toString('utf8')) // Parse buffer
  }
}