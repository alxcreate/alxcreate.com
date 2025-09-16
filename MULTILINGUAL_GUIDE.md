# Guide to Working with a Multilingual Site

## File Structure

```text
i18n/
├── ru/                                    # Russian language
│   ├── code.json                         # General translations
│   ├── docusaurus-theme-classic/         # Theme translations
│   │   └── navbar.json                   # Navigation
│   ├── docusaurus-plugin-content-docs/   # Documentation
│   │   └── current/                      # Current version
│   │       ├── docs.md                   # Documentation main page
│   │       └── linux/                    # Example section
│   │           ├── _category_.yml        # Category settings
│   │           └── basic-commands.md     # Example document
│   └── docusaurus-plugin-content-blog/   # Blog
│       ├── options.json                  # Blog settings
│       └── 2025-09-16-multilingual-site.md # Example article
└── en/                                   # English language (empty)
```

## Commands for Work

### Translations

```bash
# Generate new translation files for Russian
npm run write-translations:ru

# Generate translations for all languages
npm run write-translations
```

## How to Add New Content

### Documentation in Russian

1. Create files in the folder: `i18n/ru/docusaurus-plugin-content-docs/current/`
2. The structure should mirror the main `docs/` folder
3. Example:

   ```text
   docs/docker/docker-compose.md (English)
   ↓
   i18n/ru/docusaurus-plugin-content-docs/current/docker/docker-compose.md (Russian)
   ```

### Blog in Russian

1. Create files in the folder: `i18n/ru/docusaurus-plugin-content-blog/`
2. Use the same filename format: `YYYY-MM-DD-slug.md`

### New Categories and Menus

If you add new sections, update the translations:


1. Run `npm run write-translations:ru`
2. Find new keys in the translation files
3. Translate them to Russian
