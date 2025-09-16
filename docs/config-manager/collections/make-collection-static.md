# Make Collection Static

To make a collection static, you need to remove all query rules and include rules, and add direct membership rules for all members in the collection.

## Device

```powershell
function Make-CollectionStatic {
    param (
        [Parameter(Mandatory=$true)]
        [string]$CollectionName,

        [Parameter(Mandatory=$false)]
        [string]$SiteCode = "AUTO",

        [Parameter(Mandatory=$false)]
        [string]$SiteServer = "localhost"
    )

    try {
        if (-not (Get-Module ConfigurationManager)) {
            Import-Module ($env:SMS_ADMIN_UI_PATH.Substring(0,$env:SMS_ADMIN_UI_PATH.Length-5) + '\ConfigurationManager.psd1')
        }

        if ($SiteCode -eq "AUTO") {
            $SiteCode = (Get-PSDrive -PSProvider CMSite).Name
        }

        Push-Location "${SiteCode}:"

        $Collection = Get-CMDeviceCollection -Name $CollectionName
        if (-not $Collection) {
            throw "Collection '$CollectionName' not found"
        }

        $CurrentMembers = Get-CMDeviceCollectionDirectMembershipRule -CollectionName $CollectionName
        Write-Host "Found $($CurrentMembers.Count) current members in the collection"

        $Devices = Get-CMCollectionMember -CollectionName $CollectionName
        Write-Host "Found $($Devices.Count) devices in the collection"

        $MembershipRules = Get-CMDeviceCollectionQueryMembershipRule -CollectionName $CollectionName
        foreach ($Rule in $MembershipRules) {
            Remove-CMDeviceCollectionQueryMembershipRule -CollectionName $CollectionName -RuleName $Rule.RuleName -Force
            Write-Host "Removed query rule: $($Rule.RuleName)"
        }

        $IncludeRules = Get-CMDeviceCollectionIncludeMembershipRule -CollectionName $CollectionName
        foreach ($Rule in $IncludeRules) {
            Remove-CMDeviceCollectionIncludeMembershipRule -CollectionName $CollectionName -IncludeCollectionName $Rule.RuleName -Force
            Write-Host "Removed include rule: $($Rule.RuleName)"
        }

        foreach ($Device in $Devices) {
            Add-CMDeviceCollectionDirectMembershipRule -CollectionName $CollectionName -ResourceId $Device.ResourceID
            Write-Host "Added direct rule for device: $($Device.Name)"
        }

        Write-Host "Successfully converted collection to static with $($Devices.Count) devices"
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
Make-CollectionStatic -CollectionName "My Collection"
# Or
Make-CollectionStatic -CollectionName "My Collection" -SiteServer "cm01" -SiteCode "PS1"
```

## Users

```powershell
function Make-UserCollectionStatic {
    param (
        [Parameter(Mandatory=$true)]
        [string]$CollectionName,

        [Parameter(Mandatory=$false)]
        [string]$SiteCode = "AUTO",

        [Parameter(Mandatory=$false)]
        [string]$SiteServer = "localhost"
    )

    try {
        if (-not (Get-Module ConfigurationManager)) {
            Import-Module ($env:SMS_ADMIN_UI_PATH.Substring(0,$env:SMS_ADMIN_UI_PATH.Length-5) + '\ConfigurationManager.psd1')
        }

        if ($SiteCode -eq "AUTO") {
            $SiteCode = (Get-PSDrive -PSProvider CMSite).Name
        }

        Push-Location "${SiteCode}:"

        $Collection = Get-CMUserCollection -Name $CollectionName
        if (-not $Collection) {
            throw "User Collection '$CollectionName' not found"
        }

        $CurrentMembers = Get-CMUserCollectionDirectMembershipRule -CollectionName $CollectionName
        Write-Host "Found $($CurrentMembers.Count) current direct members in the collection"

        $Users = Get-CMCollectionMember -CollectionName $CollectionName
        Write-Host "Found $($Users.Count) users in the collection"

        $QueryRules = Get-CMUserCollectionQueryMembershipRule -CollectionName $CollectionName
        foreach ($Rule in $QueryRules) {
            Remove-CMUserCollectionQueryMembershipRule -CollectionName $CollectionName -RuleName $Rule.RuleName -Force
            Write-Host "Removed query rule: $($Rule.RuleName)"
        }

        $IncludeRules = Get-CMUserCollectionIncludeMembershipRule -CollectionName $CollectionName
        foreach ($Rule in $IncludeRules) {
            Remove-CMUserCollectionIncludeMembershipRule -CollectionName $CollectionName -IncludeCollectionName $Rule.RuleName -Force
            Write-Host "Removed include rule: $($Rule.RuleName)"
        }

        foreach ($User in $Users) {
            Add-CMUserCollectionDirectMembershipRule -CollectionName $CollectionName -ResourceId $User.ResourceID
            Write-Host "Added direct rule for user: $($User.Name)"
        }

        Write-Host "Successfully converted user collection to static with $($Users.Count) users"
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
Make-UserCollectionStatic -CollectionName "My User Collection"
# Or
Make-UserCollectionStatic -CollectionName "My User Collection" -SiteServer "cm01" -SiteCode "PS1"
```
