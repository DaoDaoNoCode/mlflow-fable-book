# 公寓楼的楼层

> **对应概念：** Workspace

## 故事

小普管着小梅团队工作的那栋楼。楼不错——一台 MLflow 服务器，空间也够——刚开始一层楼就够了。小梅的 Alpha 团队跑着一个叫「最佳巧克力蛋糕」的实验，专攻黑巧克力配方。走廊那头的 Beta 团队也有一个叫「最佳巧克力蛋糕」的实验——他们做的是白巧克力。原料不同，模型不同，完全不是一回事。名字一样。同一层楼。中间没有墙。

一个周一早上，小普打开小梅的实验，发现了十二条她不认识的 Run。白巧克力参数。Alpha 团队从没用过的特征。老王的三色参数笔记被 Beta 的条目埋住了，指标图表像两种语言叠在同一页上。Beta 有人记错了实验——名字一模一样，而且没有任何东西拦住。三天的数据污染。小梅的周更重训练任务已经把 Beta 的两条 Run 当输入吃进去了。模型被污染了。

事故之后，小普把楼分成了 **Workspace**——同一个地址里的独立楼层。Alpha 团队有自己的楼层，Beta 团队也有。两边还是可以有一个叫「最佳巧克力蛋糕」的实验，但数据永远不会串。每个 API 请求——从老王的参数记录到老陈的 Trace——现在都带着一个 Workspace header `X-MLFLOW-WORKSPACE`，这样服务器就知道数据属于哪个楼层。

「实验名字不是问题，」小普在复盘报告里写道。「问题是没有任何东西能阻止别人的工作跑进小梅的厨房。Workspace 不是为了整理——是为了划界。」

## 概念解读

**Workspace** 就是 MLflow 里的「楼层」——它在逻辑上隔离了不同团队的数据。每个 Workspace 有自己的实验、Run、模型和 Trace，完全独立。

Alpha 团队和 Beta 团队都可以有一个叫「最佳巧克力蛋糕」的实验，但它们的数据毫不相干，互相看不到。

这个设计对企业级部署很重要——多个团队共用一套 MLflow 服务，但数据各自隔离。

::: tip 一句话总结
- **Workspace** = 数据隔离的边界，通过**名称**（而非 ID）标识
- 不同 Workspace 里同名的实验是完全不同的数据
- 企业里多团队共用时不可或缺
:::

## 前端开发者参考

Workspace 感知通过两个机制贯穿整个 UI：

1. **HTTP header**：`FetchUtils.ts` 通过 `getActiveWorkspace()` 自动在每个 API 请求上添加 `X-MLFLOW-WORKSPACE` header
2. **URL 查询参数**：`useNavigate()` 封装自动在导航链接上添加 `?workspace=<name>` 参数

启用 Workspace（通过 `server-info` API 检测到）后，根页面显示 `WorkspaceLandingPage`（Workspace 选择器）。`WorkspaceRouterSync` 组件在整个应用中管理 Workspace 上下文。

| UI 模式 | Workspace 怎么影响 |
|---------|-------------------|
| API 请求 | `FetchUtils.ts` 自动设置 `X-MLFLOW-WORKSPACE` header |
| URL 导航 | `useNavigate()` 封装自动添加 `?workspace=<name>` 查询参数 |
| 根页面（`/`） | 启用 Workspace 后显示 Workspace 选择器 |
| 侧边栏 | 可能显示 Workspace 上下文 |

### 数据长什么样

```typescript
// 每个 API 请求都通过 HTTP header 带上 Workspace
// （FetchUtils.ts 里的 getActiveWorkspace() 自动设置）

GET /ajax-api/2.0/mlflow/experiments/search
Headers:
  X-MLFLOW-WORKSPACE: my-workspace-name

// URL 路由使用查询参数
/#/experiments?workspace=my-workspace-name
```

::: warning 给前端开发者的提醒
如果你写了一个 API 调用没走 `FetchUtils`，就不会带上 `X-MLFLOW-WORKSPACE` header，请求会打到错误的 Workspace（或者直接报错）。所有请求都要走标准的 fetch 工具函数。
:::

---

::: details 相关寓言
- [门卫和钥匙](./rbac) — RBAC 控制 Workspace 内和跨 Workspace 的访问权限
- [大厨的厨房](./experiments-and-runs) — 实验按 Workspace 隔离
:::
