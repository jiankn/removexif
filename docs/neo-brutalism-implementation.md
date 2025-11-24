# RemovEXIF 新野兽派（Neo-Brutalism）风格实现进度

> **设计理念**：通过高对比度、硬边框和大胆的色彩，创造出一种诚实、透明且极具冲击力的视觉语言，在隐私工具领域实现差异化。

---

## 📋 目录

1. [设计系统定义](#设计系统定义)
2. [核心组件改造清单](#核心组件改造清单)
3. [实现进度跟踪](#实现进度跟踪)
4. [技术实现指南](#技术实现指南)
5. [参考资源](#参考资源)

---

## 🎨 设计系统定义

### 1. 硬阴影系统 (Hard Shadows)

**核心原则**：拒绝模糊，拥抱纯黑色、无模糊的投影

#### Tailwind 配置
```css
/* 需要在 tailwind.config.ts 或 globals.css 中定义 */
.shadow-brutal {
  box-shadow: 4px 4px 0px 0px #000;
}

.shadow-brutal-sm {
  box-shadow: 2px 2px 0px 0px #000;
}

.shadow-brutal-lg {
  box-shadow: 6px 6px 0px 0px #000;
}

.shadow-brutal-xl {
  box-shadow: 8px 8px 0px 0px #000;
}
```

#### 悬停效果
```css
.hover-brutal {
  transition: all 0.1s ease;
}

.hover-brutal:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px #000;
}

.hover-brutal:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}
```

**状态**：`[ ]` 待实现

---

### 2. 粗边框系统 (Bold Borders)

**核心原则**：所有元素使用 2px - 4px 的粗黑色边框

#### 标准边框类
- `border-brutal`: `border-2 border-black` (2px)
- `border-brutal-thick`: `border-4 border-black` (4px)
- `border-brutal-thin`: `border border-black` (1px，用于细节)

**状态**：`[ ]` 待实现

---

### 3. 高饱和度配色方案 (Clashing Colors)

#### 主色调定义

| 用途 | 颜色 | Hex | Tailwind 类 |
|------|------|-----|-------------|
| 主背景 | 米白色/纯白 | `#FEFEFE` / `#FFFFFF` | `bg-white` / `bg-[#FEFEFE]` |
| 强调背景 | 亮绿色 | `#A3E635` | `bg-[#A3E635]` |
| 次要强调 | 亮粉色 | `#FF6B9D` | `bg-[#FF6B9D]` |
| 警告/提示 | 明黄色 | `#FFD93D` | `bg-[#FFD93D]` |
| 信息 | 电光蓝 | `#00D9FF` | `bg-[#00D9FF]` |
| 文字 | 纯黑色 | `#000000` | `text-black` |
| 边框 | 纯黑色 | `#000000` | `border-black` |

#### 配色策略
- **主 CTA 按钮**：亮绿色背景 + 黑色文字 + 黑色边框 + 硬阴影
- **次要按钮**：白色背景 + 黑色文字 + 黑色边框 + 硬阴影
- **警告/提示**：明黄色背景 + 黑色文字 + 黑色边框
- **卡片背景**：白色或米白色，带黑色边框和硬阴影

**状态**：`[ ]` 待实现

---

### 4. 极端排版系统 (Bold Typography)

#### 字体选择
- **主标题**：使用粗体无衬线字体（如 Space Grotesk、Inter Bold）
- **正文**：保持可读性，使用 Inter 或系统字体
- **强调文字**：使用等宽字体（Monospace）或粗体

#### 字号策略
- **Hero 标题**：`text-6xl` 或更大（`text-7xl`, `text-8xl`）
- **章节标题**：`text-4xl` 或 `text-5xl`
- **卡片标题**：`text-2xl` 或 `text-3xl`
- **正文**：`text-base` 或 `text-lg`

#### 排版规则
- 使用 `uppercase` 或 `font-extrabold` 增强视觉冲击
- 打破传统网格，允许元素略微偏移
- 使用严格的线条分割（参考 Excel 表格）

**状态**：`[ ]` 待实现

---

### 5. 原始插图风格 (Raw Imagery)

#### 设计元素
- 简单的几何图形
- 复古的 Clip Art 风格图标
- 拼贴照片效果
- Windows 95 风格的 UI 元素

#### 图标库
- 继续使用 Lucide Icons，但应用粗边框和硬阴影样式
- 考虑添加自定义 SVG 图标，采用新野兽派风格

**状态**：`[ ]` 待实现

---

## 🧩 核心组件改造清单

### 优先级 1：核心交互组件

#### 1.1 Navbar（导航栏）
**文件**：`src/components/Navbar.tsx`

**改造内容**：
- [X] 移除 `backdrop-blur` 和半透明效果
- [X] 添加纯白色背景 + 粗黑色底部边框（`border-b-4 border-black`）
- [X] Logo 区域添加硬阴影或粗边框
- [X] 导航链接添加粗边框悬停效果
- [X] 语言选择器改为硬阴影卡片样式
- [X] 移动端菜单改为硬边框卡片

**预期效果**：
```tsx
// 示例样式
className="bg-white border-b-4 border-black shadow-brutal-sm"
```

**状态**：`[X]` 已完成（首页）

---

#### 1.2 ImageUpload（图片上传区域）
**文件**：`src/components/ImageUpload.tsx`

**改造内容**：
- [X] 上传区域边框改为粗黑色边框（`border-4 border-black`）
- [X] 添加硬阴影（`shadow-brutal-lg`）
- [X] 拖拽激活状态使用高饱和度颜色（如亮绿色或亮粉色）
- [X] 上传按钮改为新野兽派风格（亮绿色背景 + 黑色边框 + 硬阴影）
- [X] 统计信息区域使用粗边框分隔

**预期效果**：
```tsx
// 上传区域
className="border-4 border-black bg-white shadow-brutal-lg"

// 激活状态
className="border-4 border-black bg-[#A3E635] shadow-brutal-lg"

// 按钮
className="bg-[#A3E635] text-black border-4 border-black shadow-brutal hover-brutal"
```

**状态**：`[X]` 已完成（首页）

---

#### 1.3 ActionBar（操作栏）
**文件**：`src/components/ActionBar.tsx`

**改造内容**：
- [ ] 移除 `shadow-lg`，改为硬阴影
- [ ] 顶部边框改为粗黑色（`border-t-4 border-black`）
- [ ] "重新开始"按钮改为白色背景 + 黑色边框 + 硬阴影
- [ ] "下载 ZIP"按钮改为亮绿色背景 + 黑色边框 + 硬阴影
- [ ] 添加按钮按下动画效果

**预期效果**：
```tsx
// 容器
className="bg-white border-t-4 border-black shadow-brutal-sm"

// 下载按钮
className="bg-[#A3E635] text-black border-4 border-black shadow-brutal hover-brutal font-bold uppercase"
```

**状态**：`[ ]` 未开始

---

### 优先级 2：展示组件

#### 2.1 Hero（主标题区域）
**文件**：`src/components/Hero.tsx`

**改造内容**：
- [X] 标题字号增大（`text-7xl` 或 `text-8xl`）
- [X] 标题使用 `font-extrabold` 或 `font-black`
- [X] 考虑添加背景色块（亮绿色或亮粉色）作为装饰
- [X] 副标题保持可读性，但可以添加粗边框装饰

**预期效果**：
```tsx
// 标题
className="text-7xl font-black text-black uppercase"

// 装饰背景块
<div className="absolute bg-[#A3E635] border-4 border-black shadow-brutal-lg" />
```

**状态**：`[X]` 已完成（首页）

---

#### 2.2 FeaturesGrid（功能网格）
**文件**：`src/components/FeaturesGrid.tsx`

**改造内容**：
- [X] 卡片移除圆角（`rounded-none`）或使用极小圆角
- [X] 添加粗黑色边框（`border-4 border-black`）
- [X] 添加硬阴影（`shadow-brutal`）
- [X] 图标背景使用高饱和度颜色（亮绿色、亮粉色、明黄色）
- [X] 悬停效果改为位移 + 阴影变化

**预期效果**：
```tsx
// 卡片
className="bg-white border-4 border-black shadow-brutal rounded-none hover-brutal"

// 图标背景
className="bg-[#A3E635] border-4 border-black"
```

**状态**：`[X]` 已完成（首页）

---

#### 2.3 ImageListItem（图片列表项）
**文件**：`src/components/ImageListItem.tsx`

**改造内容**：
- [ ] 图片容器添加粗黑色边框
- [ ] 添加硬阴影
- [ ] 状态标签使用高饱和度颜色
- [ ] 操作按钮改为新野兽派风格

**状态**：`[ ]` 未开始

---

### 优先级 3：辅助组件

#### 3.1 ProcessingModal（处理模态框）
**文件**：`src/components/ProcessingModal.tsx`

**改造内容**：
- [ ] 模态框背景改为白色 + 粗黑色边框
- [ ] 添加硬阴影
- [ ] 进度条使用高饱和度颜色
- [ ] 关闭按钮使用粗边框样式

**状态**：`[ ]` 未开始

---

#### 3.2 SEOTextBlock（SEO 文本块）
**文件**：`src/components/SEOTextBlock.tsx`

**改造内容**：
- [X] 背景色改为纯白色
- [X] 每个文本块添加粗黑色边框和硬阴影
- [X] 标题使用极端排版（大字号、粗体、大写）
- [X] 使用高饱和度颜色作为背景（交替使用白色和明黄色）

**状态**：`[X]` 已完成（首页）

---

#### 3.3 Footer（页脚）
**文件**：`src/components/Footer.tsx`

**改造内容**：
- [ ] 添加粗黑色顶部边框
- [ ] 链接样式改为粗边框悬停效果
- [ ] 背景色可以尝试米白色或纯白色

**状态**：`[ ]` 未开始

---

#### 3.4 StatusOverview（状态概览）
**文件**：`src/components/StatusOverview.tsx`

**改造内容**：
- [ ] 统计卡片使用粗边框和硬阴影
- [ ] 数字使用超大字号和粗体
- [ ] 使用高饱和度颜色区分不同状态

**状态**：`[ ]` 未开始

---

### 优先级 4：页面级改造

#### 4.1 首页（Home Page）
**文件**：`src/app/[locale]/page.tsx`

**改造内容**：
- [X] 背景色改为纯白色或米白色（移除 `bg-slate-50`）
- [X] 确保所有子组件都已应用新野兽派风格
- [X] 添加装饰性几何图形（可选，在 Hero 组件中）

**状态**：`[X]` 已完成（英文版首页）

---

#### 4.2 结果页（Result Page）
**文件**：`src/app/[locale]/result/page.tsx`

**改造内容**：
- [ ] 页面背景改为纯白色
- [ ] 所有卡片和容器应用粗边框和硬阴影
- [ ] 下载按钮使用新野兽派风格

**状态**：`[ ]` 未开始

---

#### 4.3 博客页（Blog Pages）
**文件**：`src/app/[locale]/blog/**/*.tsx`

**改造内容**：
- [ ] 文章卡片使用粗边框和硬阴影
- [ ] 标题使用极端排版
- [ ] 代码块使用粗边框样式

**状态**：`[ ]` 未开始

---

## 📊 实现进度跟踪

### 阶段 1：设计系统基础（100%）
- [X] 在 `globals.css` 中添加硬阴影工具类
- [X] 在 `globals.css` 中添加悬停效果工具类
- [X] 定义配色方案 CSS 变量
- [X] 更新 Tailwind 配置（如需要）

### 阶段 2：核心组件改造（首页部分 100%）
- [X] Navbar 组件（首页）
- [X] ImageUpload 组件（首页）
- [ ] ActionBar 组件（结果页，暂不改造）
- [X] Hero 组件（首页）
- [X] FeaturesGrid 组件（首页）

### 阶段 3：辅助组件改造（部分完成）
- [ ] ProcessingModal 组件
- [ ] ImageListItem 组件
- [ ] Footer 组件
- [ ] StatusOverview 组件
- [X] SEOTextBlock 组件（首页）

### 阶段 4：页面级整合（首页完成）
- [X] 首页整合（英文版）
- [ ] 结果页整合
- [ ] 博客页整合
- [ ] 其他页面整合

### 阶段 5：优化与测试（0%）
- [ ] 响应式设计测试
- [ ] 浏览器兼容性测试
- [ ] 可访问性检查（对比度、键盘导航等）
- [ ] 性能优化
- [ ] 用户测试反馈收集

---

## 🛠️ 技术实现指南

### 1. 硬阴影实现

#### 方法 A：使用 Tailwind 任意值
```tsx
<div className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
  Content
</div>
```

#### 方法 B：在 globals.css 中定义工具类（推荐）
```css
@layer utilities {
  .shadow-brutal {
    box-shadow: 4px 4px 0px 0px #000;
  }
  
  .shadow-brutal-sm {
    box-shadow: 2px 2px 0px 0px #000;
  }
  
  .shadow-brutal-lg {
    box-shadow: 6px 6px 0px 0px #000;
  }
  
  .shadow-brutal-xl {
    box-shadow: 8px 8px 0px 0px #000;
  }
}
```

### 2. 悬停动画实现

```css
@layer utilities {
  .hover-brutal {
    transition: all 0.1s ease;
  }
  
  .hover-brutal:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px #000;
  }
  
  .hover-brutal:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
}
```

### 3. 按钮组件示例

```tsx
// 主 CTA 按钮
<button className="
  bg-[#A3E635] 
  text-black 
  border-4 
  border-black 
  shadow-brutal 
  hover-brutal
  font-bold 
  uppercase
  px-6 
  py-3
">
  Start Now
</button>

// 次要按钮
<button className="
  bg-white 
  text-black 
  border-4 
  border-black 
  shadow-brutal 
  hover-brutal
  font-bold 
  uppercase
  px-6 
  py-3
">
  Cancel
</button>
```

### 4. 卡片组件示例

```tsx
<div className="
  bg-white 
  border-4 
  border-black 
  shadow-brutal 
  rounded-none
  p-8
  hover-brutal
">
  <h3 className="text-3xl font-black text-black uppercase mb-4">
    Title
  </h3>
  <p className="text-black">
    Content
  </p>
</div>
```

### 5. 响应式考虑

- 移动端：硬阴影可以适当减小（`shadow-brutal-sm`）
- 平板：使用标准硬阴影（`shadow-brutal`）
- 桌面：可以使用更大的阴影（`shadow-brutal-lg`）

---

## 📚 参考资源

### 设计灵感
1. **Gumroad** - 新野兽派商业化最成功的案例
2. **Brutalist Websites** - https://brutalistwebsites.com/
3. **Awwwards Brutalism** - 搜索 "brutalism" 标签

### 技术参考
1. **Tailwind CSS 任意值** - https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values
2. **CSS Box Shadow** - MDN 文档
3. **Transform 动画** - CSS Transitions

### 配色工具
1. **Coolors** - 配色方案生成器
2. **Adobe Color** - 配色工具

---

## 🎯 成功标准

### 视觉标准
- [ ] 所有交互元素都有硬阴影
- [ ] 所有容器都有粗黑色边框（2px-4px）
- [ ] 配色使用高饱和度颜色
- [ ] 排版使用极端字号对比
- [ ] 整体风格统一且具有冲击力

### 功能标准
- [ ] 所有交互功能正常工作
- [ ] 响应式设计在各设备上正常显示
- [ ] 可访问性符合 WCAG 2.1 AA 标准（对比度）
- [ ] 性能不受影响（CSS 动画流畅）

### 用户体验标准
- [ ] 用户能够清晰理解界面元素
- [ ] 按钮和链接有明显的视觉反馈
- [ ] 整体体验流畅且有趣
- [ ] 品牌差异化明显

---

## 📝 更新日志

### 2024-XX-XX
- 创建新野兽派风格实现进度文档
- 定义设计系统和组件改造清单

---

## 💡 注意事项

1. **可访问性**：虽然新野兽派风格大胆，但必须确保文字对比度符合 WCAG 标准（至少 4.5:1）
2. **性能**：硬阴影和动画可能影响性能，需要测试和优化
3. **品牌一致性**：确保所有页面和组件都应用统一的新野兽派风格
4. **用户反馈**：在实现过程中收集用户反馈，必要时调整设计
5. **渐进增强**：可以先实现核心页面，再逐步扩展到所有页面

---

**最后更新**：2024-XX-XX  
**维护者**：开发团队  
**状态**：规划阶段

