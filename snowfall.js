(function() {
  // 默认配置
  const defaultConfig = {
    count: 100,
    sizeRange: [8, 16],
    speedRange: [1, 2],
    color: '#ffffff',
    opacity: 0.8,
    lineWidth: 12, // 默认分支宽度，与snowflake-styles.js中的默认值保持一致
    shapes: ['style1', 'style2', 'style3'] // 支持多种雪花样式：style1（原来的样式）、style2（新的样式）和style3（第三种样式）
  }

  // 合并用户配置和默认配置
  const config = Object.assign({}, defaultConfig, window.SnowfallConfig);

  let canvas, ctx;
  let snowflakes = [];
  let animationId;
  let isInitialized = false;

  // 检查浏览器是否支持Canvas
  function isCanvasSupported() {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }

  // 等待DOM加载完成
  function waitForDOM() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // 初始化函数
  function init() {
    if (isInitialized) return;

    if (!isCanvasSupported()) {
      console.warn('Canvas is not supported, snowfall effect will not be rendered.');
      return;
    }

    createCanvas();
    generateSnowflakes();
    startAnimation();
    addEventListeners();

    isInitialized = true;
  }

  // 创建Canvas元素
  function createCanvas() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');

    // 设置Canvas为全屏
    resizeCanvas();

    // 设置样式
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';

    // 添加到body
    document.body.appendChild(canvas);
  }

  // 调整Canvas尺寸
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // 生成雪花
  function generateSnowflakes() {
    snowflakes = [];

    for (let i = 0; i < config.count; i++) {
      // 随机选择一个形状
      const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];

      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (config.sizeRange[1] - config.sizeRange[0]) + config.sizeRange[0],
        speed: Math.random() * (config.speedRange[1] - config.speedRange[0]) + config.speedRange[0],
        opacity: Math.random() * config.opacity,
        drift: Math.random() * 0.5 - 0.25,
        shape: shape
      });
    }
  }

  // 使用外部 SnowflakeStyles 库绘制雪花
  function ensureStylesLoaded() {
    if (!window.SnowflakeStyles) {
      console.error('SnowflakeStyles library not loaded! Please include snowflake-styles.js before snowfall.js.');
      return false;
    }
    return true;
  }

  // 绘制雪花
  function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!ensureStylesLoaded()) return;

    snowflakes.forEach(snowflake => {
      // 根据雪花的shape属性调用不同的绘制函数
      if (snowflake.shape === 'style2') {
        window.SnowflakeStyles.drawStyle2(ctx, snowflake.x, snowflake.y, snowflake.size, config.color, config.lineWidth, snowflake.opacity);
      } else if (snowflake.shape === 'style3') {
        window.SnowflakeStyles.drawStyle3(ctx, snowflake.x, snowflake.y, snowflake.size, config.color, config.lineWidth, snowflake.opacity);
      } else {
        window.SnowflakeStyles.drawStyle1(ctx, snowflake.x, snowflake.y, snowflake.size, config.color, config.lineWidth, snowflake.opacity);
      }
    });
  }

  // 更新雪花位置
  function updateSnowflakes() {
    snowflakes.forEach(snowflake => {
      // 向下移动
      snowflake.y += snowflake.speed;
      // 左右漂移
      snowflake.x += snowflake.drift;

      // 如果雪花超出屏幕底部，重置到顶部
      if (snowflake.y > canvas.height) {
        snowflake.y = -snowflake.size;
        snowflake.x = Math.random() * canvas.width;
      }

      // 如果雪花超出屏幕左右，重置位置
      if (snowflake.x > canvas.width + snowflake.size) {
        snowflake.x = -snowflake.size;
      } else if (snowflake.x < -snowflake.size) {
        snowflake.x = canvas.width + snowflake.size;
      }
    });
  }

  // 动画循环
  function animate() {
    updateSnowflakes();
    drawSnowflakes();
    animationId = requestAnimationFrame(animate);
  }

  // 启动动画
  function startAnimation() {
    animationId = requestAnimationFrame(animate);
  }

  // 停止动画
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // 添加事件监听器
  function addEventListeners() {
    window.addEventListener('resize', resizeCanvas);
  }

  // 移除事件监听器
  function removeEventListeners() {
    window.removeEventListener('resize', resizeCanvas);
  }

  // 销毁雪花效果
  function destroy() {
    if (!isInitialized) return;

    stopAnimation();
    removeEventListeners();

    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }

    snowflakes = [];
    isInitialized = false;
  }

  // 暴露销毁方法到全局
  window.Snowfall = {
    destroy
  };

  // 初始化
  waitForDOM();
})();