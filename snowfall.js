(function() {
  // 默认配置
  const defaultConfig = {
    count: 92,
    sizeRange: [8, 16],
    speedRange: [1, 2],
    color: '#ffffff',
    opacity: 0.8,
    lineWidth: 9.2, // 默认分支宽度，与snowflake-styles.js中的默认值保持一致
    shapes: ['style1', 'style2', 'style3'] // 支持多种雪花样式：style1、style2和style3
  }

  // 合并用户配置和默认配置
  const config = Object.assign({}, defaultConfig, window.SnowfallConfig);

  let canvas, ctx;
  let snowflakes = [];
  let animationId;
  let isInitialized = false;
  let lastTime = 0;
  const targetFPS = 45;
  const frameInterval = 1000 / targetFPS;

  /**
   * 检查浏览器是否支持Canvas API
   * @returns {boolean} 是否支持
   */
  function isCanvasSupported() {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }

  /**
   * 等待DOM加载完成后初始化
   */
  function waitForDOM() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  /**
   * 初始化雪花效果
   * 包括创建Canvas、生成雪花、启动动画和事件监听
   */
  function init() {
    if (isInitialized) return;
    if (!isCanvasSupported()) {
      console.warn('Canvas is not supported, snowfall effect will not be rendered.');
      return;
    }
    // 初始化SnowflakeStyles库
    if (!initSnowflakeStyles()) {
      return;
    }
    createCanvas();
    generateSnowflakes();
    startAnimation();
    addEventListeners();
    initBatteryMonitoring();
    isInitialized = true;
  }

  /**
   * 创建并配置Canvas元素
   */
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

  /**
   * 调整Canvas尺寸以适应窗口大小
   */
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /**
   * 根据配置生成雪花对象数组
   */
  function generateSnowflakes() {
    snowflakes = [];

    for (let i = 0; i < config.count; i++) {
      // 随机选择一个形状
      const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];

      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // 取整大小以提高缓存命中率
        size: Math.floor(Math.random() * (config.sizeRange[1] - config.sizeRange[0]) + config.sizeRange[0]),
        speed: Math.random() * (config.speedRange[1] - config.speedRange[0]) + config.speedRange[0],
        opacity: Math.random() * config.opacity,
        drift: Math.random() * 0.5 - 0.25,
        shape: shape
      });
    }
  }

  // 存储SnowflakeStyles引用，避免每次绘制都访问window
  let snowflakeStyles = null;

  /**
   * 检查并初始化SnowflakeStyles库
   * @returns {boolean} 是否初始化成功
   */
  function initSnowflakeStyles() {
    if (!window.SnowflakeStyles) {
      console.error('SnowflakeStyles library not loaded! Please include snowflake-styles.js before snowfall.js.');
      return false;
    }
    snowflakeStyles = window.SnowflakeStyles;
    // 清理缓存，确保新的尺寸计算生效
    snowflakeStyles.clearCache();
    return true;
  }

  /**
   * 清除画布并绘制所有雪花
   */
  function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!snowflakeStyles) return;
    // 预提取配置属性，避免在循环中重复访问
    const color = config.color;
    const lineWidth = config.lineWidth;

    for (let i = 0, len = snowflakes.length; i < len; i++) {
      const snowflake = snowflakes[i];
      // 直接调用样式库绘制，利用其内部的缓存机制
      switch (snowflake.shape) {
        case 'style2':
          snowflakeStyles.drawStyle2(ctx, snowflake.x, snowflake.y, snowflake.size, color, lineWidth, snowflake.opacity);
          break;
        case 'style3':
          snowflakeStyles.drawStyle3(ctx, snowflake.x, snowflake.y, snowflake.size, color, lineWidth, snowflake.opacity);
          break;
        default:
          snowflakeStyles.drawStyle1(ctx, snowflake.x, snowflake.y, snowflake.size, color, lineWidth, snowflake.opacity);
          break;
      }
    }
  }

  /**
   * 更新所有雪花的位置（下落和漂移）
   * 处理边界检查和重置
   */
  function updateSnowflakes() {
    const width = canvas.width;
    const height = canvas.height;
    
    for (let i = 0, len = snowflakes.length; i < len; i++) {
      const snowflake = snowflakes[i];
      // 向下移动
      snowflake.y += snowflake.speed;
      // 左右漂移
      snowflake.x += snowflake.drift;
      // 如果雪花超出屏幕底部，重置到顶部
      if (snowflake.y > height) {
        snowflake.y = -snowflake.size;
        snowflake.x = Math.random() * width;
      }
      // 如果雪花超出屏幕左右，重置位置
      if (snowflake.x > width + snowflake.size) {
        snowflake.x = -snowflake.size;
      } else if (snowflake.x < -snowflake.size) {
        snowflake.x = width + snowflake.size;
      }
    }
  }

  /**
   * 动画循环函数
   * @param {number} timestamp - 当前时间戳
   */
  function animate(timestamp = 0) {
    // 帧率控制：只在达到目标帧间隔时更新
    if (timestamp - lastTime >= frameInterval) {
      updateSnowflakes();
      drawSnowflakes();
      lastTime = timestamp;
    }
    animationId = requestAnimationFrame(animate);
  }

  /**
   * 启动动画循环
   */
  function startAnimation() {
    animationId = requestAnimationFrame(animate);
  }

  /**
   * 停止动画循环
   */
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  /**
   * 防抖函数
   * @param {Function} func - 需要防抖的函数
   * @param {number} wait - 等待时间（毫秒）
   * @returns {Function} 防抖后的函数
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 防抖处理后的resize函数
  const debouncedResizeCanvas = debounce(resizeCanvas, 200);

  /**
   * 处理页面可见性变化
   * 页面隐藏时停止动画，显示时恢复动画
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }

  /**
   * 处理电池状态变化
   * 低电量模式下减少雪花数量以节省电量
   * @param {BatteryManager} battery - 电池管理器对象
   */
  function handleBatteryStatus(battery) {
    // 低电量时（≤20%）减少雪花数量和简化动画
    if (battery.level <= 0.2 && battery.charging === false) {
      if (config.count > 20) {
        config.count = 20;
        generateSnowflakes();
      }
    } else {
      // 恢复正常雪花数量
      if (config.count !== defaultConfig.count) {
        config.count = defaultConfig.count;
        generateSnowflakes();
      }
    }
  }

  /**
   * 初始化电池状态监听
   * 仅在浏览器支持 Battery Status API 时启用
   */
  function initBatteryMonitoring() {
    if ('getBattery' in navigator || ('battery' in navigator && navigator.battery)) {
      const batteryPromise = navigator.getBattery ? navigator.getBattery() : Promise.resolve(navigator.battery);
      batteryPromise.then(battery => {
        handleBatteryStatus(battery);
        battery.addEventListener('levelchange', () => handleBatteryStatus(battery));
        battery.addEventListener('chargingchange', () => handleBatteryStatus(battery));
      });
    }
  }

  /**
   * 添加全局事件监听器
   * 包括窗口大小调整和页面可见性变化
   */
  function addEventListeners() {
    window.addEventListener('resize', debouncedResizeCanvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  /**
   * 移除全局事件监听器
   */
  function removeEventListeners() {
    window.removeEventListener('resize', debouncedResizeCanvas);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }

  /**
   * 销毁雪花效果并清理资源
   * 停止动画、移除事件监听、删除Canvas元素、清理缓存
   */
  function destroy() {
    if (!isInitialized) return;

    stopAnimation();
    removeEventListeners();

    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }

    // 清理离屏Canvas缓存，避免内存泄漏
    if (snowflakeStyles) {
      snowflakeStyles.clearCache();
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