# 皇家图书馆

> **对应概念：** Model Registry

## 故事

**阿赫迈德**管着镇上大街上的皇家图书馆——官方目录，小梅最好的蛋糕在这里变成有编号、有版本的正式记录。阿毕的记录簿里标了「特别优秀」的蛋糕，就被提拔到这里来。阿赫迈德把小梅的巧克力蛋糕注册为「巧克力蛋糕」，开始编版本。版本 1 不错。版本 3——托马斯包装过的——更好。医院食堂、街角面包店、学校午餐项目全都订了版本 3。

然后学校反映了一个问题。版本 3 有个配比错误——做小份的时候小苏打放多了。街角面包店也发现了同样的问题。阿赫迈德修好了配方，做出了版本 5。但镇上现在面对一个很头疼的问题：三个客户，每家手里都有自己的版本 3 副本。你怎么通知他们全部停用？阿赫迈德发了消息。医院换了。面包店不确定自己手里是哪个版本。学校压根没收到通知。

这时候阿赫迈德引入了 **Alias**。不再告诉每个客户「请用版本 5」，他创建了一个 `@champion` Alias。从今以后，每个客户只需要订 `@champion`。等版本 7 准备好——经过罗莎的评委在评估大赛里测试之后——阿赫迈德挪一下 Alias 就行。所有客户自动拿到新版本。不用发通知，不会搞混。「配方的错误确实是我的问题，」阿赫迈德说。「但不知道谁在用哪个版本？那才是真正的灾难。现在我只需要挪一个 Alias，全镇就都更新了。」

任何蛋糕想拿到 `@champion`，都必须先通过罗莎的评估。而一旦通过了，是帕特尔医生把它摆到柜台上让顾客真正能买到。

## 概念解读

**Model Registry** 是一个中心化的模型目录，提供版本管理、别名、Tag 标注和溯源追踪。

核心概念三个：

- **Registered Model** — 目录中的一条命名记录（如 `fraud-detector`）
- **Model Version** — 某个具体版本，关联着产出它的 Run
- **Model Alias** — 可变的命名引用（如 `@champion`），指向某个版本。别名可以独立于使用它的代码来更新，实现了版本和代码的解耦

别名的设计很巧妙。线上系统不写死「用第 5 版」，而是写「用 `@champion`」。切换新版只需要把别名挪过去，线上代码不用动。这让灰度发布、回滚、A/B 测试都变得很容易。

::: tip 一句话总结
- **Registered Model** = 目录中的一条命名记录
- **Model Version** = 具体某一版，关联着产出它的 Run
- **Alias** = 可移动的命名引用（如 `@champion`），解耦版本和代码
- **溯源（Lineage）** = 追溯模型是哪个实验、哪个 Run 产出的
:::

## 前端开发者参考

**Model Registry** 在侧边栏里是一个独立板块。模型列表支持搜索。点进去看到所有版本，每个版本标着 Alias 和 Tag。版本上的 Run 链接可以直接跳回产出这个模型的那个 Run 详情。

| 组件 | 对应什么 |
|------|---------|
| `ModelListPage` | 模型目录大厅，支持搜索 |
| `ModelPage` / `ModelView` | 某个模型的所有版本、Alias、Tag |
| `ModelVersionPage` / `ModelVersionView` | 某个版本的详情（Alias、来源 Run、溯源） |
| `CompareModelVersionsPage` | 版本并排对比 |

### 数据长什么样

```typescript
// ModelEntity（前端类型）
{
  name: "fraud-detector",
  description: "Detects fraudulent transactions",
  creation_timestamp: 1700000000000,
  last_updated_timestamp: 1700003600000,
  tags: [{ key: "team", value: "ml" }],
  latest_versions: [...],
  aliases: { "champion": "7", "challenger": "8" },
}

// ModelVersionInfoEntity（前端类型）
{
  name: "fraud-detector",
  version: "7",
  creation_timestamp: 1700000000000,
  current_stage: "None",    // 遗留字段，推荐用 Alias
  source: "runs:/abc-def-456/model",
  run_id: "abc-def-456",    // 溯源：哪个 Run 产出的
  status: "READY",
  aliases: ["champion"],
  tags: [...],
}
```

---

::: details 相关寓言
- [匠人的出厂记录](./logged-models) — 注册模型的版本关联着 LoggedModel
- [发射台](./model-serving) — 注册模型可以直接部署到生产环境
- [美食大赛的评委](./evaluation-and-scorers) — 模型在晋升前通常要经过评估
:::
