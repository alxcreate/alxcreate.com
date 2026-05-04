# ICMP Ping (Agent-based)

The standard Zabbix capabilities for monitoring node availability via ICMP protocol, implemented through data items `icmpping`, `icmppingloss`, and `icmppingsec`, are powerful tools for basic network health checking. These checks belong to the "Simple checks" category, meaning they are executed directly from the Zabbix server or Zabbix proxy. This approach effectively confirms the presence of a network route and availability of the target node from the perspective of the central monitoring infrastructure.

This may not be sufficient in scenarios where you need to check: Is the database server accessible from the application server? Can the web server reach the internal API? Is there network connectivity between two nodes in different network segments protected by firewalls? A positive check result from the Zabbix server to both nodes does not guarantee connectivity between them.

For such checks, we must move the source of verification from the central monitoring server to one of the monitored nodes (agents). Instead of asking "Does the Zabbix server see node B?", we ask the question "Does node A see node B?".

## Basic Principle

The foundation for implementing monitoring from a specified observation point is the UserParameter mechanism in the Zabbix agent. This directive in the agent configuration file allows extending its standard functionality by providing the ability to execute arbitrary local commands or scripts and return their results to the Zabbix server.

For creating a universal and reusable solution, flexible user parameters play a key role. Their syntax, `UserParameter=key[*],command`, allows passing arguments from the Zabbix data item key directly to the command executed on the agent. Arguments enclosed in square brackets in the data item key become available in the command through positional variables `$1`, `$2`, and so on.

The universal template for Linux and Windows will define what data it expects but remain independent of how the agent generates this data.

All platform-specific complexity is encapsulated within the Zabbix agent configuration on each specific node. The administrator only needs to configure user parameters once according to the host's operating system, after which the universal template can be applied to it. This design pattern has high scalability and maintenance convenience. Any changes in monitoring logic (for example, adjusting trigger thresholds or adding new checks) are made centrally in one template and automatically applied to all hosts, regardless of their OS.

## Linux Implementation

Linux family operating systems provide a powerful set of standard command-line utilities such as `ping`, `grep`, `awk`, `cut`, and `tr`. By combining them in pipelines, you can effectively parse the text output of the `ping` command and extract the necessary metrics. Below are reliable commands for each of the three required indicators.

### Availability (icmpping)

To determine basic node availability, it's sufficient to send one ICMP packet and check the return code of the `ping` command. Successful command execution returns code `0`. However, for Zabbix it's more convenient to get value `1` in case of success and `0` in case of failure. This can be achieved with the following construction:

```bash
ping -c 1 -W 1 $1 >/dev/null 2>&1 && echo 1 || echo 0
```

- `ping -c 1 -W 1 $1`: Sends one (`-c 1`) ICMP packet to the address passed as the first argument (`$1`), with a maximum response timeout of 1 second (`-W 1`).
- `>/dev/null 2>&1`: Redirects standard output (stdout) and standard error output (stderr) to `/dev/null` to hide the command's text output.
- `&& echo 1`: If the ping command completed successfully (return code `0`), this part executes, outputting `1`.
- `|| echo 0`: If the ping command completed with an error (non-zero return code), this part executes, outputting `0`.

### Packet Loss (icmpping.loss)

The percentage of lost packets is contained in the summary line of the `ping` command output. To extract it, we'll build the following command pipeline:

```bash
ping -c 5 -W 1 $1 | grep 'packet loss' | awk -F',' '{print $3}' | awk '{print $1}' | tr -d '%'
```

- `ping -c 5 -W 1 $1`: Sends 5 packets for more accurate loss statistics.
- `| grep 'packet loss'`: From all `ping` output, filters only the line containing the phrase "packet loss". Example line: `5 packets transmitted, 5 received, 0% packet loss, time 4005ms`.
- `| awk -F',' '{print $3}'`: Uses `awk` with field separator (`-F`) set to comma. Selects the third field, which in our example would be `0% packet loss`.
- `| awk '{print $1}'`: Uses `awk` with the default separator (space) to extract the first field from the previous result, i.e., `0%`.
- `| tr -d '%'`: Removes (`-d`) the `%` symbol from the output, leaving only the numeric value.

### Response Time (icmpping.sec)

The average response time is also found in the final `ping` statistics, in the last line of output. The command to extract it and convert to seconds looks like this:

```bash
ping -c 5 -W 1 $1 | tail -1 | awk -F'/' '{print $5/1000}'
```

