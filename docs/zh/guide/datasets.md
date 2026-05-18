# 试吃厨房的原料清单

> **对应概念：** 数据集（Datasets）

## 故事

**美香**在小梅面包坊隔壁开了间试菜厨房。

周一，美香测小梅的新黑巧配方。用的是罗德里戈首选供应商的高级比利时可可。一口下去——醇厚、均衡、完美。美香拍板：「行，能送去阿赫迈德的图书馆了。」

周二，副手小凯也测了同一个配方。不过他手边只有根特备用供应商的廉价可可。一口下去——寡淡、发苦。小凯端着盘子走进来：「小梅这配方不行啊。」

两人吵了一个钟头。美香说完美，小凯说难吃。谁都没说错，谁也都不对。吵到最后才反应过来：她俩根本不是在测配方——测的是原料。配方一样，输入不一样。拿什么比？

美香从那天起想明白两件事。

第一件：要比配方，原料必须一样。她做了十二套标准测试包——每套原料预先称好，精确到克，套套相同。不管谁的蛋糕，拿这十二套一测，结果才有可比性。

第二件：得记下小梅开发配方时用了什么原料。小梅用比利时可可开发的配方，美香就把来源记一笔。记的不是可可本身，是它从哪来的。以后谁想回溯结果怎么产生的，一翻就有。

罗莎办大赛的时候，评委们用的就是美香的标准测试包。没有测试包，不给打分。这是规矩。

「你要是不控制原料，」美香跟小凯说，「就没资格评价配方。」

## 概念解读

MLflow 里有两种不同的数据集概念：

### 1. Run 级的 DatasetInput（溯源）

训练模型的时候，你可以记录用了哪个数据集作为输入。这会在 Run 上创建一条 `DatasetInput` 记录——一条溯源线索，说明「这个 Run 是用*这份*数据训练出来的」。MLflow 不存储数据集本身，只存元数据（名称、摘要/校验和、来源位置、schema）。这样你可以回答：「这个模型是用什么数据训练的？」

### 2. EvaluationDataset（测试）

做评估的时候，MLflow 提供了结构化的测试用例集合。一个 `EvaluationDataset` 包含多条 `DatasetRecord`——每条记录有输入（测试提示或特征）、期望输出（标准答案）和 Tag。可以理解为一个给模型用的结构化测试套件。

跑评估时，Scorer 会处理数据集里的每一条记录并打分。数据集的 digest（摘要值）确保你每次都是拿同一套测试用例来比较模型。

::: tip 一句话总结
- **DatasetInput**（Run 级）= 溯源——记录模型用了什么数据训练
- **EvaluationDataset** = 结构化的测试用例集合，有输入、期望输出和 Tag
- **DatasetRecord** = EvaluationDataset 里的一条测试用例
- 数据集有 digest（校验和）来保证可复现性
:::

## 前端开发者参考

Run 级的数据集在 Run 详情页展示。EvaluationDataset 在实验里有自己的标签页，支持完整的增删改查操作来管理数据集和单条记录。

| 组件 | 对应什么 |
|------|---------|
| `RunPage` | Run 详情——展示用了哪些数据集 |
| `ExperimentEvaluationDatasetsPage` | 实验里的 Datasets 标签页——评估数据集的增删改查 |
| 数据集记录管理 | 在数据集里添加、编辑、删除单条测试用例 |
| `ExperimentEvaluationRunsPage` | 数据集上跑出来的评估结果 |

### 数据长什么样

```typescript
// Run 级的 Dataset（溯源）
// 记录在 Run 上的数据集元数据
{
  name: "training-data-v2",
  digest: "abc123def456",           // 校验和，保证可复现
  source_type: "s3",
  source: "s3://bucket/training-data.parquet",
  schema: '{"columns": [...]}',
  profile: '{"num_rows": 50000}',
}

// DatasetInput —— 把数据集和 Run 关联起来
{
  tags: [{ key: "context", value: "training" }],
  dataset: { /* 上面的 Dataset 对象 */ },
}

// EvaluationDataset（测试）—— tags/schema/profile 都是 JSON 字符串
{
  dataset_id: "ds-456",
  name: "chatbot-test-suite-v3",
  tags: '{"domain": "customer-support"}',        // JSON 字符串
  schema: '{"columns": ["question", "answer"]}',  // JSON 字符串
  profile: '{"num_rows": 200}',                   // JSON 字符串
  digest: "xyz789",
}

// DatasetRecord —— 一条测试用例。inputs/expectations/tags 都是 JSON 字符串。
{
  dataset_record_id: "rec-001",
  dataset_id: "ds-456",
  inputs: '{"question": "怎么重置密码？"}',
  expectations: '{"answer": "进入 设置 > 安全 > 重置密码"}',
  tags: '{"difficulty": "easy", "category": "account"}',
  source: "manual",
  source_id: "human-annotator-1",
}
```

---

::: details 相关寓言
- [美食大赛的评委](./evaluation-and-scorers) — Scorer 在 EvaluationDataset 上打分
- [大厨的厨房](./experiments-and-runs) — DatasetInput 记录了 Run 用了什么训练数据
:::
