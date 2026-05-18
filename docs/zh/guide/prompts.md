---
outline: deep
---

# 写信人的模板

> **对应概念：** Prompt Registry

## 故事

<div v-pre>

小梅的巧克力蛋糕不是自己烤出来的。通过帕特尔医生柜台的每一笔订单背后，都有一张配方卡片——一套精心写好的指令，留着空要填：「做一个 {{size}} 的巧克力蛋糕，送给 {{customer_name}}，备注 {{special_request}}。」写这些配方卡片的人是**雅拉**。

雅拉是个完美主义者。她维护着一整套模板，涵盖小梅厨房能做的每一种蛋糕：`@chocolate-classic`、`@birthday-celebration`、`@memorial-tribute`。生日模板第一版活泼明快，第二版加了一句「让愿望成真」。生意挺好。

然后雅拉的一个学徒犯了一个改变一切的错误。一个客户订了悼念蛋糕——庄重、肃穆的那种。学徒打开悼念模板的第二版，加了些喜庆的措辞，觉得需要「多一些温度」。他直接在原版上改了。版本号没变。下一笔悼念订单送到的时候，蛋糕上用奶油裱着「恭祝喜事，欢庆此刻！」

那家人崩溃了。雅拉惊呆了。侦探老陈拉出 Trace 一看，一切正确——系统用的是悼念模板，第二版，完全按要求来的。版本号对了，文字错了。甚至没人能查出修改是什么时候发生的。

这场灾难给了雅拉两条铁律。第一：版本一旦定稿，**绝不能改**。一个字、一个逗号都不行。要改就发新版。第二：模板用 **Alias** 来引用，不用版本号。`@memorial` 这个 Alias 永远指向雅拉亲自批准的版本。模板改进了，她就把 Alias 挪到新版本上。老陈追踪的每一笔订单都能精确地看到用了雅拉的哪个模板、哪个版本、哪个 Alias——从顾客请求到成品蛋糕，一条完整的链条。

「版本号是给历史看的，」雅拉跟学徒们说。「Alias 才是用来兜底的。」

</div>

## 概念解读

<div v-pre>

MLflow 的 **Prompt Registry** 让你对 Prompt 做版本管理、追踪和复用。Prompt 是给大模型的模板指令，带有变量槽位（如 `{{user_question}}`），使用时填入具体内容。

</div>

设计理念类似 Git：

- **不可变性（Immutability）**：Prompt 版本一旦创建就不能修改，保证同一个版本在任何地方的行为完全一致
- **Alias**：可变的命名引用，如 `@production`、`@staging`、`@beta`。通过移动 Alias 来管理上线、回滚和灰度，不需要改代码
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
