# 扩展文档、国际化与无障碍修正设计

## 目标

修正扩展隐私/权限说明与实际实现的偏差，并补齐 Popup 与 Options 页面的语言语义、错误提示国际化和图标按钮可访问名称。

## 范围

- 更新根目录隐私政策，准确描述静态 Content Script、`host_permissions` 与 `chrome.storage.sync`。
- 为 Popup 与 Options 页面同步更新 `document.documentElement.lang`。
- 将 Popup 与 Options 中的硬编码错误提示纳入现有中英文资源。
- 为 Popup 设置弹窗关闭按钮添加中英文可访问名称。
- 让语言切换同步更新受影响的 `title` 属性。

## 非目标

- 不新增 `scripting` 权限。
- 不改变链接拦截、白名单匹配、存储结构或更新通知行为。
- 不重构现有页面结构或引入新的国际化框架。

## 方案

沿用 Popup/Options 各自现有的 `languageResources` 与 `getText()`。新增必要的文案 key，在 `updateLanguage()` 中统一更新 HTML 语言属性、图标按钮的 `aria-label`/`title`，错误处理路径只调用本地化 key。隐私政策仅描述实际存在的权限与运行方式，明确 Chrome Sync 是浏览器提供的同步服务，而非扩展自有外部服务。

## 验收标准

1. Manifest 中没有 `scripting` 权限，隐私政策不再声称扩展使用该权限。
2. Popup 与 Options 切换中文后，根 HTML 的 `lang` 为 `zh`；切换英文后为 `en`。
3. Popup 和 Options 的错误提示均通过翻译资源显示。
4. Popup 关闭按钮具有中英文可访问名称。
5. Popup 中的设置按钮、关闭按钮和后台打开控件的提示文本会随语言切换更新。
6. 现有测试、Lint、版本校验和更新说明校验继续通过。
