# 全景：串起来的故事

> **二十一个角色，同一个小镇，一台戏**

## 故事

把所有寓言角色搁到一块儿，看看他们怎么配合。

### 第一幕：做模型

**大厨小梅**把厨房搭好（实验），开始一轮接一轮地试蛋糕。她吃过亏——最好的配方没记下来，丢了。从那以后，每次尝试都老老实实记成一个 Run。**自动驾驶仪**（Autologging）跟在后头帮她自动记——参数、指标，一个都不落。

**老王**拿三色笔帮小梅整理笔记：蓝色记输入（参数），红色记结果（指标），绿色贴标签（Tag）。**莉娜**管恒温保管库，把蛋糕和文件（Artifact）存好——那些塞不进笔记本的大家伙。**小莲**是团队新人，发现了自动驾驶仪，让记录全自动化了。

每个蛋糕出炉，**老毕**就在出厂记录簿（LoggedModel）上登记一笔：哪个厨房出的，第几次尝试，存在仓库哪个架子上。蛋糕是拿**老陶的万能转接头**（Flavor/pyfunc）包好的——不管什么烤箱（框架）烤出来的，包上就能通用。

### 第二幕：发布上线

小梅最好的蛋糕准备好了。她把它从老毕的记录簿提到**图书管理员老艾的皇家图书馆**（Model Registry），注册为"巧克力蛋糕"，打上 `@champion` 的 Alias。不过在这之前——**大赛评委们**（评估 + Scorer）先拿**小美的标准测试食材**（Dataset）考了一轮。评委里的过敏原检测器挑出了小梅没注意到的问题。修好之后，蛋糕才拿到 `@champion`。

**帕特尔博士**接过 `@champion` 蛋糕，放上她的**发射台**（Model Serving）——变成一个谁都能调用的 REST API。蛋糕正式上线。

### 第三幕：服务与观测

顾客发来一个请求。请求先到**港口调度员罗德里戈**（AI Gateway）那里，他路由到对应的供应商。请求用的是**小雅精心打磨的模板**（Prompt）——`@production` 版，改不了，靠得住。**侦探老陈**（Tracing）全程跟着，每一步记成一个 Span——拼 Prompt、调 LLM、格式化回复。顾客要是投诉，翻老陈的 Trace 就知道哪个环节出了岔子。

**质检员**（Issue）长期盯着老陈的 Trace。一个顾客不满意，那是一条 Assessment。47 个顾客抱怨同一件事呢？那就是一个 Issue——系统性的毛病，必须修。质检员会把它关联回模型版本，也关联到本该逮住这个问题的 Scorer。

### 第四幕：治理与基建

上面这一切都跑在**建筑师小普划出的楼层**（Workspace）上——跟别的团队的数据完全隔开。**小丹的守门人**（RBAC）管着谁能干什么——实习生只能看，不能碰生产环境。**信号弹**（Webhook）在关键节点自动发射——模型提升了、评估跑完了、Issue 冒出来了。整套工作流是用**伦敦团队的蓝图**（Project）搭的——一个可复现的包，谁跑都一样。

### 即将推出

**老方的工具棚**（MCP Registry）将管理 AI Agent 能用哪些外部工具——带版本、带 Alias、带审批过的接入地址。**冷库**（Trace Archival）会把旧 Trace 搬到便宜的存储，同时保持可搜索。**握手**（Span Links）会在异步 Agent 跨时间协作时，把不同 Trace 里的 Span 连起来。

## 架构全图

点卡片跳到对应的寓言，鼠标悬停看简介。

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

### 完整关系表

| 概念 | 产出 / 包含 | 关联到 |
|------|-----------|--------|
| **实验** | Run, Trace, Issue | 把相关的尝试归到一组；受 Workspace 限定 |
| **Run** | 参数, 指标, Tag, Artifact, LoggedModel | 由 Project 创建；Autologging 自动填充 |
| **Autologging** | （自动生成 Run 数据） | patch 30 多个框架，自动把数据写进 Run |
| **Artifact** | 文件（模型、数据、图表） | 存在 Artifact Store；Run 和 LoggedModel 指向它 |
| **Flavor / pyfunc** | 模型打包格式 | 决定 LoggedModel 怎么存取；让所有模型都能部署 |
| **LoggedModel** | 模型元数据，指向 Artifact | 在 Run 里创建；可提升到 Model Registry；Trace 自动关联 |
| **Model Registry** | Registered Model → 版本 + Alias | 版本指回 Run；上线前先评估；走 Model Serving 部署 |
| **Model Serving** | REST API 端点 | 从 Registry 部署模型；走 pyfunc 接口；Gateway 可以代理 |
| **Trace** | Span, Assessment | 记录 LLM 请求的完整旅程；关联 LoggedModel、Prompt、MCP Server |
| **Prompt** | 版本, Alias | LLM 调用里用的模板；版本不可变；经 Gateway 发送 |
| **AI Gateway** | Endpoint | 路由 LLM 调用，Tracing 自动记录；可代理到已部署模型 |
| **Dataset** | 记录, 输入 | 训练溯源（Run 级）；评估的测试用例 |
| **评估** | Scorer 在评估 Run 上的打分 | 在 Dataset 上测模型；为 Registry 提升提供依据 |
| **Issue** | 质量问题模式 | 从 Trace 规律中检测出来；关联到 Assessment |
| **Workspace** | 以上所有 | 数据隔离边界；每个 API 调用都带着它 |
| **RBAC** | Role, 权限 | 管着谁在 Workspace 里能做什么 |
| **Webhook** | 事件订阅 | Registry、评估等事件发生时触发 |
| **Project** | MLproject 定义 | 在可复现的环境里跑 Run |
| **MCP Registry**（RFC） | MCP Server, 版本, Access Binding | 受管工具目录；Trace 关联到 MCP 版本 |
| **Trace Archival**（RFC） | 归档的 Span 数据 | 把旧 Trace 搬到便宜的存储 |
| **Span Links**（RFC） | 跨 Trace 的连接 | 给异步 Agent 连接不同 Trace 里的 Span |
