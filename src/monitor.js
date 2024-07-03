class Monitor {
  constructor() {
    this.metrics = {
      lcp: 0,
      loadTime: 0,
      fps: 0,
      memory: 0,
      cpu: 0,
    };
  }

  start() {
    this.calculateFPS();
    this.calculateMemoryUsage();
    this.calculateCpuUsage();
    this.observePerformance();
    setInterval(() => {
      this.updateMetrics();
    }, 200);
  }

  createMonitorElement() {
    const monitorElement = document.createElement("div");
    monitorElement.className = "performance-monitor";
    monitorElement.id = "performance-monitor";
    monitorElement.innerHTML = `
        <div><span>LCP:</span><span id="lcp">${this.metrics.lcp}</span></div>
        <div><span>Load Time:</span><span id="load-time">${this.metrics.loadTime}</span></div>
        <div><span>FPS:</span><span id="fps">${this.metrics.fps}</span></div>
        <div><span>内存:</span><span id="memory">${this.metrics.memory}</span></div>
        <div><span>cpu:</span><span id="cpu">${this.metrics.cpu}</span></div>
      `;
    document.body.appendChild(monitorElement);
  }

  updateMetrics() {
    if (document.getElementById("performance-monitor")) {
      document.getElementById("lcp").innerText = this.metrics.lcp;
      document.getElementById("load-time").innerText = this.metrics.loadTime;
      document.getElementById("fps").innerText = this.metrics.fps;
      document.getElementById("memory").innerText = this.metrics.memory;
      document.getElementById("cpu").innerText = this.metrics.cpu;
    } else {
      this.createMonitorElement();
      this.updateMetrics();
    }
  }

  observePerformance() {
    window.addEventListener("load", () => {
      new PerformanceObserver((entryList) => {
        const entries = window.performance.getEntriesByType("navigation");
        if (entries.length > 0) {
          const { duration, startTime } = entries[0];
          const loadTime = Math.round(duration - startTime);
          let LCP = Math.round(entryList.getEntries()[0].startTime);
          this.metrics.lcp = LCP;
          this.metrics.loadTime = loadTime;
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });
  }

  calculateFPS() {
    let last = Date.now();
    let ticks = 0;
    function rafLoop() {
      ticks += 1;
      //每30帧统计一次帧率
      if (ticks >= 30) {
        const now = Date.now();
        const diff = now - last;
        const fps = Math.round(1000 / (diff / ticks));
        last = now;
        ticks = 0;
        renderFps(fps); // 刷新帧率数值
      }
      requestAnimationFrame(rafLoop);
    }

    //显示帧率数值到界面上
    const renderFps = (fps) => {
      this.metrics.fps = fps;
    };

    //开始执行
    rafLoop();
  }
  calculateMemoryUsage() {
    const logMemoryUsage = () => {
      if (performance.memory) {
        let memory = performance.memory;
        this.metrics.memory =
          (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + "MB";
      } else {
        console.log("Memory API not supported in this browser.");
      }
    };

    setInterval(logMemoryUsage, 1000); // 每1秒记录一次内存使用情况
  }

  calculateCpuUsage() {
    let lastCpuMeasureTime = performance.now();
    let cpuUsage = 0;

    const calculateCpuUsage = () => {
      let startTime = performance.now();
      // 模拟一些计算密集型任务
      for (let i = 0; i < 1000000; i++) {}
      let endTime = performance.now();

      let duration = endTime - startTime;
      let interval = endTime - lastCpuMeasureTime;
      cpuUsage = (duration / interval) * 100;

      this.metrics.cpu = cpuUsage.toFixed(2) + "%";
      lastCpuMeasureTime = endTime;

      setTimeout(calculateCpuUsage, 1000); // 每秒计算一次CPU占用率
    };

    calculateCpuUsage();
  }
}

module.exports = Monitor;
