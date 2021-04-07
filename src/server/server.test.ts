import axios, { AxiosResponse } from 'axios';
import { mocked } from 'ts-jest/utils';
import request from 'supertest';
import app from './index';

import { parseUsernames } from '../controller/authMiddleware';
import { readMsg, writeMsg } from '../controller/fileManipulation';

const getUrl = '/api/getMessage';
const postUrl = '/api/saveMessage';

// ------- MOCKS ----------

jest.mock('axios');
const mockAxios = mocked(axios, true);

// axios mocks
const mockAuthUsers: AxiosResponse = {
  data: {
    data: [{
      email: 'test@test.com'
    },
    {
      email: 'missing@file.com'
    },
  ]
  },
  statusText: 'Mocked',
  headers: {},
  status: 200,
  config: {}
}
mockAxios.get.mockResolvedValue(mockAuthUsers);


// --- file mocks ---
jest.mock('../controller/fileManipulation');
const mockRead = mocked(readMsg);
mockRead.mockImplementation((u) => {
  if (u === 'missing@file.com') {
    return Promise.reject(); // for testing no file at location
  }
  return Promise.resolve('Test message')
});
const mockWrite = mocked(writeMsg);
mockWrite.mockImplementation(() => Promise.resolve())

// ---------- TESTS --------------

describe('Server running', () => {
  test('running', async () => {
    const r = await request(app)
      .get('/test')
    expect(r.status).toBe(200);
  })
})

describe('Helper functions', () => {
  beforeAll(() => {
    jest.requireActual('../controller/authMiddleware')
  })
  test('Parse usernames', async () => { 
    try {
      const users = await parseUsernames();
      console.log(users);
      expect(users).toEqual(['test@test.com', 'missing@file.com']);
    } catch (err) {
      console.error(err);
    }
  })
})

describe('Errors', () => {
  beforeAll(() => {
    jest.requireActual('../controller/authMiddleware')
  })

  describe('GETs', () => {
    test('No auth', async () => {
      const r = await request(app).get(getUrl);
      expect(r.status).toBe(401);
    })
    test('No auth', async () => {
      const r = await request(app)
        .get(getUrl)
        .auth('', '');
      expect(r.status).toBe(401)
    })
    test('No password', async () => {
      const r = await request(app)
        .get(getUrl)
        .auth('test@test.com', '');
        expect(r.status).toBe(401)
    });
    test('Invalid user', async () => {
      const r = await request(app)
        .get(getUrl)
        .auth('test1@test.com', '')
      expect(r.status).toBe(401);
    });
    test('No file for user', async () => {
      const r = await request(app).get(getUrl).auth('missing@file.com', '1');
      expect(r.status).toBe(400);
    })
  })
  describe('POSTs', () => {
    test('No auth', async () => {
      const r = await request(app).post(postUrl);
      expect(r.status).toBe(401);
    })
    test('Empty auth', async () => {
      const r = await request(app)
        .post(postUrl)
        .auth('', '');
      expect(r.status).toBe(401)
    })
    test('No password', async () => {
      const r = await request(app)
        .post(postUrl)
        .auth('test@test.com', '');
        expect(r.status).toBe(401)
    });
    test('Invalid user', async () => {
      const r = await request(app)
        .post(postUrl)
        .auth('test1@test.com', '')
      expect(r.status).toBe(401);
    });
    test('Bad JSON', async () => {
      const r = await request(app).post(postUrl).auth('test@test.com', '1').send();
      expect(r.status).toBe(400);
    })
  })
});



describe('Successful POST', () => {
  test('Username and pass', async() => {
    const r = await request(app).post(postUrl)
      .send({
        "message": "Test message"
      })
      .auth('test@test.com', '1');
    expect(r.status).toBe(201);
    expect(writeMsg).toHaveBeenCalledWith('test@test.com', 'Test message');
  });
});

describe('Successful GET', () => {
  test('Test user, test message', async () => {
    const r = await request(app).get(getUrl)
      .auth('test@test.com', '1');
    expect(r.status).toBe(200);
    expect(readMsg).toHaveBeenCalledWith('test@test.com');
  })
})
