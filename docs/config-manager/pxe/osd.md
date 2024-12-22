# Operating System Deployment

## Links

[Using Microsoft Deployment Toolkit (MDT) UDI as Custom OSD Frontend in Microsoft SCCM](https://www.youtube.com/watch?v=UREhjeKM-TM)

[NIC 4th Edition - OS Deployment at LEVEL 500](https://www.youtube.com/watch?v=u7dA1uZrrVo\&list=PLVYxL4mCN8gIUIgqg6wiWwpsCbRvpdxch)

## ESD to WIM

Mount the ISO image. Get a list of versions inside the image

```bat
dism /Get-WimInfo /WimFile:h:\sources\install.esd
```

Export the image to a `.wim` file

```bat
dism /export-image /SourceImageFile:e:\sources\install.esd /SourceIndex:1 /DestinationImageFile:C:\Temp\Windows10_21H2_OEM_EN_x64.wim /Compress:max /CheckIntegrity
```

- If the file is in `.wim` format, then you can use one file for installing different versions;
- Copy the resulting `.wim` files to the SCCM server directory `%DeployRoot%\OS\Image`;
- In the **CM** console, add the image to **Operating System Images**;
- Distribute each added image to the **CM** distribution point;
- Added to UDI.

## Language

`MDT_Setting\Unattend.xml`

You need to change the following lines in the **oobeSystem** section of the **unattend.xml** file.

```xml title="Unattend.xml"
<InputLocale>%Keyboardlocale%</InputLocale>
<SystemLocale>%InputLocale%</SystemLocale>
<UILanguage>%UILanguage%</UILanguage>
<UserLocale>%Inputlocale%</UserLocale>
```

## Settings

### TFTP Settings for PXE Boot

Edit registry on server with PXE Distribution Point.

- Path: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\SMS\DP`
- Type: `REG_DWORD`
- RamDiskTFTPBlockSize - package size; Default `4096` (`16384` max)
- RamDiskTFTPWindowSize - package count; Default `4`

Optimal size for MTU. Example, 1450.

### Set Computer Name

Open the properties of the **All Unknown Computers** collection and add variables on the **Collection Variables** tab (e.g. `OSDComputerName`)
