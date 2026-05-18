# 试吃厨房的原料清单

> **对应概念：** 数据集（Datasets）

## 故事

**美香**在小梅面包坊隔壁开了试吃厨房。任何蛋糕想在阿赫迈德的图书馆拿到 `@champion` Alias，都必须先过美香的标准化试吃。没有例外——小梅也不行。

这条规矩之所以存在，是因为一个周一发生的事。美香用罗德里戈首选供应商的高级比利时可可测试了小梅的新黑巧克力配方。醇厚、均衡、完美。她宣布可以进阿赫迈德的图书馆了。周二，她的副手小凯用根特备用供应商的平价可可测了同一个配方。寡淡、苦涩、难吃。小凯走进厨房说：「小梅的配方不行啊。」

两个人吵了一个小时——美香坚持说完美，小凯坚持说难吃——最后才发现根本不是在测配方。她们测的是不同的原料。配方是同一个，输入不是。两个人都没错，两个人也都不对。她们根本没有比较的基础。

这场争论让美香明白了两件事。第一：想知道哪个配方更好，每次必须用同一套原料。她做了十二套标准化测试包——预先称量好的原料组合，每套完全一样，精确到克。任何蛋糕只要用这套测试包测过，就能和其他蛋糕公平比较。第二：她得记录小梅开发配方时用了什么原料。小梅用比利时可可开发配方的时候，美香把这个来源记下来——不是可可本身，而是它从哪来的记录，这样别人能回溯、理解结果是怎么产生的。

「你要是不控制原料，」美香跟小凯说，「就没资格评价配方。」罗莎的评委们——给小梅的大赛评估打分的那些人——用的就是美香的标准化测试包给每个参赛者打分。没有测试包，就没有分数。这是规矩。

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
| `RunPage` | Run 详情——展示哪些数据集被用作输入 |
| `ExperimentEvaluationDatasetsPage` | 实验里的 Datasets 标签页——评估数据集的增删改查 |
| 数据集记录管理 | 在数据集里添加、编辑、删除单条测试用例 |
| `ExperimentEvaluationRunsPage` | 基于数据集计算的评估结果 |

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
