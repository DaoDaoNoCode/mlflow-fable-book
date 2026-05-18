import DefaultTheme from 'vitepress/theme'
import ArchitectureDiagram from './components/ArchitectureDiagram.vue'
import DataFlowDiagram from './components/DataFlowDiagram.vue'
import NotFound from './components/NotFound.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ArchitectureDiagram', ArchitectureDiagram)
    app.component('DataFlowDiagram', DataFlowDiagram)
  },
  NotFound,
}
