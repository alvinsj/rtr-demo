## Refresh Token Rotation Demo

### Development

1. Add a new file `.env.local`

```sh
VITE_AUTH_URL=https://auth-api.app/api/authorize
VITE_TOKEN_URL=https://auth-api.app/api/oauth/token
VITE_BASE_URL=http://localhost:5173
```

2. Install packages

```sh
$ npm install
```

3. Run development server, default to http://localhost:5173

```sh
$ npm run dev
```

### Test

```sh
$ npm run test
$ npm run test:coverage # display coverage
```
