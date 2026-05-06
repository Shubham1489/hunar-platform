# SSL Certificates
Place your SSL certificates here:
- `fullchain.pem` (certificate + intermediate CA)
- `privkey.pem` (private key)

## Using Letsencrypt:
```bash
sudo certbot certonly --standalone -d yourdomain.com
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./
```

**NEVER commit SSL certificates to git!** They are excluded in `.gitignore`.
