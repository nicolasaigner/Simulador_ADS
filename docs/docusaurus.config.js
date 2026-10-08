"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prism_react_renderer_1 = require("prism-react-renderer");
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const config = {
    title: 'Simulador ADS API',
    tagline: 'API RESTful para simulador de provas e atividades do curso ADS',
    favicon: 'img/favicon.ico',
    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },
    // Set the production url of your site here
    url: 'https://your-domain.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',
    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'seu-usuario', // Usually your GitHub org/user name.
    projectName: 'simulador-ads', // Usually your repo name.
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'pt-BR',
        locales: ['pt-BR'],
    },
    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/seu-usuario/simulador-ads/tree/main/docs/',
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            },
        ],
    ],
    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: 'Simulador ADS API',
            logo: {
                alt: 'Simulador ADS Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Documentação',
                },
                {
                    href: 'http://localhost:3000',
                    label: 'API (localhost:3000)',
                    position: 'right',
                },
                {
                    href: 'https://github.com/seu-usuario/simulador-ads',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Documentação',
                    items: [
                        {
                            label: 'Introdução',
                            to: '/docs/intro',
                        },
                        {
                            label: 'Guia Rápido',
                            to: '/docs/guia-rapido',
                        },
                        {
                            label: 'Endpoints',
                            to: '/docs/endpoints/courses',
                        },
                    ],
                },
                {
                    title: 'Recursos',
                    items: [
                        {
                            label: 'Exemplos',
                            to: '/docs/exemplos/basico',
                        },
                        {
                            label: 'Questões com Imagens',
                            to: '/docs/exemplos/imagens',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Simulador ADS. Documentação criada com Docusaurus.`,
        },
        prism: {
            theme: prism_react_renderer_1.themes.github,
            darkTheme: prism_react_renderer_1.themes.dracula,
            additionalLanguages: ['bash', 'json', 'javascript'],
        },
    },
};
exports.default = config;
//# sourceMappingURL=docusaurus.config.js.map