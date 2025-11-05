# HTTP vs HTTPS

## What is the difference between HTTP and HTTPS?

- **HTTP (HyperText Transfer Protocol):**
  - Data is sent in plain text.
  - Not secure; vulnerable to interception and attacks.
  - Uses port 80 by default.

- **HTTPS (HyperText Transfer Protocol Secure):**
  - Data is encrypted using SSL/TLS.
  - Secure; protects data from interception.
  - Uses port 443 by default.

---

## How to create and use HTTPS?

1. **Obtain an SSL/TLS Certificate:**
   - Get a certificate from a trusted Certificate Authority (CA) or generate a self-signed certificate for development.

2. **Configure Your Server:**
   - Install the certificate on your web server (e.g., Apache, Nginx, Node.js).
   - Update server configuration to use HTTPS.

3. **Update Application URLs:**
   - Change all URLs from `http://` to `https://`.

4. **Test Your Setup:**
   - Access your site using `https://` and ensure there are no security warnings.

---

## What is redirecting, how does it work, and when is it used?

- **Redirecting** means automatically sending users from one URL to another.
- **How it works:** The server responds with a special HTTP status code (like 301 or 302) and the new URL.
- **When to use:**
  - Moving a website or page to a new address.
  - Forcing all traffic to use HTTPS instead of HTTP.
  - URL shortening or tracking.

**Example:**  
Redirecting all HTTP traffic to HTTPS for