
# Express `req.query`

Short: access query string parameters from the request URL.

Usage:

- `req.query` — an object with key/value pairs parsed from the URL query string.

Example:

```js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/profile', (req, res) => {
  // GET /profile?name=Gourav
  // req.query -> { name: 'Gourav' }
  res.send(req.query.name || 'no name');
});

app.get('/user', (req, res) => {
  // GET /user?name=Gourav&age=11
  const { name, age } = req.query;
  res.json({ name, age });
});

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
```

Notes:

- `req.query` is always an object (empty if no query string).
- For nested parsing or arrays, consider using a parser (e.g., `qs`) or middleware.
- No extra middleware is required for simple query access.

Quick test:

1) Start the server: `node index.js`
2) Visit: `http://localhost:3000/profile?name=Gourav`

The server will respond with `Gourav`.
