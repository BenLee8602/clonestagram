# middlewares
documentation for middleware functions found in `pixelblob/src/middlewares`


## require login
in `auth.js`
```js
function requireLogin(req, res, next) { ... }
```
only calls next if given a valid user login (access token)

### request headers
- `req.headers.authorization` string containing a users access token in the format `Bearer ${token}`

### responses
- `401` if access token is missing or invalid
- `403` if access token is expired

### request output
- `req.user` object containing the users id and name (`req.user.id` and `req.user.name`)


## get page info
in `page.js`
```js
function getPageInfo(req, res, next) { ... }
```
extracts pagination info from request query parameters

### request query parameters
- `req.query.page` zero-indexed integer of the current page. defaults to `0`
- `req.query.start` integer (milliseconds since epoch) representing the start of the pagination session. prevents duplicate records in the response. defaults to `new Date()`

### request output
- `req.page` object containing the current page, and pagination start (`req.page.number` and `req.page.start`)