- `ping -c 5 -W 1 $1`: Sends 5 packets.
- `| tail -1`: Selects only the last line of output. Example line: `rtt min/avg/max/mdev = 0.388/0.430/0.469/0.031 ms`.
- `| awk -F'/' '{print $5/1000}'`: Uses `awk` with separator `/`. The fifth field (`$5`) contains the average response time in milliseconds. We immediately divide it by 1000 to get the value in seconds, as required by the standard `icmppingsec` data item.

### Linux Zabbix Agent Configuration

The default agent configuration file includes configuration files from the `zabbix_agentd.d` directory (`Include=/etc/zabbix/zabbix_agentd.d/*.conf`). You can create a separate file `userparams-ping.conf` in this directory to segment the changes made.

To avoid conflicts with existing keys on the Zabbix server, we use `custom` in the name.

When adding the obtained commands, it's necessary to consider that the `$` symbol is used in `awk` to denote fields. To avoid conflicts with Zabbix syntax, the `$` symbol needs to be escaped by doubling it (`$$`). As a result, the corresponding lines in the agent configuration file will look as follows:

```conf
# Distributed ICMP Monitoring Parameters for Linux
UserParameter=custom.icmpping[*],ping -c 1 -W 1 $1 >/dev/null 2>&1 && echo 1 || echo 0
UserParameter=custom.icmpping.loss[*],ping -c 5 -W 1 $1 | grep 'packet loss' | awk -F',' '{print $$3}' | awk '{print $$1}' | tr -d '%'
UserParameter=custom.icmpping.sec[*],ping -c 5 -W 1 $1 | tail -1 | awk -F'/' '{print $$5/1000}'
```

After changing the configuration, you need to restart the agent service:

```bash
sudo systemctl restart zabbix-agent
```

### Testing

For local testing of user parameters, you can use the commands:

```bash
zabbix_agentd -t custom.icmpping[8.8.8.8]
zabbix_agentd -t custom.icmpping.loss[8.8.8.8]
zabbix_agentd -t custom.icmpping.sec[8.8.8.8]
```

For testing from the Zabbix server, you need to specify the address of the host where you configured the agent:

```bash
zabbix_get -s <agent_IP_address> -k custom.icmpping[8.8.8.8]
```

## Windows Implementation

For Windows systems, the modern and most reliable approach is using PowerShell and its `Test-Connection` cmdlet. Unlike parsing the text output of the `ping.exe` utility, which can change depending on the operating system language and Windows version, `Test-Connection` returns a structured `Win32_PingStatus` object.

For deployment convenience and to avoid the need to distribute separate `.ps1` files, we'll create compact one-line commands that can be embedded directly into the Zabbix agent configuration file.

### Availability (icmpping)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-Connection -ComputerName $1 -Count 1 -Quiet) { 1 } else { 0 }"
```

- `powershell -NoProfile -ExecutionPolicy Bypass -Command "..."`: Standard PowerShell invocation that ignores user profiles (`-NoProfile`) and bypasses local script execution policies (`-ExecutionPolicy Bypass`).
- `Test-Connection -ComputerName $1 -Count 1 -Quiet`: Performs one availability check of the target (`$1`). The `-Quiet` key forces the cmdlet to return a simple boolean value: `$true` on success and `$false` on failure.
- `if (...) { 1 } else { 0 }`: Converts the boolean result to the numeric format `1` or `0` expected by Zabbix.

### Packet Loss (icmpping.loss)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "$result = @(Test-Connection -ComputerName $1 -Count 5 -ErrorAction SilentlyContinue); if ($result.Count -gt 0) { (($result.Count - ($result | Where-Object { $_.StatusCode -eq 0 }).Count) / $result.Count) * 100 } else { 100 }"
```

- `$result = @(Test-Connection...)`: Performs 5 checks and saves the results in the `$result` array. `@()` ensures that `$result` is always an array, even if one or zero objects are returned.
- `-ErrorAction SilentlyContinue`: Suppresses error output in case of complete host unavailability.
- `if ($result.Count -gt 0)`: Checks if at least one response was received (even with an error).
- `($result | Where-Object { $_.StatusCode -eq 0 }).Count`: Filters the results array, leaving only successful responses (`StatusCode` equals `0`), and counts them.
- `(($result.Count - <successful>) / $result.Count) * 100`: Calculates the loss percentage as the difference between the total number of attempts and the number of successful responses, divided by the total number of attempts.
- `else { 100 }`: If the host is completely unavailable and no response objects were received, returns 100% loss.

