# 全景：串起来的故事

> **二十一个角色，一个小镇**

## 故事

把所有寓言角色放到同一个小镇，看看他们怎么协作。

### 第一幕：造模型

**大厨小梅**搭好厨房（实验），开始一次又一次地试做蛋糕。她吃过亏——最好的配方因为没记下来丢了一次。从那以后，每次尝试都是一个 Run，认认真真地记录。她的**自动驾驶仪**（Autologging）负责全自动记录——参数、指标，全都不用她动笔。

**面包师老王**把小梅的笔记整理成三种颜色：蓝色记输入（参数），红色记结果（指标），绿色贴标签（Tag）。**雕塑家小丽**把真正的蛋糕和文件（Artifact）存到她的仓库里——那些塞不进笔记本的大家伙。

小梅做的每个蛋糕都会在**老毕的出厂记录簿**（LoggedModel）上登记一笔——记录蛋糕出自哪个厨房、哪次尝试、放在仓库的哪个架子上。蛋糕是用**老陶的万能转接头**（Flavor/pyfunc）包好的——标准化的包装，不管用什么烤箱（框架）烤出来的，都能通用。

### 第二幕：发布与部署

小梅最好的蛋糕准备好面世了，她把它从老毕的记录簿提升到**图书管理员老艾的皇家图书馆**（Model Registry），注册为"巧克力蛋糕"，打上 `@champion` 的 Alias。但在这之前——**美食大赛的评委们**（评估 + Scorer）先拿**小美的标准化食材**（Dataset）测试了一番。评委中的过敏原检测器发现了小梅没注意到的问题。修好之后，蛋糕才拿到了 `@champion` 的徽章。

**帕特尔博士**拿到 `@champion` 蛋糕，通过她的**发射台**（Model Serving）部署上线——现在它是一个谁都能调用的 REST API。蛋糕正式上线了。

### 第三幕：服务与观测

一个顾客发来请求。请求先到达**港口调度员罗德里戈**（AI Gateway），他把请求路由到对应的供应商。请求用的是**小雅精心打磨的模板**（Prompt）——`@production` 版本，不可变，值得信赖。**侦探老陈**（Tracing）全程记录每个 Span——构造 Prompt、调用 LLM、格式化回复。顾客要是投诉了，翻老陈的 Trace 就知道是哪个环节出了问题。

**质检员**（Issue）长期盯着老陈的 Trace。一个顾客不满意，那是一个 Assessment。但如果 47 个顾客抱怨同一件事呢？那就是一个 Issue——系统性的问题，必须修。质检员把它关联回模型版本和应该捕获到这个问题的 Scorer。

### 第四幕：治理与基础设施

所有这一切都发生在**建筑师小普的楼层**（Workspace）上——跟其他团队的数据完全隔离。**小丹的守门人**（RBAC）确保实习生只能看不能碰生产环境。**信号弹**（Webhook）在关键事件发生时自动发射——模型被提升了、评估完成了、Issue 被检测到了。整个工作流是用**伦敦团队的蓝图**（Project）搭建的——一个可复现的包，任何人运行都能得到相同的结果。

### 即将推出

**老方的工具棚**（MCP Registry）将管理 AI Agent 能使用哪些外部工具——带版本、带 Alias、带审批过的接入地址。**冷藏仓库**（Trace Archival）会把旧 Trace 搬到更便宜的存储，同时保持可搜索。而**握手**（Span Links）将在异步 Agent 跨时间协作时，把不同 Trace 中的 Span 连接起来。

## 架构全图

点击卡片跳转到对应的寓言页面，鼠标悬停查看简介。

<ArchitectureDiagram lang="zh" />

## 数据流

<DataFlowDiagram lang="zh" />

## 概念关系图

### 核心链路：构建 → 注册 → 服务 → 观测

```
实验 → Run → LoggedModel → Model Registry → Model Serving → Tracing
         ↑                        ↑                ↑           ↓
    Autologging               评估            Gateway       Issue
         ↑                     ↑                 ↑
    参数/指标/Tag           Dataset           Prompt
         ↑
     Artifact（单独存储）
```

### 所有关系

| 概念 | 产出 / 包含 | 关联到 |
|------|-----------|--------|
| **实验** | Run, Trace, Issue | 分组相关的尝试；受 Workspace 限定 |
| **Run** | 参数, 指标, Tag, Artifact, LoggedModel | 由 Project 创建；由 Autologging 自动填充 |
| **Autologging** | （自动创建 Run 数据） | 自动 patch 30 多个框架，把数据记录到 Run |
| **Artifact** | 文件（模型、数据、图表） | 存在 Artifact Store 中；被 Run 和 LoggedModel 引用 |
| **Flavor / pyfunc** | 模型打包格式 | 决定 LoggedModel 怎么保存和加载；支持通用 Serving |
| **LoggedModel** | 模型元数据，关联到 Artifact | 在 Run 中创建；可提升到 Model Registry；关联到 Trace |
| **Model Registry** | Registered Model → 版本 + Alias | 版本关联回 Run；部署前先做评估；通过 Model Serving 部署 |
| **Model Serving** | REST API 端点 | 从 Registry 部署模型；使用 pyfunc 接口；可被 Gateway 代理 |
| **Trace** | Span, Assessment | 记录 LLM 请求旅程；关联到 LoggedModel、Prompt、MCP Server |
| **Prompt** | 版本, Alias | 在被追踪的 LLM 调用中使用的模板；不可变版本；通过 Gateway 发送 |
| **AI Gateway** | Endpoint | 路由被 Tracing 捕获的 LLM 调用；可代理到已部署模型 |
| **Dataset** | 记录, 输入 | 训练溯源（Run 级别）；评估的测试用例 |
| **评估** | Scorer 在评估 Run 上的结果 | 在 Dataset 上测试模型；为 Registry 提升提供依据 |
| **Issue** | 质量问题模式 | 从 Trace 模式中检测；关联到 Assessment |
| **Workspace** | 以上所有 | 数据隔离边界；影响每个 API 调用 |
| **RBAC** | Role, 权限 | 控制谁在 Workspace 内能做什么 |
| **Webhook** | 事件订阅 | 在 Registry、评估等事件发生时触发 |
| **Project** | MLproject 定义 | 在可复现的环境中产出 Run |
| **MCP Registry**（RFC） | MCP Server, 版本, Access Binding | 受管工具目录；Trace 关联到 MCP 版本 |
| **Trace Archival**（RFC） | 归档的 Span 数据 | 把旧 Trace 数据搬到更便宜的存储 |
| **Span Links**（RFC） | 跨 Trace 的连接 | 为异步 Agent 连接不同 Trace 中的 Span |
