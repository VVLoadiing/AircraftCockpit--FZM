# 发布到 npm

`@fzm/ui` 已配置为可独立发布的包。构建后产出 ESM / UMD / 类型声明 / 汇总样式。

## 构建

```bash
# 在仓库根目录
pnpm build:ui

# 或进入 packages/ui
cd packages/ui && pnpm build
```

产物位于 `packages/ui/dist/`：

| 文件 | 说明 |
|------|------|
| `fzm-ui.js` | ESM 产物 |
| `fzm-ui.umd.cjs` | UMD 产物 |
| `fzm-ui.css` | 汇总样式（令牌 + 主题 + 基础 + 动效） |
| `index.d.ts` 等 | 类型声明 |

## package.json 关键字段

`packages/ui/package.json` 已配置：

```jsonc
{
  "name": "@fzm/ui",
  "main": "./dist/fzm-ui.umd.cjs",
  "module": "./dist/fzm-ui.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/fzm-ui.js", "require": "./dist/fzm-ui.umd.cjs" },
    "./styles": "./dist/fzm-ui.css"
  },
  "sideEffects": ["**/*.css"],   // Tree-shaking 保留 CSS
  "files": ["dist"],
  "peerDependencies": {
    "vue": "^3.4.0",
    "echarts": "^5.4.0 || ^6.0.0"  // echarts 可选
  },
  "peerDependenciesMeta": { "echarts": { "optional": true } }
}
```

## 发布

```bash
cd packages/ui
pnpm build
npm login              # 首次需登录
npm publish --access public
```

> 若是私有 scope（如 `@your-org/ui`），`--access public` 发布为公开包；私有包需付费。

## 版本管理建议

- 遵循 [SemVer](https://semver.org/lang/zh-CN/)：破坏性变更升 major，新增功能升 minor，修复升 patch
- 可配合 [changesets](https://github.com/changesets/changesets) 管理多包版本与 CHANGELOG
- 发布前确认 `files` 字段只含 `dist`，不会把 `src` 等发布上去

## 在其他项目中消费

```bash
pnpm add @fzm/ui
```

```ts
import { TechCard, useUiTheme } from '@fzm/ui'
import '@fzm/ui/styles'
```
