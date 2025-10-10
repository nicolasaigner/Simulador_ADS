import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🎯 Simulados Personalizados',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Gere simulados customizados com filtros avançados: escolha a matéria,
        quantidade de questões, tipo (objetivas/discursivas) e muito mais.
      </>
    ),
  },
  {
    title: '📊 Estatísticas Detalhadas',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Acesse estatísticas completas sobre questões, matérias, tipos e
        visualize métricas em tempo real para planejar seus estudos.
      </>
    ),
  },
  {
    title: '🔍 Busca Inteligente',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Busque questões por palavra-chave, filtre por matéria, tipo ou origem.
        Encontre exatamente o que precisa para estudar.
      </>
    ),
  },
  {
    title: '✅ Validação Automática',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Valide respostas automaticamente e receba feedback detalhado com
        percentual de acerto e correção questão por questão.
      </>
    ),
  },
  {
    title: '🖼️ Suporte a Imagens',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Questões com imagens são detectadas automaticamente. Filtre e
        trabalhe especificamente com questões visuais.
      </>
    ),
  },
  {
    title: '🚀 API RESTful',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        API profissional com endpoints bem documentados, respostas padronizadas
        e pronta para integração com qualquer frontend.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
