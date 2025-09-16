# Обновление Zabbix из исходного кода

1. Установите новую версию

    ```bash
    NEW_VERSION="7.2.3"
    MAJOR_VERSION=${NEW_VERSION%.*}
    ```

2. Загрузите исходный код с [https://www.zabbix.com/download_sources](https://www.zabbix.com/download_sources) в папку `/home/zabbix${NEW_VERSION}`

    ```bash
    wget https://cdn.zabbix.com/zabbix/sources/stable/${MAJOR_VERSION}/zabbix-${NEW_VERSION}.tar.gz -P /home/zabbix${NEW_VERSION}
    ```

3. Распакуйте исходный код

    ```bash
    cd /home/zabbix${NEW_VERSION}
    tar -zxvf zabbix-${NEW_VERSION}.tar.gz
    ```

4. Выполните `configure` с необходимыми опциями

    ```bash
    cd /home/zabbix${NEW_VERSION}/zabbix-${NEW_VERSION}
    ./configure --enable-server --enable-agent --with-mysql --enable-ipv6 --with-net-snmp --with-libcurl --with-libxml2 --with-openipmi
    ```

5. При необходимости установите необходимые компоненты

    ```bash
    apt-get install libopenipmi-dev / sudo yum install OpenIPMI-devel
    ```

6. После успешной конфигурации скомпилируйте и установите

    ```bash
    make install
    ```

    Команда `make install` установит исполняемые файлы демонов (`zabbix_server`, `zabbix_agentd`, `zabbix_proxy`) в `/usr/local/sbin` и клиентские исполняемые файлы (`zabbix_get`, `zabbix_sender`) в `/usr/local/bin`.

    Файлы конфигурации будут установлены в `/usr/local/etc/zabbix_server.conf`.

7. Скопируйте файлы веб-интерфейса из исходной папки

    ```bash
    cp -rf /var/www/html/zabbix /var/www/html/_zabbix
    cp -rf /home/zabbix${NEW_VERSION}/zabbix-${NEW_VERSION}/ui/* /var/www/html/zabbix/
    rm -rf /var/www/html/_zabbix
    ```

8. При необходимости отредактируйте файл php.ini

    ```bash
    nano /etc/php/8.3/apache2/php.ini
    ```

9. Перезапустите службы

    ```bash
    systemctl restart zabbix-server zabbix-agent apache2
    ```
