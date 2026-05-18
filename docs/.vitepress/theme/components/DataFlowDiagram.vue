<script setup>
import { computed } from 'vue'

const props = defineProps({
  lang: { type: String, default: 'en' }
})

const isZh = computed(() => props.lang === 'zh')

const steps = computed(() => [
  {
    id: 'code',
    icon: '👨‍💻',
    title: isZh.value ? '开发者写代码' : 'Developer writes code',
    detail: isZh.value ? '编写训练脚本，调用 MLflow API' : 'Write training script, call MLflow API',
    code: 'mlflow.start_run()',
  },
  {
    id: 'log',
    icon: '📝',
    title: isZh.value ? '记录参数、指标、Tag' : 'Log params, metrics, tags',
    detail: isZh.value
      ? 'log_param() → 参数入库\nlog_metric() → 指标入库\nset_tag() → Tag 入库'
      : 'log_param() → params stored\nlog_metric() → metrics stored\nset_tag() → tags stored',
    code: 'mlflow.log_param("lr", 0.001)\nmlflow.log_metric("acc", 0.95)',
  },
  {
    id: 'model',
    icon: '🤖',
    title: isZh.value ? '训练并保存模型' : 'Train and save model',
    detail: isZh.value
      ? 'model.fit(data) 训练模型\nlog_model() → Artifact 入仓库 + LoggedModel 创建'
      : 'model.fit(data) trains the model\nlog_model() → artifacts stored + LoggedModel created',
    code: 'model.fit(X_train, y_train)\nmlflow.sklearn.log_model(model, "model")',
  },
  {
    id: 'register',
    icon: '📚',
    title: isZh.value ? '注册到 Model Registry' : 'Register in Model Registry',
    detail: isZh.value
      ? '最佳模型注册到目录，打上 Alias（如 @champion）'
      : 'Best model registered with alias (e.g. @champion)',
    code: 'mlflow.register_model(model_uri, "fraud-detector")',
  },
  {
    id: 'evaluate',
    icon: '⚖️',
    title: isZh.value ? '评估模型' : 'Evaluate model',
    detail: isZh.value
      ? '各 Scorer 在测试数据集上打分，生成成绩单'
      : 'Scorers grade the model on test data, produce results table',
    code: 'mlflow.evaluate(model, data, scorers=[...])',
  },
  {
    id: 'deploy',
    icon: '🚀',
    title: isZh.value ? '部署上线' : 'Deploy to production',
    detail: isZh.value
      ? '通过 AI Gateway 统一对外提供服务'
      : 'Serve via AI Gateway with rate limits and fallbacks',
    code: null,
  },
  {
    id: 'trace',
    icon: '🔍',
    title: isZh.value ? 'Trace 记录请求' : 'Trace captures requests',
    detail: isZh.value
      ? '每个请求的完整旅程：Span 树 + 耗时 + 输入输出'
      : 'Full request journey: Span tree + latency + inputs/outputs',
    code: null,
  },
  {
    id: 'feedback',
    icon: '🔄',
    title: isZh.value ? '反馈闭环' : 'Feedback loop',
    detail: isZh.value
      ? 'Assessment（人工或自动评分）反馈回来，持续改进'
      : 'Assessments (human or automated) feed back for improvement',
    code: null,
  },
])
</script>

<template>
  <div class="flow-diagram">
    <template v-for="(step, i) in steps" :key="step.id">
      <div class="flow-card">
        <div class="flow-card-left">
          <div class="flow-card-number">{{ i + 1 }}</div>
          <div class="flow-card-icon">{{ step.icon }}</div>
        </div>
        <div class="flow-card-body">
          <div class="flow-card-title">{{ step.title }}</div>
          <div class="flow-card-desc">{{ step.detail }}</div>
          <code v-if="step.code" class="flow-card-code">{{ step.code }}</code>
        </div>
      </div>
      <div v-if="i < steps.length - 1" class="flow-connector">
        <svg width="2" height="28" viewBox="0 0 2 28">
          <line x1="1" y1="0" x2="1" y2="28" stroke="#667eea" stroke-width="2" stroke-dasharray="4 3" />
        </svg>
        <svg class="flow-connector-arrow" width="12" height="8" viewBox="0 0 12 8">
          <polygon points="6,8 0,0 12,0" fill="#667eea" />
        </svg>
      </div>
    </template>
  </div>
</template>

<style scoped>
.flow-diagram {
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-card {
  display: flex;
  gap: 14px;
  padding: 16px 20px;
  width: 100%;
  max-width: 540px;
  border-radius: 10px;
  border: 2px solid #e0e4f0;
  background: #fafbff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.flow-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.12);
}

.dark .flow-card {
  background: #1a1a2e;
  border-color: #2a2a4a;
}

.dark .flow-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.2);
}

.flow-card-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding-top: 2px;
}

.flow-card-number {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.flow-card-icon {
  font-size: 22px;
}

.flow-card-body {
  flex: 1;
  min-width: 0;
}

.flow-card-title {
  font-weight: 600;
  font-size: 15px;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.dark .flow-card-title {
  color: #e0e0e0;
}

.flow-card-desc {
  font-size: 13px;
  color: #555;
  white-space: pre-line;
  line-height: 1.5;
}

.dark .flow-card-desc {
  color: #aaa;
}

.flow-card-code {
  display: block;
  margin-top: 8px;
  padding: 8px 10px;
  background: #1e1e2e;
  color: #a6e3a1;
  border-radius: 6px;
  font-size: 12px;
  white-space: pre;
  overflow-x: auto;
}

.flow-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 40px;
  justify-content: center;
}

.flow-connector-arrow {
  margin-top: -1px;
}
</style>
