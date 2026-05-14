import { themes as prismThemes } from 'prism-react-renderer';
const config = {
    plugins: [
        'docusaurus-plugin-sass',
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'books',
                path: 'books',
                routeBasePath: 'books',
                sidebarPath: './sidebars.ts',
                breadcrumbs: false,
            },
        ],
    ],
    title: 'alxcreate | Aleksey Abramov',
    tagline: 'Notes on Docusaurus',
    favicon: 'img/favicon.ico',
    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },
    // Set the production url of your site here
    url: 'https://alxcreate.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',
    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'alxcreate', // Usually your GitHub org/user name.
    projectName: 'alxcreate', // Usually your repo name.
    onBrokenLinks: 'warn',
    markdown: {
        hooks: {
            onBrokenMarkdownLinks: 'warn',
        },
    },
    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },
    presets: [
        [
            'classic',
            {
                docs: {
                    breadcrumbs: false,
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/alxcreate/alxcreate.com/tree/main/',
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/alxcreate/alxcreate.com/tree/main/',
                    // Useful options to enforce blogging best practices
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                },
                theme: {
                    customCss: [
                        require.resolve('./src/styles/custom.scss'),
                    ],
                },
            },
        ],
    ],
    themeConfig: {
        metadata: [
            { name: 'google-site-verification', content: 'OjQplra8v_3-hcGrY8Bcf6HGfzYmRv4D-cVCqGWvg18' },
            { charset: 'UTF-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        ],
        colorMode: {
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: 'alxcreate',
            // logo: {
            //   alt: 'alxcreate Logo',
            //   src: 'img/logo.svg',
            // },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'docsSidebar',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    type: 'docSidebar',
                    sidebarId: 'booksSidebar',
                    docsPluginId: 'books',
                    position: 'left',
                    label: 'Books',
                },
                { to: '/blog', label: 'Blog', position: 'left' },
                {
                    href: 'https://github.com/alxcreate/alxcreate.com',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        // footer: {
        //   style: 'dark',
        //   links: [
        //     {
        //       title: 'Docs',
        //       items: [
        //         {
        //           label: 'Tutorial',
        //           to: '/docs/intro',
        //         },
        //       ],
        //     },
        //     {
        //       title: 'Community',
        //       items: [
        //         {
        //           label: 'Stack Overflow',
        //           href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //         },
        //         {
        //           label: 'Discord',
        //           href: 'https://discordapp.com/invite/docusaurus',
        //         },
        //         {
        //           label: 'X',
        //           href: 'https://x.com/docusaurus',
        //         },
        //       ],
        //     },
        //     {
        //       title: 'More',
        //       items: [
        //         {
        //           label: 'Blog',
        //           to: '/blog',
        //         },
        //         {
        //           label: 'GitHub',
        //           href: 'https://github.com/facebook/docusaurus',
        //         },
        //       ],
        //     },
        //   ],
        //   copyright: `Copyright © ${new Date().getFullYear()} alxcreate, Inc. Built with Docusaurus.`,
        // },
        prism: {
            // theme: prismThemes.github,
            // darkTheme: prismThemes.dracula,
            theme: prismThemes.oneLight,
            darkTheme: prismThemes.oneDark,
            additionalLanguages: [
                'java',
                'json',
                'bash',
                'powershell',
                'csharp',
                'csv',
                'docker',
                'ini',
                'http',
                'hcl',
                'go',
                'python',
                'regex',
                'sql',
                'toml',
                'uri',
                'visual-basic',
                'yaml',
            ],
            magicComments: [
                {
                    className: 'theme-code-block-highlighted-line',
                    line: 'highlight-next-line',
                    block: { start: 'highlight-start', end: 'highlight-end' },
                },
                {
                    className: 'code-block-error-line',
                    line: 'highlight-next-line-error',
                },
            ],
        },
    },
};
export default config;
