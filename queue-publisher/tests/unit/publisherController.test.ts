import { Request, Response } from 'express';

import { Publisher } from './../../src/publishers/publisher';
import { PublisherController } from "../../src/publisherController";

describe('PublisherController', () => {
    let controller: PublisherController;
    beforeEach(() => {
        const createMockPublisherFunction = jest.fn<Publisher, []>(() => {
            return {
                publish: jest.fn().mockResolvedValueOnce({})
            };
        });

        const mockPublisher = createMockPublisherFunction();
        controller = new PublisherController(mockPublisher);
    });

    describe('publish', () => {
        it('should successfully publish when given queue name and message', async () => {
            // arrange
            const queueName = 'queue';
            const message = 'text';
            const mockRequest = { query: { message }, params: { queueName } } as any as Request;
            const mockResponse = { send: jest.fn() } as any as Response;

            // act
            await controller.publish(mockRequest, mockResponse);

            // assert
            expect(mockResponse.send).toHaveBeenCalledWith('message sent!');
        });

        it('should return 500 on queue name not given', async () => {
            // arrange
            const message = 'text';
            const mockRequest = { query: { message }, params: { someOtherParam: 'test' } } as any as Request;
            const mockResponse = {
                status: jest.fn(), send: jest.fn()
            } as any as Response;

            // act
            await controller.publish(mockRequest, mockResponse);

            // assert
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith('queue must be declared!');
        });
    });

    it('should return 500 on message not given', async () => {
        // arrange
        const queueName = 'queue';
        const mockRequest = { query: { someOtherParam: 'test' }, params: { queueName } } as any as Request;
        const mockResponse = {
            status: jest.fn(), send: jest.fn()
        } as any as Response;

        // act
        await controller.publish(mockRequest, mockResponse);

        // assert
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith('message cannot be empty!');
    });
});