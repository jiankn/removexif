# RemovExif 博客发布工作流

> 目标：从一篇 Markdown 原稿快速生成 8 种语言的内容文件、放到正确目录，并完成部署。

## 0. 前置准备

- 文章正文（Markdown，包含标题、描述等信息）
- 16:9 封面图，放在 `public/images/blog/`，命名建议 `slug-language.jpg`
- 需要的标签关键词（逗号分隔即可）

## 1. 使用多语言生成器

1. 打开 `tools/blog-generator.html` （直接在浏览器中双击即可，无需运行 Dev Server）。
2. 填写 Step 1 的全局信息：
   - `Slug`：英文短横线格式，将作为 `src/content/posts/<locale>/<slug>.md` 的文件名。
   - `发布日期`：可以固定成需要的日期，或使用当天。
   - `封面图路径`：例如 `/images/blog/my-new-guide.jpg`。
   - `作者 / 标签`：用于 frontmatter。
3. 在 Step 2 粘贴你准备好的 Markdown 正文（不包含 frontmatter）。
4. 点击「将上面内容复制到所有语言」，如果某些语言你有单独翻译，可在 Step 3 中对应区域直接修改标题/描述/正文。
5. 点击「生成 Markdown 文件」，输出区域会展示 8 份内容，每份都带好 frontmatter。
6. 复制每个结果，保存到 `src/content/posts/<locale>/<slug>.md`。若目录不存在，请手动创建。

> 这样做完，`getBlogPosts` 会自动读取所有语言的文章；无需再在其他地方手动登记 slug。

## 2. 静态资源与链接

- 如果有新增封面图，记得把文件放入 `public/images/blog/`，并在 frontmatter 的 `coverImage` 字段填入 `/images/blog/xxxx.jpg`。
- 正文内如需插入图片，请使用绝对路径 `/images/blog/...`，确保 Next.js 能正确处理。

## 3. 验证

1. 运行 `pnpm lint` 及 `pnpm build`，确保没有语法/类型问题。
2. `pnpm dev` 查看页面：
   - `/{locale}/blog` 列表应出现新文章。
   - `/{locale}/blog/<slug>` 页面正文、StructuredData、`<time>` 标签应匹配新的 frontmatter。
3. Commit + push：GitHub Action -> Vercel 将自动部署。

## 4. FAQ

- **如何排序？** `getBlogPosts` 会按 `date` 倒序，如果要置顶，给文章更晚的日期即可。
- **只想先发布英语？** 暂时只保存 `src/content/posts/en/<slug>.md` 也可以，其它语言稍后补充；生成器输出的文本仅供复制，没保存的文件不会影响构建。
- **StructuredData 要改吗？** 不需要。`StructuredData` 会读取 `BlogPost` 的 `title/description/date/coverImage`，保持 frontmatter 正确即可。

## 5. Blog 页面如何显示新文章

- 列表页 `src/app/[locale]/blog/page.tsx` 调用 `getBlogPosts(locale)`，新增 Markdown 就会自动展示。
- 详情页 `src/app/[locale]/blog/[slug]/page.tsx` 通过 URL slug 读取对应文件，无需额外注册。
- 如果未来新增 `generateStaticParams` 这种显式列表，只要运行 `pnpm build` 就能确认所有 slug 都被包含；当前实现已在构建时读取文件系统，依旧是全自动。

按照以上步骤，就能从 Markdown 原稿到多语言文章全自动落地，最后提交代码即可触发 Vercel 部署。祝写作顺利 🚀

