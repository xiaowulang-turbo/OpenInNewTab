# Open In New Tab（在新标签页中打开）

[English](README.md) | [简体中文](README.zh-CN.md)

一个 Monorepo 项目，提供两种实现方式，使用**白名单模式**强制所有链接在新标签页中打开：

-   **油猴脚本版本**：Tampermonkey/Greasemonkey 用户脚本
-   **Chrome 扩展版本**：原生 Chrome 扩展，配备弹窗界面

两个版本均支持暗色模式、国际化和现代化 UI 设计。

## 🎯 白名单模式的工作原理

基于白名单的方式意味着：

1. **默认情况下，不会影响任何网站** - 扩展/脚本在您添加域名之前不会执行任何操作
2. **您可以控制要修改的网站** - 添加特定的域名（例如：github.com、reddit.com）到您的白名单
3. **仅在白名单网站上的链接会在新标签页中打开** - 只有您添加的网站才会修改其链接行为
4. **易于管理** - 随时通过弹窗界面或菜单命令添加或删除域名

**示例**：如果您将 `github.com` 添加到白名单，GitHub 上的所有链接都会在新标签页中打开。其他网站（如 Google、Twitter 等）将保持不变，除非您也将它们添加到白名单中。

📖 **[官方网站](https://open-in-new-tab.vercel.app/)** | 🎯 **[Greasy Fork 脚本](https://greasyfork.org/en/scripts/551033-open-in-new-tab)** | 🌟 **[在 GitHub 上点赞](https://github.com/xiaowulang-turbo/OpenInNewTab)**

## 项目结构

```
/OpenInNewTab/ (Monorepo 根目录)
├── userscript/              # Tampermonkey 用户脚本版本
│   ├── OpenInNewTab.user.js
│   ├── README.md
│   ├── README.zh-CN.md
│   └── LICENSE
├── extension/               # Chrome 扩展版本
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
│   ├── icons/
│   ├── README.md
│   └── README.zh-CN.md
├── website/                 # 官方落地页
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── README.md
├── README.md                # 英文说明文档
├── README.zh-CN.md          # 本文件（中文说明文档）
└── LICENSE                  # MIT 许可证
```

## 快速开始

选择您喜欢的版本：

### 🚀 油猴脚本版本

-   **适合场景**：快速测试、开发环境或喜欢使用 Tampermonkey 的用户
-   **安装方式**：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/551033-open-in-new-tab) | [查看 userscript/README.zh-CN.md](userscript/README.zh-CN.md#安装) ([English](userscript/README.md#installation))
-   **功能特性**：菜单管理、暗色模式、国际化

### 🌐 Chrome 扩展版本

-   **适合场景**：生产环境使用、更好的性能、原生浏览器集成
-   **安装方式**：[查看 extension/README.zh-CN.md](extension/README.zh-CN.md#安装) ([English](extension/README.md#installation))
-   **功能特性**：弹窗界面、自动更新、Web Store 分发

## 文档

详细文档请参考您想要使用的具体版本：

-   **[油猴脚本版本](userscript/README.zh-CN.md)** ([English](userscript/README.md)) - 完整的 Tampermonkey/Greasemonkey 文档
-   **[Chrome 扩展版本](extension/README.zh-CN.md)** ([English](extension/README.md)) - 完整的 Chrome 扩展文档

两个版本共享相同的核心功能和特性，但具有不同的安装和使用说明。

## 功能特性

-   ✅ **白名单模式**：只在指定的域名上生效，更好的控制和性能
-   ✅ **动态内容支持**：处理现有和动态添加的链接
-   ✅ **安全性**：添加 `rel="noopener noreferrer"` 确保安全
-   ✅ **轻量级**：高效的 DOM 监控，对性能影响最小
-   ✅ **用户友好的管理**：便捷的白名单管理界面
-   ✅ **持久化存储**：保存用户偏好设置
-   ✅ **暗色模式支持**：自动适配系统暗色/亮色模式偏好
-   ✅ **现代化 UI**：简洁、响应式设计，流畅的动画和悬停效果
-   ✅ **国际化**：根据浏览器设置自动检测语言（英文/中文）

## 版本对比

| 特性       | 油猴脚本版本                   | Chrome 扩展版本            |
| ---------- | ------------------------------ | -------------------------- |
| 安装难度   | 需要先安装 Tampermonkey        | 直接从商店安装（即将上线） |
| 性能       | 稍慢（脚本注入）               | 更快（原生扩展）           |
| 管理界面   | 菜单命令 + 模态框              | 浏览器弹窗 + 选项页面      |
| 自动更新   | 通过 Greasy Fork               | 通过 Chrome Web Store      |
| 浏览器支持 | 所有支持 Tampermonkey 的浏览器 | Chromium 系浏览器          |
| 开发调试   | 更容易修改                     | 需要重新加载扩展           |

## 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 在适当的目录（`userscript/` 或 `extension/`）中进行修改
3. 充分测试您的更改
4. 提交 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件

## 问题反馈

如果您遇到任何问题或有建议，请在 GitHub 上创建 issue。

## 更新日志

-   **v1.3.0** (Extension): 添加选项页面、主题设置、完整的国际化支持
-   **v1.1.5** (Userscript): 优化白名单管理界面、暗色模式支持
-   更多历史版本请查看各子项目的 README

## 致谢

感谢所有为本项目做出贡献的开发者和使用者。

---

**Star 和 Fork 本项目让更多人看到！** ⭐
