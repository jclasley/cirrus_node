import axios from 'axios';
import {Request, Response, NextFunction} from 'express';

interface Auth {
  login: string,
  password: string
}

interface User {
  email: string
}

export const parseUsernames = () : Promise<Array<string>> => {
  // forward error to bAuth
  return axios.get('https://reqres.in/api/users')
    .then(({ data }) => {
      const emails = data.data.reduce((m: Array<string>, i: User) => {
        return [...m, i["email"]]
      }, []);
      return emails;
  })
}

const bAuth = (req: Request, res: Response, next: NextFunction) => {
  // if there is basic auth provided in header, get it; otherwise, empty string
  const auth = (req.headers.authorization || '').split(' ')[1] || '';
  if (!req.headers.authorization) {
    res.status(401).send({error: "No authentication provided"});
    return;
  }

  const [login, password] = Buffer.from(auth, 'base64').toString().split(':');
  parseUsernames().then(users => {
     // if username is in approved list and password not empty
    if (users.includes(login)) {
      if (password) {  // empty password
        req.headers.username = login;
        return next(); // move on with middlewares
      } else {
        res.status(401).send({error: "Invalid password"})
      }
    } else { // user not approved
      res.status(401).send({error: "Unauthorized user"})
    }
  })
    .catch(err => {
      res.status(500).send(err);
    })
}

export default bAuth;