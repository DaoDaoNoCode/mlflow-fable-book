import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'The MLflow Fable Book',
  description: 'MLflow concepts explained through fables — a developer\'s guide through stories',

  base: process.env.VITEPRESS_BASE || '/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: (process.env.VITEPRESS_BASE || '/') + 'logo.svg' }],
    ['meta', { property: 'og:title', content: 'The MLflow Fable Book' }],
    ['meta', { property: 'og:description', content: '21 stories that explain every MLflow concept through everyday analogies. For developers, teams, and anyone new to the platform.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'The MLflow Fable Book' }],
    ['meta', { name: 'twitter:description', content: '21 stories that explain every MLflow concept through everyday analogies.' }],
  ],

  locales: {
    en: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Fables', link: '/en/guide/' },
          { text: 'Reference', link: '/en/reference/glossary' },
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/en/guide/' },
              ],
            },
            {
              text: 'Experiment Tracking',
              collapsed: false,
              items: [
                { text: 'The Chef\'s Kitchen', link: '/en/guide/experiments-and-runs' },
                { text: 'The Baker\'s Notebook', link: '/en/guide/parameters-metrics-tags' },
                { text: 'The Museum Vault', link: '/en/guide/artifacts' },
                { text: 'The Autopilot', link: '/en/guide/autologging' },
              ],
            },
            {
              text: 'Model Management',
              collapsed: false,
              items: [
                { text: 'The Universal Adapter', link: '/en/guide/flavors-and-packaging' },
                { text: 'The Apprentice\'s Logbook', link: '/en/guide/logged-models' },
                { text: 'The Royal Library', link: '/en/guide/model-registry' },
                { text: 'The Launchpad', link: '/en/guide/model-serving' },
              ],
            },
            {
              text: 'LLM & GenAI',
              collapsed: false,
              items: [
                { text: 'The Detective\'s Thread', link: '/en/guide/tracing-and-spans' },
                { text: 'The Poet\'s Drafts', link: '/en/guide/prompts' },
                { text: 'The Harbor Master', link: '/en/guide/ai-gateway' },
                { text: 'The Test Kitchen', link: '/en/guide/datasets' },
                { text: 'The Judge\'s Tournament', link: '/en/guide/evaluation-and-scorers' },
                { text: 'The Quality Inspector', link: '/en/guide/issues' },
              ],
            },
            {
              text: 'Infrastructure',
              collapsed: false,
              items: [
                { text: 'The Apartment Building', link: '/en/guide/workspaces' },
                { text: 'The Gatekeepers', link: '/en/guide/rbac' },
                { text: 'The Signal Flares', link: '/en/guide/webhooks' },
                { text: 'The Blueprint', link: '/en/guide/projects' },
              ],
            },
            {
              text: 'Coming Soon (RFCs)',
              collapsed: false,
              items: [
                { text: 'The Tool Shed Registry', link: '/en/guide/mcp-registry' },
                { text: 'The Cold Storage', link: '/en/guide/trace-archival' },
                { text: 'The Handshake', link: '/en/guide/span-links' },
              ],
            },
            {
              text: 'The Big Picture',
              items: [
                { text: 'How It All Connects', link: '/en/guide/how-it-all-connects' },
              ],
            },
          ],
          '/en/reference/': [
            {
              text: 'Reference',
              items: [
                { text: 'Glossary', link: '/en/reference/glossary' },
                { text: 'Concept → UI Map', link: '/en/reference/ui-component-map' },
              ],
            },
          ],
        },
      },
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '寓言', link: '/zh/guide/' },
          { text: '参考', link: '/zh/reference/glossary' },
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '开始',
              items: [
                { text: '简介', link: '/zh/guide/' },
              ],
            },
            {
              text: '实验追踪',
              collapsed: false,
              items: [
                { text: '大厨的厨房', link: '/zh/guide/experiments-and-runs' },
                { text: '面包师的三色笔记', link: '/zh/guide/parameters-metrics-tags' },
                { text: '博物馆的仓库', link: '/zh/guide/artifacts' },
                { text: '自动驾驶仪', link: '/zh/guide/autologging' },
              ],
            },
            {
              text: '模型管理',
              collapsed: false,
              items: [
                { text: '万能转换头', link: '/zh/guide/flavors-and-packaging' },
                { text: '匠人的出厂记录', link: '/zh/guide/logged-models' },
                { text: '皇家图书馆', link: '/zh/guide/model-registry' },
                { text: '发射台', link: '/zh/guide/model-serving' },
              ],
            },
            {
              text: 'LLM 与 GenAI',
              collapsed: false,
              items: [
                { text: '侦探的红线', link: '/zh/guide/tracing-and-spans' },
                { text: '写信人的模板', link: '/zh/guide/prompts' },
                { text: '港口调度员', link: '/zh/guide/ai-gateway' },
                { text: '试菜间的食材单', link: '/zh/guide/datasets' },
                { text: '美食大赛的评委', link: '/zh/guide/evaluation-and-scorers' },
                { text: '质检员', link: '/zh/guide/issues' },
              ],
            },
            {
              text: '基础设施',
              collapsed: false,
              items: [
                { text: '公寓楼的楼层', link: '/zh/guide/workspaces' },
                { text: '门卫和钥匙', link: '/zh/guide/rbac' },
                { text: '信号弹', link: '/zh/guide/webhooks' },
                { text: '施工蓝图', link: '/zh/guide/projects' },
              ],
            },
            {
              text: '即将推出（RFC）',
              collapsed: false,
              items: [
                { text: '工具棚的登记处', link: '/zh/guide/mcp-registry' },
                { text: '冷库', link: '/zh/guide/trace-archival' },
                { text: '握手', link: '/zh/guide/span-links' },
              ],
            },
            {
              text: '全景',
              items: [
                { text: '串起来的故事', link: '/zh/guide/how-it-all-connects' },
              ],
            },
          ],
          '/zh/reference/': [
            {
              text: '参考',
              items: [
                { text: '术语表', link: '/zh/reference/glossary' },
                { text: '概念 → UI 对照表', link: '/zh/reference/ui-component-map' },
              ],
            },
          ],
        },
        outlineTitle: '本页内容',
        docFooter: {
          prev: '上一篇',
          next: '下一篇',
        },
      },
    },
  },

  themeConfig: {
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DaoDaoNoCode/mlflow-fable-book' },
    ],
    outline: {
      level: [2, 3],
    },
  },
})
