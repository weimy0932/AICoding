# 暖炉小馆 · 餐馆展示与预订网站

原生 HTML5 + CSS3 + JavaScript 实现，无任何第三方框架依赖。

## 项目结构

```
restaurant/
├── index.html          # 首页（英雄区 / 特色 / 招牌菜 / CTA）
├── dishes.html         # 菜品展示（按菜系 / 热门度筛选）
├── about.html          # 门店介绍（品牌故事 / 门店信息 / 环境图片）
├── booking.html        # 在线预订（表单校验 / 弹窗反馈）
├── contact.html        # 联系我们（联系方式 + 留言表单）
├── css/
│   ├── style.css       # 主样式（暖色调设计系统 / 组件）
│   └── responsive.css  # 响应式断点（手机 / 平板 / PC / 打印）
├── js/
│   ├── main.js         # 固定导航 / 汉堡菜单 / 平滑滚动 / 懒加载 / 返回顶部 / 滚动动画
│   ├── dishes.js       # 菜品数据渲染 + 双重筛选
│   └── booking.js      # 日期 / stepper / 表单校验 + localStorage 偏好记忆 + 成功弹窗
├── images/             # 静态图片资源目录（本次使用 CSS 渐变占位）
└── README.md
```

## 启动方式

**方式一：直接双击打开**

- 直接用浏览器打开 `index.html` 即可浏览（Chrome / Edge / Firefox / Safari 最新版本）。

**方式二：本地静态服务器（推荐）**

某些浏览器对 `file://` 协议下的 localStorage / fetch 有限制，建议启动本地服务器：

```bash
# 使用本机 Python
cd restaurant
python -m http.server 8080

# 或在项目外层启动（访问 /restaurant 子路径）
cd ..
python -m http.server 8080
```

浏览器访问：http://localhost:8080/

> 注：本项目使用的就是本工程目录下 [.venv](../.venv)（Python 3.14.3）。

## 功能清单

| 模块 | 实现点 |
|---|---|
| 导航栏 | 固定顶部、滚动阴影、汉堡菜单（移动端）、当前页高亮 |
| 响应式 | 4 档断点（<480 / <768 / <1024 / ≥1440），打印样式 |
| 菜品页 | 菜系 × 热门度双重筛选、JS 数据驱动、空态提示、XSS 防护 |
| 预订页 | 日期最小值 / 默认明日、人数 stepper、实时校验、localStorage 记忆、成功弹窗 |
| 交互 | 平滑滚动（兼容固定导航高度）、返回顶部（>400px 显示）、IntersectionObserver 懒加载与滚动动画 |
| 视觉 | 暖橙 + 沙棕 + 金黄配色、hover 位移阴影反馈、按钮按压态 |
| 无障碍 | 语义化标签、aria-label、键盘可达、弹窗 ESC 关闭 |

## 设计规范

- 主色 `#E85D26`、强调 `#F6AE2D`、背景 `#FFF8F0`、文字 `#2D1B0E`
- 字体：PingFang SC / Microsoft YaHei（正文）+ Noto Serif SC（标题）
- 组件圆角 6 / 10 / 16 px，阴影 3 级，动效 `cubic-bezier(.4,0,.2,1)`

## 测试

- 全部 5 个页面链接互通，无死链
- 菜品筛选支持菜系 + 热门度自由组合
- 预订表单校验手机号格式、必填、日期 ≥ 今日、人数 1–20
- 手机 / 平板 / PC 三档分辨率下无布局错乱
- 弹窗支持遮罩关闭、ESC 关闭、按钮关闭

## 后续扩展建议

- 菜品数据改用后端接口（替换 `dishes.js` 中 `DISHES` 为 `fetch`）
- 预订 / 留言表单接入后端，当前为前端模拟提交
- `images/` 目录可补充真实菜品照片，HTML 中改用 `<img loading="lazy" data-src="...">` 触发懒加载
