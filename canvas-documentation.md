# Canvas 技术文档

## 1. Canvas 简介

Canvas 是 HTML5 提供的一个用于绘制图形的标签，允许通过 JavaScript 动态绘制 2D 或 3D 图形。Canvas 提供了一个像素级的绘图 API，可以用于创建动画、游戏、数据可视化、图像处理等多种应用。

### 1.1 基本用法

```html
<canvas id="myCanvas" width="400" height="300"></canvas>
<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  // 使用 ctx 进行绘制操作
</script>
```

## 2. Canvas 绘制基础

### 2.1 坐标系

Canvas 使用笛卡尔坐标系，原点 (0, 0) 位于左上角，x 轴向右递增，y 轴向下递增。

### 2.2 绘制路径

Canvas 绘制通常遵循以下步骤：

1. **开始路径**：使用 `beginPath()` 方法
2. **定义路径**：使用各种绘制方法（如 `moveTo()`, `lineTo()`, `arc()` 等）
3. **闭合路径**：使用 `closePath()` 方法（可选）
4. **绘制路径**：使用 `fill()` 或 `stroke()` 方法

### 2.3 基本图形绘制

- **直线**：`moveTo(x1, y1)`, `lineTo(x2, y2)`
- **矩形**：`rect(x, y, width, height)`
- **圆形/弧线**：`arc(x, y, radius, startAngle, endAngle, anticlockwise)`
- **贝塞尔曲线**：`quadraticCurveTo()`, `bezierCurveTo()`

## 3. Fill（填充）详解

### 3.1 基本概念

`fill()` 方法用于填充当前路径所围成的区域，填充颜色由 `fillStyle` 属性决定。

### 3.2 fillStyle 属性

`fillStyle` 可以设置为以下类型：

- **颜色值**：如 `"red"`, `"#FF0000"`, `"rgba(255, 0, 0, 0.5)"`
- **渐变对象**：通过 `createLinearGradient()` 或 `createRadialGradient()` 创建
- **图案对象**：通过 `createPattern()` 创建

### 3.3 填充规则

`fill()` 方法可以接受一个可选参数 `fillRule`，用于指定填充规则：

- **"nonzero"**（默认）：非零环绕规则
- **"evenodd"**：奇偶规则

### 3.4 示例

```javascript
// 填充矩形
ctx.fillStyle = "red";
ctx.fillRect(10, 10, 100, 100);

// 填充圆形
ctx.beginPath();
ctx.arc(150, 150, 50, 0, Math.PI * 2);
ctx.fillStyle = "blue";
ctx.fill();
```

## 4. Stroke（描边）详解

### 4.1 基本概念

`stroke()` 方法用于绘制当前路径的轮廓，描边颜色由 `strokeStyle` 属性决定，线条宽度由 `lineWidth` 属性决定。

### 4.2 描边相关属性

- **`strokeStyle`**：描边颜色，与 `fillStyle` 支持相同的类型
- **`lineWidth`**：线条宽度，默认值为 1
- **`lineCap`**：线条端点样式，可选值：`"butt"`（默认）, `"round"`, `"square"`
- **`lineJoin`**：线条连接样式，可选值：`"miter"`（默认）, `"round"`, `"bevel"`
- **`miterLimit`**：斜接限制，默认值为 10
- **`lineDashOffset`**：虚线偏移量

### 4.3 虚线设置

使用 `setLineDash()` 方法设置虚线样式：

```javascript
// 设置虚线样式 [实线长度, 空白长度]
ctx.setLineDash([5, 3]);
```

### 4.4 示例

```javascript
// 描边矩形
ctx.strokeStyle = "green";
ctx.lineWidth = 3;
ctx.strokeRect(10, 10, 100, 100);

// 描边圆形
ctx.beginPath();
ctx.arc(150, 150, 50, 0, Math.PI * 2);
ctx.strokeStyle = "purple";
ctx.lineWidth = 5;
ctx.stroke();
```

## 5. Canvas 应用场景

### 5.1 数据可视化

- 图表绘制：折线图、柱状图、饼图等
- 数据仪表盘
- 实时数据监控

### 5.2 游戏开发

- 2D 游戏
- 简单的动画效果
- 游戏UI元素

### 5.3 图像处理

- 图像裁剪和缩放
- 滤镜效果
- 像素操作

### 5.4 交互应用

- 签名板
- 绘图应用
- 地图绘制

### 5.5 动画效果

- 粒子效果
- 过渡动画
- 物理模拟

## 6. Canvas 性能优化

### 6.1 减少绘制操作

- 合并绘制操作，减少 `fill()` 和 `stroke()` 调用
- 使用 `save()` 和 `restore()` 方法优化状态管理

### 6.2 合理使用缓存

- 对于静态内容，使用离屏 Canvas 进行缓存
- 使用 `drawImage()` 方法复用绘制结果

### 6.3 优化路径复杂度

- 简化复杂路径
- 避免不必要的路径计算

### 6.4 合理设置 Canvas 尺寸

- 避免使用 CSS 缩放 Canvas，应直接设置 Canvas 的 width 和 height 属性
- 根据实际需要设置合适的分辨率

### 6.5 使用 requestAnimationFrame

- 使用 `requestAnimationFrame` 进行动画绘制，而不是 `setInterval`
- 这可以确保动画与浏览器刷新率同步，提高性能和流畅度

### 6.6 减少像素操作

- 像素操作（如 `getImageData()` 和 `putImageData()`）非常消耗性能，应尽量减少使用
- 如果必须使用，可以考虑使用 WebGL 或其他更高效的方法

## 7. 完整代码示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas 示例</title>
  <style>
    canvas {
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <canvas id="myCanvas" width="500" height="400"></canvas>
  <script>
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // 绘制填充矩形
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(50, 50, 100, 100);

    // 绘制描边矩形
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.strokeRect(200, 50, 100, 100);

    // 绘制填充圆形
    ctx.beginPath();
    ctx.arc(100, 250, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.fill();

    // 绘制描边圆形
    ctx.beginPath();
    ctx.arc(250, 250, 50, 0, Math.PI * 2);
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 5]);
    ctx.stroke();

    // 绘制渐变填充
    const gradient = ctx.createLinearGradient(350, 200, 450, 300);
    gradient.addColorStop(0, 'yellow');
    gradient.addColorStop(1, 'orange');

    ctx.beginPath();
    ctx.arc(400, 250, 50, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制文字
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Canvas 绘制示例', 50, 380);
  </script>
</body>
</html>
```

## 8. 总结

Canvas 是一个功能强大的绘图 API，提供了丰富的绘制功能，可以用于创建各种复杂的图形和动画效果。通过合理使用 fill 和 stroke 方法，以及遵循性能优化原则，可以创建出高效、流畅的 Canvas 应用。

Canvas 的主要优势在于：

- 像素级的绘制控制
- 良好的性能表现
- 广泛的浏览器支持
- 丰富的绘制 API

Canvas 适用于各种场景，包括数据可视化、游戏开发、图像处理、交互应用等。通过不断学习和实践，可以掌握 Canvas 的各种高级特性，创建出更加复杂和精美的效果。