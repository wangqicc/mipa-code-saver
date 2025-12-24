/**
 * 雪花样式库 - 提供多种雪花绘制函数
 * 支持在任何Canvas上下文和坐标系中使用
 */
(function() {
  // 创建雪花样式库对象
  const SnowflakeStyles = {
    // 离屏Canvas缓存，用于预渲染雪花图形
    _offscreenCache: {},
    // 缓存配置
    _cacheConfig: {
      maxEntries: 50, // 最大缓存条目数，防止内存泄漏
      checkInterval: 30000 // 缓存检查间隔（毫秒）
    },
    // 上一次清理时间
    _lastCleanupTime: Date.now(),

    /**
     * 清理离屏Canvas缓存
     */
    clearCache() {
      this._offscreenCache = {};
      this._lastCleanupTime = Date.now();
    },

    /**
     * 检查并清理旧缓存，防止内存泄漏
     * @private
     */
    _checkAndCleanCache() {
      const now = Date.now();
      const cacheEntries = Object.entries(this._offscreenCache);
      // 检查是否需要清理
      if (cacheEntries.length > this._cacheConfig.maxEntries || now - this._lastCleanupTime > this._cacheConfig.checkInterval) {
        // 如果缓存条目超过限制，删除最旧的一半条目
        if (cacheEntries.length > this._cacheConfig.maxEntries) {
          // 简单实现：将缓存转换为数组，删除一半条目
          const entriesToRemove = cacheEntries.slice(0, Math.floor(cacheEntries.length / 2));
          entriesToRemove.forEach(([key]) => delete this._offscreenCache[key]);
        }
        this._lastCleanupTime = now;
      }
    },

    /**
     * 获取缓存键名
     * @private
     * @param {string} style - 雪花样式名称
     * @param {number} size - 雪花大小
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     * @returns {string} 缓存键名
     */
    _getCacheKey(style, size, color, lineWidth) {
      // 对size进行取整，防止浮点数导致缓存未命中
      const safeSize = Math.round(size * 10) / 10;
      return `${style}_${safeSize}_${color}_${lineWidth}`;
    },

    /**
     * 设置绘制样式
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     * @param {number} opacity - 透明度（0-1）
     */
    setDrawingStyle(ctx, color = '#ffffff', lineWidth = 2.0, opacity = 1.0) {
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
    },

    /**
     * 生成主分支角度数组
     * @private
     * @param {number} count - 分支数量
     * @returns {Array<number>} 角度数组
     */
    _generateBranchAngles(count) {
      const angles = [];
      for (let i = 0; i < count; i++) {
        angles.push(i * (2 * Math.PI / count));
      }
      return angles;
    },

    /**
     * 绘制单个主分支和侧分支（公共方法）
     * @private
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} angle - 分支角度
     * @param {number} mainBranchLength - 主分支长度
     * @param {Array<number>} subBranchPositions - 子分支距离中心的距离数组
     * @param {Array<number>} subBranchLengths - 子分支长度数组
     * @param {Array<number>} subBranchAngles - 子分支角度偏移数组
     */
    _drawBranch(ctx, angle, mainBranchLength, subBranchPositions, subBranchLengths, subBranchAngles) {
      // 绘制主分支
      ctx.moveTo(0, 0);
      ctx.lineTo(mainBranchLength * Math.cos(angle), mainBranchLength * Math.sin(angle));

      // 绘制每个位置的子分支
      subBranchPositions.forEach((position, index) => {
        const length = subBranchLengths[index];
        const subAngle = subBranchAngles[index];
        const x = position * Math.cos(angle);
        const y = position * Math.sin(angle);
        // 绘制左侧子分支
        ctx.moveTo(x, y);
        ctx.lineTo(x + length * Math.cos(angle + subAngle), y + length * Math.sin(angle + subAngle));
        // 绘制右侧子分支
        ctx.moveTo(x, y);
        ctx.lineTo(x + length * Math.cos(angle - subAngle), y + length * Math.sin(angle - subAngle));
      });
    },

    /**
     * 雪花样式1：最外层中等长度，中间最长，内部分支最短且角度不同，所有线条无交叉
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} x - 中心点X坐标
     * @param {number} y - 中心点Y坐标
     * @param {number} size - 雪花大小（像素）
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     * @param {number} opacity - 透明度（0-1）
     */
    drawStyle1(ctx, x, y, size, color = '#ffffff', lineWidth = 5.2, opacity = 1.0) {
      this._drawWithOffscreenCanvas(ctx, x, y, size, color, lineWidth, opacity, 'style1', (offscreenCtx) => {
        offscreenCtx.save();
        offscreenCtx.translate(offscreenCtx.canvas.width / 2, offscreenCtx.canvas.height / 2);
        offscreenCtx.scale(size / 85, size / 85);

        this.setDrawingStyle(offscreenCtx, color, lineWidth, 1.0);

        // 绘制中心圆
        offscreenCtx.beginPath();
        offscreenCtx.arc(0, 0, 12, 0, Math.PI * 2);
        offscreenCtx.fill();

        // 定义8个主分支角度，均匀分布（每个分支间隔45度）
        const angles = this._generateBranchAngles(8);

        // 样式1的分支参数
        const mainBranchLength = 85;
        const subBranchPositions = [24, 40, 60];
        const subBranchLengths = [16, 32, 16];
        const subBranchAngles = [Math.PI/4.5, Math.PI/4.5, Math.PI/4.5]; // 不同位置的子分支角度不同

        // 合并所有线条绘制，减少beginPath和stroke调用次数
        offscreenCtx.beginPath();
        angles.forEach(angle => {
          this._drawBranch(offscreenCtx, angle, mainBranchLength, subBranchPositions, subBranchLengths, subBranchAngles);
        });
        // 一次性绘制所有线条
        offscreenCtx.stroke();

        offscreenCtx.restore();
      });
    },

    /**
     * 雪花样式2：6个主分支，每个主分支有3组侧分支，所有侧分支角度均为60度
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} x - 中心点X坐标
     * @param {number} y - 中心点Y坐标
     * @param {number} size - 雪花大小（像素）
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     * @param {number} opacity - 透明度（0-1）
     */
    drawStyle2(ctx, x, y, size, color = '#ffffff', lineWidth = 5.2, opacity = 1.0) {
      this._drawWithOffscreenCanvas(ctx, x, y, size, color, lineWidth, opacity, 'style2', (offscreenCtx) => {
        offscreenCtx.save();
        offscreenCtx.translate(offscreenCtx.canvas.width / 2, offscreenCtx.canvas.height / 2);
        offscreenCtx.scale(size / 85, size / 85);

        this.setDrawingStyle(offscreenCtx, color, lineWidth, 1.0);

        // 绘制中心圆
        offscreenCtx.beginPath();
        offscreenCtx.arc(0, 0, 24, 0, Math.PI * 2);
        offscreenCtx.fill();

        // 定义8个主分支角度，均匀分布（每个分支间隔45度）
        const angles = this._generateBranchAngles(8);

        // 样式2的分支参数
        const mainBranchLength = 85;
        const subBranchPositions = [30, 45, 60];
        const subBranchLengths = [16, 20, 24];
        const subBranchAngles = [Math.PI/4, Math.PI/4, Math.PI/4]; // 所有子分支角度均为60度

        // 合并所有线条绘制，减少beginPath和stroke调用次数
        offscreenCtx.beginPath();
        angles.forEach(angle => {
          this._drawBranch(offscreenCtx, angle, mainBranchLength, subBranchPositions, subBranchLengths, subBranchAngles);
        });
        // 一次性绘制所有线条
        offscreenCtx.stroke();

        offscreenCtx.restore();
      });
    },

    /**
     * 雪花样式3：6个主分支，中间是六角星，每个分支末端有圆形装饰
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} x - 中心点X坐标
     * @param {number} y - 中心点Y坐标
     * @param {number} size - 雪花大小（像素）
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     * @param {number} opacity - 透明度（0-1）
     */
    drawStyle3(ctx, x, y, size, color = '#ffffff', lineWidth = 5.2, opacity = 1.0) {
      this._drawWithOffscreenCanvas(ctx, x, y, size, color, lineWidth, opacity, 'style3', (offscreenCtx) => {
        offscreenCtx.save();
        offscreenCtx.translate(offscreenCtx.canvas.width / 2, offscreenCtx.canvas.height / 2);
        offscreenCtx.scale(size / 100, size / 100);

        this.setDrawingStyle(offscreenCtx, color, lineWidth, 1.0);

        // 绘制中心六角星
        this._drawHexagonStar(offscreenCtx, 36);

        // 样式3的分支参数
        const angles = this._generateBranchAngles(6);
        const mainBranchLength = 95;
        const subBranchPositions = [28, 48, 68];
        const subBranchLengths = [18, 32, 18];
        const subBranchAngles = [Math.PI/4, Math.PI/4, Math.PI/4]; // 所有子分支角度均为45度

        // 合并所有线条绘制，减少beginPath和stroke调用次数
        offscreenCtx.beginPath();
        angles.forEach(angle => {
          this._drawBranch(offscreenCtx, angle, mainBranchLength, subBranchPositions, subBranchLengths, subBranchAngles);
        });
        // 一次性绘制所有线条
        offscreenCtx.stroke();

        // 合并所有末端圆形绘制，减少beginPath和fill调用次数
        offscreenCtx.beginPath();
        const endCircleAngles = this._generateBranchAngles(6);
        endCircleAngles.forEach(angle => {
          this._drawEndCircle(offscreenCtx, angle);
        });
        // 一次性绘制所有圆形装饰
        offscreenCtx.fill();

        offscreenCtx.restore();
      });
    },

    /**
     * 绘制中心六角星
     * @private
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} size - 六角星大小
     */
    _drawHexagonStar(ctx, size) {
      ctx.beginPath();

      for (let i = 0; i < 12; i++) {
        const radius = i % 2 === 1 ? size : size * 0.45;
        const angle = i * Math.PI / 6;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.fill();
    },

    /**
     * 绘制分支末端的圆形装饰
     * @private
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} angle - 分支角度
     */
    _drawEndCircle(ctx, angle) {
      // 圆形装饰的位置和大小
      const endCircleDistance = 95;
      const endCircleRadius = 8;

      // 计算圆形装饰的坐标
      const x = endCircleDistance * Math.cos(angle);
      const y = endCircleDistance * Math.sin(angle);

      // 绘制圆形装饰（仅添加到路径，不立即绘制）
      ctx.moveTo(x + endCircleRadius, y); // 移动到圆形右侧，避免绘制线条
      ctx.arc(x, y, endCircleRadius, 0, Math.PI * 2);
    },

    /**
     * 使用离屏Canvas绘制雪花（公共方法）
     * @private
     * @param {CanvasRenderingContext2D} ctx - 主Canvas上下文
     * @param {number} x - 中心点X坐标
     * @param {number} y - 中心点Y坐标
     * @param {number} size - 雪花大小
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     * @param {number} opacity - 透明度
     * @param {string} styleName - 样式名称
     * @param {Function} drawCallback - 实际绘制逻辑回调
     */
    _drawWithOffscreenCanvas(ctx, x, y, size, color, lineWidth, opacity, styleName, drawCallback) {
      // 检查并清理旧缓存
      this._checkAndCleanCache();
      // 生成缓存键
      const cacheKey = this._getCacheKey(styleName, size, color, lineWidth);
      // 检查缓存是否存在
      let offscreenCanvas = this._offscreenCache[cacheKey];
      if (!offscreenCanvas) {
        // 创建离屏Canvas
        offscreenCanvas = document.createElement('canvas');
        // 根据样式计算合适的基准尺寸、最大半径系数和缩放系数
        // 最大半径系数：考虑雪花的实际最大尺寸（包括主分支和装饰）
        const styleConfigs = {
          'style1': { baseSize: 85, maxRadiusFactor: 1.05 }, // 主分支长度85
          'style2': { baseSize: 85, maxRadiusFactor: 1.05 }, // 主分支长度85
          'style3': { baseSize: 100, maxRadiusFactor: 1.08 } // 主分支长度95 + 末端圆形半径8
        };
        const config = styleConfigs[styleName] || { baseSize: 85, maxRadiusFactor: 1.05 };
        const scale = size / config.baseSize;
        // 计算精确的画布尺寸
        // 1. 计算雪花实际最大半径
        const actualMaxRadius = config.baseSize * config.maxRadiusFactor * scale;
        // 2. 添加线条宽度的影响
        // 3. 使用1.1的安全系数确保所有内容都能被绘制，避免裁剪
        const canvasSize = Math.ceil((actualMaxRadius + lineWidth) * 2 * 1.1);
        offscreenCanvas.width = canvasSize;
        offscreenCanvas.height = canvasSize;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        // 清空离屏Canvas
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        // 调用实际绘制逻辑
        drawCallback.call(this, offscreenCtx);
        // 缓存离屏Canvas
        this._offscreenCache[cacheKey] = offscreenCanvas;
      }

      // 在主Canvas上绘制预渲染的雪花，并应用透明度
      ctx.save();
      ctx.globalAlpha = opacity;
      // 计算绘制位置（居中绘制）
      const drawX = x - offscreenCanvas.width / 2;
      const drawY = y - offscreenCanvas.height / 2;
      // 绘制预渲染的雪花
      ctx.drawImage(offscreenCanvas, drawX, drawY);
      ctx.restore();
    }
  };

  // 导出到全局作用域
  window.SnowflakeStyles = SnowflakeStyles;
})();
