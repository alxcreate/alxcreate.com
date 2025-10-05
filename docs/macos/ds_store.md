# .DS_Store files

Disable creation of .DS_Store files on network volumes and removable media:

```bash
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool TRUE
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool TRUE
```

To revert the changes, enter:

```bash
defaults delete com.apple.desktopservices DSDontWriteNetworkStores
defaults delete com.apple.desktopservices DSDontWriteUSBStores
```
