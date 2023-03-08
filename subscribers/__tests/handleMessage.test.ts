import { Request, Response } from 'express';
import { handleMessage } from '../handleMessage';
import { HandlerResolver } from '~subscribers/handlers';

// Mocked dependencies
jest.mock('~subscribers/handlers', () => ({
  HandlerResolver: {
    getInstance: jest.fn(() => ({
      resolveHandler: jest.fn(),
    })),
  },
}));

describe('handleMessage', () => {
  let req: Request<any>;
  let res: Response;
  let sendMock: jest.SpyInstance;

  beforeEach(() => {
    req = {
      body: {
        message: {
          attributes: {
            topic: 'test-topic',
          },
        },
      },
    } as Request<any>;
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    } as any;
    sendMock = jest.spyOn(res, 'send');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle message with valid topic', async () => {
    const handler = {
      handle: jest.fn(),
    };
    (HandlerResolver.getInstance as jest.Mock).mockReturnValueOnce({
      resolveHandler: () => handler,
    });

    await handleMessage(req, res);

    expect(handler.handle).toHaveBeenCalledWith(req.body.message);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('should handle message with invalid topic', async () => {
    (HandlerResolver.getInstance as jest.Mock).mockReturnValueOnce({
      resolveHandler: () => null,
    });

    await handleMessage(req, res);

    expect(sendMock).toHaveBeenCalledWith(
      'Bad Request: no handler found for topic test-topic',
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle message with invalid format', async () => {
    req.body.message = {};

    await handleMessage(req, res);

    expect(sendMock).toHaveBeenCalledWith(
      'Bad Request: invalid Pub/Sub message format',
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle message with missing body', async () => {
    req.body = undefined;

    await handleMessage(req, res);

    expect(sendMock).toHaveBeenCalledWith(
      'Bad Request: no Pub/Sub message received',
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
