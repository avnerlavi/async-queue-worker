import rascal from 'rascal';

import { PublisherFactory } from '../../src/publishers/publisherFactory';
import { RabbitMQPublisher } from '../../src/publishers/rabbitMQPublisher';

describe('PublisherFactory', () => {
    describe('createPublisher', () => {
        it('should create publisher for requested queue if in configuration', async () => {
            // arrange
            const queueType = 'rabbitmq';
            const mockConfig = {
                'vhosts': {
                    '/': {
                        'queues': {
                            'email': {}
                        }
                    }
                }
            };

            jest.mock('rascal');
            const mockedRascal = rascal as jest.Mocked<typeof rascal>;
            mockedRascal.BrokerAsPromised.create = jest.fn().mockResolvedValueOnce({
                config: mockConfig
            });

            const mockBroker = await rascal.BrokerAsPromised.create(mockConfig);
            const mockPublisher = new RabbitMQPublisher(mockBroker);
            jest.spyOn(RabbitMQPublisher, 'create').mockResolvedValueOnce(mockPublisher);

            // act
            const returnedPublisher = await PublisherFactory.createPublisher(queueType);

            // assert
            expect(returnedPublisher).toEqual(mockPublisher);
        });

        it('should throw error for requested queue if not in configuration', () => {
            // arrange
            const queueType = 'nonexistant';
            const errorMessage = `publisher cannot be created for given queue type of ${queueType}!`;

            // act & assert
            expect(PublisherFactory.createPublisher(queueType)).rejects.toThrow(errorMessage);
        });
    });
});