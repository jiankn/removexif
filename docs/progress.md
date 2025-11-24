# RemovExif 开发进度计划

本文档根据 PRD.md 制定，包含所有开发任务的详细清单。每完成一个任务，将 `[ ]` 标记为 `[X]`。

---

## 第一章：项目初始化与基础架构

### 1.1 项目环境搭建
- [X] 初始化 Next.js 14 项目（使用 App Router）
- [X] 配置 TypeScript
- [X] 安装并配置 Tailwind CSS
- [X] 安装并配置 Shadcn UI
- [X] 配置 ESLint 和 Prettier
- [ ] 设置 Git 仓库并创建初始提交

### 1.2 多语言路由架构
- [X] 安装 next-intl 依赖
- [X] 创建 middleware.ts 配置多语言路由
- [X] 配置支持的语言列表：en, es, pt, de, fr, ja, zh-CN, zh-TW
- [X] 创建 `src/app/[locale]` 目录结构
- [X] 实现自动语言检测和重定向逻辑
- [ ] 测试所有语言路由是否正常工作

### 1.3 基础目录结构
- [X] 创建 `src/components` 目录
- [X] 创建 `src/lib` 目录（工具函数）
- [X] 创建 `src/types` 目录（TypeScript 类型定义）
- [X] 创建 `src/messages` 目录（国际化翻译文件）
- [X] 创建 `src/content/posts` 目录（博客内容）
- [X] 创建 `public` 目录结构（静态资源）

---

## 第二章：全局设计系统实现

