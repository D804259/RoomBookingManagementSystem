/**
 * Animated ability-estimate line chart drawn on HTML Canvas.
 * After every submitted answer the series is redrawn and the newest
 * point eases into place.
 */
(function (global) {
  let animationId = null;

  function drawChart(canvas, history, options = {}) {
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 320;
    const cssHeight = canvas.clientHeight || 180;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = { top: 18, right: 16, bottom: 28, left: 36 };
    const width = cssWidth - padding.left - padding.right;
    const height = cssHeight - padding.top - padding.bottom;
    const minY = -3;
    const maxY = 3;
    const points = history.length > 0 ? history : [0];

    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = "#f7f8fc";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    ctx.strokeStyle = "#e7eaf1";
    ctx.lineWidth = 1;
    ctx.font = "11px 'IBM Plex Sans', sans-serif";
    ctx.fillStyle = "#7a8499";

    for (let tick = minY; tick <= maxY; tick += 1.5) {
      const y = padding.top + ((maxY - tick) / (maxY - minY)) * height;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + width, y);
      ctx.stroke();
      ctx.fillText(tick.toFixed(1), 6, y + 4);
    }

    ctx.fillText("Ability θ", 6, 12);
    ctx.fillText("Question", cssWidth - 58, cssHeight - 8);

    if (points.length === 1) {
      const y = padding.top + ((maxY - points[0]) / (maxY - minY)) * height;
      ctx.beginPath();
      ctx.arc(padding.left, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#635bdb";
      ctx.fill();
      return;
    }

    const progress = options.progress === undefined ? 1 : options.progress;
    const lastIndex = points.length - 1;
    const mapped = points.map((value, index) => {
      const x = padding.left + (index / lastIndex) * width;
      const y = padding.top + ((maxY - value) / (maxY - minY)) * height;
      return { x, y, value };
    });

    if (progress < 1 && mapped.length >= 2) {
      const prev = mapped[mapped.length - 2];
      const last = mapped[mapped.length - 1];
      last.x = prev.x + (last.x - prev.x) * progress;
      last.y = prev.y + (last.y - prev.y) * progress;
    }

    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + height);
    gradient.addColorStop(0, "rgba(99, 91, 219, 0.2)");
    gradient.addColorStop(1, "rgba(99, 91, 219, 0.02)");

    ctx.beginPath();
    ctx.moveTo(mapped[0].x, padding.top + height);
    mapped.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.lineTo(mapped[mapped.length - 1].x, padding.top + height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    mapped.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = "#635bdb";
    ctx.lineWidth = 2.4;
    ctx.stroke();

    mapped.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = "#39366f";
      ctx.fill();
      ctx.strokeStyle = "#f7f8fc";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  function animateChart(canvas, history) {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    const start = performance.now();
    const duration = 420;

    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      drawChart(canvas, history, { progress: eased });
      if (progress < 1) {
        animationId = requestAnimationFrame(frame);
      }
    }

    animationId = requestAnimationFrame(frame);
  }

  global.AbilityChart = {
    drawChart,
    animateChart
  };
})(window);
