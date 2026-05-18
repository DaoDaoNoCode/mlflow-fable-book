# 建筑蓝图

> **对应概念：** MLflow Projects（可复现的代码打包）

## 故事

小梅的巧克力蛋糕推荐模型太成功了，公司想在伦敦办公室也复制一份。小梅把训练脚本打了个包，写了份 README——「用 Python 3.10，跑 train.py，用默认参数」——发了过去。

伦敦团队周一就开始跟 Python 版本打架：代码用了 3.10 的特性，他们的服务器跑的是 3.8。周二是依赖冲突：一个特定版本的 PyTorch 跟他们的 CUDA 安装打架。周三好不容易搞定了环境，又发现 README 里的默认超参数早就过时了——老王几周前在本地调过，但没更新文档。伦敦的模型准确率 84.2%，小梅这边是 91.4%。折腾了四天，结果都对不上。

这场灾难之后，两个团队达成共识：每个项目必须附带一份**蓝图**——一个 MLproject 文件，准确声明跑什么代码、接受什么参数（带类型和默认值）、搭什么环境。conda.yaml 锁死每一个依赖。入口点声明每一条命令。不再靠会过时的 README，不再靠「在我机器上能跑」。

蓝图在小梅的厨房里创建 Run，跟她手动做实验一样——老王的参数笔记、莉娜的 Artifact 保管库，全都照常工作。唯一的区别是 Run 上的 source tag 写着 `PROJECT` 而不是 `LOCAL`。现在任何人、任何地方，克隆仓库、跑一条命令，就能复现小梅的准确结果。

「代码从来不是问题，」伦敦的负责人跟管理层说。「问题是代码*周围的一切*。蓝图就是那个'周围的一切'。」

## 概念解读

**MLflow Project** 是一种标准格式，用来打包可复现的 ML 代码。核心是一个 **MLproject 文件**——一个 YAML 清单，定义了：

- **入口点** — 要执行的命令。每个入口点有名称、参数（带类型和默认值）和命令模板
- **环境** — 依赖怎么装。可选：conda 环境、Docker 镜像、virtualenv、或系统环境

MLproject 文件长这样：

```yaml
name: my-training-project

conda_env: conda.yaml    # 也可以是 docker_env, python_env

entry_points:
  main:
    parameters:
      learning_rate: {type: float, default: 0.01}
      epochs: {type: int, default: 10}
    command: "python train.py --lr {learning_rate} --epochs {epochs}"
  validate:
    parameters:
      model_uri: {type: string}
    command: "python validate.py --model {model_uri}"
```

运行一个 Project：

```bash
mlflow run . -P learning_rate=0.001 -P epochs=50
```

也可以直接从 Git 仓库运行：

```bash
mlflow run git@github.com:org/ml-project.git -P learning_rate=0.001
```

MLflow 会自动处理克隆仓库、搭建环境、执行命令。每次 Project 运行都会创建一个追踪用的 **Run**，自动记录参数、指标和 Artifact。

**后端**决定 Project 在哪里跑：
- **本地**（默认）— 在你自己的机器上跑
- **Databricks** — 提交到 Databricks 集群
- **Kubernetes** — 在 K8s Pod 里跑

::: tip 一句话总结
- **MLflow Project** = 可复现 ML 代码的标准打包格式
- **MLproject 文件** = YAML 清单，定义入口点、参数和环境
- 可以从本地目录或 Git 仓库运行
- 每次运行自动创建一个追踪 Run
- 后端：本地、Databricks、Kubernetes
:::

::: info Projects 和实验的关系
每次 Project 运行都自动在某个实验下创建一个 Run，所以参数、指标、Artifact、对比等追踪功能开箱即用。Run 上的 `source_type` 和 `source_name` Tag 会标明它来自 Project 执行。
:::

## 前端开发者参考

Projects 主要是 CLI 和 SDK 的概念——UI 里没有专门的页面来管理或浏览 Project。但 Project 的 Run 会作为普通 Run 出现在实验追踪页面里，现有的 Run 组件照常处理。

| 组件 | 对应什么 |
|------|---------|
| `ExperimentRunsPage` | Project 的 Run 和其他 Run 混在一起展示 |
| `RunPage` | Project Run 的详情——参数、指标、Artifact |

识别一个 Run 是不是来自 Project，看它的 Tag：

### 数据长什么样

```typescript
// 一个由 Project 执行创建的 Run
{
  info: {
    runUuid: "proj-run-123",
    experimentId: "42",
    runName: "my-training-project",
    status: "FINISHED",
    startTime: 1700000000000,
    endTime: 1700003600000,
    artifactUri: "s3://bucket/proj-run-123/artifacts",
    lifecycleStage: "active",
  },
  data: {
    params: [
      { key: "learning_rate", value: "0.001" },
      { key: "epochs", value: "50" },
    ],
    metrics: [
      { key: "rmse", value: 0.042, step: 50, timestamp: 1700003600000 },
    ],
    tags: [
      { key: "mlflow.source.type", value: "PROJECT" },       // <-- Project 标记
      { key: "mlflow.source.name", value: "git@github.com:org/ml-project.git" },
      { key: "mlflow.project.entryPoint", value: "main" },
      { key: "mlflow.project.backend", value: "local" },
    ],
  },
}
```

---

::: details 相关寓言
- [大厨的厨房](./experiments-and-runs) — Project 运行会自动创建追踪 Run
:::
