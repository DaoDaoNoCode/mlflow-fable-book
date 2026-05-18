<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vitepress'

const props = defineProps({
  lang: { type: String, default: 'en' }
})

const router = useRouter()
const hoveredId = ref(null)

const isZh = computed(() => props.lang === 'zh')

const categories = computed(() => [
  {
    id: 'tracking',
    label: isZh.value ? '实验追踪' : 'Experiment Tracking',
    color: '#e8f4fd',
    border: '#4a9eda',
    items: [
      { id: 'experiment', label: isZh.value ? '实验 & Run' : 'Experiments & Runs', icon: '🧪', link: `/${props.lang}/guide/experiments-and-runs`, desc: isZh.value ? '一组 Run 的集合' : 'Groups of code executions' },
      { id: 'params', label: isZh.value ? '参数/指标/Tag' : 'Params/Metrics/Tags', icon: '📊', link: `/${props.lang}/guide/parameters-metrics-tags`, desc: isZh.value ? '输入、输出、标记' : 'Inputs, outputs, labels' },
      { id: 'artifact', label: 'Artifacts', icon: '📦', link: `/${props.lang}/guide/artifacts`, desc: isZh.value ? '产出的文件' : 'Output files' },
      { id: 'autolog', label: 'Autologging', icon: '🤖', link: `/${props.lang}/guide/autologging`, desc: isZh.value ? '一行代码自动记录' : 'One-line auto tracking' },
    ],
  },
  {
    id: 'models',
    label: isZh.value ? '模型管理' : 'Model Management',
    color: '#fff8e1',
    border: '#ffa726',
    items: [
      { id: 'flavor', label: isZh.value ? 'Flavor / pyfunc' : 'Flavors / pyfunc', icon: '🔌', link: `/${props.lang}/guide/flavors-and-packaging`, desc: isZh.value ? '通用模型接口' : 'Universal model interface' },
      { id: 'logged-model', label: 'LoggedModel', icon: '📋', link: `/${props.lang}/guide/logged-models`, desc: isZh.value ? '模型出厂记录' : 'Model birth certificate' },
      { id: 'registry', label: 'Model Registry', icon: '📚', link: `/${props.lang}/guide/model-registry`, desc: isZh.value ? '版本 + Alias 目录' : 'Versions + aliases catalog' },
      { id: 'serving', label: isZh.value ? '模型服务' : 'Model Serving', icon: '🚀', link: `/${props.lang}/guide/model-serving`, desc: isZh.value ? '部署为 REST API' : 'Deploy as REST API' },
    ],
  },
  {
    id: 'genai',
    label: 'LLM & GenAI',
    color: '#fce4ec',
    border: '#e91e63',
    items: [
      { id: 'trace', label: 'Trace & Span', icon: '🔍', link: `/${props.lang}/guide/tracing-and-spans`, desc: isZh.value ? '请求的完整旅程' : 'Full request journey' },
      { id: 'prompt', label: 'Prompts', icon: '✏️', link: `/${props.lang}/guide/prompts`, desc: isZh.value ? '不可变的模板指令' : 'Immutable templates' },
      { id: 'gateway', label: 'AI Gateway', icon: '🌐', link: `/${props.lang}/guide/ai-gateway`, desc: isZh.value ? 'LLM 统一代理' : 'Unified LLM proxy' },
      { id: 'dataset', label: isZh.value ? '数据集' : 'Datasets', icon: '🥘', link: `/${props.lang}/guide/datasets`, desc: isZh.value ? '测试用例集合' : 'Test case collections' },
      { id: 'eval', label: isZh.value ? '评估 & Scorer' : 'Evaluation & Scorers', icon: '⚖️', link: `/${props.lang}/guide/evaluation-and-scorers`, desc: isZh.value ? '系统化打分' : 'Systematic scoring' },
      { id: 'issue', label: 'Issues', icon: '🔎', link: `/${props.lang}/guide/issues`, desc: isZh.value ? '质量问题模式' : 'Quality problem patterns' },
    ],
  },
  {
    id: 'infra',
    label: isZh.value ? '基础设施' : 'Infrastructure',
    color: '#f0f7e8',
    border: '#7cb342',
    items: [
      { id: 'workspace', label: 'Workspaces', icon: '🏢', link: `/${props.lang}/guide/workspaces`, desc: isZh.value ? '数据隔离边界' : 'Data isolation boundary' },
      { id: 'rbac', label: 'RBAC', icon: '🔑', link: `/${props.lang}/guide/rbac`, desc: isZh.value ? '权限控制' : 'Access control' },
      { id: 'webhook', label: 'Webhooks', icon: '📡', link: `/${props.lang}/guide/webhooks`, desc: isZh.value ? '事件自动化' : 'Event automation' },
      { id: 'project', label: 'Projects', icon: '📐', link: `/${props.lang}/guide/projects`, desc: isZh.value ? '可复现的 ML 代码' : 'Reproducible ML code' },
    ],
  },
])

function navigate(link) {
  router.go(link)
}
</script>

<template>
  <div class="arch-diagram">
    <div
      v-for="cat in categories"
      :key="cat.id"
      class="arch-category"
    >
      <div class="arch-category-label" :style="{ backgroundColor: cat.border }">
        {{ cat.label }}
      </div>
      <div class="arch-category-grid" :style="{ borderColor: cat.border, backgroundColor: cat.color + '40' }">
        <div
          v-for="item in cat.items"
          :key="item.id"
          class="arch-card"
          :class="{ hovered: hoveredId === item.id }"
          :style="{ backgroundColor: cat.color, borderColor: cat.border }"
          @mouseenter="hoveredId = item.id"
          @mouseleave="hoveredId = null"
          @click="navigate(item.link)"
        >
          <div class="arch-card-icon">{{ item.icon }}</div>
          <div class="arch-card-label">{{ item.label }}</div>
          <div class="arch-card-desc">{{ item.desc }}</div>
          <div class="arch-card-hint">{{ isZh ? '点击阅读 →' : 'Read fable →' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.arch-diagram {
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.arch-category {
  border-radius: 10px;
  overflow: hidden;
}

.arch-category-label {
  padding: 8px 16px;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.arch-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  padding: 12px;
  border: 2px solid;
  border-top: none;
  border-radius: 0 0 10px 10px;
}

.arch-card {
  border: 2px solid;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 90px;
}

.arch-card:hover,
.arch-card.hovered {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.arch-card-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.arch-card-label {
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 2px;
  color: #1a1a1a;
}

.arch-card-desc {
  font-size: 11px;
  color: #555;
  line-height: 1.3;
  flex: 1;
}

.arch-card-hint {
  font-size: 10px;
  color: #888;
  margin-top: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}

.arch-card:hover .arch-card-hint {
  opacity: 1;
}

.dark .arch-card-label { color: #e0e0e0; }
.dark .arch-card-desc { color: #aaa; }
.dark .arch-card { background-color: #2a2a3e !important; }
.dark .arch-category-grid { background-color: #1a1a2e !important; }
</style>
