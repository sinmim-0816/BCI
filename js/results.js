(() => {
  const app = document.querySelector(".content");
  const page = document.querySelector(".page");

  const payload = readPayload();
  if (!payload) {
    window.location.replace("index.html");
    return;
  }

  document.title = `${payload.fullName}'s Assessment Results`;
  page.classList.add("is-results");
  renderResults(payload);
  attachHandlers();
  animateResults(payload);

  function readPayload() {
    try {
      const raw = sessionStorage.getItem("bci-results-payload");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function renderResults(results) {
    const fullName = results.fullName || "Your";
    const completionDate = results.completionDate || new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    app.innerHTML = `
      <div class="results-shell">
        <section class="results-hero">
          <div class="results-hero-inner">
            <h1>${escapeHtml(fullName)}'s Assessment Results</h1>
            <p>Completed ${escapeHtml(completionDate)}</p>
          </div>
        </section>

        <div class="results-grid">
          <section class="results-card score-card">
            <div class="score-ring" data-score-target="${results.overallScore}" style="--score:0">
              <div class="score-ring-inner">
                <div class="score-number" data-score-number>0</div>
                <div class="score-denominator">/ 100</div>
              </div>
            </div>
            <div class="score-pill">${escapeHtml(results.riskLabel)}</div>
            <div class="score-range">${escapeHtml(results.riskRange)}</div>
            <div class="score-caption">BCI Assessment</div>
          </section>

          <section class="results-card radar-card">
            <h2>Performance by Category</h2>
            <div class="radar-wrap">
              ${buildRadarChart(results.categories)}
            </div>
          </section>
        </div>

        <section class="results-card breakdown-card">
          <h2>Category Breakdown</h2>
          <div class="breakdown-list">
            ${results.categories.map((category) => `
              <div class="breakdown-item">
                <div class="breakdown-head">
                  <span>${escapeHtml(category.label)}</span>
                  <strong style="color:${category.color}">${category.percent}%</strong>
                </div>
                <div class="breakdown-bar"><span style="--target-width:${category.percent}%"></span></div>
                <div class="breakdown-foot">${category.points.toFixed(1)} / 20 points · Contributes ${category.points.toFixed(1)} / 20 to overall score</div>
              </div>
            `).join("")}
          </div>
        </section>

        <div class="results-grid results-grid-bottom">
          <section class="results-card insight-card">
            <h2><i class="fa-solid fa-circle-check" aria-hidden="true"></i>Strengths</h2>
            <div class="insight-list insight-list-success">
              ${results.strengths.map((item) => `
                <div class="insight-item">
                  <div class="insight-title">${escapeHtml(item.label)}</div>
                  <div class="insight-sub">${item.percent}% — Well managed</div>
                </div>
              `).join("")}
            </div>
          </section>

          <section class="results-card insight-card">
            <h2><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>Areas for Improvement</h2>
            <div class="insight-list insight-list-warning">
              ${results.improvements.map((item) => `
                <div class="insight-item insight-item-warning">
                  <div class="insight-title">${escapeHtml(item.label)}</div>
                  <div class="insight-sub">${item.percent}% — Requires attention</div>
                </div>
              `).join("")}
            </div>
          </section>
        </div>

        <section class="results-card actions-card">
          <h2><i class="fa-solid fa-arrow-trend-up" aria-hidden="true"></i>Top 5 Priority Actions</h2>
          <div class="action-list">
            ${results.actions.map((item, index) => `
              <div class="action-item">
                <div class="action-index">${index + 1}</div>
                <div class="action-copy">
                  <div class="action-title">${escapeHtml(item.title)}</div>
                  <div class="action-sub">${escapeHtml(item.category)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="results-card recommend-card">
          <h2><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>AI-Powered Personalised Recommendations</h2>
          <p>AI recommendations are generated automatically when you complete the full assessment with your contact details.</p>
        </section>

        <div class="results-footer">
          <div class="results-actions">
            <button class="results-download" type="button"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i><span>Download PDF Report</span></button>
            <button class="results-retake" type="button"><i class="fa-solid fa-arrow-rotate-right" aria-hidden="true"></i><span>Retake Assessment</span></button>
          </div>
          <p class="results-disclaimer">For professional advice tailored to your situation, consult a qualified legal, financial, or business advisor.</p>
          <div class="results-completed">Completed ${escapeHtml(completionDate)}</div>
        </div>
      </div>
    `;

    scrollToTop();
  }

  function buildRadarChart(categories) {
    const size = 360;
    const center = size / 2;
    const radius = 112;
    const angleOffset = -Math.PI / 2;
    const points = categories.map((category, index) => {
      const angle = angleOffset + (Math.PI * 2 * index) / categories.length;
      const distance = radius * (category.percent / 100);
      const x = center + Math.cos(angle) * distance;
      const y = center + Math.sin(angle) * distance;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

    const labelPositions = categories.map((category, index) => {
      const angle = angleOffset + (Math.PI * 2 * index) / categories.length;
      const distance = radius + 48;
      const x = center + Math.cos(angle) * distance;
      const y = center + Math.sin(angle) * distance;
      return { x, y, label: category.label };
    });

    return `
      <svg class="radar-chart" viewBox="0 0 ${size} ${size}" aria-label="Performance by Category chart" role="img">
        <g class="radar-grid">
          <polygon points="${buildRadarPolygonPoints(0.25)}"></polygon>
          <polygon points="${buildRadarPolygonPoints(0.50)}"></polygon>
          <polygon points="${buildRadarPolygonPoints(0.75)}"></polygon>
          <polygon points="${buildRadarPolygonPoints(1)}"></polygon>
          ${categories.map((_, index) => {
            const angle = angleOffset + (Math.PI * 2 * index) / categories.length;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            return `<line x1="${center}" y1="${center}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line>`;
          }).join("")}
        </g>
        <polygon class="radar-fill" points="${points}"></polygon>
        <polygon class="radar-stroke" points="${points}"></polygon>
        ${labelPositions.map((item) => `
          <text x="${item.x.toFixed(1)}" y="${item.y.toFixed(1)}">${escapeHtml(item.label)}</text>
        `).join("")}
      </svg>
    `;

    function buildRadarPolygonPoints(scale) {
      return categories.map((_, index) => {
        const angle = angleOffset + (Math.PI * 2 * index) / categories.length;
        const x = center + Math.cos(angle) * radius * scale;
        const y = center + Math.sin(angle) * radius * scale;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");
    }
  }

  function animateResults(results) {
    const shell = app.querySelector(".results-shell");
    const scoreRing = app.querySelector(".score-ring");
    const scoreNumber = app.querySelector("[data-score-number]");

    if (!shell || !scoreRing || !scoreNumber) {
      return;
    }

    const targetScore = Number(results.overallScore) || 0;
    const duration = 1100;
    const start = performance.now();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        shell.classList.add("is-animating");
      });
    });

    const tick = (now) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const value = targetScore * eased;

      scoreRing.style.setProperty("--score", value.toFixed(2));
      scoreNumber.textContent = Math.round(value);

      if (elapsed < 1) {
        requestAnimationFrame(tick);
      } else {
        scoreRing.style.setProperty("--score", String(targetScore));
        scoreNumber.textContent = String(targetScore);
      }
    };

    requestAnimationFrame(tick);
  }

  function attachHandlers() {
    const downloadButton = app.querySelector(".results-download");
    const retakeButton = app.querySelector(".results-retake");

    if (downloadButton) {
      downloadButton.addEventListener("click", () => window.print());
    }

    if (retakeButton) {
      retakeButton.addEventListener("click", () => {
        sessionStorage.removeItem("bci-results-payload");
        window.location.href = "index.html";
      });
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
