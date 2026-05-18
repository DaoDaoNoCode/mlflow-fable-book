import DefaultTheme from 'vitepress/theme'
import ArchitectureDiagram from './components/ArchitectureDiagram.vue'
import DataFlowDiagram from './components/DataFlowDiagram.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import NotFound from './components/NotFound.vue'
import './custom.css'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(ReadingProgress),
    })
  },
  enhanceApp({ app }) {
    app.component('ArchitectureDiagram', ArchitectureDiagram)
    app.component('DataFlowDiagram', DataFlowDiagram)
  },
  NotFound,
}
