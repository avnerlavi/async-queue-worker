import { ConsumerFactory } from './consumers/consumerFactory';

require('dotenv').config({path: __dirname + '/../.env'});

const queueType = 'rabbitmq';
const role = 'email';
try {
    const consumer = new ConsumerFactory().createConsumer(queueType, role);
    console.log(`created consumer for queue of type ${queueType} and of role ${role}...`);
    consumer.consume();
} catch (err: any) {
    console.log(err.message);
}