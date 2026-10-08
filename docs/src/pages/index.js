"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const clsx_1 = __importDefault(require("clsx"));
const Link_1 = __importDefault(require("@docusaurus/Link"));
const useDocusaurusContext_1 = __importDefault(require("@docusaurus/useDocusaurusContext"));
const Layout_1 = __importDefault(require("@theme/Layout"));
const HomepageFeatures_1 = __importDefault(require("@site/src/components/HomepageFeatures"));
const Heading_1 = __importDefault(require("@theme/Heading"));
const index_module_css_1 = __importDefault(require("./index.module.css"));
function HomepageHeader() {
    const { siteConfig } = (0, useDocusaurusContext_1.default)();
    return (<header className={(0, clsx_1.default)('hero hero--primary', index_module_css_1.default.heroBanner)}>
      <div className="container">
        <Heading_1.default as="h1" className="hero__title">
          {siteConfig.title}
        </Heading_1.default>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={index_module_css_1.default.buttons}>
          <Link_1.default className="button button--secondary button--lg" to="/docs/intro">
            📚 Ver Documentação - 5min ⏱️
          </Link_1.default>
          <Link_1.default className="button button--success button--lg margin-left--md" to="/docs/guia-rapido">
            🚀 Guia Rápido
          </Link_1.default>
        </div>
        <div style={{ marginTop: '2rem', fontSize: '1.2rem' }}>
          <p>✅ 8 Matérias • 296 Questões • 2 Questões com Imagens</p>
        </div>
      </div>
    </header>);
}
function Home() {
    const { siteConfig } = (0, useDocusaurusContext_1.default)();
    return (<Layout_1.default title={`${siteConfig.title} - Documentação`} description="API RESTful profissional para simulador de provas e atividades do curso ADS">
      <HomepageHeader />
      <main>
        <HomepageFeatures_1.default />

        {/* Seção de Exemplo Rápido */}
        <section style={{ padding: '4rem 0', backgroundColor: '#f5f5f5' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>🚀 Comece em 30 segundos</h2>
            <div className="row">
              <div className="col col--6">
                <h3>1. Listar Matérias</h3>
                <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px' }}>
        {`fetch('http://localhost:3000/api/courses')
  .then(res => res.json())
  .then(data => console.log(data));`}
                </pre>
              </div>
              <div className="col col--6">
                <h3>2. Gerar Simulado</h3>
                <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px' }}>
        {`fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    courseSlug: 'arquitetura-de-sistemas',
    limit: 10
  })
}).then(res => res.json());`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Estatísticas */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>📊 Estatísticas da API</h2>
            <div className="row">
              <div className="col col--3" style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>8</h1>
                <p>Matérias</p>
              </div>
              <div className="col col--3" style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>296</h1>
                <p>Questões Totais</p>
              </div>
              <div className="col col--3" style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>253</h1>
                <p>Objetivas</p>
              </div>
              <div className="col col--3" style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>43</h1>
                <p>Discursivas</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout_1.default>);
}
//# sourceMappingURL=index.js.map