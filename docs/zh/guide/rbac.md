# 门卫

> **对应概念：** RBAC 与权限管理

## 故事

**小丹**来小梅团队实习，第一周。主管给了他 MLflow 服务器的账号——就是小普刚分好 Workspace 的那台——让他看看小梅的实验，了解巧克力蛋糕模型怎么运作。主管忘了一件事：设权限。

小丹什么都能看到。小梅的实验，老王的参数笔记，阿赫迈德的模型注册中心——生产模型全在那儿。哪些是敏感的、哪些不是，界面上看起来一模一样。周三下午，小丹在阿赫迈德的图书馆里点来点去想搞懂怎么用，手一滑，把小梅生产巧克力蛋糕模型上的 `@champion` Alias 删了。那个 Alias 正是帕特尔医生的服务端点指向的目标。

完蛋。服务端点挂了两个小时。

值班工程师追了半天，故障原因就是 Alias 丢了。复盘会又短又痛：一个权限全开的实习生，删了一个他根本不知道是生产环境的东西。

那次之后，团队立了门卫制度。小丹拿 READ——小普 Workspace 里什么都能看，什么都碰不了。模型给 USE——能通过帕特尔医生的端点跑预测，不能改部署。只有小梅这样的组长才有 EDIT 和 MANAGE。层级严格：MANAGE 包含 EDIT，EDIT 包含 USE，USE 包含 READ。每级自动继承下级。

「我不是故意搞坏的，」小丹在复盘会上说。

主管点头：「这恰恰说明了问题。系统不应该让你搞坏你不打算搞坏的东西。」

## 概念解读

MLflow 支持**身份验证**（你是谁？）和**权限控制**（你能做什么？）。

**身份验证**用的是基本认证——用户名加密码。用户由管理员创建和管理。

**权限控制**用的是 RBAC（基于角色的访问控制），有四个权限级别，每个级别自动包含低级别：

| 级别 | 允许做什么 |
|------|----------|
| **READ** | 查看资源 |
| **USE** | 读取 + 使用资源（如跑预测） |
| **EDIT** | 使用 + 修改资源 |
| **MANAGE** | 编辑 + 控制访问、删除、管理操作 |

权限可以**按资源授予**——针对某个具体的实验或注册模型。比如：「用户 Alice 对实验 #42 有 EDIT 权限。」

**角色**把权限打包到一起方便管理。不用给每个用户逐个授权，而是创建一个「数据科学家」角色——对所有实验有 READ 权限、对特定实验有 EDIT 权限——然后把角色分配给多个用户。

**管理员**可以管理一切：创建用户、定义角色、授予和收回权限。

::: tip 一句话总结
- **身份验证** = 大门的工牌（用户名/密码）
- **权限控制** = 能进哪些楼层（RBAC）
- 权限级别：READ < USE < EDIT < MANAGE（每级包含低级别）
- 权限可以按资源（实验、模型）授予，也可以通过角色授予
- 管理员统管用户、角色和权限
:::

## 前端开发者参考

RBAC 涉及几个页面：个人用户的账户管理，以及系统级的用户/角色管理后台。

| 组件 | 对应什么 |
|------|---------|
| `AccountPage` | 用户个人主页——改密码、查看自己的权限 |
| `AdminPage` | 管理后台——管理用户和角色 |
| `RoleDetailPage` | 角色详情——这个角色授予了哪些权限 |
| `UserDetailPage` | 用户详情——这个用户有哪些角色和权限 |

### 关键 Hook

```typescript
// 检查当前用户是否是管理员
useCurrentUserIsAdmin()  // 返回 boolean

// 查询当前用户对某个资源的权限
useMyPermissionsQuery({ resourceType, resourceId })
// 返回权限级别：READ | USE | EDIT | MANAGE
```

### 数据长什么样

```typescript
// 用户
{
  username: "alice",
  is_admin: false,
}

// 角色
{
  role_name: "data-scientist",
  permissions: [
    { resource_type: "experiment", resource_id: "42", permission: "EDIT" },
    { resource_type: "experiment", resource_id: "*", permission: "READ" },
    { resource_type: "registered-model", resource_id: "*", permission: "USE" },
  ],
}

// 按资源授予的权限
{
  username: "alice",
  resource_type: "experiment",    // 或 "registered-model"
  resource_id: "42",
  permission: "EDIT",             // READ | USE | EDIT | MANAGE
}
```

::: info API 端点
用户管理接口在 v2（`ajax-api/2.0/mlflow/users/`），角色和权限接口在 v3（`ajax-api/3.0/mlflow/roles/`、`ajax-api/3.0/mlflow/users/permissions/`）。
:::

---

::: details 相关寓言
- [公寓楼的楼层](./workspaces) — 权限在 Workspace 范围内生效
- [皇家图书馆](./model-registry) — 模型权限控制谁能晋升模型
:::
