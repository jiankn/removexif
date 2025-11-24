# AdSense 配置指南

## 开发阶段（审核前）

在 AdSense 审核通过之前，不需要真实的 Publisher ID 和 Slot ID。

### 环境变量配置

创建 `.env.local` 文件（如果不存在），添加以下内容：

```env
# AdSense Configuration
# Set to true only after AdSense approval (Chapter 21)
NEXT_PUBLIC_ENABLE_ADS=false

# AdSense Publisher ID
# Format: ca-pub-xxxxxxxxxxxxxxxx
# Get this from Google AdSense dashboard after approval
NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx

# AdSense Slot IDs (Optional - only needed after approval)
# These will be provided by Google AdSense after creating ad units
NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER=
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=
NEXT_PUBLIC_ADSENSE_SLOT_NATIVE_GRID=
NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE=
```

### 当前行为

- `NEXT_PUBLIC_ENABLE_ADS=false`：广告功能关闭
- 所有广告位会显示占位符组件（变色龙策略）：
  - 首页顶部横幅 → `PrivacyTriviaWidget`
  - 结果页侧边栏 → `FeaturedGuidesWidget`
  - 结果页原生位 → `TransparencyWidget`

## 审核通过后（第二十一章）

### 1. 获取 Publisher ID

1. 登录 [Google AdSense](https://www.google.com/adsense/)
2. 在"账户"页面找到"发布商 ID"（Publisher ID）
3. 格式：`ca-pub-xxxxxxxxxxxxxxxx`

### 2. 创建广告单元

在 AdSense 后台创建以下广告单元：

#### 首页顶部横幅广告
- **名称**：Top Banner (Home Page)
- **类型**：展示广告
- **尺寸**：响应式（或 728x90）
- **位置**：首页 Hero 区域下方

#### 侧边栏摩天大楼广告
- **名称**：Sidebar Skyscraper (Result Page)
- **类型**：展示广告
- **尺寸**：300x600（摩天大楼）
- **位置**：结果页右侧边栏（Sticky）

#### 结果页原生网格广告
- **名称**：Native Grid (Result Page)
- **类型**：展示广告
- **尺寸**：300x250（矩形）
- **位置**：结果页图片列表下方

#### 博客文章内嵌广告（可选，博客系统完成后）
- **名称**：In-Article (Blog Posts)
- **类型**：文章内广告
- **尺寸**：响应式
- **位置**：博客文章内容中（每 500 字一个）

### 3. 获取 Slot ID

创建广告单元后，AdSense 会提供每个广告单元的 Slot ID（格式：`1234567890`）。

### 4. 更新环境变量

更新 `.env.local` 文件：

```env
# 启用广告
NEXT_PUBLIC_ENABLE_ADS=true

# 使用真实的 Publisher ID
NEXT_PUBLIC_ADSENSE_ID=ca-pub-你的真实ID

# 使用真实的 Slot ID
NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER=你的顶部横幅SlotID
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=你的侧边栏SlotID
NEXT_PUBLIC_ADSENSE_SLOT_NATIVE_GRID=你的原生网格SlotID
NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE=你的文章内广告SlotID
```

### 5. 部署到生产环境

1. 在 Vercel 项目设置中添加环境变量
2. 重新部署应用
3. 验证所有广告位是否正常显示

## 注意事项

1. **不要点击自己的广告**：这会导致 AdSense 账户被封禁
2. **使用无痕模式测试**：如果已登录 AdSense 账户，使用无痕模式查看网站
3. **监控 CLS 指标**：确保广告加载不会影响页面布局
4. **遵守 AdSense 政策**：确保所有内容符合 AdSense 政策要求

## 技术实现

- **组件位置**：`src/components/ads/AdUnit.tsx`
- **配置文件**：`src/lib/ads-config.ts`
- **脚本注入**：`src/app/[locale]/layout.tsx`
- **性能优化**：
  - Preconnect 到 AdSense 域名
  - IntersectionObserver 延迟加载
  - Fixed height 防止 CLS
  - 路由变化时自动刷新广告

