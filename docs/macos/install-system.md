# Install system

Show all available versions:

```sh
softwareupdate --list-full-installers
```

Output:

```text
Finding available software
Software Update found the following full installers:
* Title: macOS Tahoe, Version: 26.2, Size: 16975578KiB, Build: 25C56, Deferred: NO
* Title: macOS Tahoe, Version: 26.1, Size: 16890687KiB, Build: 25B78, Deferred: NO
* Title: macOS Tahoe, Version: 26.0.1, Size: 16550558KiB, Build: 25A362, Deferred: NO
* Title: macOS Tahoe, Version: 26.0, Size: 16550645KiB, Build: 25A354, Deferred: NO
* Title: macOS Sequoia, Version: 15.7.3, Size: 15286709KiB, Build: 24G419, Deferred: NO
```

Download installer:

```sh
softwareupdate --fetch-full-installer --full-installer-version 15.7.3
```

Output:

```text
Scanning for 15.7.3 installer
Install finished successfully
```

Start **Install macOS** from applications.