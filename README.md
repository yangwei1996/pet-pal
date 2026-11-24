# 小小陪伴 · 像素养宠小游戏

两只像素小宠物住在同一间小屋：你喂它们、陪它们玩、带它们去远方探险，它们会用日记和照片记下这一天。
纯前端、单文件、无后端依赖，也能以无边框置顶小窗的形式待在桌面角落。

![手机版主界面](docs/screenshots/float-main.png)
![桌面悬浮小宠物](docs/screenshots/float-window.png)

## 玩法与已实现的功能

- **养宠**：喂食、逗趣、抚摸、晒毛，饱食/心情/体力三条状态条 + 亲密度成长（10 级，幼崽→少年→成年），升级给金币。
- **日记本**：完成抚摸/升级/探险/晒毛等会写一篇日记，文案按场景变化，照片按文案现画（不会每篇都一样），支持全屏看和保存图片。
- **远方探险**：雪山 / 沙漠 / 神秘森林 / 城市四个地区，按累计次数解锁；每地去多了涨熟练度，金币加成最高 30%；路上有随机奇遇、稀有事件、可采集的「风物」图鉴，也能带回新饰品。
- **小屋商店**：3 种房间主题 + 6 件家具，买下立刻摆进小屋。
- **双宠关系**：两只都在家时会慢慢变亲近，关系够了能拍「合照日记」。
- **悬浮模式**：宠物跳到桌面右下角，透明置顶小窗，点它会摸一摸，饿了头上冒红点。
- **存档**：本地自动存档；换设备/换域名可用「存档码」（`PPSAVE1.` 前缀的 base64）搬运。

## 目录结构

```
mobile.html            游戏本体（单文件，含 CSS/JS/像素绘制）
index.html             GitHub Pages 入口，自动跳转到 mobile.html
electron/main.js       桌面壳主进程（主窗口 + 悬浮窗 + 菜单/快捷键）
electron/preload.js    只暴露 openFloat/openHome 三个能力
package.json           electron 依赖与 npm 脚本
.github/workflows/pages.yml  GitHub Pages 自动部署
docs/                  截图与开发记录
```

## 在线玩

部署完成后访问 `https://<你的用户名>.github.io/<仓库名>/`，`index.html` 会自动跳到 `mobile.html`。
手机和桌面浏览器都能玩，图标式的「浮」按钮可以开一个悬浮小窗（浏览器版的小窗不会盖住其他应用）。

## 本地玩

```bash
# 直接双击 mobile.html 也能玩；想用本地 http 更稳：
python3 -m http.server 8899
# 打开 http://127.0.0.1:8899/mobile.html
```

## 桌面悬浮版

```bash
npm install     # 只需一次
npm start       # 打开完整小屋
# 按 Cmd+Shift+P，或点顶栏「浮」按钮 → 宠物到桌面右下角
npm run float   # 直接以「主窗口 + 悬浮窗」启动
```

悬浮窗：286×258、无边框、透明、置顶，空白处按住可拖动，位置默认在屏幕右下角。悬浮窗和主窗口同源共用存档，操作会同步。

## 打包成 macOS App（双击即开）

```bash
bash packaging/build_app.sh              # 生成 dist/小小陪伴.app
bash packaging/build_app.sh --install    # 顺带安装到 /Applications
```

- 产物约 233MB（Electron 运行时 233MB 是正常的，游戏本体只有 141KB）。
- 图标：`packaging/app.icns`（源图 `docs/screenshots/app-icon.png`）。
- 首次启动只开主窗口；`Cmd+Shift+P` 或点顶栏「浮」才会出悬浮窗。
- 改了 `mobile.html` 或 `electron/` 后重跑一次脚本即可更新 App。
- 本地构建的 App 是 ad-hoc 签名（未走 Apple 公证）：若系统拦截，右键 App →「打开」，一次即可。
- 存档目录：`~/Library/Application Support/小小陪伴/`（和命令行 `npm start` 版本共用）。

## 部署到 GitHub Pages（三步）

1. 建仓库并推送：

```bash
git init -b main          # 本目录已经 init 过，跳过这步
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

2. 打开仓库 **Settings → Pages**，把 **Source** 选成 **GitHub Actions**（工作流 `.github/workflows/pages.yml` 已随仓库带上，push 后会自动跑，首次约 1 分钟）。
3. Actions 跑绿后，Pages 页面会显示站点地址 `https://<用户名>.github.io/<仓库名>/`。

> 备用方案：若不想用 Actions，也可在 **Settings → Pages → Source = Deploy from a branch**，选 `main` + `/ (root)`。仓库根目录已有 `index.html` 与 `.nojekyll`，同样能直接出站。
>
> 私有仓库也能开 Pages（取决于账号套餐）；公开仓库最省事。

## 存档说明

- 存档写在浏览器 `localStorage`，键名 `petpal_pixel_v2`。
- **换域名就是换存档**：本地 `file://`、`127.0.0.1`、GitHub Pages、各家 CDN 短链互不相通。
- 搬家方式：抽屉「存档」页 → 复制存档码 → 在新地址粘贴读取（不会用原生 confirm，两段点击确认）。

## 已知限制

- 这版是 **H5 网页**，不是抖音/微信小游戏包（小游戏容器只有 canvas + 有限 API，没有 DOM/CSS，也没有 `tt.`/`wx.` 调用）。要上小游戏，需要按 canvas 重写渲染层，或改用 Cocos/Laya；国内小游戏还需要版号与企业主体。
- iOS 上不允许虚拟支付，若以后接内购只能走安卓或广告变现。
- 桌面悬浮的「盖住其他应用」只有 Electron 版能做到；浏览器小窗只是普通窗口。

## 许可

代码可自由用于个人与学习用途。要放到公开仓库建议补一个许可证文件（如 MIT），把作者信息填上。
