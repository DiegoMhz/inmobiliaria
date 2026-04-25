# Skill Registry — inmobiliaria_yusve

## Project Conventions

| Source | File |
|--------|------|
| CLAUDE.md | CLAUDE.md |

## User Skills

| Skill | Trigger | Path |
|-------|---------|------|
| react-19 | Writing React components | ~/.claude/skills/react-19/SKILL.md |
| tailwind-4 | Styling with Tailwind CSS | ~/.claude/skills/tailwind-4/SKILL.md |
| typescript | Writing TypeScript code — types, interfaces, generics | ~/.claude/skills/typescript/SKILL.md |
| zustand-5 | Managing React state with Zustand | ~/.claude/skills/zustand-5/SKILL.md |
| zod-4 | Using Zod for validation | ~/.claude/skills/zod-4/SKILL.md |
| judgment-day | Parallel adversarial review of code/PR | ~/.claude/skills/judgment-day/SKILL.md |
| branch-pr | PR creation workflow | ~/.claude/skills/branch-pr/SKILL.md |
| issue-creation | Issue creation workflow | ~/.claude/skills/issue-creation/SKILL.md |

## Compact Rules

### react-19
- NO manual memoization (useMemo/useCallback) — React Compiler handles it
- Use `use()` hook for data fetching inside components
- Server Components by default; `"use client"` only when needed
- Prefer Actions (async functions) over event handlers for mutations
- Form state via `useActionState`, optimistic via `useOptimistic`

### tailwind-4
- Tailwind class exists? → `className="..."`
- Dynamic value? → `style={{ width: \`${x}%\` }}`
- Conditional styles? → `cn("base", condition && "variant")`
- NEVER use `var()` in className
- Theme variables in `@theme {}` block in CSS, not `tailwind.config.js`
- Use `cn()` from `clsx` or `tailwind-merge` for conditional classes

### typescript
- ALWAYS: `const STATUS = { ... } as const` then `type Status = (typeof STATUS)[keyof typeof STATUS]`
- NEVER: direct union types like `type Status = "active" | "inactive"`
- Flat interfaces — no deep nesting
- Prefer `interface` for objects, `type` for unions/intersections
- `unknown` over `any` at boundaries; never use `any` internally

### zustand-5
- One store per domain slice
- Actions defined inside `create()`, not outside
- Use `useShallow` for selecting multiple values: `useStore(useShallow(s => ({ a: s.a, b: s.b })))`
- Persist with `persist` middleware only when truly needed
- Devtools middleware in development only

### zod-4
- Breaking changes from v3: use `z.email()` not `z.string().email()`
- Use `z.uuid()` not `z.string().uuid()`
- Use `z.url()` not `z.string().url()`
- Use `z.string().min(1)` not `z.string().nonempty()`
- Infer types: `type T = z.infer<typeof schema>`
- Parse at boundaries only (API input, form submit, env vars)
