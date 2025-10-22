# Open In New Tab - Chrome 扩展版本

[English](README.md) | [简体中文](README.zh-CN.md)

一个 Chrome 扩展程序，使用白名单模式强制所有链接在新标签页中打开，支持暗色模式和国际化。

📖 **[官方网站](https://open-in-new-tab.vercel.app/)** | 🎯 **[Greasy Fork 脚本](https://greasyfork.org/en/scripts/551033-open-in-new-tab)** | 🌟 **[GitHub 仓库](https://github.com/xiaowulang-turbo/OpenInNewTab)**

## 🎯 快速入门指南

### 白名单模式的工作原理

本扩展使用**白名单模式**：

1. **安装扩展** - 默认情况下，不会影响任何网站
2. **添加域名到白名单** - 点击扩展图标，添加您想要修改的网站
3. **链接在新标签页中打开** - 仅在白名单网站上，所有链接将自动在新标签页中打开
4. **其他网站保持不变** - 未加入白名单的网站正常工作

### 分步使用示例

假设您想让 `github.com` 上的所有链接在新标签页中打开：

1. **访问 github.com**
2. **点击扩展图标**（在浏览器工具栏中）
3. **查看当前域名**（显示在顶部，例如："当前域名: github.com"）
4. **点击绿色的"添加"按钮**（在当前域名旁边）
5. **完成！** 现在 github.com 上的所有链接都会在新标签页中打开
6. **移除域名**：再次点击扩展图标，然后点击红色的"移除"按钮

您也可以手动添加域名，只需在输入框中输入域名（例如：`stackoverflow.com`、`reddit.com`），然后点击"添加"。

## 功能特性

-   **白名单模式**：只在指定的域名上生效，更好的控制和性能
-   **动态内容支持**：处理现有和动态添加的链接
-   **安全性**：添加 `rel="noopener noreferrer"` 确保安全
-   **轻量级**：高效的 DOM 监控，对性能影响最小
-   **用户友好的管理**：基于弹窗的白名单管理
-   **白名单管理器**：完整的界面，可查看、添加、修改和删除域名
-   **持久化存储**：使用 Chrome 的 storage API 保存用户偏好
-   **暗色模式支持**：自动适配系统暗色/亮色模式偏好
-   **现代化 UI**：简洁、响应式设计，流畅的动画和悬停效果
-   **国际化**：根据浏览器设置自动检测语言（英文/中文）

## 安装

### 方式 1：Chrome Web Store（即将推出）

扩展程序即将在 Chrome Web Store 上线，敬请期待！

### 方式 2：开发者模式安装

1. **克隆或下载项目：**

    ```bash
    git clone https://github.com/xiaowulang-turbo/OpenInNewTab.git
    cd OpenInNewTab/extension
    ```

2. **安装扩展：**
    - 打开 Chrome，访问 `chrome://extensions/`
    - 启用"开发者模式"（右上角的开关）
    - 点击"加载已解压的扩展程序"
    - 选择 `extension` 目录
    - 扩展将被安装并可以使用

### Web Store 分发

1. **打包扩展：**

    - 创建一个包含所有扩展文件的 ZIP 文件
    - 确保 `manifest.json` 位于根目录

2. **提交到 Chrome Web Store：**
    - 访问 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/devconsole)
    - 创建新项目并上传您的包
    - 填写所需信息
    - 提交审核

## 配置

### 初始设置

扩展默认带有空白的白名单。用户可以通过弹窗界面添加域名。

### 用户管理

#### 快速访问

点击浏览器工具栏中的扩展图标以打开弹窗界面。

#### 添加当前域名（快速添加）

-   弹窗会自动检测当前网站的域名
-   点击当前域名旁边的绿色"添加"按钮
-   域名将立即添加到您的白名单

#### 管理您的白名单

**通过扩展弹窗：**

1. 点击浏览器工具栏中的扩展图标
2. 弹窗显示您所有的白名单域名
3. **添加新域名**：在输入框中输入域名（例如：`example.com`），然后点击"添加"
4. **删除域名**：点击任何域名旁边的红色"移除"按钮
5. **查看所有域名**：在一个清晰、有组织的列表中查看您的所有白名单域名

**通过选项页面：**

1. 点击弹窗中的设置图标（⚙️）
2. 点击底部的"更多选项"按钮
3. 访问完整的配置页面，包括：
    - 主题设置（亮色/暗色/自动）
    - 语言设置（英文/中文）
    - 完整的白名单管理
    - 导入/导出白名单数据

### 域名匹配

扩展支持精确域名匹配和子域名匹配：

-   `example.com` 精确匹配 `example.com`
-   `example.com` 也匹配 `sub.example.com`、`deep.sub.example.com` 等

