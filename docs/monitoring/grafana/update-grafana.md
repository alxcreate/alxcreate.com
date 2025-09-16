# Update Grafana

1. Set new version

```sh
NEW_VERSION="11.5.0"
```

2. Make backup

```sh
mkdir /home/grafana-backup
cp /etc/grafana/grafana.ini /home/grafana-backup/grafana.ini
cp /var/lib/grafana/grafana.db /home/grafana-backup/grafana.db

mkdir /home/grafana-backup/plugins
cp -rf /var/lib/grafana/plugins/* /home/grafana-backup/plugins
```

3. Download Grafana

```sh
wget https://dl.grafana.com/oss/release/grafana_${NEW_VERSION}_amd64.deb
```

4. Install Grafana

```sh
sudo dpkg -i grafana_${NEW_VERSION}_amd64.deb
```
