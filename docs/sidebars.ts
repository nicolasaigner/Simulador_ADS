import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'guia-rapido',
    {
      type: 'category',
      label: 'Endpoints',
      items: [
        'endpoints/courses',
        'endpoints/quiz',
        'endpoints/search',
      ],
    },
    {
      type: 'category',
      label: 'Exemplos',
      items: [
        'exemplos/basico',
        'exemplos/imagens',
      ],
    },
  ],
};

export default sidebars;