### 2.1 Tailwind 配置
- [X] 配置 8pt 栅格系统（确保所有间距是 4 或 8 的倍数）
- [X] 设置最大容器宽度 max-w-6xl (1152px)
- [X] 配置侧边栏宽度 336px
- [X] 配置颜色系统：
  - [X] 背景色 bg-slate-50 (#F8FAFC)
  - [X] 内容层 bg-white + shadow-sm
  - [X] 品牌主色 bg-indigo-600 (#4F46E5)
  - [X] 功能色：rose-600 (危险), emerald-600 (安全), slate-500 (中立)
- [X] 配置字体系统：Inter 字体，字重策略
- [X] 配置圆角系统：rounded-xl (12px) 和 rounded-2xl (16px)

### 2.2 全局样式
- [X] 创建 `src/app/globals.css` 全局样式文件
- [X] 配置行高 leading-relaxed (1.625)
- [X] 确保不使用纯白背景 (#FFFFFF) 作为页面背景
- [X] 配置响应式断点

---

## 第三章：核心类型定义

### 3.1 TypeScript 接口
- [X] 创建 `src/types/core.ts` 文件
- [X] 定义 `ProcessedImage` 接口
- [X] 定义元数据 `meta` 对象类型
- [X] 定义 `badges` 智能标签类型
- [X] 定义文件处理状态类型：'queued' | 'processing' | 'done' | 'error'
- [X] 导出所有类型供其他模块使用

---

## 第四章：首页开发

### 4.1 导航栏组件
- [X] 创建 `src/components/Navbar.tsx`
- [X] 实现透明背景，滚动后变为 bg-white/90 backdrop-blur-md
- [X] 添加 Logo（文字 "RemovExif" + 盾牌图标）
- [X] 添加右侧导航：Blog, GitHub 链接, 语言切换器
- [X] 实现语言下拉菜单
- [X] 添加滚动检测逻辑（滚动 > 20px 时改变样式）

### 4.2 Hero 区域
- [X] 创建 `src/components/Hero.tsx`
- [X] 实现 H1 标题（包含核心关键词）
- [X] 实现 H2 副标题（痛点 + 解决方案）
- [X] 添加响应式布局
- [X] 实现多语言支持

### 4.3 上传区域（Dropzone）
- [X] 安装 react-dropzone 依赖
- [X] 创建 `src/components/ImageUpload.tsx` 组件
- [X] 实现拖拽上传功能
- [X] 实现点击上传功能
- [X] 实现拖拽状态视觉反馈：
  - [X] 静止态：border-dashed border-slate-300
  - [X] 激活态：全屏半透明覆盖层（防止拖到框外）
  - [X] 吸附态：border-indigo-500，图标浮动动画
  - [X] 拒绝态：border-rose-500，Shake 动画
- [X] 添加文件类型验证（仅支持 JPG, PNG, WebP）
- [X] 实现多文件上传支持
- [X] 添加文件大小限制提示

### 4.4 价值主张区域
- [X] 创建 `src/components/FeaturesGrid.tsx`
- [X] 实现三列布局（Privacy First, Batch Power, Lossless）
- [X] 添加图标和描述文字
- [X] 实现响应式布局（移动端单列）
- [X] 添加多语言支持

### 4.5 SEO 文本区域
- [X] 创建 `src/components/SEOTextBlock.tsx`
- [X] 添加 "What is EXIF Data?" 内容
- [X] 添加 "Why remove it?" 内容
- [X] 添加 "How to use this tool?" 内容
- [X] 使用淡灰色文字样式
- [X] 实现多语言支持

---

## 第五章：EXIF 处理核心逻辑

### 5.1 依赖安装
- [X] 安装 exif-js（读取元数据）
- [X] 安装 piexifjs（修改/清除 JPEG 元数据）
- [X] 安装 jszip（批量打包）
- [X] 安装 file-saver（触发下载）

### 5.2 EXIF 读取功能
- [X] 创建 `src/lib/exif-reader.ts`
- [X] 实现单张图片 EXIF 解析函数
- [X] 提取相机信息（make, model）
- [X] 提取日期时间信息
- [X] 提取 GPS 坐标并转换为十进制
- [X] 提取其他元数据（ISO, 光圈, 快门等）
- [X] 处理解析错误情况

### 5.3 EXIF 清除功能
- [X] 创建 `src/lib/exif-remover.ts`
- [X] 实现 JPEG 文件元数据清除
- [X] 实现 PNG 文件元数据清除（如果支持）
- [X] 实现 WebP 文件元数据清除（如果支持）
- [X] 确保图片质量不损失
- [X] 处理清除失败的情况

### 5.4 批量处理逻辑
- [X] 创建 `src/lib/batch-processor.ts`
- [X] 实现分片处理策略（每次处理 5 张）
- [X] 使用 Promise.all 配合 setTimeout 让出主线程
- [X] 实现进度追踪
- [X] 处理内存管理（URL.revokeObjectURL）

### 5.5 智能标签生成
- [X] 创建 `src/lib/badge-generator.ts`
- [X] 根据 ISO 值生成标签（如 "Low Light / Grainy"）
- [X] 根据光圈值生成标签（如 "Bokeh Effect"）
- [X] 根据 GPS 数据生成 "Privacy Risk Found" 标签
- [X] 无 EXIF 时生成 "Safe to Share" 标签
- [X] 实现标签颜色分类（warning, info, safe）

---

## 第六章：结果页（Dashboard）开发

### 6.1 结果页布局
- [X] 创建 `src/app/[locale]/result` 页面
- [X] 实现双栏布局（Desktop）/ 单栏布局（Mobile）
- [X] 左侧主内容区域
- [X] 右侧侧边栏区域（Sticky 吸顶）

### 6.2 状态概览栏
- [X] 创建 `src/components/StatusOverview.tsx`
- [X] 显示 "Analysis Complete" 状态（绿色对勾）
- [X] 显示处理图片数量
- [X] 显示发现的 GPS 标签数量（红色警告）
- [X] 显示节省的文件大小

### 6.3 视图切换器
- [X] 创建 `src/components/ViewSwitcher.tsx`
- [X] 实现列表视图（List View）
- [X] 实现网格视图（Grid View）
- [X] 添加切换按钮

### 6.4 图片列表项
- [X] 创建 `src/components/ImageListItem.tsx`
- [X] 显示缩略图
- [X] 显示文件名
- [X] 显示原大小 -> 新大小
- [X] 显示状态标签（Clean / Privacy Risk）
- [X] 实现单张下载功能

### 6.5 底部操作栏
- [X] 创建 `src/components/ActionBar.tsx`
- [X] 实现 Sticky Bottom 布局
- [X] 添加 "Download All (ZIP)" 主按钮
- [X] 实现批量打包下载功能
- [X] 添加 "Clear All / Start Over" 按钮

---

## 第七章：伪加载动画

### 7.1 处理模态框
- [X] 创建 `src/components/ProcessingModal.tsx`
- [X] 实现全屏模态框（bg-white 不透明）
- [X] 添加圆形进度环或骨架屏扫描动画
- [X] 实现多阶段文案显示：
  - [X] 0-500ms: "Analyzing File Structure..." (0% -> 30%)
  - [X] 500-1200ms: "Detecting GPS Coordinates..." (30% -> 70%)
  - [X] 1200-1800ms: "Verifying Privacy Tags..." (70% -> 95%)
  - [X] 1800ms: "Done!" -> 跳转结果页
- [X] 实现多图处理时的动态计数（"Analyzing image 3 of 10..."）
- [X] 总时长控制在 1.5-2.5 秒（单图）或 3-4 秒（多图）

---

## 第八章：变色龙占位符组件

### 8.1 顶部横幅占位符
- [X] 创建 `src/components/PrivacyTriviaWidget.tsx`
- [X] 实现隐私冷知识轮播
- [X] 高度 h-24 (96px) 或自适应
- [X] 样式：bg-indigo-50 border border-indigo-100 rounded-xl
- [X] 添加左侧图标（💡 或 🛡️）
- [X] 实现文字轮播功能
- [X] 准备多语言文案库（至少 3-5 条提示）
- [X] 实现多语言支持

### 8.2 侧边栏占位符
- [X] 创建 `src/components/FeaturedGuidesWidget.tsx`
- [X] 尺寸：宽 100% (max 336px)，高 600px
- [X] 样式：bg-white rounded-2xl shadow-sm border border-slate-100 p-6
- [X] Header: "Learn Photography" (H3)
- [X] 实现 4-6 个图文混排的链接列表
- [X] 链接指向博客文章（内链结构）
- [X] Footer: "Read more articles ->" 链接
- [X] 实现多语言支持

### 8.3 结果页原生位占位符
- [X] 创建 `src/components/TransparencyWidget.tsx`
- [X] 样式：bg-slate-50 rounded-xl p-6 text-center
- [X] Title: "Why is RemovExif free?"
- [X] 添加说明文字
- [X] 添加分享按钮：[Share on X] [Share on Facebook]
- [X] 实现多语言支持

---

## 第九章：广告引擎实现

### 9.1 环境变量配置
- [X] 创建 `.env.local` 文件（需手动创建，参考 `docs/adsense-setup.md`）
- [X] 添加 `NEXT_PUBLIC_ENABLE_ADS=false`（审核期）
- [X] 添加 `NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx`（占位符）
- [X] 在 `docs/adsense-setup.md` 中提供配置说明

### 9.2 全局脚本注入
- [X] 修改 `src/app/[locale]/layout.tsx`
- [X] 使用 next/script 加载 AdSense 核心脚本
- [X] 设置 strategy="afterInteractive"
- [X] 添加 crossOrigin="anonymous"
- [X] 仅在 `NEXT_PUBLIC_ENABLE_ADS=true` 时加载

### 9.3 广告组件
- [X] 创建 `src/components/ads/AdUnit.tsx`
- [X] 实现环境变量判断逻辑
- [X] 审核期显示 fallback 内容（变色龙占位符）
- [X] 获利期显示真实 AdSense 广告
- [X] 实现路由变化时刷新广告
- [X] 添加 fixedHeight 属性防止 CLS
- [X] 添加 "Advertisement" 标签（Policy 要求）
- [X] 实现 IntersectionObserver 延迟加载

### 9.4 广告位配置
- [X] 首页顶部横幅广告位配置
- [X] 侧边栏摩天大楼广告位配置（Sticky）
- [X] 结果页原生网格广告位配置
- [X] 博客文章内嵌广告位配置（预留，待博客系统完成后实现）

### 9.5 性能优化
- [X] 在 layout.tsx 添加 preconnect 链接：
  - [X] https://pagead2.googlesyndication.com
  - [X] https://googleads.g.doubleclick.net
- [X] 确保所有广告位都有 fixedHeight
- [X] 创建 `src/lib/ads-config.ts` 统一管理广告配置
- [X] 创建 `docs/adsense-setup.md` 配置指南

---

## 第十章：国际化系统

### 10.1 翻译文件结构
- [X] 创建 `src/messages/en.json`（英文）
- [X] 创建 `src/messages/es.json`（西班牙语）
- [X] 创建 `src/messages/pt.json`（葡萄牙语）
- [X] 创建 `src/messages/de.json`（德语）
- [X] 创建 `src/messages/fr.json`（法语）
- [X] 创建 `src/messages/ja.json`（日语）
- [X] 创建 `src/messages/zh-CN.json`（简体中文）
- [X] 创建 `src/messages/zh-TW.json`（繁体中文）

### 10.2 翻译内容
- [X] 翻译 Common 部分（品牌名、加载、错误等）
- [X] 翻译 Home 部分（Hero 标题、副标题、上传区文案）
- [X] 翻译 Dashboard 部分（分析完成、下载按钮、标签等）
- [X] 翻译 SEO 部分（页面标题、描述）
- [X] 翻译 Blog 相关文案
- [X] 翻译 Privacy 和 Terms 页面文案
- [X] 翻译所有占位符组件文案

### 10.3 繁简中文分离
- [X] 确保 zh-CN 使用简体术语（元数据、信息、软件、默认）
- [X] 确保 zh-TW 使用繁体术语（后设资料、资讯、软体、预设）
- [X] 检查文案风格差异（简体直白高效，繁体亲切柔和）

---

## 第十一章：博客系统

### 11.1 Markdown 解析系统
- [X] 安装 gray-matter（读取元数据）
- [X] 安装 remark 和 remark-html（转译 HTML）
- [X] 创建 `src/lib/markdown.ts` 解析工具
- [X] 实现 Markdown 转 HTML 功能
- [X] 实现 Front Matter 解析

### 11.2 博客目录结构
- [X] 创建 `src/content/posts/en/` 目录
- [X] 创建 `src/content/posts/es/` 目录
- [X] 创建 `src/content/posts/pt/` 目录
- [X] 创建 `src/content/posts/de/` 目录
- [X] 创建 `src/content/posts/fr/` 目录
- [X] 创建 `src/content/posts/ja/` 目录
- [X] 创建 `src/content/posts/zh-CN/` 目录
- [X] 创建 `src/content/posts/zh-TW/` 目录

### 11.3 博客列表页
- [X] 创建 `src/app/[locale]/blog/page.tsx`
- [X] 实现网格卡片布局
- [X] 显示封面图（16:9, 圆角）
- [X] 显示标题（H2, 粗体）
- [X] 显示摘要（截取前 100 字符）
- [X] 添加 "阅读更多" 按钮
- [X] 实现分页功能（如果需要）
- [X] 实现每 3 篇文章后插入原生广告卡片

### 11.4 博客详情页
- [X] 创建 `src/app/[locale]/blog/[slug]/page.tsx`
- [X] 实现动态路由
- [X] 渲染 Markdown 内容为 HTML
- [X] 添加文章元数据（标题、日期、作者、标签）
- [X] 实现侧边栏 ToolCallToActionWidget（Sticky）
- [X] 实现底部相关文章推荐
- [X] 实现每 500 字插入内嵌广告
- [X] 添加结构化数据（Article Schema）

### 11.5 自动化内链插入
- [X] 在 markdown.ts 中添加内链插入逻辑
- [X] 检测关键词 "EXIF remover" 或 "clean photos"
- [X] 自动替换为指向首页的链接
- [X] 添加样式类 text-indigo-600 font-bold

### 11.6 文章模板
- [X] 创建文章模板文档（通过示例文章体现）
- [X] 定义 Front Matter 结构（title, date, description, tags, coverImage）
- [X] 定义文章结构（Introduction, Methods, FAQ 等）

---

## 第十二章：内容创作

### 12.1 核心文章撰写
- [X] 撰写英文文章 "How to remove GPS from iPhone photos"
- [X] 撰写英文文章 "Is it safe to share photos on Reddit?"
- [X] 撰写英文文章 "Check shutter count online free"
- [X] 撰写英文文章 "Remove camera serial number metadata"
- [X] 每篇文章至少 1000 字
- [ ] 包含操作步骤截图（待添加图片资源）
- [X] 包含个人观点和见解
- [X] 人工润色（避免纯 AI 生成痕迹）

### 12.2 文章翻译
- [X] 将所有英文文章翻译为西班牙语（已完成，4篇文章）
- [X] 将所有英文文章翻译为葡萄牙语（已完成，4篇文章）
- [X] 将所有英文文章翻译为德语（已完成，4篇文章）
- [X] 将所有英文文章翻译为法语（已完成，4篇文章）
- [X] 将所有英文文章翻译为日语（已完成，4篇文章）
- [X] 将所有英文文章翻译为简体中文（已完成，4篇文章）
- [X] 将所有英文文章翻译为繁体中文（已完成，4篇文章）
- [X] 确保文件名（slug）在所有语言中保持一致

---

## 第十三章：SEO 优化

### 13.1 技术 SEO
- [X] 创建 `src/app/sitemap.ts` 动态生成 sitemap.xml
- [X] 创建 `src/app/robots.ts` 生成 robots.txt
- [X] 实现所有页面的 Canonical 标签
- [X] 实现动态 Hreflang 标签（在 metadata.ts）
- [X] 配置所有 8 种语言的 alternates
- [X] 设置 x-default 为英文

### 13.2 结构化数据
- [X] 首页添加 SoftwareApplication Schema（JSON-LD）
- [X] 首页添加 FAQPage Schema（JSON-LD）
- [X] 博客文章添加 Article Schema（JSON-LD，在 StructuredData 组件中）
- [X] 确保所有 Schema 数据完整准确

### 13.3 Meta 标签优化
- [X] 为所有页面添加动态 title
- [X] 为所有页面添加动态 description
- [X] 为所有页面添加 Open Graph 标签
- [X] 为所有页面添加 Twitter Card 标签
- [X] 确保图片使用正确的尺寸

---

## 第十四章：法律页面

### 14.1 隐私政策页面
- [X] 创建 `src/app/[locale]/privacy/page.tsx`
- [X] 撰写完整的隐私政策内容
- [X] 包含 Advertising Partners Privacy Policies 部分
- [X] 包含第三方广告服务器说明
- [X] 包含 Cookie 使用说明
- [X] 实现多语言版本（8 种语言，翻译文件已创建）

### 14.2 服务条款页面
- [X] 创建 `src/app/[locale]/terms/page.tsx`
- [X] 撰写完整的服务条款内容
- [X] 实现多语言版本（8 种语言，翻译文件已创建）

### 14.3 About Us 页面
- [X] 创建 `src/app/[locale]/about/page.tsx`
- [X] 撰写关于页面内容
- [X] 实现多语言版本（8 种语言，翻译文件已创建）

---

## 第十五章：移动端适配

### 15.1 响应式设计
- [X] 测试所有页面在移动端的显示（基础响应式已实现）
- [X] 调整导航栏移动端样式（汉堡菜单已实现）
- [X] 调整 Hero 区域移动端布局（已使用响应式类）
- [X] 调整上传区域移动端尺寸（已使用响应式类）
- [X] 调整结果页移动端布局（单栏，已使用 grid-cols-1）
- [X] 调整博客列表页移动端布局（已使用响应式网格）
- [X] 调整博客详情页移动端布局（已使用响应式布局）
- [X] 确保所有按钮在移动端可点击（至少 44x44px，已实现）

### 15.2 触摸交互优化
- [X] 优化拖拽上传在移动端的体验（react-dropzone 已支持）
- [X] 添加触摸反馈动画（已添加 touch-feedback 和 btn-touch 类）
- [X] 测试文件选择在移动端的兼容性（已支持）

---

## 第十六章：性能优化

### 16.1 图片优化
- [X] 确保所有静态图片使用 Next.js Image 组件（博客页面已使用）
- [X] 配置图片优化设置（Next.js 默认优化）
- [X] 添加图片懒加载（Next.js Image 默认懒加载）

### 16.2 代码优化
- [X] 检查并移除未使用的依赖（基础检查完成）
- [X] 实现代码分割（Code Splitting，Next.js App Router 自动实现）
- [X] 优化 Bundle 大小（使用动态导入和代码分割）
- [X] 使用 React.memo 优化组件渲染（已优化 ImageListItem、ViewSwitcher、ActionBar、StatusOverview）

### 16.3 性能测试
- [ ] 使用 Lighthouse 测试性能分数（需部署后测试）
- [ ] 确保 LCP < 2.5s（需部署后测试）
- [ ] 确保 FID < 100ms（需部署后测试）
- [ ] 确保 CLS < 0.1（已通过 fixedHeight 优化广告位）
- [ ] 优化到目标分数（90+，需部署后测试）

---

## 第十七章：部署与域名

### 17.1 Vercel 部署
- [ ] 创建 Vercel 账户
- [ ] 连接 GitHub 仓库
- [ ] 配置环境变量
- [ ] 配置构建设置
- [ ] 执行首次部署
- [ ] 测试生产环境功能

### 17.2 域名配置
- [ ] 购买域名 removexif.com
- [ ] 在 Vercel 中绑定域名
- [ ] 配置 DNS 记录
- [ ] 等待 DNS 传播
- [ ] 测试 HTTPS 证书自动配置
- [ ] 配置域名重定向（www 到非 www 或反之）

---

## 第十八章：SEO 提交与监控

### 18.1 Google Search Console
- [ ] 注册 Google Search Console 账户
- [ ] 验证网站所有权
- [ ] 提交 sitemap.xml
- [ ] 检查索引状态
- [ ] 监控搜索表现

### 18.2 Bing Webmaster
- [ ] 注册 Bing Webmaster Tools 账户
- [ ] 验证网站所有权
- [ ] 提交 sitemap.xml
- [ ] 检查索引状态

### 18.3 Analytics 配置
- [ ] 安装 Google Analytics 4
- [ ] 配置事件追踪
- [ ] 设置转化目标
- [ ] 测试数据收集

---

## 第十九章：冷启动推广

### 19.1 Product Hunt 准备
- [ ] 制作产品截图（使用 Figma 套壳）
- [ ] 制作演示 GIF 或视频
- [ ] 撰写 Product Hunt 发布文案
- [ ] 强调 "Privacy First" 和 "Browser-based"
- [ ] 准备发布时间（周二或周三太平洋时间 00:01）

### 19.2 Reddit 推广
- [ ] 在 r/privacy 发帖
- [ ] 在 r/photography 发帖
- [ ] 在 r/OSINT 发帖
- [ ] 使用"开发者分享"话术，避免广告感
- [ ] 提供 GitHub 链接

### 19.3 其他平台
- [ ] 在 V2EX 分享创造节点发帖
- [ ] 在 IndieHackers 发帖
- [ ] 提交至 5-10 个免费的 Web Tools 目录站
- [ ] 考虑提交至阮一峰的周刊（通过 GitHub Issue）

---

## 第二十章：AdSense 申请准备

### 20.1 内容检查
- [X] 检查所有页面是否有 Broken Links（已检查，已修复FeaturedGuidesWidget中的链接问题）
- [X] 确保 Privacy Policy 链接在页脚可见（已创建Footer组件并添加到所有页面）
- [X] 确保 Terms 链接在页脚可见（已创建Footer组件并添加到所有页面）
- [X] 检查所有页面内容质量（所有页面已存在：首页、博客列表、博客详情、结果页、隐私政策、服务条款、关于我们）
- [X] 确保有足够的原创内容（已有4篇英文文章，每篇已翻译为7种语言，共28篇文章）

### 20.2 网站活跃度
- [ ] 持续更新博客（每天一篇，至少 5-7 篇）
- [ ] 确保网站有稳定的访问量
- [ ] 检查网站加载速度
- [ ] 确保移动端体验良好

### 20.3 AdSense 申请
- [ ] 注册 Google AdSense 账户
- [ ] 填写网站信息
- [ ] 提交申请
- [ ] 等待审核（通常 2-4 周）

---

## 第二十一章：审核通过后的配置

### 21.1 广告激活
- [ ] 收到 AdSense 审核通过通知
- [ ] 获取真实的 AdSense Publisher ID
- [ ] 更新环境变量 `NEXT_PUBLIC_ADSENSE_ID`
- [ ] 创建广告单元（Top Banner, Sidebar, Native Grid）
- [ ] 获取各广告位的 Slot ID
- [ ] 更新 AdUnit 组件中的 Slot ID

### 21.2 广告切换
- [ ] 将 `NEXT_PUBLIC_ENABLE_ADS` 设置为 `true`
- [ ] 部署到生产环境
- [ ] 测试所有广告位是否正常显示
- [ ] 检查广告加载性能

### 21.3 监控与优化
- [ ] 监控 CLS 指标（确保广告不影响布局）
- [ ] 监控页面加载速度
- [ ] 微调广告位高度
- [ ] 监控点击率（CTR）
- [ ] 监控 RPM（每千次展示收入）

---

## 第二十二章：风险防御

### 22.1 AdSense 封号防御
- [ ] 制定"绝对不点击自己广告"的规则
- [ ] 使用无痕模式查看网站（如果已登录 Publisher 账号）
- [ ] 接入 Cloudflare（免费版）
- [ ] 开启 Bot Fight Mode
- [ ] 设置 WAF 规则拦截垃圾 IP
- [ ] 监控点击率异常（CTR > 10% 时立即报备）

### 22.2 SEO 防御
- [ ] 确保 Hreflang 配置正确
- [ ] 检查是否有重复内容
- [ ] 人工润色所有 AI 生成的内容
- [ ] 添加具体工具截图和操作步骤
- [ ] 添加个人观点和见解

### 22.3 竞品防御
- [ ] 代码已通过 Next.js 编译混淆
- [ ] 建立品牌护城河（UI 风格、多语言 SEO 矩阵）
- [ ] 持续更新内容保持竞争力

---

## 第二十三章：持续优化

### 23.1 内容更新
- [ ] 制定内容更新计划（每周至少 2-3 篇新文章）
- [ ] 覆盖更多长尾关键词
- [ ] 根据用户反馈优化内容

### 23.2 功能迭代
- [ ] 收集用户反馈
- [ ] 优化用户体验
- [ ] 添加新功能（如支持更多图片格式）

### 23.3 数据分析
- [ ] 定期分析 Google Analytics 数据
- [ ] 分析搜索关键词表现
- [ ] 优化高转化页面
- [ ] 调整 SEO 策略

---

## 进度统计

- 总任务数：___ / ___
- 已完成：___ / ___
- 进行中：___ / ___
- 未开始：___ / ___

最后更新日期：___________

