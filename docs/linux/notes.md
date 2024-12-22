---
title: Linux notes
---


## Change SWAP size

1. Turn off all running swap processes: `swapoff -a`
2. Resize swap `fallocate -l 1G /swapfile` (change 1G to the gigabyte size you want it to be)
3. CHMOD swap: `chmod 600 /swapfile`
4. Make file usable as swap `mkswap /swapfile`
5. Active the swap file `swapon /swapfile`

To verify your swap size run the following command and you will see the swap size: `free -m`

## Copy key to remote host

```bash
scp -i ~/.ssh/id_rsa user@10.0.0.1:.ssh/id_rsa
```

## Change user password

```bash
passwd username
```

## Login via SSH with password

```bash
nano /etc/ssh/sshd_config
```

```conf
PasswordAuthentication yes/no
AllowUsers jenkins
```

```bash
systemctl restart sshd
```

## Add host to known hosts

```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

## Show where the command is located and add to PATH

```bash
which molecule
echo $PATH
export PATH=$PATH:/path/to/molecule
```

## Add user to sudoers

```bash
nano /etc/sudoers
```

## Add ssh key for system

```bash
chmod 600 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa
```

## Add admin for system

```bash
useradd -m -s /bin/bash admin
passwd admin
usermod -aG wheel admin
visudo
```

## Install FTP

```bash
apt update
apt install vsftpd
systemctl start vsftpd
systemctl enable vsftpd
useradd -m testuser
passwd testuser
ufw allow 20/tcp
ufw allow 21/tcp
mkdir /srv/ftp/new_location
usermod -d /srv/ftp/new_location ftp
systemctl restart vsftpd.service
nano /etc/vsftpd.conf
```

```conf title="/etc/vsftpd.conf"
write_enable=YES
```

```bash
systemctl restart vsftpd.service
```

```conf
chroot_local_user=YES
chroot_list_file=/etc/vsftpd.chroot_list
```
