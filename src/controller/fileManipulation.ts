import { promises } from 'fs';
const { readFile, writeFile } = promises;
import path from 'path';

const dir = process.env.MSGDIR || path.resolve(__dirname, '../../messages');

export const readMsg = (username: string) : Promise<string> => {
  const msgPath = path.join(dir, `${username}.txt`);
  return readFile(msgPath) // forward error
    .then(chunk => chunk.toString())
}

export const writeMsg = (username: string, msg: string) : Promise<void> => {
  const msgPath = path.join(dir, `${username}.txt`);
  return writeFile(msgPath, msg)
}