# 更新日志 / Changelog

## 7.8.1 — X-WIDE 修复版首发

基于上游 **cg-use-everywhere 7.8**。

### 🐞 修复

- **修复「浏览器端 UE 虚拟连线不显示」的 BUG**：在部分 ComfyUI 前端版本下，
  插件初始化时未能成功挂上画布绘制钩子 / 连线列表未生成，结果画布一次都不请求
  绘制 UE 连线（节点上的绿色徽标正常，但一条广播线都看不到，时有时无）。
- **修复连线上「流动」动画随之不显示**的问题（连线恢复后动画由前端绘制）。

修正方式：在 `js/use_everywhere.js` **末尾追加**一段模块级「自愈看门狗」
（源码中标记为 `[XW-UE fix]`，可整段删除），页面加载后每 2 秒自检一次，
缺失就补齐：

- 缺 `shared.graphAnalyser` / `shared.linkRenderController` → 立即补建；
- 画布原型的 `drawConnections` 上没有 `render_all_ue_links` 钩子 → 补钩子；
- 缺 `ue_list`（连线列表）→ 触发重建，必要时直接调 `analyse_graph(visible_graph(), true)` 产出；
- 暂停深度泄漏（`pause_depth` 过大）→ 复位。

一切正常时完全静默，不产生任何控制台输出，对性能无影响（每 2 秒一次廉价自检）。

### ✨ 变更（不影响功能）

- 插件显示名称改为 **X-WIDE Use Everywhere**（`[tool.comfy] DisplayName`）。
- 设置页新增「关于 / 作者」面板：设置 → Use Everywhere → **About**
  （`js/xwide_about.js`），同时提供可双击打开的独立页面 `about.html`。
- 新增仓库/节点图标 `docs/icon.png`。
- 启动时检测是否与原版 `cg-use-everywhere` 同时安装，若检测到则打印醒目告警。

### ⚠️ 兼容性

- **节点 ID、参数、工作流格式与原版 7.8 完全一致**，可以直接替换（drop-in）。
- **请勿与原版 `cg-use-everywhere` 同时安装**：两者节点 ID 相同，会相互覆盖。
- 需要 ComfyUI 前端 `comfyui-frontend-package >= 1.25.0`（与原版一致）。

---

## 7.8 — 上游版本

原版功能与更新记录见 [UPSTREAM-README.md](UPSTREAM-README.md) 与
上游仓库 <https://github.com/chrisgoringe/cg-use-everywhere>。
