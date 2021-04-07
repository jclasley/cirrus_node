### Build & Install

`make all`

OR

`make build` then `npm run start`

### Config

Environment variables: `PORT` and `MSGDIR`

`PORT` default is 8080

`MSGDIR` default is `./messages`

### Testing

`make test`

OR

`npm run test`

### Routes

`GET`: `/api/getMessage`
`POST`: `/api/saveMessage`