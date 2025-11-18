
**Express `req.params`**
Last Updated: 07 Jan, 2025

What it is:
- `req.params` is an object containing route parameters. For route `/student/:id`, `req.params.id` holds the value from the URL.

Syntax:
- `req.params`

Example:
```js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/student/:id', (req, res) => {
  console.log(req.params.id);
  res.send(`id: ${req.params.id}`);
});

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
```

Run:
- `npm install express`
- `node index.js`

Test:
- Open `http://localhost:3000/student/123` — server logs `123` and responds `id: 123`.

Notes:
- `req.params` defaults to an empty object `{}` when no route parameters exist.