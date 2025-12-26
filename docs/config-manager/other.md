# Other

## Links

[Ievgen Liashov - SCCM](https://www.youtube.com/channel/UCwp8uhhZgP-ha0EsUreXBUQ/videos)

[Сбор состава групп администраторов](https://www.itninja.com/blog/view/audit-local-administrator-group-with-sccm)

## Edit Console

Create backup of the folder `C:\Program Files (x86)\Microsoft Configuration Manager\AdminConsole\XmlStorage\ConsoleRoot`.

Edit with `AdminUI.ConsoleBuilder.exe` `C:\Program Files (x86)\Microsoft Configuration Manager\AdminConsole\bin\AdminUI.ConsoleBuilder.exe`. Files in `C:\Program Files (x86)\Microsoft Configuration Manager\AdminConsole\XmlStorage\ConsoleRoot` will be updated.

- ConnectedConsole.xml
- IdleConsole.xml
- ManagementClassDescriptions.xml

## USMT

[USMT Best Practices](https://docs.microsoft.com/en-us/windows/deployment/usmt/usmt-best-practices)

[How to Use USMT in SCCM for User Migration (ScanState, LoadState, MigApp, MigUser, MigDocs)](https://www.youtube.com/watch?v=f7_8B0TCLuI)

[Understanding Migration XML Files](https://docs.microsoft.com/en-us/windows/deployment/usmt/understanding-migration-xml-files#bkmk-config)

[What does USMT migrate?](https://docs.microsoft.com/en-us/windows/deployment/usmt/usmt-what-does-usmt-migrate)

`C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\User State Migration Tool\amd64\USMT Mig_.xml`

## HP Manageability Integration Kit (MIK)

[HP Manageability Integration Kit (MIK) for Microsoft System Center Configuration Manager](https://ftp.ext.hp.com/pub/caps-softpaq/cmit/HPMIK.html)

[HP MIK BIOS Configuration Setting](https://www.youtube.com/watch?v=WGi03_2_8ms)

[HP Manageability Integration Kit](http://nas.wuibaille.fr/LeblogOSDdownload/MICROSOFT/SCCM/HPMIKWhitepaper.pdf)

## Start Client Actions

```bat title="StartClientActions.bat"
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000121}" /NOINTERACTIVE
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000003}" /NOINTERACTIVE
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000010}" /NOINTERACTIVE
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000001}" /NOINTERACTIVE
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000021}" /NOINTERACTIVE
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000022}" /NOINTERACTIVE
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000002}" /NOINTERACTIVE
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000031}" /NOINTERACTIVE
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000108}" /NOINTERACTIVE
WMIC /namespace:\\root\ccm path sms_client CALL TriggerSchedule "{00000000-0000-0000-0000-000000000111}" /NOINTERACTIVE
```

## Issues

### SQL Server change tracking cleanup

[SQL Server change tracking cleanup](https://docs.microsoft.com/en-us/mem/configmgr/core/servers/deploy/install/list-of-prerequisite-checks#bkmk_changetracking)

```sql
USE CM_S01
EXEC spDiagChangeTracking @CleanupChangeTracking = 1
SELECT * FROM vLogs WHERE ProcedureName = 'spDiagChangeTracking'
```

### SCCM Hotfix Stuck on "Prerequisite Check Passed"

[sccm-1602-hotfix-stuck-on-prerequisite-check-passed](https://emeneye.wordpress.com/2016/08/01/sccm-1602-hotfix-stuck-on-prerequisite-check-passed/)

Get `PackageGuid` from `C:\Program Files\Microsoft Configuration Manager\EasySetupPayload` and delete from `CM_UpdatePackages`.

```sql
DELETE FROM CM_S01.dbo.CM_UpdatePackages
WHERE PackageGuid='6b4f84b7-5555-48b0-aecc-74fb5a8aa24b';
```

### MDT Task Sequence Integration with crash

`C:\Program Files (x86)\Microsoft Configuration Manager\AdminConsole\XmlStorage\Extensions\Forms`

- `Microsoft.BDD.SCCM_CreateBootImage.xml`
- `Microsoft.BDD.SCCM_ImportTaskSequence.xml`

Change `http` to `https`
