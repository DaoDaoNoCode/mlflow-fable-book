---
outline: deep
---

# 写信人的模板

> **对应概念：** Prompt Registry

## 故事

<div v-pre>

**雅拉**是写蛋糕上文字模板的人。

帕特尔医生柜台的每一笔订单背后，都有一张模板卡片——「做一个 {{size}} 的巧克力蛋糕，送给 {{customer_name}}，备注 {{special_request}}。」这些卡片全是雅拉写的。

雅拉维护着一整套模板：`@chocolate-classic`、`@birthday-celebration`、`@memorial-tribute`。生日模板第一版活泼明快，第二版加了句「让愿望成真」。生意一直挺好。

后来出了件大事。

雅拉手下一个学徒，打开了悼念模板的第二版。他觉得措辞太冷了，需要「多一些温度」，就直接在上面加了几句喜庆的话。改完，版本号没动，顺手存了。

下一笔悼念订单到的时候，蛋糕送到了。上面用奶油裱着：「恭喜！祝这个快乐的日子永远延续！」

那家人崩溃了。

雅拉急忙叫来侦探老陈。老陈拉出 Trace 一看——系统用的是悼念模板，第二版，完全按流程走的。版本号对了，文字错了。最可怕的是，没人能查出改动发生在什么时候。

这场灾难以后，雅拉定了两条铁规。

第一：版本一旦定稿，**一个字都不准改**。要改？发新版。老版本永远冻在那里，想看随时能看。

第二：模板引用只用 **Alias**，不用版本号。`@memorial` 永远指向雅拉亲自批准的版本。模板改进了，Alias 挪到新版本上就行。老陈追踪的每一笔订单，都能精确看到用了哪个模板、哪个版本、哪个 Alias。

「版本号是给历史看的，」雅拉跟学徒们说。「Alias 是给信任看的。」

</div>

## 概念解读

<div v-pre>

MLflow 的 **Prompt Registry** 让你对 Prompt 做版本管理、追踪和复用。Prompt 是给大模型的模板指令，带有变量槽位（如 `{{user_question}}`），使用时填入具体内容。

</div>

设计理念类似 Git：

- **不可变性（Immutability）**：Prompt 版本一旦创建就不能修改，保证同一个版本在任何地方的行为完全一致
- **Alias**：可变的命名引用，如 `@production`、`@staging`、`@beta`。想上线、回滚、灰度，挪一下 Alias 就行，代码不用动
- **`@latest`**：保留的 Alias，自动指向最新版本

<div v-pre>

::: tip 一句话总结
- **Prompt** = 带有 `{{变量}}` 槽位的模板指令
- 版本**不可变**——只能发新版，不能改旧版
- **Alias** = 可移动的命名引用（如 `@production`），用来管理上线和回滚
- `@latest` 自动指向最新版本
:::

</div>

## 前端开发者参考

<div v-pre>

**Prompt 板块**展示的是小雅的模板集合。每个 Prompt 有**版本历史**和 diff 对比。模板编辑器会高亮 `{{变量}}` 的位置。Alias 标签（如 `@production`）醒目地标在版本旁边。

</div>

| 组件 | 对应什么 |
|------|---------|
| `PromptsPage` | 顶层 Prompt 列表 |
| `PromptsDetailsPage` | Prompt 详情，包含版本历史和 diff 对比 |
| `ExperimentPromptsPage` | 实验维度的 Prompt 标签页 |
| `ExperimentPromptDetailsPage` | 实验维度的 Prompt 详情 |

### 数据长什么样

Prompt 通过 Unity Catalog OSS 管理。Prompt 和 PromptVersion 是两个独立实体：

<div v-pre>

```typescript
// Prompt（命名条目）
{
  name: "customer-greeting",
  description: "Greeting template for customer interactions",
  tags: [{ key: "team", value: "support" }],
}

// PromptVersion（具体的不可变版本）
{
  version: 3,
  template: "Dear {{name}}, thank you for choosing {{company}}...",
  tags: [...],
  aliases: ["production"],  // 这个版本是 @production 版本
}
```

</div>

---

::: details 相关寓言
- [侦探的红线](./tracing-and-spans) — Prompt 在 LLM 调用中使用，会出现在 Trace 里
- [港口调度员](./ai-gateway) — Prompt 通过网关端点发送给 LLM
:::
