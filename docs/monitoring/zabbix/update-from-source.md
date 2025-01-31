# Update Zabbix from Source

1. Set new version

    ```bash
    NEW_VERSION="7.2.3"
    MAJOR_VERSION=${NEW_VERSION%.*}
    ```

2. Download source from [https://www.zabbix.com/download_sources](https://www.zabbix.com/download_sources) to folder `/home/zabbix${NEW_VERSION}`

    ```bash
    wget https://cdn.zabbix.com/zabbix/sources/stable/${MAJOR_VERSION}/zabbix-${NEW_VERSION}.tar.gz -P /home/zabbix${NEW_VERSION}
    ```

3. Extract source

    ```bash
    cd /home/zabbix${NEW_VERSION}
    tar -zxvf zabbix-${NEW_VERSION}.tar.gz
    ```

4. Execute `configure` with necessary options

    ```bash
    cd /home/zabbix${NEW_VERSION}/zabbix-${NEW_VERSION}
    ./configure --enable-server --enable-agent --with-mysql --enable-ipv6 --with-net-snmp --with-libcurl --with-libxml2 --with-openipmi
    ```

5. If necessary, install the necessary components

    ```bash
    apt-get install libopenipmi-dev / sudo yum install OpenIPMI-devel
    ```

6. After successful configuration, compile and install

    ```bash
    make install
    ```

    The `make install` command will install the daemon executables (`zabbix_server`, `zabbix_agentd`, `zabbix_proxy`) in `/usr/local/sbin` and the client executables (`zabbix_get`, `zabbix_sender`) in `/usr/local/bin`.

    The configuration files will be installed in `/usr/local/etc/zabbix_server.conf`.

7. Copy frontend files from source folder

    ```bash
    cp -rf /var/www/html/zabbix /var/www/html/_zabbix
    cp -rf /home/zabbix${NEW_VERSION}/zabbix-${NEW_VERSION}/ui/* /var/www/html/zabbix/
    rm -rf /var/www/html/_zabbix
    ```

8. If required, edit php.ini file

    ```bash
    nano /etc/php/8.3/apache2/php.ini
    ```

9. Restart services

    ```bash
    systemctl restart zabbix-server zabbix-agent apache2
    ```
