# The Gatekeepers

> **MLflow Concept:** RBAC & Permissions

## The Story

Danny's first week as an intern on Maya's team started well. His manager gave him credentials to the MLflow server — the same server Priya had recently split into workspaces — so he could explore Maya's experiments and learn how the chocolate cake recommendation model worked. What his manager forgot to do was set permissions.

Danny could see everything. Maya's experiments, Thomas's parameter logs, Lena's artifact vault, and most dangerously, Ahmed's model registry — the library where every production model lived. He didn't know what was sensitive and what wasn't. It all looked the same in the interface. On Wednesday afternoon, while clicking through Ahmed's library to understand how it worked, Danny accidentally deleted the `@champion` alias from Maya's production chocolate cake model. That alias was the one Dr. Patel's serving endpoint pointed to. It vanished.

The recommendation engine went down for two hours. The on-call engineer traced the outage to the missing alias in Ahmed's library. The postmortem was brief and painful: an intern with full access had removed a production pointer he didn't even know was production.

After that incident, Maya's team implemented gatekeepers. Danny got READ access — he could see everything in Priya's workspace but touch nothing. He got USE access for models — he could run predictions through Dr. Patel's serving endpoints but not modify deployments. Only team leads like Maya got EDIT and MANAGE permissions. The hierarchy was strict: MANAGE included EDIT, which included USE, which included READ. Each level inherited the ones below it.

"I didn't mean to break anything," Danny said at the postmortem. His manager nodded. "That's exactly the point. The system shouldn't let you break things you don't mean to break."

## The Lesson

MLflow supports **authentication** (who are you?) and **authorization** (what can you do?).

**Authentication** uses basic auth — username and password. Users are created and managed by admins.

**Authorization** uses RBAC (Role-Based Access Control) with four permission levels, each including all lower levels:

| Level | What It Allows |
|-------|---------------|
| **READ** | View the resource |
| **USE** | Read + use the resource (e.g., run predictions) |
| **EDIT** | Use + modify the resource |
| **MANAGE** | Edit + control access, delete, admin operations |

Permissions can be **resource-scoped** — applied to a specific experiment or registered model. For example: "User Alice has EDIT permission on Experiment #42."

**Roles** group permissions together for easier management. Instead of granting individual permissions to every user, you create a role like "Data Scientist" with READ on all experiments and EDIT on specific ones, then assign that role to multiple users.

**Admin users** can manage everything: create users, define roles, grant and revoke permissions.

::: tip Key Takeaway
- **Authentication** = badge at the door (username/password)
- **Authorization** = which floors you can access (RBAC)
- Permission levels: READ < USE < EDIT < MANAGE (each includes lower)
- Permissions can be per-resource (experiment, model) or via roles
- Admin users manage users, roles, and permissions
:::

## For Frontend Developers

The RBAC system spans several pages: account management for individual users, and admin pages for system-wide user/role management.

| Component | What It Shows |
|-----------|--------------|
| `AccountPage` | User profile — change password, view own permissions |
| `AdminPage` | Admin panel — manage users and roles |
| `RoleDetailPage` | Drill-down into a specific role — what permissions it grants |
| `UserDetailPage` | Drill-down into a specific user — their roles and permissions |

### Key Hooks

```typescript
// Check if current user is admin
useCurrentUserIsAdmin()  // returns boolean

// Query current user's permissions on a resource
useMyPermissionsQuery({ resourceType, resourceId })
// returns permission level: READ | USE | EDIT | MANAGE
```

### Data Shape

```typescript
// User
{
  username: "alice",
  is_admin: false,
}

// Role
{
  role_name: "data-scientist",
  permissions: [
    { resource_type: "experiment", resource_id: "42", permission: "EDIT" },
    { resource_type: "experiment", resource_id: "*", permission: "READ" },
    { resource_type: "registered-model", resource_id: "*", permission: "USE" },
  ],
}

// Resource-scoped permission
{
  username: "alice",
  resource_type: "experiment",    // or "registered-model"
  resource_id: "42",
  permission: "EDIT",             // READ | USE | EDIT | MANAGE
}
```

::: info API Endpoints
User management endpoints are in v2 (`ajax-api/2.0/mlflow/users/`). Role and permission endpoints are in v3 (`ajax-api/3.0/mlflow/roles/`, `ajax-api/3.0/mlflow/users/permissions/`).
:::

---

::: info See Also
- [The Apartment Building](./workspaces) — permissions are scoped within workspaces
- [The Royal Library](./model-registry) — model permissions control who can promote models
:::