## 工作原理

1. **初始化**：扩展加载并注册内容脚本
2. **白名单检查**：检查当前域名是否在您的个人白名单中
3. **链接修改**：如果在白名单中，修改所有现有链接以在新标签页中打开
4. **动态监控**：设置 MutationObserver 处理动态添加的内容
5. **安全增强**：添加安全属性（`rel="noopener noreferrer"`）以防止安全问题
6. **持久化存储**：使用 Chrome 的 storage API 保存您的白名单偏好

## 架构

### 扩展结构

```
/extension/
├── manifest.json          # 扩展清单 (Manifest V3)
├── background.js          # Service worker
├── content.js             # 内容脚本（链接修改逻辑）
├── popup.html             # 弹窗界面
├── popup.js               # 弹窗功能
├── popup.css              # 弹窗样式（支持暗色模式）
├── options.html           # 选项页面
├── options.js             # 选项页面功能
├── options.css            # 选项页面样式
└── icons/                 # 扩展图标 (16x16, 24x24, 32x32, 64x64, 128x128)
    ├── icon16.png
    ├── icon24.png
    ├── icon32.png
    ├── icon64.png
    └── icon128.png
```

### 组件职责

-   **manifest.json**：定义扩展元数据、权限和结构
-   **background.js**：Service worker，用于扩展生命周期管理
-   **content.js**：注入到网页中以修改链接行为
-   **popup.html/js/css**：白名单管理的用户界面
-   **options.html/js/css**：完整的设置和配置页面
-   **icons/**：不同尺寸的扩展图标

## 语言支持

扩展会自动检测您的浏览器语言设置，并以适当的语言显示界面：

-   **英文**（默认）：当浏览器语言不是中文时使用
-   **中文**：当浏览器语言以 'zh' 开头时使用（例如：zh-CN、zh-TW、zh-HK）

所有用户界面元素均已国际化，包括弹窗界面、通知和设置。

## 暗色模式支持

扩展弹窗会自动适配您的系统暗色/亮色模式偏好：

-   **亮色模式**：简洁的白色界面，带有微妙的阴影
-   **暗色模式**：暗色主题，具有适当的对比度以提高可读性
-   **平滑过渡**：无缝的主题切换，没有突兀的变化

您也可以在选项页面中手动设置主题偏好。

## 安全考虑

-   扩展仅在白名单域名上运行
-   使用 `rel="noopener noreferrer"` 防止新页面访问原始页面
-   避免修改下载链接（带有 `download` 属性的链接）
-   用户数据使用 Chrome 的安全存储 API 本地存储
-   遵循 Chrome 扩展安全最佳实践

## 浏览器兼容性

-   ✅ Chrome 88+（需要 Manifest V3 支持）
-   ✅ Edge 88+（基于 Chromium）
-   ✅ Opera 74+（基于 Chromium）
-   ✅ 其他支持 Manifest V3 的 Chromium 系浏览器

## API 映射

| Tampermonkey API           | Chrome 扩展 API             | 用途     |
| -------------------------- | --------------------------- | -------- |
| `GM_setValue()`            | `chrome.storage.sync.set()` | 数据存储 |
| `GM_getValue()`            | `chrome.storage.sync.get()` | 数据检索 |
| `GM_registerMenuCommand()` | 扩展弹窗                    | 用户界面 |
| 页面 DOM 操作              | 内容脚本                    | 链接修改 |

## 开发

### 从源码构建

1. **克隆仓库：**

    ```bash
    git clone https://github.com/xiaowulang-turbo/OpenInNewTab.git
    cd OpenInNewTab/extension
    ```

2. **在开发者模式下加载：**

    - 打开 `chrome://extensions/`
    - 启用"开发者模式"
    - 点击"加载已解压的扩展程序"
    - 选择 `extension` 目录

3. **进行更改：**
    - 编辑 `extension` 目录中的文件
    - 重新加载扩展以查看更改
    - 在不同网站上测试功能

### 测试

-   在各种网站上测试白名单功能
-   验证暗色模式适配
-   测试语言切换
-   确保不与其他扩展冲突

## 许可证

MIT License - 详见 LICENSE 文件

## 贡献

1. Fork 本仓库
2. 在适当的目录（`userscript/` 或 `extension/`）中进行更改
3. 充分测试
4. 提交 Pull Request

## 问题反馈

如果您遇到任何问题或有建议，请在 GitHub 上创建 issue。

## 相关项目

-   [油猴脚本版本](../userscript/README.zh-CN.md) - 相同功能的 Tampermonkey 用户脚本
-   [项目根目录](../README.zh-CN.md) - 主项目文档
