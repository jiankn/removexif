# 博客图片目录

此目录用于存放博客文章的封面图片。

## 需要的图片文件

根据博客文章配置，您需要添加以下图片文件：

1. **iphone-gps.jpg** - iPhone GPS 相关文章的封面图
2. **reddit-privacy.jpg** - Reddit 隐私相关文章的封面图
3. **shutter-count.jpg** - 快门计数相关文章的封面图
4. **serial-number.jpg** - 相机序列号相关文章的封面图

## 图片要求

- **格式**: JPG 或 PNG
- **推荐尺寸**: 1200x630px (适合社交媒体分享)
- **文件大小**: 建议小于 500KB（优化加载速度）
- **命名**: 使用小写字母和连字符，如 `iphone-gps.jpg`

## 如何添加图片

1. 将图片文件放在此目录 (`public/images/blog/`)
2. 确保文件名与博客文章中的 `coverImage` 路径匹配
3. 提交到 Git 仓库
4. Vercel 会自动部署这些静态文件

## 访问路径

图片上传后，可以通过以下路径访问：
- `/images/blog/iphone-gps.jpg`
- `/images/blog/reddit-privacy.jpg`
- `/images/blog/shutter-count.jpg`
- `/images/blog/serial-number.jpg`

## 注意事项

- 如果图片不存在，网站会显示占位符（不会报错）
- 建议使用图片优化工具压缩图片以提高加载速度
- 确保图片不包含敏感信息或版权问题

