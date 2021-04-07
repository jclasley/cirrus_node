import express, { Request, Response } from 'express';
const app = express();
import auth from '../controller/authMiddleware';
import { readMsg, writeMsg } from '../controller/fileManipulation';

app.use(express.json()); // allow json content-type


app.get('/test', (req, res) => {
  res.status(200).send('y');
})

app.use(auth); // does basic auth parsing, returns 401 if not authorized

app.get('/api/getMessage', async (req: Request, res: Response) => {
  const user = req.headers.username || ''; // attached by middleware
  try {
    const msg = await readMsg(user.toString());
    res.status(200).send({data: msg});
  } catch (err) {
    res.status(400).send({data: 'No message found for that user'});
  }
})

app.post('/api/saveMessage', async (req: Request, res: Response) => {
  const user = req.headers.username || '';
  try {
    if (req.body.message) {
      writeMsg(user.toString(), req.body.message);
      res.status(201).send({data: 'Message received'})
    } else {
      res.status(400).send({error: "Improper JSON"})
    }
  } catch (err) {
    res.status(500).send({error: err})
  }
})


export default app;