### Response Time (icmpping.sec)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "$result = Test-Connection -ComputerName $1 -Count 5 -ErrorAction SilentlyContinue | Where-Object { $_.StatusCode -eq 0 }; if ($result) { Write-Host (($result | Measure-Object -Property ResponseTime -Average).Average / 1000) } else { Write-Host 0 }"
```

- `$result = Test-Connection... | Where-Object { $_.StatusCode -eq 0 }`: Performs 5 checks and immediately filters only successful results.
- `if ($result)`: Checks if there was at least one successful response.
- `($result | Measure-Object -Property ResponseTime -Average).Average`: Uses the `Measure-Object` cmdlet to calculate the average value of the `ResponseTime` property for all successful responses.
- `/ 1000`: Divides the average value (in milliseconds) by `1000` to get seconds.
- `else { Write-Host 0 }`: If there were no successful responses, returns `0`. `Write-Host` is used for explicit output to the standard output stream.

### Windows Zabbix Agent Configuration

The `UserParameter` syntax in Windows is similar to Linux, but the command specifies the full `powershell.exe` invocation.

Final configuration block for the `userparams-ping.conf` file in the `zabbix_agentd.d/` directory:

```conf
# Distributed ICMP Monitoring Parameters for Windows
UserParameter=custom.icmpping[*],powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-Connection -ComputerName $1 -Count 1 -Quiet) { 1 } else { 0 }"
UserParameter=custom.icmpping.loss[*],powershell -NoProfile -ExecutionPolicy Bypass -Command "$result = @(Test-Connection -ComputerName $1 -Count 5 -ErrorAction SilentlyContinue); if ($result.Count -gt 0) { (($result.Count - ($result | Where-Object { $_.StatusCode -eq 0 }).Count) / $result.Count) * 100 } else { 100 }"
UserParameter=custom.icmpping.sec[*],powershell -NoProfile -ExecutionPolicy Bypass -Command "$result = Test-Connection -ComputerName $1 -Count 5 -ErrorAction SilentlyContinue | Where-Object { $_.StatusCode -eq 0 }; if ($result) { Write-Host (($result | Measure-Object -Property ResponseTime -Average).Average / 1000) } else { Write-Host 0 }"
```

Running a PowerShell instance can take some time. If you observe timeout errors in Zabbix, you may need to increase the `Timeout` parameter value from the standard 3 seconds to, for example, 10 or 20 seconds.

After adding the configuration, restart the "Zabbix Agent" service through the `services.msc` snap-in or using PowerShell: `Restart-Service "Zabbix Agent"` or `Restart-Service "Zabbix Agent 2"`.

### Testing

For local testing, open a command prompt (`cmd.exe` or PowerShell), navigate to the Zabbix agent installation directory (for example, `C:\Program Files\Zabbix Agent 2`) and execute: `.\zabbix_agent2.exe -t custom.icmpping[8.8.8.8]`

Perform testing from the Zabbix server using `zabbix_get`, as described in the Linux section.

## Creating Universal Zabbix Template

After agents on both platforms are configured to respond to the same keys, you can proceed to create a centralized template in the Zabbix web interface.

### Creating Template and Defining Macros

1. Go to `Data collection → Templates` section and click the `Create template` button.
2. Fill in the basic attributes:
   - **Template name**: `ICMP Ping (Agent-based)`
   - **Template groups**: Select an appropriate group, for example, `Templates/Network devices`.
3. Go to the `Macros` tab and create a user macro:
   - **Macro**: `{$PING_TARGET}`
   - **Value**: `127.0.0.1` (this value will be used by default if not overridden at the host level).
   - **Description**: `IP address or DNS name of the host to check availability from the agent`.

### Data Items

Go to the `Items` tab of the created template and sequentially create three data items using the `Create item` button.

1. **Availability**
   - **Name**: `ICMP Ping (from Agent) to {$PING_TARGET}`
   - **Type**: `Zabbix agent`
   - **Key**: `custom.icmpping[{$PING_TARGET}]`
   - **Type of information**: `Numeric (unsigned)`
   - **Units**: Leave empty
   - **Update interval**: `1m`
   - **History storage period**: `7d`
   - **Trend storage period**: `365d`
2. **Packet Loss**
   - **Name**: `ICMP Loss (from Agent) to {$PING_TARGET}`
   - **Type**: `Zabbix agent`
   - **Key**: `custom.icmpping.loss[{$PING_TARGET}]`
   - **Type of information**: `Numeric (float)`
   - **Units**: `%`
   - **Update interval**: `1m`
   - **History storage period**: `90d`
   - **Trend storage period**: `365d`
3. **Response Time**
   - **Name**: `ICMP Response Time (from Agent) to {$PING_TARGET}`
   - **Type**: `Zabbix agent`
   - **Key**: `custom.icmpping.sec[{$PING_TARGET}]`
   - **Type of information**: `Numeric (float)`
   - **Units**: `s`
   - **Update interval**: `1m`
   - **History storage period**: `90d`
   - **Trend storage period**: `365d`

### Triggers

The alert logic will replicate the standard `ICMP Ping` template to ensure familiar and effective behavior.

Go to the `Triggers` tab and create three triggers.

1. **ICMP Unavailable**
   - **Name**: `Unavailable by ICMP ping from {HOST.NAME} to {$PING_TARGET}`
   - **Severity**: `High`
   - **Expression**: `max(/Template Module ICMP Ping (Agent-based)/custom.icmpping,#3)=0`
   - **Description**: This trigger will fire if the last three availability checks (`max(...,#3)`) returned value `0` (unavailable).
2. **High ICMP Packet Loss**
   - **Name**: `High ICMP ping loss from {HOST.NAME} to {$PING_TARGET}`
   - **Severity**: `Warning`
   - **Expression**: `min(/Template Module ICMP Ping (Agent-based)/custom.icmpping.loss,5m)>{$ICMP_LOSS_WARN}`
   - **Dependencies**: Add dependency on the "ICMP Unavailable" trigger. This will prevent unnecessary loss alerts when the host is completely unavailable.
   - **Note**: For this trigger to work, you need to add the `{$ICMP_LOSS_WARN}` macro on the template's `Macros` tab with a default value of `20`.
3. **High ICMP Response Time**
   - **Name**: `High ICMP ping response time from {HOST.NAME} to {$PING_TARGET}`
   - **Severity**: `Warning`
   - **Expression**: `avg(/Template Module ICMP Ping (Agent-based)/custom.icmpping.sec,5m)>{$ICMP_RESPONSE_TIME_WARN}`
   - **Dependencies**: Add dependencies on the "ICMP Unavailable" and "High ICMP packet loss" triggers.
   - **Note**: You need to add the `{$ICMP_RESPONSE_TIME_WARN}` macro on the template's `Macros` tab with a default value of `0.15` (150 ms).## Testing

After applying the template and updating the configuration, go to `Monitoring → Latest data` section. Use the filter to select your Node A. Within a few minutes, you should see three new data items appear and receive their first values.

The presented template uses passive checks (`Zabbix agent`) by default. This means that the Zabbix server initiates a connection to the agent for each data request. With a large number of such checks, this can create significant load on the Zabbix server's poller processes.

For scenarios with a large number of user parameters, it's recommended to use active checks (`Zabbix agent (active)`). In this mode, the agent periodically requests a list of tasks from the server, executes them, and sends the results in one batch. This significantly reduces server load and improves scalability. To switch, it's sufficient to change the data item type in the template to `Zabbix agent (active)`.

## Security

The agent parameter `UnsafeUserParameters` allows passing special characters such as `|`, `&`, `;`, `>` in user parameter arguments. Enabling this option creates a serious vulnerability: if an attacker gains control of the Zabbix server, they can execute arbitrary commands on all agents with this parameter enabled by creating a special data item.

For the solution described in this guide, enabling `UnsafeUserParameters` is not required. Our commands pass only IP addresses or DNS names as arguments, which do not contain forbidden characters. It's strongly recommended to leave `UnsafeUserParameters=0` (default value) to maintain the security of your monitoring infrastructure.

## Functionality Extension

You can add additional arguments to user parameters. For example, to control the number of packets sent or timeout.

Example for Linux:

```conf
UserParameter=custom.icmpping.loss[*],ping -c $2 -W 1 $1 |...
```

The data item key in Zabbix would then look like: `custom.icmpping.loss[{$PING_TARGET},5]`, where `5` is the number of packets.

This allows flexible configuration of check parameters for each host through macros without changing agent configurations.
