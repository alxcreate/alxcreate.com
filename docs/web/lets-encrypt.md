# Let's Encrypt

Install certbot

```bash
apt update
apt install certbot python3-certbot-nginx
```

Edit nginx config file

```bash
nano /etc/nginx/sites-available/default
```

Add domain names

```conf
server_name example.com <www.example.com>;
```

Check config files

```bash
nginx -t
```

Reload nginx

```bash
systemctl reload nginx
```

Create new cert

```bash
certbot --nginx -d example.com -d <www.example.com> --non-interactive --agree-tos -m <admin@example.com>
```

Check timer

```bash
systemctl status certbot.timer
```

Check work

```bash
certbot renew --dry-run
```

For CentOS add to cron

```bash
crontab -e
30 4 ** * /usr/bin/certbot renew --quiet
```
