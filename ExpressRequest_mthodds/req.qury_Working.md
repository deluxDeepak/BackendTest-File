---
# req.query — Working
---

1. Jab tum URL hit karte ho

Agar tum browser me likhte ho:

`http://localhost:3000/profile?name=Gourav&age=22`

To ye 3 cheezein send hoti hain:

- Route path → `/profile`
- Query string → `?name=Gourav&age=22`
- HTTP method → `GET`

🚀 2. Express route match hota hai

Express check karta hai:

```js
app.get('/profile', ...)
```

URL ka path `/profile` match ho gaya → to ye callback run hoga:

```js
(req, res) => {
    console.log("Query output:", req.query);
}
```

🚀 3. Query string parsing hoti hai (Important)

URL me:

`?name=Gourav&age=22`

Isme:

- name = Gourav
- age = 22

Express internally "qs" (querystring) parser use karta hai:

`?name=Gourav&age=22`

↓ parse hota hai

```js
{
  name: "Gourav",
  age: "22"
}
```

But ye object normal object nahi hota.
It is created like:

```js
Object.create(null)
```

Isliye output print hota hai:

```text
[Object: null prototype] { name: 'Gourav', age: '22' }
```

Null prototype = object without default JS methods.

🚀 4. Express iss parsed object ko req.query me store karta hai

So inside route:

```js
console.log(req.query);
```

Result:

```js
{ name: 'Gourav', age: '22' }
```

But console shows:

```text
[Object: null prototype] { name: 'Gourav', age: '22' }
```

Prototype ke wajah se.

🚀 5. Ab tum ise response me use kar sakte ho

```js
res.send(`Name is ${req.query.name}`);
```

Output:

```text
Name is Gourav
```

🧠 END-TO-END FLOW SUMMARY

| Step | What happens          | Example                    |
|------|-----------------------|----------------------------|
| 1    | Browser request       | `/profile?name=Gourav`     |
| 2    | Express route match   | `app.get('/profile')`      |
| 3    | Query string parsed   | `{ name: 'Gourav' }`       |
| 4    | Stored in req.query   | `req.query.name = Gourav`  |
| 5    | Response sent         | `"Name is Gourav"`        |

🔥 Bonus: WHY Null Prototype?

- ❌ To prevent prototype pollution
- ✔️ Security
- ✔️ Query ko simple key-value object bana kar rakhna
- ✔️ Cleaner input

Ye intentional behavior hai — koi error nahi.