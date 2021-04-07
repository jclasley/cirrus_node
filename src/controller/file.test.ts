import { readMsg, writeMsg } from './fileManipulation'
import fs from 'fs';
import path from 'path';

const t_user = 'test@test.com';
const t_msg = 'Test msg';

describe('File read/write', () => {
  let dir: string;

  beforeEach(() => {
    dir = process.env.MSGDIR || path.resolve(__dirname, '../../messages');
  });
  // remove files created by test
  afterAll((done) => {
    fs.unlink(path.join(dir, `${t_user}.txt`), err => {
      if (err) {
        console.error(err);
      }
      done();
    });
  });

  test('Creates file if none exists', () => {
    const w = writeMsg(t_user, t_msg);
    expect(w).resolves.not.toThrow();
    expect(fs.existsSync(path.join(dir, `${t_user}.txt`))).toBeTruthy();
  });
  test('Reading the file with `readMsg` yields what was created by `writeMsg`', async () => {
    const msgCall = readMsg(t_user);
    expect(msgCall).resolves.not.toThrow();
    const msg = await msgCall;
    expect(msg).toBe(t_msg);
  });
})