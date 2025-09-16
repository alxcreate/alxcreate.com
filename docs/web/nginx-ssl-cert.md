# Nginx SSL certificate

Create private key:

```bash
openssl genrsa -out servername.key 2048
```

Create configuration file with following content:

```conf title="servername-key.conf"
[req]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_extensions
distinguished_name = dn

[dn]
C=CA # Country Name
ST=Region # State or Province
L=Town # Locality or City
O=Global Security
OU=IT Department # Organizational Unit
emailAddress=email@domain.com # Email
CN = servername # Common Name

[req_extensions]
subjectAltName = @alter_name

[alter_name]
DNS.1 = servername.domain.com
```

Create a certificate signing request (CSR) using private key and configuration file:

```bash
openssl req -new -key servername.key -out servername.csr -config servername-key.conf
cat servername.csr
```

Use `servername.csr` for **Microsoft Active Directory Certificate Services**

Use folowing command to convert certificate to **base64** format:

```bash
openssl base64 -in servername.csr -out servername_base64.csr
cat servername_base64.csr
```

Convert certificate:

```bash
openssl x509 -inform DER -in servername.cer -out servername.crt
```

Set permissions for key and certificate files:

```bash
chmod 400 servername.key
chmod 400 servername.crt
```

Convert certificate to **PEM** format:

```bash
openssl x509 -inform der -in ca.cer -out ca.pem
```

Copy certificate to **/usr/local/share/ca-certificates**:

```bash
cp ./certs/ca.pem /usr/local/share/ca-certificates/ca.crt
```

Update certificates:

```bash
update-ca-certificates
```

Add certificate to Nginx configuration:

```bash
nano /etc/nginx/sites-available/default
```

```conf
server {
    listen 443 ssl;
    server_name server.com;

    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    # ...
}
```

Restart Nginx

```bash
sudo systemctl restart nginx
```
