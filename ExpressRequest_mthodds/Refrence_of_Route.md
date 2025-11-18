# Express Request (`req`) — Commonly used

This is a short, practical reference of the `req` properties and methods you'll use most.

## Common properties

- `req.params` — route params (e.g., `/user/:id` → `req.params.id`).
- `req.query` — query string object (e.g., `?q=term` → `req.query.q`).
- `req.body` — parsed request body (requires `express.json()` or `express.urlencoded()`).
- `req.headers` / `req.get(name)` — request headers (use `req.get('content-type')`).
- `req.method` — HTTP method (`GET`, `POST`, etc.).
- `req.path` — request path (no query string).
- `req.ip` — remote IP address.
- `req.hostname` — Host header hostname.
- `req.cookies` / `req.signedCookies` — cookies (requires `cookie-parser`).

## Common methods

- `req.get(field)` — get header value (case-insensitive).
- `req.is(type)` — check Content-Type (e.g., `req.is('json')`).
- `req.accepts(types)` — content negotiation helper.

## Tiny examples

```js
// params
app.get('/user/:id', (req, res) => res.send(req.params.id));

// query
app.get('/search', (req, res) => res.send(req.query.q));

// body (JSON middleware required)
app.post('/item', express.json(), (req, res) => res.json(req.body));
```

