# TODO

## ✅ Done

- 油猴脚本 v1.6.0（P0）核心能力补齐
  - 修复 `@updateURL` / `@downloadURL` → raw URL（之前指向 GitHub `blob/` HTML 页，自动更新失效）
  - 加 `@noframes` 与 `@grant`：`GM_unregisterMenuCommand` / `GM_addValueChangeListener` / `GM_removeValueChangeListener`
  - 真点击拦截（capture 阶段 `preventDefault` + `window.open`），同步路径不被弹窗拦截
  - 跳过逻辑：download / 修饰键 / 中键 / `javascript:` / `mailto:` / `tel:` / `#anchor`
  - target patching + `data-oint-patched` 标记 + 可回滚
  - MutationObserver + `requestIdleCallback` 节流批处理
  - 白名单变更免刷新生效（同 tab + 跨 tab）
  - 菜单项 toggle：当前域名"加入"↔ "移出"动态切换，老管理器自动降级

## 🎯 P1（脚本设置中心对齐扩展）

- JSON 白名单导入 / 导出
- 主题手动覆盖（light/dark/auto）
- 语言手动覆盖
- Toast 替换阻塞式 `alert`
- 后台打开（实验性，基于 `GM_openInTab`，需在用户手势同步栈内调用）
- 欢迎页（首次运行 → 跳官网，用 `GM_setValue("__installed_at")` 检测）

## 🎯 P1（通用）

- 插件更新横幅
- 官网 changelog 页面
- 官网 docs 页面

## 🧱 P2（工程化）

- 抽 `shared/core/`：白名单匹配 / 跳过规则 / 链接 patch（统一脚本与扩展的同构核心）
- `scripts/build-userscript.mjs`：把 `shared/core` inline 进 `.user.js`，发布前自动跑
- 域名规范化：去 `www.` / 小写 / IDN（`new URL(...).hostname`）
- `extension/web_accessible_resources` 收紧：popup 资源不需要暴露给 `*://*/*`
- CHANGELOG.md 维护规范（手写或自动生成）

## 🧊 Backlog（暂不做）

- 跨 tab 主动 reload —— 油猴端无 `tabs` 权限，不可行；现有方案（每页通过 storage 监听器自更新）已等价
- 脚本独立版本号 —— 需重构 `scripts/version-core.mjs`，ROI 低，暂搁置
