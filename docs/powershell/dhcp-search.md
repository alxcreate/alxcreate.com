# Search DHCP leases

## Introduction

This script allows you to search for DHCP leases on multiple DHCP servers in your domain. You can search by MAC address, IP address, or hostname.

## Prerequisites

This script requires the `DhcpServer` module included in the Remote Server Administration Tools (RSAT) feature.

## Script

```powershell
function Format-MacAddress {
    param(
        [string]$mac
    )

    $mac = $mac.ToUpper() -replace '[^0-9A-F]', ''

    if ($mac.Length -ne 12) {
        throw "Wrong MAC address format."
    }

    return [regex]::Replace($mac, '(.{2})', '$1-').TrimEnd('-')
}

function Search-DHCPInfo {
    param(
        [Parameter(Mandatory=$true)]
        [string]$SearchValue,

        [Parameter(Mandatory=$false)]
        [ValidateSet("MAC", "IP", "Hostname")]
        [string]$SearchType = "Auto"
    )

    if ($SearchType -eq "Auto") {
        if ($SearchValue -match '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$' -or $SearchValue -match '^[0-9A-Fa-f]{12}$') {
            $SearchType = "MAC"
        }
        elseif ($SearchValue -match '^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$') {
            $SearchType = "IP"
        }
        else {
            $SearchType = "Hostname"
        }
    }

    $dhcpServers = Get-DhcpServerInDC
    $results = @()

    foreach ($server in $dhcpServers) {
        Write-Verbose "Checking server: $($server.DnsName)"

        try {
            $scopes = Get-DhcpServerv4Scope -ComputerName $server.DnsName

            foreach ($scope in $scopes) {
                Write-Verbose "Checking scope: $($scope.ScopeId)"

                $leases = Get-DhcpServerv4Lease -ComputerName $server.DnsName -ScopeId $scope.ScopeId

                $matches = switch ($SearchType) {
                    "MAC" {
                        $formattedMac = Format-MacAddress $SearchValue
                        $leases | Where-Object { $_.ClientId -eq $formattedMac }
                    }
                    "IP" {
                        $leases | Where-Object { $_.IPAddress -eq $SearchValue }
                    }
                    "Hostname" {
                        $leases | Where-Object { $_.HostName -like "*$SearchValue*" }
                    }
                }

                if ($matches) {
                    foreach ($match in $matches) {
                        $description = ""
                        try {
                            $reservation = Get-DhcpServerv4Reservation -ComputerName $server.DnsName -ScopeId $scope.ScopeId -ClientId $match.ClientId -ErrorAction SilentlyContinue
                            if ($reservation) {
                                $description = $reservation.Description
                            }
                        }
                        catch {
                            Write-Verbose "Could not get reservation description: $_"
                        }

                        $results += [PSCustomObject]@{
                            DHCPServer = $server.DnsName
                            ScopeID = $scope.ScopeId
                            ScopeName = $scope.Name
                            IPAddress = $match.IPAddress
                            HostName = $match.HostName
                            MACAddress = $match.ClientId
                            LeaseExpiryTime = $match.LeaseExpiryTime
                            AddressState = $match.AddressState
                            Description = $description
                        }
                    }
                }
            }
        }
        catch {
            Write-Warning "Error accessing server $($server.DnsName): $_"
        }
    }

    return $results
}

function Format-DHCPResults {
    param(
        [Parameter(ValueFromPipeline=$true)]
        $Results
    )

    process {
        if ($Results.Count -eq 0) {
            Write-Host "No results found." -ForegroundColor Yellow
            return
        }

        foreach ($result in $Results) {
            Write-Host "`nFound DHCP lease:" -ForegroundColor Green
            Write-Host "DHCPServer     : $($result.DHCPServer)"
            Write-Host "ScopeName      : $($result.ScopeID) ($($result.ScopeName))"
            Write-Host "IPAddress      : $($result.IPAddress)"
            Write-Host "HostName       : $($result.HostName)"
            Write-Host "MACAddress     : $($result.MACAddress)"
            Write-Host "LeaseExpiryTime: $($result.LeaseExpiryTime)"
            Write-Host "AddressState   : $($result.AddressState)"
            Write-Host "Description    : $($result.Description)"
            Write-Host ($("-" * 50))
        }
    }
}
```

### Examples of usage

```powershell
Search-DHCPInfo -SearchValue "00:11:22:33:44:55" | Format-DHCPResults
Search-DHCPInfo -SearchValue "192.168.1.100" | Format-DHCPResults
Search-DHCPInfo -SearchValue "PC01" | Format-DHCPResults
```
