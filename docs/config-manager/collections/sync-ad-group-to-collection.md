# Sync Active Directory Group to Collection

This script will sync computers or users from an Active Directory group to a Configuration Manager collection. The script will add or remove devices or users from the collection based on the members of the AD group.

## Devices

```powershell
function Sync-ADGroupToCollection {
    param (
        [Parameter(Mandatory=$true)]
        [string]$ADGroupName,

        [Parameter(Mandatory=$true)]
        [string]$CollectionName,

        [Parameter(Mandatory=$true)]
        [ValidateSet('Add','Remove')]
        [string]$Action,

        [Parameter(Mandatory=$false)]
        [string]$SiteCode = "AUTO",

        [Parameter(Mandatory=$false)]
        [string]$SiteServer = "localhost"
    )

    try {
        if (-not (Get-Module ActiveDirectory)) {
            Import-Module ActiveDirectory
        }

        if (-not (Get-Module ConfigurationManager)) {
            Import-Module ($env:SMS_ADMIN_UI_PATH.Substring(0,$env:SMS_ADMIN_UI_PATH.Length-5) + '\ConfigurationManager.psd1')
        }

        if ($SiteCode -eq "AUTO") {
            $SiteCode = (Get-PSDrive -PSProvider CMSite).Name
        }

        $ADComputers = Get-ADGroupMember -Identity $ADGroupName |
            Where-Object { $_.objectClass -eq "computer" } |
            ForEach-Object { Get-ADComputer $_ -Properties Name }

        if (-not $ADComputers) {
            Write-Warning "No computers found in AD group '$ADGroupName'"
            return
        }

        Write-Host "Found $($ADComputers.Count) computers in AD group"

        Push-Location "${SiteCode}:"

        $Collection = Get-CMDeviceCollection -Name $CollectionName
        if (-not $Collection) {
            throw "Collection '$CollectionName' not found"
        }

        $CMDevices = Get-CMDevice

        switch ($Action) {
            'Add' {
                $AddedCount = 0
                $SkippedCount = 0

                foreach ($Computer in $ADComputers) {
                    $CMDevice = $CMDevices | Where-Object { $_.Name -eq $Computer.Name }

                    if ($CMDevice) {
                        try {
                            $ExistingRule = Get-CMDeviceCollectionDirectMembershipRule -CollectionName $CollectionName |
                                Where-Object { $_.ResourceID -eq $CMDevice.ResourceID }

                            if (-not $ExistingRule) {
                                Add-CMDeviceCollectionDirectMembershipRule -CollectionName $CollectionName -ResourceId $CMDevice.ResourceID
                                Write-Host "Added device $($Computer.Name) to collection"
                                $AddedCount++
                            } else {
                                Write-Host "Device $($Computer.Name) already exists in collection" -ForegroundColor Yellow
                                $SkippedCount++
                            }
                        }
                        catch {
                            Write-Warning "Failed to add device $($Computer.Name): $_"
                            $SkippedCount++
                        }
                    } else {
                        Write-Warning "Device $($Computer.Name) not found in SCCM"
                        $SkippedCount++
                    }
                }

                Write-Host "`nOperation completed: Added $AddedCount devices, Skipped $SkippedCount devices"
            }

            'Remove' {
                $RemovedCount = 0
                $SkippedCount = 0

                foreach ($Computer in $ADComputers) {
                    $CMDevice = $CMDevices | Where-Object { $_.Name -eq $Computer.Name }

                    if ($CMDevice) {
                        try {
                            $ExistingRule = Get-CMDeviceCollectionDirectMembershipRule -CollectionName $CollectionName |
                                Where-Object { $_.ResourceID -eq $CMDevice.ResourceID }

                            if ($ExistingRule) {
                                Remove-CMDeviceCollectionDirectMembershipRule -CollectionName $CollectionName -ResourceId $CMDevice.ResourceID -Force
                                Write-Host "Removed device $($Computer.Name) from collection"
                                $RemovedCount++
                            } else {
                                Write-Host "Device $($Computer.Name) not found in collection" -ForegroundColor Yellow
                                $SkippedCount++
                            }
                        }
                        catch {
                            Write-Warning "Failed to remove device $($Computer.Name): $_"
                            $SkippedCount++
                        }
                    } else {
                        Write-Warning "Device $($Computer.Name) not found in SCCM"
                        $SkippedCount++
                    }
                }

                Write-Host "`nOperation completed: Removed $RemovedCount devices, Skipped $SkippedCount devices"
            }
        }
    }
    catch {
        Write-Error "An error occurred: $_"
    }
    finally {
        Pop-Location
    }
}
```

Use the function like this:

```powershell
# Add computers from AD group to collection
Sync-ADGroupToCollection -ADGroupName "IT-Computers" -CollectionName "My Collection" -Action Add
# Remove computers from AD group from collection
Sync-ADGroupToCollection -ADGroupName "IT-Computers" -CollectionName "My Collection" -Action Remove
```

## Users

```powershell
function Sync-ADGroupToUserCollection {
    param (
        [Parameter(Mandatory=$true)]
        [string]$ADGroupName,

        [Parameter(Mandatory=$true)]
        [string]$CollectionName,

        [Parameter(Mandatory=$true)]
        [ValidateSet('Add','Remove')]
        [string]$Action,

        [Parameter(Mandatory=$false)]
        [string]$SiteCode = "AUTO",

        [Parameter(Mandatory=$false)]
        [string]$SiteServer = "localhost"
    )

    try {
        if (-not (Get-Module ActiveDirectory)) {
            Import-Module ActiveDirectory
        }

        if (-not (Get-Module ConfigurationManager)) {
            Import-Module ($env:SMS_ADMIN_UI_PATH.Substring(0,$env:SMS_ADMIN_UI_PATH.Length-5) + '\ConfigurationManager.psd1')
        }

        if ($SiteCode -eq "AUTO") {
            $SiteCode = (Get-PSDrive -PSProvider CMSite).Name
        }

        $ADUsers = Get-ADGroupMember -Identity $ADGroupName |
            Where-Object { $_.objectClass -eq "user" } |
            ForEach-Object { Get-ADUser $_ -Properties UserPrincipalName, SamAccountName }

        if (-not $ADUsers) {
            Write-Warning "No users found in AD group '$ADGroupName'"
            return
        }

        Write-Host "Found $($ADUsers.Count) users in AD group"

        Push-Location "${SiteCode}:"

        $Collection = Get-CMUserCollection -Name $CollectionName
        if (-not $Collection) {
            throw "User Collection '$CollectionName' not found"
        }

        $CMUsers = Get-CMUser

        switch ($Action) {
            'Add' {
                $AddedCount = 0
                $SkippedCount = 0

                foreach ($User in $ADUsers) {
                    $CMUser = $CMUsers | Where-Object {
                        $_.UserPrincipalName -eq $User.UserPrincipalName -or
                        $_.UserName -eq $User.SamAccountName
                    }

                    if ($CMUser) {
                        try {
                            $ExistingRule = Get-CMUserCollectionDirectMembershipRule -CollectionName $CollectionName |
                                Where-Object { $_.ResourceID -eq $CMUser.ResourceID }

                            if (-not $ExistingRule) {
                                Add-CMUserCollectionDirectMembershipRule -CollectionName $CollectionName -ResourceId $CMUser.ResourceID
                                Write-Host "Added user $($User.SamAccountName) to collection"
                                $AddedCount++
                            } else {
                                Write-Host "User $($User.SamAccountName) already exists in collection" -ForegroundColor Yellow
                                $SkippedCount++
                            }
                        }
                        catch {
                            Write-Warning "Failed to add user $($User.SamAccountName): $_"
                            $SkippedCount++
                        }
                    } else {
                        Write-Warning "User $($User.SamAccountName) not found in SCCM"
                        $SkippedCount++
                    }
                }

                Write-Host "`nOperation completed: Added $AddedCount users, Skipped $SkippedCount users"
            }

            'Remove' {
                $RemovedCount = 0
                $SkippedCount = 0

                foreach ($User in $ADUsers) {
                    $CMUser = $CMUsers | Where-Object {
                        $_.UserPrincipalName -eq $User.UserPrincipalName -or
                        $_.UserName -eq $User.SamAccountName
                    }

                    if ($CMUser) {
                        try {
                            $ExistingRule = Get-CMUserCollectionDirectMembershipRule -CollectionName $CollectionName |
                                Where-Object { $_.ResourceID -eq $CMUser.ResourceID }

                            if ($ExistingRule) {
                                Remove-CMUserCollectionDirectMembershipRule -CollectionName $CollectionName -ResourceId $CMUser.ResourceID -Force
                                Write-Host "Removed user $($User.SamAccountName) from collection"
                                $RemovedCount++
                            } else {
                                Write-Host "User $($User.SamAccountName) not found in collection" -ForegroundColor Yellow
                                $SkippedCount++
                            }
                        }
                        catch {
                            Write-Warning "Failed to remove user $($User.SamAccountName): $_"
                            $SkippedCount++
                        }
                    } else {
                        Write-Warning "User $($User.SamAccountName) not found in SCCM"
                        $SkippedCount++
                    }
                }

                Write-Host "`nOperation completed: Removed $RemovedCount users, Skipped $SkippedCount users"
            }
        }
    }
    catch {
        Write-Error "An error occurred: $_"
    }
    finally {
        Pop-Location
    }
}
```

Use the function like this:

```powershell
# Add users from AD group to collection
Sync-ADGroupToUserCollection -ADGroupName "IT-Staff" -CollectionName "IT Users Collection" -Action Add
# Remove users from AD group from collection
Sync-ADGroupToUserCollection -ADGroupName "IT-Staff" -CollectionName "IT Users Collection" -Action Remove
```
