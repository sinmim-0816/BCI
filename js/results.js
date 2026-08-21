(() => {
  const app = document.querySelector(".content");
  const page = document.querySelector(".page");
  let radarChartInstance = null;
  const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbygZQv_903p-8O02toDHwdEHfbVk8tkNT_xzAE6_vMXAAE-2pRs7WzZvThAk7-ZsVPv/exec";

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
    const improvementItems = results.categories
      .filter((category) => category.percent < 80)
      .sort((a, b) => a.percent - b.percent)
      .slice(0, 2);
    const strengthItems = results.categories
      .filter((category) => category.percent >= 90)
      .sort((a, b) => b.percent - a.percent);
    const hasImprovements = improvementItems.length > 0;

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
              <div class="radar-chart" data-radar-chart></div>
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
              ${strengthItems.length ? strengthItems.map((item) => `
                <div class="insight-item">
                  <div class="insight-title">${escapeHtml(item.label)}</div>
                  <div class="insight-sub">${item.percent}% — Well managed</div>
                </div>
              `).join("") : `
                <p class="insight-message">No categories are currently above the 90% strength threshold.</p>
              `}
            </div>
          </section>

          <section class="results-card insight-card">
            <h2><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>${hasImprovements ? "Areas for Improvement" : "No Immediate Concerns"}</h2>
            ${hasImprovements ? `
              <div class="insight-list insight-list-warning">
                ${improvementItems.map((item) => `
                  <div class="insight-item insight-item-warning">
                    <div class="insight-title">${escapeHtml(item.label)}</div>
                    <div class="insight-sub">${item.percent}% — Requires attention</div>
                  </div>
                `).join("")}
              </div>
            ` : `
              <p class="insight-message">Your responses do not indicate any immediate improvement areas. That said, it is still good practice to review your continuity plan periodically.</p>
            `}
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

    renderPerformanceChart(results.categories);
    scrollToTop();
  }

  function renderPerformanceChart(categories) {
    const container = app.querySelector("[data-radar-chart]");
    if (!container) {
      return;
    }

    const values = categories.map((category) => category.percent);
    const labels = categories.map((category) => category.label);

    if (!window.echarts) {
      container.innerHTML = buildRadarChartFallback(categories);
      return;
    }

    if (radarChartInstance) {
      radarChartInstance.dispose();
      radarChartInstance = null;
    }

    radarChartInstance = echarts.init(container);
    radarChartInstance.setOption({
      animation: true,
      animationDuration: 1200,
      animationEasing: "cubicOut",
      tooltip: {
        trigger: "item",
        backgroundColor: "#ffffff",
        borderColor: "#dbe2eb",
        borderWidth: 1,
        textStyle: {
          color: "#1f2e45",
        },
        formatter: ({ name, value }) => {
          const rows = labels.map((label, index) => `<div style="display:flex;justify-content:space-between;gap:14px;margin:3px 0;"><span>${escapeHtml(label)}</span><strong>${Math.round(value[index])}%</strong></div>`).join("");
          return `<div style="min-width:210px"><div style="font-weight:700;margin-bottom:6px;">${escapeHtml(name)}</div>${rows}</div>`;
        },
      },
      radar: {
        center: ["50%", "52%"],
        radius: "58%",
        splitNumber: 4,
        shape: "polygon",
        axisName: {
          color: "#1f2e45",
          fontSize: 13,
          fontWeight: 500,
          padding: [2, 4],
        },
        indicator: categories.map((category) => ({
          name: category.label,
          max: 100,
        })),
        splitArea: {
          areaStyle: {
            color: ["rgba(15,52,101,0.02)", "rgba(15,52,101,0.05)"],
          },
        },
        splitLine: {
          lineStyle: {
            color: "#dbe2eb",
            width: 1.1,
          },
        },
        axisLine: {
          lineStyle: {
            color: "#dbe2eb",
          },
        },
      },
      series: [
        {
          type: "radar",
          symbol: "circle",
          symbolSize: 6,
          data: [
            {
              value: values,
              name: "Performance",
              areaStyle: {
                color: "rgba(21, 60, 114, 0.22)",
              },
              lineStyle: {
                color: "#153c72",
                width: 3,
              },
              itemStyle: {
                color: "#e0b14c",
                borderColor: "#153c72",
                borderWidth: 1,
              },
            },
          ],
        },
      ],
    });

    window.requestAnimationFrame(() => {
      radarChartInstance && radarChartInstance.resize();
    });
    window.addEventListener("resize", handleRadarResize, { passive: true });
  }

  function buildRadarChartFallback(categories) {
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

  function handleRadarResize() {
    if (radarChartInstance && typeof radarChartInstance.resize === "function") {
      radarChartInstance.resize();
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
      downloadButton.addEventListener("click", () => generatePdfReport(payload));
    }

    if (retakeButton) {
      retakeButton.addEventListener("click", () => {
        sessionStorage.removeItem("bci-results-payload");
        window.location.href = "index.html";
      });
    }
  }

  function submitResultsToSheet(payload) {
    const sheetPayload = payload.sheetSubmissionPayload;
    if (!sheetPayload || !SHEET_ENDPOINT) {
      return;
    }

    const storageKey = `bci-sheet-submitted:${sheetPayload.timestamp || payload.completionDate || payload.fullName || "result"}`;
    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    const body = JSON.stringify(sheetPayload);
    let sent = false;

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
      sent = navigator.sendBeacon(SHEET_ENDPOINT, blob);
    }

    if (!sent) {
      fetch(SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
        body,
      }).catch(() => {});
    }

    sessionStorage.setItem(storageKey, "1");
  }

  function generatePdfReport(results) {
    const jsPdfNamespace = window.jspdf || {};
    const JsPDF = jsPdfNamespace.jsPDF;

    if (!JsPDF) {
      window.alert("PDF export is not available right now. Please refresh and try again.");
      return;
    }

    const details = results.sheetSubmissionPayload || {};
    const fullName = details.full_name || results.fullName || "Your";
    const companyName = details.company_name || "";
    const positionTitle = details.position_title || "";
    const emailAddress = details.email_address || "";
    const completionDate = details.completion_date || results.completionDate || "";
    const filename = `BCI-Report-${slugify(fullName)}-${formatDateStamp(new Date())}.pdf`;

    const doc = new JsPDF({ orientation: "p", unit: "pt", format: "a4", compress: true });
    doc.setProperties({
      title: `${fullName} BCI Report`,
      subject: "Business Continuity Index report",
      author: "Business Continuity Index",
      creator: "Business Continuity Index",
    });

    drawCoverPage(doc, {
      fullName,
      companyName,
      positionTitle,
      emailAddress,
      completionDate,
      overallScore: results.overallScore,
      riskLabel: results.riskLabel,
      riskRange: results.riskRange,
    });

    doc.addPage();
    drawSummaryPage(doc, results, fullName);

    doc.addPage();
    drawRiskAnalysisPage(doc, results);

    doc.addPage();
    drawRecommendationsPage(doc, results);

    doc.addPage();
    drawDisclaimerPage(doc);

    doc.save(filename);
  }

  function drawCoverPage(doc, info) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const navy = [13, 28, 66];
    const navy2 = [17, 38, 82];
    const gold = [215, 175, 45];
    const lightText = [175, 194, 225];

    doc.setFillColor(...gold);
    doc.rect(0, 0, pageWidth, 20, "F");
    doc.setFillColor(...navy);
    doc.rect(0, 20, pageWidth, pageHeight - 40, "F");
    doc.setFillColor(...gold);
    doc.rect(0, pageHeight - 20, pageWidth, 20, "F");

    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("BCI™", 54, 92);

    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.setFontSize(27);
    doc.text(doc.splitTextToSize("Business Continuity Index™", 260), 54, 324, { lineHeightFactor: 1.02 });

    doc.setDrawColor(...gold);
    doc.setLineWidth(5);
    doc.line(54, 386, 348, 386);

    doc.setTextColor(...lightText);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text("Executive Assessment Report", 54, 438);

    const circleX = 473;
    const circleY = 356;
    doc.setFillColor(...navy2);
    doc.circle(circleX, circleY, 100, "F");
    doc.setFillColor(...gold);
    doc.circle(circleX, circleY, 82, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(31);
    doc.text(String(Math.round(Number(info.overallScore) || 0)), circleX, circleY + 15, { align: "center" });
    doc.setFontSize(11);
    doc.text("/ 100", circleX, circleY + 42, { align: "center" });

    doc.setTextColor(...gold);
    doc.setFontSize(12);
    doc.text(info.riskLabel || "", circleX, circleY + 94, { align: "center" });

    doc.setFillColor(18, 37, 83);
    doc.roundedRect(50, 560, 495, 198, 18, 18, "F");

    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Prepared For", 82, 598);

    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.setFontSize(17);
    doc.text(doc.splitTextToSize(info.fullName || "Your", 300), 82, 636);

    doc.setTextColor(170, 188, 215);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text("Details", 82, 662);

    const detailRows = [
      ["Company Name", info.companyName],
      ["Position Title", info.positionTitle],
      ["Email Address", info.emailAddress],
      ["Date", info.completionDate || ""],
    ].filter(([, value]) => Boolean(value));

    let y = 681;
    detailRows.forEach(([label, value]) => {
      doc.setTextColor(170, 188, 215);
      doc.setFont("helvetica", "normal");
      doc.text(`${label}:`, 82, y);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), 160, y);
      y += 18;
    });

    doc.setTextColor(120, 139, 172);
    doc.setFontSize(8.5);
    doc.text("This report is generated for informational purposes only and does not constitute legal, financial, or professional advice.", pageWidth / 2, pageHeight - 24, { align: "center" });
    doc.text("Consult a qualified advisor for guidance specific to your circumstances.", pageWidth / 2, pageHeight - 9, { align: "center" });
  }

  function drawSummaryPage(doc, results, fullName) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const navy = [13, 28, 66];
    const gold = [215, 175, 45];
    const light = [170, 187, 215];
    const text = [31, 38, 56];

    drawTopBanner(doc, "Executive Summary");
    drawSectionHeading(doc, "Executive Summary", 50, 100);

    const score = Math.round(Number(results.overallScore) || 0);
    const scoreText = results.riskLabel || "";
    const rangeText = results.riskRange || "";

    doc.setFillColor(...navy);
    doc.roundedRect(40, 128, pageWidth - 80, 110, 18, 18, "F");

    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(39);
    doc.text(String(score), 106, 202);

    doc.setTextColor(214, 225, 244);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Overall BCI Score", 208, 160);

    doc.setTextColor(...gold);
    doc.setFontSize(18);
    doc.text(scoreText, 208, 206);

    doc.setTextColor(139, 157, 183);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Score range: ${rangeText}`, pageWidth - 66, 182, { align: "right" });

    const summary = buildSummaryText(results);
    doc.setTextColor(...text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text(doc.splitTextToSize(summary, pageWidth - 100), 50, 262, { lineHeightFactor: 1.35 });

    drawSectionHeading(doc, "Category Breakdown", 50, 366);
    const bars = results.categories.slice(0, 5);
    let startY = 400;
    bars.forEach((category) => {
      doc.setTextColor(...text);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(category.label, 50, startY);
      doc.setTextColor(...hexToRgb(category.color));
      doc.setFontSize(10);
      doc.text(`${category.percent}%`, pageWidth - 60, startY, { align: "right" });
      doc.setFillColor(241, 242, 246);
      doc.roundedRect(50, startY + 8, pageWidth - 110, 16, 8, 8, "F");
      doc.setFillColor(...hexToRgb(category.color));
      doc.roundedRect(50, startY + 8, Math.max(12, (pageWidth - 110) * (category.percent / 100)), 16, 8, 8, "F");
      startY += 48;
    });

    drawFooter(doc, 2, false);
  }

  function drawRiskAnalysisPage(doc, results) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const navy = [13, 28, 66];
    const gold = [215, 175, 45];
    const text = [31, 38, 56];
    const muted = [122, 135, 166];

    drawTopBanner(doc, "Risk Analysis");
    drawSectionHeading(doc, "Key Risk Areas", 50, 100);

    const riskItems = [...results.categories]
      .filter((category) => category.percent < 80)
      .sort((a, b) => a.percent - b.percent)
      .slice(0, 3);

    if (riskItems.length) {
      let y = 176;
      riskItems.forEach((item) => {
        doc.setFillColor(...hexToRgb(item.color));
        doc.roundedRect(50, y, 14, 82, 6, 6, "F");
        doc.setFillColor(246, 247, 251);
        doc.roundedRect(70, y, pageWidth - 120, 82, 12, 12, "F");
        doc.setTextColor(...text);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(item.label, 95, y + 26);
        doc.setTextColor(...muted);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`${item.percent}% — Requires attention`, 95, y + 47);
        doc.setTextColor(...hexToRgb(item.color));
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${item.percent}%`, pageWidth - 88, y + 42, { align: "right" });
        y += 101;
      });
    } else {
      doc.setFillColor(246, 247, 251);
      doc.roundedRect(50, 176, pageWidth - 100, 82, 12, 12, "F");
      doc.setTextColor(...text);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("No critical risk areas identified", 95, 206);
      doc.setTextColor(...muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("All category scores are 80% or above.", 95, 228);
    }

    drawSectionHeading(doc, "Top Priority Actions", 50, 532);
    const actions = (results.actions || []).slice(0, 5);
    let actionY = 574;
    actions.forEach((action, index) => {
      doc.setFillColor(...gold);
      doc.circle(58, actionY - 5, 12, "F");
      doc.setTextColor(21, 35, 66);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(String(index + 1), 58, actionY - 0.5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(doc.splitTextToSize(action.title, pageWidth - 168), 92, actionY - 10);
      doc.setTextColor(131, 141, 168);
      doc.setFontSize(6.5);
      doc.text(String(action.category || ""), 92, actionY + 4);
      actionY += 34;
    });

    drawFooter(doc, 3, false);
  }

  function drawRecommendationsPage(doc, results) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const gold = [215, 175, 45];
    const navy = [13, 28, 66];
    const text = [31, 38, 56];
    const muted = [120, 132, 159];

    drawTopBanner(doc, "AI Recommendations");
    drawSectionHeading(doc, "AI-Powered Personalised Recommendations", 50, 100);

    doc.setTextColor(...muted);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10.5);
    doc.text("AI recommendations were not generated for this report.", 50, 188);

    drawSectionHeading(doc, "Suggested Next Steps", 50, 286);

    const steps = [
      "Share this report with your legal and financial advisors",
      "Book a business succession and estate planning review",
      "Prioritise the top 3 actions from your risk areas",
      "Schedule a follow-up assessment in 6-12 months",
    ];

    let y = 366;
    steps.forEach((step) => {
      doc.setFillColor(...gold);
      doc.rect(50, y - 14, 8, 18, "F");
      doc.setTextColor(...text);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(step, 74, y);
      y += 42;
    });

    drawFooter(doc, 4, false);
  }

  function drawDisclaimerPage(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const gold = [215, 175, 45];
    const navy = [13, 28, 66];
    const light = [186, 201, 230];
    const currentYear = new Date().getFullYear();
    const creatorName = "Ivan";
    const creatorOrg = "Trust Advisory / CW Group";
    const creatorEmail = "ivantrustadvisory@cwgroup.com.my";
    const creatorPhone = "+6019 6000 109";

    doc.setFillColor(...navy);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setFillColor(...gold);
    doc.rect(0, pageHeight - 14, pageWidth, 14, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Important Disclaimer", pageWidth / 2, 348, { align: "center" });
    doc.setDrawColor(...gold);
    doc.setLineWidth(4);
    doc.line(pageWidth / 2 - 82, 365, pageWidth / 2 + 82, 365);

    doc.setTextColor(...light);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const disclaimerLines = [
      "This Business Continuity Index™ report is generated for informational and educational purposes only.",
      "It does not constitute legal, financial, tax, or professional advice of any kind.",
      "The scores and recommendations in this report are based solely on the responses provided during the assessment and may not reflect all aspects of your business, personal, or financial circumstances.",
      "You should not rely on this report as a substitute for professional advice. Before making any decisions based on this report, you should consult with a qualified legal advisor, financial planner, accountant, or other relevant professional.",
      "The Business Continuity Index™ and its creators accept no liability for any loss or damage arising from reliance on this report.",
    ];
    let y = 454;
    disclaimerLines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, 440);
      doc.text(wrapped, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.35 });
      y += wrapped.length * 16 + 8;
    });

    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Creator: ${creatorName}`, pageWidth / 2, 778, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(creatorOrg, pageWidth / 2, 790, { align: "center" });
    doc.setTextColor(140, 154, 181);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(`${creatorEmail} | ${creatorPhone}`, pageWidth / 2, 803, { align: "center" });
    doc.setFontSize(7);
    doc.text(`© ${currentYear} All rights reserved.`, pageWidth / 2, 817, { align: "center" });
  }

  function drawTopBanner(doc, label) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const navy = [13, 28, 66];
    const gold = [215, 175, 45];
    doc.setFillColor(...navy);
    doc.rect(0, 0, pageWidth, 64, "F");
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Business Continuity Index™", 50, 36);
    doc.setTextColor(143, 160, 194);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(label, pageWidth - 50, 36, { align: "right" });
  }

  function drawSectionHeading(doc, text, x, y) {
    const gold = [215, 175, 45];
    doc.setTextColor(20, 37, 84);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text(text, x, y);
    doc.setDrawColor(...gold);
    doc.setLineWidth(3);
    doc.line(x, y + 10, x + Math.min(170, text.length * 8.2), y + 10);
  }

  function drawFooter(doc, pageNumber, dark) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const navy = [13, 28, 66];
    const gold = [215, 175, 45];
    const gray = dark ? [165, 179, 205] : [129, 141, 170];
    const creatorName = "Ivan";
    const creatorOrg = "Trust Advisory / CW Group";
    const creatorEmail = "ivantrustadvisory@cwgroup.com.my";
    const creatorPhone = "+6019 6000 109";

    doc.setFillColor(...navy);
    doc.rect(0, pageHeight - 46, pageWidth, 46, "F");
    doc.setTextColor(...gray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text("Business Continuity Index™ — Confidential", 52, pageHeight - 28);
    doc.text(`Creator: ${creatorName} | ${creatorOrg}`, pageWidth / 2, pageHeight - 28, { align: "center" });
    doc.text(`Page ${pageNumber}`, pageWidth - 52, pageHeight - 28, { align: "right" });
    doc.setFontSize(6);
    doc.text(`${creatorEmail} | ${creatorPhone}`, pageWidth / 2, pageHeight - 16, { align: "center" });
    doc.setFillColor(...gold);
    doc.rect(0, pageHeight - 2, pageWidth, 2, "F");
  }

  function buildSummaryText(results) {
    const score = Math.round(Number(results.overallScore) || 0);
    const riskLabel = results.riskLabel || "Risk";

    if (score >= 80) {
      return `Your Business Continuity Index™ score of ${score}/100 indicates ${riskLabel}. Your responses indicate a relatively stronger level of preparedness, although important gaps may still exist.`;
    }

    if (score >= 60) {
      return `Your Business Continuity Index™ score of ${score}/100 indicates ${riskLabel}. While you have taken steps in some areas, there are material gaps in your business continuity, succession, and wealth protection planning. Addressing the identified priority actions should be a near-term business imperative.`;
    }

    if (score >= 40) {
      return `Your Business Continuity Index™ score of ${score}/100 indicates ${riskLabel}. Several parts of your continuity and succession framework appear to be in place, but key weaknesses may create uncertainty during a transition.`;
    }

    return `Your Business Continuity Index™ score of ${score}/100 indicates ${riskLabel}. Your responses suggest significant succession vulnerabilities that may deserve professional review.`;
  }

  function slugify(value) {
    return String(value || "Your")
      .trim()
      .replace(/['"]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^A-Za-z0-9\-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "Your";
  }

  function formatDateStamp(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function hexToRgb(hex) {
    const value = String(hex || "").replace("#", "");
    if (value.length !== 6) {
      return [0, 0, 0];
    }
    return [
      parseInt(value.slice(0, 2), 16),
      parseInt(value.slice(2, 4), 16),
      parseInt(value.slice(4, 6), 16),
    ];
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
