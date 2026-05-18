---
outline: deep
---

# The Poet's Drafts

> **MLflow Concept:** Prompts

## The Story

<div v-pre>

Maya's chocolate cake didn't bake itself. Behind every order that came through Dr. Patel's counter was a recipe card — a carefully worded set of instructions with blanks to fill in: "Make a {{size}} chocolate cake for {{customer_name}} with {{special_request}}." The person who wrote those recipe cards was **Yara**.

Yara was a perfectionist. She maintained a library of templates for every cake Maya's kitchen could produce: `@chocolate-classic`, `@birthday-celebration`, `@memorial-tribute`. Version 1 of the birthday template was cheerful and bright. Version 2 added a line about "making wishes come true." Business was good.

Then one of Yara's apprentices made the mistake that changed everything. A customer had ordered a memorial cake — somber, dignified. The apprentice opened Version 2 of the memorial template and added festive language, thinking it needed "more warmth." He edited it in place. The version number didn't change. When the next memorial order came through, the cake arrived with "Celebrate this joyous occasion!" piped across the top in buttercream.

The family was devastated. Yara was mortified. And when Detective Chen pulled the trace, everything looked correct — the system had used the memorial template, Version 2, exactly as requested. The version number was right. The words were wrong. Nobody could even tell when the change had happened.

That disaster gave Yara two unbreakable rules. First: once a version is finalized, it can **never** be modified. Not a word, not a comma. If you need changes, you create a new version. Second: templates are referenced by **alias**, not number. The alias `@memorial` always points to the version Yara has personally approved. When she improves a template, she moves the alias to the new version. Every order Chen traces shows exactly which Yara template was used, which version, which alias — an unbroken chain from customer request to finished cake.

"Version numbers are for history," Yara told her apprentices. "Aliases are for trust."

</div>

## The Lesson

<div v-pre>

**Prompts** in MLflow are versioned templates for LLM interactions, managed through the **Prompt Registry**. They have variable slots (like `{{user_question}}` or `{{context}}`) that get filled at runtime. The design is inspired by Git:

</div>

- **Immutability**: Once created, a prompt version cannot be modified — ensuring consistent behavior
- **Aliases**: Mutable named references like `@production`, `@staging`, `@beta` that point to specific versions. Move the alias to deploy, roll back, or A/B test — no code changes needed
- **`@latest`**: Reserved alias that automatically points to the newest version

<div v-pre>

::: tip Key Takeaway
- **Prompt** = a versioned template with `{{variable}}` slots
- Versions are **immutable** — only new versions can be created
- **Aliases** = mutable pointers (e.g., `@production`) for deployment management
- `@latest` automatically points to the newest version
:::

</div>

## For Frontend Developers

<div v-pre>

The **Prompts section** shows the template collection. Each prompt has a version history with diff comparison. The template editor highlights `{{variables}}`. Alias badges (like `@production`) appear prominently.

</div>

| Component | What It Shows |
|-----------|--------------|
| `PromptsPage` | Top-level prompts list |
| `PromptsDetailsPage` | Prompt detail with version history and diffs |
| `ExperimentPromptsPage` | Experiment-scoped prompts tab |
| `ExperimentPromptDetailsPage` | Experiment-scoped prompt detail |

### Data Shape

Prompts are managed via Unity Catalog OSS. The Prompt and PromptVersion are separate entities:

<div v-pre>

```typescript
// Prompt (the named entry)
{
  name: "customer-greeting",
  description: "Greeting template for customer interactions",
  tags: [{ key: "team", value: "support" }],
}

// PromptVersion (a specific immutable version)
{
  version: 3,
  template: "Dear {{name}}, thank you for choosing {{company}}...",
  tags: [...],
  aliases: ["production"],  // this version is the @production version
}
```

</div>

---

::: info See Also
- [The Detective's Thread](./tracing-and-spans) — prompts used in LLM calls appear in traces
- [The Harbor Master](./ai-gateway) — prompts are sent through Gateway endpoints
:::
