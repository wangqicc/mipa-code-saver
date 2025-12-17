/**
 * 雪花样式库 - 提供多种雪花绘制函数
 * 支持在任何Canvas上下文和坐标系中使用
 */

(function() {
  // 创建雪花样式库对象
  const SnowflakeStyles = {
    /**
     * 设置绘制样式
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     */
    setDrawingStyle(ctx, color = '#ffffff', lineWidth = 2.0) {
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
    },

    /**
     * 雪花样式1：最外层中等长度，中间最长，内部分支最短且角度不同，所有线条无交叉
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} x - 中心点X坐标
     * @param {number} y - 中心点Y坐标
     * @param {number} size - 雪花大小（像素）
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     */
    drawStyle1(ctx, x, y, size, color = '#ffffff', lineWidth = 4.5) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 85, size / 85);

      this.setDrawingStyle(ctx, color, lineWidth);

      // 绘制中心圆
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      // 定义6个主分支角度
      const angles = [0, Math.PI/3, 2*Math.PI/3, Math.PI, 4*Math.PI/3, 5*Math.PI/3];

      // 绘制6个主分支
      angles.forEach(angle => {
        // 主分支
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(85 * Math.cos(angle), 85 * Math.sin(angle));
        ctx.stroke();

        // 第一组分支：内部，角度不同（45度）
        const innerX = 20 * Math.cos(angle);
        const innerY = 20 * Math.sin(angle);

        // 左侧分支（角度+45度）
        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(innerX + 20 * Math.cos(angle + Math.PI/4), innerY + 20 * Math.sin(angle + Math.PI/4));
        ctx.stroke();

        // 右侧分支（角度-45度）
        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(innerX + 20 * Math.cos(angle - Math.PI/4), innerY + 20 * Math.sin(angle - Math.PI/4));
        ctx.stroke();

        // 第二组分支：中间，最长，角度60度
        const middleX = 45 * Math.cos(angle);
        const middleY = 45 * Math.sin(angle);

        // 左侧分支（角度+60度）
        ctx.beginPath();
        ctx.moveTo(middleX, middleY);
        ctx.lineTo(middleX + 30 * Math.cos(angle + Math.PI/3), middleY + 30 * Math.sin(angle + Math.PI/3));
        ctx.stroke();

        // 右侧分支（角度-60度）
        ctx.beginPath();
        ctx.moveTo(middleX, middleY);
        ctx.lineTo(middleX + 30 * Math.cos(angle - Math.PI/3), middleY + 30 * Math.sin(angle - Math.PI/3));
        ctx.stroke();

        // 第三组分支：最外层，中等长度，角度60度
        const outerX = 70 * Math.cos(angle);
        const outerY = 70 * Math.sin(angle);

        // 左侧分支（角度+60度）
        ctx.beginPath();
        ctx.moveTo(outerX, outerY);
        ctx.lineTo(outerX + 20 * Math.cos(angle + Math.PI/3), outerY + 20 * Math.sin(angle + Math.PI/3));
        ctx.stroke();

        // 右侧分支（角度-60度）
        ctx.beginPath();
        ctx.moveTo(outerX, outerY);
        ctx.lineTo(outerX + 20 * Math.cos(angle - Math.PI/3), outerY + 20 * Math.sin(angle - Math.PI/3));
        ctx.stroke();
      });

      ctx.restore();
    },

    /**
     * 雪花样式2：6个主分支，每个主分支有3组侧分支，所有侧分支角度均为60度
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} x - 中心点X坐标
     * @param {number} y - 中心点Y坐标
     * @param {number} size - 雪花大小（像素）
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     */
    drawStyle2(ctx, x, y, size, color = '#ffffff', lineWidth = 4.5) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 85, size / 85);

      this.setDrawingStyle(ctx, color, lineWidth);

      // 绘制中心圆
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // 定义6个主分支角度
      const angles = [0, Math.PI/3, 2*Math.PI/3, Math.PI, 4*Math.PI/3, 5*Math.PI/3];

      // 绘制6个主分支
      angles.forEach(angle => {
        // 主分支
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(85 * Math.cos(angle), 85 * Math.sin(angle));
        ctx.stroke();

        // 第一组分支：距离中心25，长度12，角度60度（靠近中心，较短）
        const firstX = 25 * Math.cos(angle);
        const firstY = 25 * Math.sin(angle);

        // 左侧分支（角度+60度）
        ctx.beginPath();
        ctx.moveTo(firstX, firstY);
        ctx.lineTo(firstX + 12 * Math.cos(angle + Math.PI/3), firstY + 12 * Math.sin(angle + Math.PI/3));
        ctx.stroke();

        // 右侧分支（角度-60度）
        ctx.beginPath();
        ctx.moveTo(firstX, firstY);
        ctx.lineTo(firstX + 12 * Math.cos(angle - Math.PI/3), firstY + 12 * Math.sin(angle - Math.PI/3));
        ctx.stroke();

        // 第二组分支：距离中心50，长度18，角度60度（中间，中等长度）
        const secondX = 50 * Math.cos(angle);
        const secondY = 50 * Math.sin(angle);

        // 左侧分支（角度+60度）
        ctx.beginPath();
        ctx.moveTo(secondX, secondY);
        ctx.lineTo(secondX + 18 * Math.cos(angle + Math.PI/3), secondY + 18 * Math.sin(angle + Math.PI/3));
        ctx.stroke();

        // 右侧分支（角度-60度）
        ctx.beginPath();
        ctx.moveTo(secondX, secondY);
        ctx.lineTo(secondX + 18 * Math.cos(angle - Math.PI/3), secondY + 18 * Math.sin(angle - Math.PI/3));
        ctx.stroke();

        // 第三组分支：距离中心70，长度18，角度60度（靠近末端，中等长度）
        const thirdX = 70 * Math.cos(angle);
        const thirdY = 70 * Math.sin(angle);

        // 左侧分支（角度+60度）
        ctx.beginPath();
        ctx.moveTo(thirdX, thirdY);
        ctx.lineTo(thirdX + 18 * Math.cos(angle + Math.PI/3), thirdY + 18 * Math.sin(angle + Math.PI/3));
        ctx.stroke();

        // 右侧分支（角度-60度）
        ctx.beginPath();
        ctx.moveTo(thirdX, thirdY);
        ctx.lineTo(thirdX + 18 * Math.cos(angle - Math.PI/3), thirdY + 18 * Math.sin(angle - Math.PI/3));
        ctx.stroke();
      });

      ctx.restore();
    },

    /**
     * 雪花样式3：6个主分支，中间是六角星，每个分支末端有圆形装饰
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} x - 中心点X坐标
     * @param {number} y - 中心点Y坐标
     * @param {number} size - 雪花大小（像素）
     * @param {string} color - 雪花颜色
     * @param {number} lineWidth - 线条宽度
     */
    drawStyle3(ctx, x, y, size, color = '#ffffff', lineWidth = 4.5) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 100, size / 100);

      this.setDrawingStyle(ctx, color, lineWidth);

      // 绘制中心六角星
      this._drawHexagonStar(ctx, 32, color);

      // 绘制6个主分支
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3; // 6个分支，每个分支间隔60度

        // 绘制主分支
        this._drawMainBranch(ctx, angle, color);

        // 绘制分支上的子分支
        this._drawSubBranches(ctx, angle, color);

        // 绘制分支末端的圆形装饰
        this._drawEndCircle(ctx, angle, color);
      }

      ctx.restore();
    },

    /**
     * 绘制中心六角星
     * @private
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} size - 六角星大小
     * @param {string} color - 颜色
     */
    _drawHexagonStar(ctx, size, color) {
      ctx.beginPath();

      for (let i = 0; i < 12; i++) {
        const radius = i % 2 === 1 ? size : size * 0.36;
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
     * 绘制主分支
     * @private
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} angle - 分支角度
     * @param {string} color - 颜色
     */
    _drawMainBranch(ctx, angle, color) {
      // 主分支长度
      const mainBranchLength = 95;

      // 绘制主分支
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(mainBranchLength * Math.cos(angle), mainBranchLength * Math.sin(angle));
      ctx.stroke();
    },

    /**
     * 绘制分支上的子分支
     * @private
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} angle - 分支角度
     * @param {string} color - 颜色
     */
    _drawSubBranches(ctx, angle, color) {
      // 定义子分支的位置和长度（与图像完全匹配）
      const subBranchPositions = [25, 45, 65]; // 距离中心的距离
      const subBranchLengths = [16, 28, 16]; // 子分支长度

      // 绘制每个位置的子分支
      subBranchPositions.forEach((position, index) => {
        const length = subBranchLengths[index];
        const x = position * Math.cos(angle);
        const y = position * Math.sin(angle);

        // 绘制左侧子分支（角度+60度）
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length * Math.cos(angle + Math.PI / 4), y + length * Math.sin(angle + Math.PI / 4));
        ctx.stroke();

        // 绘制右侧子分支（角度-60度）
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length * Math.cos(angle - Math.PI / 4), y + length * Math.sin(angle - Math.PI / 4));
        ctx.stroke();
      });
    },

    /**
     * 绘制分支末端的圆形装饰
     * @private
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} angle - 分支角度
     * @param {string} color - 颜色
     */
    _drawEndCircle(ctx, angle, color) {
      // 圆形装饰的位置和大小
      const endCircleDistance = 95;
      const endCircleRadius = 8;

      // 计算圆形装饰的坐标
      const x = endCircleDistance * Math.cos(angle);
      const y = endCircleDistance * Math.sin(angle);

      // 绘制圆形装饰
      ctx.beginPath();
      ctx.arc(x, y, endCircleRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 导出到全局作用域
  window.SnowflakeStyles = SnowflakeStyles;
})();
