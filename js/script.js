(() => {
  const app = document.querySelector(".content");
  const page = document.querySelector(".page");
  const topbar = document.querySelector(".topbar");
  const topbarSub = document.querySelector(".topbar-sub");
  const stepText = document.querySelector(".step-text");
  const answeredText = document.querySelector(".answered");
  const progressTrack = document.querySelector(".progress-track");
  const progressTrackFill = document.querySelector(".progress-track-fill");
  const progressSegments = Array.from(document.querySelectorAll(".seg"));
  const brandTitle = document.querySelector(".brand-title");
  const totalQuestionCount = 25;
  const faArrowLeftIcon = `<i class="fa-solid fa-arrow-left nav-icon" aria-hidden="true"></i>`;
  const faArrowRightIcon = `<i class="fa-solid fa-arrow-right nav-icon" aria-hidden="true"></i>`;
  const faChevronDownIcon = `<i class="fa-solid fa-chevron-down select-icon" aria-hidden="true"></i>`;
  const faInfoIcon = `<i class="fa-solid fa-circle-info info-icon" aria-hidden="true"></i>`;

  const sections = [
    {
      eyebrow: "BUSINESS CONTINUITY",
      title: "Assess Your Business Continuity",
      intro: "Select the answer that best describes your current situation.",
      stepLabel: "Step 1 of 6 — Business Continuity",
      answeredLabel: "0/25 answered",
      progressActive: 1,
      questions: [
        {
          prompt: "If you cannot work tomorrow, who can run the company?",
          options: [
            "A designated person is fully prepared and documented",
            "Someone could step in but is not formally prepared",
            "No one is clearly identified",
          ],
        },
        {
          prompt: "Is there a documented succession plan?",
          options: [
            "Yes, formal and regularly reviewed",
            "Informal or partially documented",
            "No succession plan exists",
          ],
        },
        {
          prompt: "Can the business operate without the founder?",
          options: [
            "Yes, fully capable of operating independently",
            "Partially - some reliance on the founder",
            "No, the business depends heavily on the founder",
          ],
        },
        {
          prompt: "Are Standard Operating Procedures (SOPs) documented?",
          options: [
            "Yes, comprehensive and up-to-date SOPs",
            "Partially documented",
            "No SOPs exist",
          ],
        },
        {
          prompt: "Are key client and supplier relationships institutionalized?",
          options: [
            "Yes, multiple team members manage these relationships",
            "Partially - some relationships are shared",
            "No, only the founder holds these relationships",
          ],
        },
      ],
      footer: {
        back: null,
        next: "Next Section",
      },
    },
    {
      eyebrow: "OWNERSHIP STRUCTURE",
      title: "Assess Your Ownership Structure",
      intro: "Select the answer that best describes your current situation.",
      stepLabel: "Step 2 of 6 — Ownership Structure",
      answeredLabel: "5/25 answered",
      progressActive: 2,
      questions: [
        {
          prompt: "Are shares owned personally?",
          options: [
            "Shares are held through a structured entity (trust/holding company)",
            "Shares held personally but with planning in place",
            "Shares are held personally with no structure",
          ],
        },
        {
          prompt: "Is there a Shareholders' Agreement?",
          options: [
            "Yes, current and legally reviewed",
            "Draft exists but not finalised",
            "No Shareholders' Agreement",
          ],
        },
        {
          prompt: "Is there a Holding Company structure?",
          options: [
            "Yes, a holding company is in place",
            "Being considered or in progress",
            "No holding company",
          ],
        },
        {
          prompt: "Are nominee arrangements documented?",
          options: [
            "Yes, all nominee arrangements are formally documented",
            "Partially documented",
            "No documentation exists",
          ],
        },
        {
          prompt: "Will ownership transfer be delayed by probate if you pass away?",
          options: [
            "No, proper structures prevent probate delays",
            "Partially mitigated",
            "Yes, probate would delay ownership transfer",
          ],
        },
      ],
      footer: {
        back: "Back",
        next: "Next Section",
      },
    },
    {
      eyebrow: "FAMILY & ESTATE PLANNING",
      title: "Assess Your Family & Estate Planning",
      intro: "Select the answer that best describes your current situation.",
      stepLabel: "Step 3 of 6 — Family & Estate Planning",
      answeredLabel: "10/25 answered",
      progressActive: 3,
      questions: [
        {
          prompt: "Do you have a valid Will?",
          options: [
            "Yes, recently reviewed and updated",
            "Yes, but it has not been reviewed recently",
            "No Will exists",
          ],
        },
        {
          prompt: "Do you have a Trust?",
          options: [
            "Yes, a formal trust structure is in place",
            "Being considered or in progress",
            "No trust exists",
          ],
        },
        {
          prompt: "Have guardians been appointed for minor dependants?",
          options: [
            "Yes, formally appointed and documented",
            "Informally agreed but not documented",
            "No guardians appointed",
          ],
        },
        {
          prompt: "Have beneficiaries been clearly identified?",
          options: [
            "Yes, clearly identified across all assets and policies",
            "Partially identified",
            "Not identified",
          ],
        },
        {
          prompt: "Has your family discussed succession planning?",
          options: [
            "Yes, regular structured conversations take place",
            "Informally discussed once or twice",
            "Not discussed",
          ],
        },
      ],
      footer: {
        back: "Back",
        next: "Next Section",
      },
    },
    {
      eyebrow: "KEY PERSON RISK",
      title: "Assess Your Key Person Risk",
      intro: "Select the answer that best describes your current situation.",
      stepLabel: "Step 4 of 6 — Key Person Risk",
      answeredLabel: "15/25 answered",
      progressActive: 4,
      questions: [
        {
          prompt: "Does the business depend heavily on one person?",
          options: [
            "No, responsibilities are distributed across a team",
            "Somewhat — one person is critical but deputies exist",
            "Yes, one person is essential and irreplaceable",
          ],
        },
        {
          prompt: "Is there Key Person Insurance in place?",
          options: [
            "Yes, adequate coverage for all key individuals",
            "Partial coverage in place",
            "No Key Person Insurance",
          ],
        },
        {
          prompt: "Are signing authorities delegated?",
          options: [
            "Yes, formal delegation of authority is documented",
            "Partially delegated",
            "All signing authority rests with one person",
          ],
        },
        {
          prompt: "Can operations continue for six months without the founder?",
          options: [
            "Yes, the business would operate normally",
            "Partially — some disruption would occur",
            "No, operations would be severely impacted",
          ],
        },
        {
          prompt: "Is there a second line of leadership in place?",
          options: [
            "Yes, a capable second tier of leadership exists",
            "One or two deputies but not a full tier",
            "No second line of leadership",
          ],
        },
      ],
      footer: {
        back: "Back",
        next: "Next Section",
      },
    },
    {
      eyebrow: "WEALTH PROTECTION",
      title: "Assess Your Wealth Protection",
      intro: "Select the answer that best describes your current situation.",
      stepLabel: "Step 5 of 6 — Wealth Protection",
      answeredLabel: "20/25 answered",
      progressActive: 4,
      questions: [
        {
          prompt: "Are business and personal assets separated?",
          options: [
            "Yes, fully separated with formal structures",
            "Partially separated",
            "No separation exists",
          ],
        },
        {
          prompt: "Are valuable assets adequately protected?",
          options: [
            "Yes, assets are protected through trusts or insurance",
            "Some assets are protected",
            "Assets are largely unprotected",
          ],
        },
        {
          prompt: "Are assets exposed to business liabilities?",
          options: [
            "No, assets are fully ring-fenced from business liabilities",
            "Partially exposed",
            "Yes, assets are exposed to business liabilities",
          ],
        },
        {
          prompt: "Is creditor protection considered in your planning?",
          options: [
            "Yes, formal creditor protection structures are in place",
            "Some consideration but not formalised",
            "Not considered",
          ],
        },
        {
          prompt: "Is there a structured plan for intergenerational wealth transfer?",
          options: [
            "Yes, a formal intergenerational transfer plan exists",
            "Being planned but not finalised",
            "No plan exists",
          ],
        },
      ],
      footer: {
        back: "Back",
        next: "Continue to Your Details",
      },
    },
    {
      eyebrow: "ALMOST DONE",
      title: "Your Details",
      intro: "Enter your details to receive your personalised Business Continuity Index™ score and report.",
      stepLabel: "Step 6 of 6 — Your Details",
      answeredLabel: "25/25 answered",
      progressActive: 5,
      form: [
        { label: "Full Name", placeholder: "John Smith", required: true },
        { label: "Company Name", placeholder: "Acme Holdings Ltd", required: true },
        { label: "Position / Title", placeholder: "CEO / Director / Owner", required: false },
        { label: "Email Address", placeholder: "john@example.com", required: true },
        { label: "Phone Number", placeholder: "+1 555 000 0000", required: false },
        {
          label: "Industry",
          placeholder: "Select industry",
          required: false,
          select: true,
          options: [
            "Professional Services",
            "Financial Services",
            "Manufacturing",
            "Retail & E-commerce",
            "Technology",
            "Healthcare",
            "Real Estate & Construction",
            "Hospitality & Tourism",
            "Agriculture",
            "Other",
          ],
        },
        {
          label: "Annual Revenue",
          placeholder: "Select range",
          required: false,
          select: true,
          options: [
            "Under $500K",
            "$500K - $1M",
            "$1M - $5M",
            "$5M - $20M",
            "$20M - $100M",
            "Over $100M",
          ],
        },
        {
          label: "Number of Employees",
          placeholder: "Select range",
          required: false,
          select: true,
          options: ["1–5", "6–20", "21–50", "51–200", "201–500", "500+"],
        },
      ],
      note: "Your information is kept confidential and used solely to generate your personalised report. We do not share your data with third parties.",
      footer: {
        back: "Back",
        next: "View My Results",
      },
    },
  ];

  const state = {
    sectionIndex: 0,
    mode: "assessment",
    answers: sections.map((section) => Array(section.questions ? section.questions.length : 0).fill(null)),
    formValues: sections.map((section) => {
      if (!Array.isArray(section.form)) {
        return {};
      }

      return Object.fromEntries(section.form.map((field) => [field.label, ""]));
    }),
    openSelect: null,
    formErrors: sections.map((section) => {
      if (!Array.isArray(section.form)) {
        return {};
      }

      return Object.fromEntries(section.form.map((field) => [field.label, ""]));
    }),
  };

  function renderHeader() {
    const section = sections[state.sectionIndex];
    stepText.textContent = section.stepLabel;
    answeredText.textContent = `${getAnsweredCount()}/${totalQuestionCount} answered`;
    if (state.mode === "results") {
      stepText.textContent = "";
      answeredText.textContent = "";
      if (topbarSub) topbarSub.hidden = true;
      if (progressTrack) progressTrack.hidden = true;
      if (brandTitle) {
        brandTitle.innerHTML = `Business Continuity Index<span>™</span>`;
      }
      if (page) page.classList.add("is-results");
      return;
    }

    if (topbarSub) topbarSub.hidden = false;
    if (progressTrack) progressTrack.hidden = false;
    if (brandTitle) {
      brandTitle.innerHTML = `BCI<span>™</span>`;
    }
    if (page) page.classList.remove("is-results");
    progressTrack.hidden = false;
    if (progressTrackFill) {
      progressTrackFill.style.width = `${(getAnsweredCount() / totalQuestionCount) * 100}%`;
    }

    progressSegments.forEach((segment, index) => {
      segment.classList.remove("complete", "current");
      if (state.sectionIndex >= progressSegments.length) {
        segment.classList.add("complete");
        return;
      }

      if (index < state.sectionIndex) {
        segment.classList.add("complete");
      } else if (index === state.sectionIndex) {
        segment.classList.add("current");
      }
    });
  }

  function renderSection({ animate = false } = {}) {
    state.mode = "assessment";
    const section = sections[state.sectionIndex];
    const answers = state.answers[state.sectionIndex];
    const isFormSection = Array.isArray(section.form);
    const sectionFormValues = state.formValues[state.sectionIndex] || {};
    const sectionFormErrors = state.formErrors[state.sectionIndex] || {};

    const bodyContent = isFormSection
      ? `
        <div class="form-grid">
          ${section.form
            .map((field, fieldIndex) => {
              const fieldValue = escapeHtml(sectionFormValues[field.label] || "");
              const fieldError = Boolean(sectionFormErrors[field.label]);
              const fieldErrorMessage = sectionFormErrors[field.label] || "";
              const fieldId = `form-${state.sectionIndex}-${fieldIndex}`;
              const errorId = `${fieldId}-error`;
              const isPhoneField = field.label === "Phone Number";
              const hasSelectMenu = Array.isArray(field.options) && field.options.length > 0;
              const selectedValue = sectionFormValues[field.label] || "";
              const displayValue = selectedValue || field.placeholder;
              const isOpen = state.openSelect === field.label;
              const required = field.required ? '<span class="required" aria-hidden="true">*</span>' : "";
              const control = field.select
                ? `
                  <button type="button" class="field-control field-select${selectedValue ? " has-value" : ""}" data-select-field="${field.label}" aria-haspopup="listbox" aria-expanded="${isOpen ? "true" : "false"}" aria-label="${field.label}">
                    <span>${escapeHtml(displayValue)}</span>
                    ${faChevronDownIcon}
                  </button>
                  ${hasSelectMenu ? `
                    <div class="select-menu${isOpen ? " is-open" : ""}" role="listbox" aria-label="${field.label}">
                      ${field.options.map((option) => {
                        const isSelected = selectedValue === option;
                        return `<button type="button" class="select-option${isSelected ? " is-selected" : ""}" data-select-field="${field.label}" data-select-option="${escapeHtml(option)}" role="option" aria-selected="${isSelected ? "true" : "false"}">${option}</button>`;
                      }).join("")}
                    </div>
                  ` : ""}
                `
                : `
                  <input class="field-control field-input" id="${fieldId}" data-field-label="${field.label}" ${isPhoneField ? 'data-digits-only="true"' : ""} type="text" ${isPhoneField ? 'inputmode="numeric" pattern="[0-9]*" autocomplete="tel"' : ""} value="${fieldValue}" placeholder="${field.placeholder}" aria-label="${field.label}" aria-invalid="${fieldError ? "true" : "false"}" ${field.required ? 'data-required="true"' : ""} ${fieldError ? `aria-describedby="${errorId}"` : ""} />
                `;

              return `
                <label class="field${fieldError ? " has-error" : ""}"${field.select ? "" : ` for="${fieldId}"`}>
                  <span class="field-label">
                    <span class="field-label-main">${field.label}</span>
                    ${required}
                  </span>
                  ${control}
                  ${fieldError ? `<span class="field-error" id="${errorId}" role="status">${faInfoIcon}<span>${escapeHtml(fieldErrorMessage)}</span></span>` : ""}
                </label>
              `;
            })
            .join("")}
        </div>
        <p class="form-note">${section.note}</p>
      `
      : section.questions
          .map((question, questionIndex) => {
            const questionMarkup = question.options
              .map((option, optionIndex) => {
                const selected = answers[questionIndex] === optionIndex;
                return `
                  <button class="choice${selected ? " is-selected" : ""}" type="button" data-question="${questionIndex}" data-option="${optionIndex}" aria-pressed="${selected ? "true" : "false"}">
                    <span class="dot" aria-hidden="true"></span>
                    <span class="choice-text">${option}</span>
                  </button>
                `;
              })
              .join("");

            return `
              <section class="question" data-question-block="${questionIndex}">
                <p class="question-title"><span class="num">${questionIndex + 1}.</span>${question.prompt}</p>
                <div class="choices">${questionMarkup}</div>
              </section>
            `;
          })
          .join("");

    app.innerHTML = `
      <div class="section-shell${animate ? "" : " no-animate"}">
        <div class="eyebrow">${section.eyebrow}</div>
        <h1>${section.title}</h1>
        <p class="intro">${section.intro}</p>
        ${bodyContent}
        <div class="actions">
          <div class="footer-nav">
            ${section.footer.back ? `<button class="back" type="button">${faArrowLeftIcon}<span>${section.footer.back}</span></button>` : `<button class="back" type="button" disabled hidden>${section.footer.back ?? ""}</button>`}
            <button class="next${isSectionComplete(state.sectionIndex) ? " is-enabled" : ""}" type="button" aria-disabled="${isSectionComplete(state.sectionIndex) ? "false" : "true"}">
              <span>${section.footer.next}</span>
              ${faArrowRightIcon}
            </button>
          </div>
        </div>
      </div>`;

    attachQuestionHandlers();
    attachFormHandlers();
    attachNavHandlers();
    renderHeader();
  }

  function renderResults() {
    state.mode = "results";
    const results = getResultsData();
    const fullName = getFullName() || "Your";
    const completionDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    app.innerHTML = `
      <div class="results-shell">
        <section class="results-hero">
          <div class="results-hero-inner">
            <h1>${escapeHtml(fullName)}'s Assessment Results</h1>
            <p>Completed ${completionDate}</p>
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
            <div class="score-pill">${results.riskLabel}</div>
            <div class="score-range">${results.riskRange}</div>
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
          <div class="results-completed">Completed ${completionDate}</div>
        </div>
      </div>
    `;

    attachResultsHandlers();
    renderHeader();
    animateResults(results);
    scrollToTop();
  }

  function getSectionCategoryName(sectionIndex) {
    const label = sections[sectionIndex].stepLabel || "";
    return label.includes("—") ? label.split("—").pop().trim() : label;
  }

  function getFullName() {
    return (state.formValues[5] && state.formValues[5]["Full Name"]) || "";
  }

  function getSectionScore(sectionIndex) {
    const answers = state.answers[sectionIndex] || [];
    return answers.reduce((total, answer) => total + Math.max(0, 4 - (Number(answer) * 2)), 0);
  }

  function getRiskLabel(score) {
    if (score < 40) {
      return { label: "High Risk", range: "0-39 score range", accent: "#e34b4b" };
    }

    if (score < 75) {
      return { label: "Moderate Risk", range: "60-74 score range", accent: "#e7b11f" };
    }

    return { label: "Low Risk", range: "75-100 score range", accent: "#27b36a" };
  }

  function getResultsData() {
    const categories = sections.slice(0, 5).map((section, index) => {
      const points = getSectionScore(index);
      const percent = Math.round((points / 20) * 100);
      return {
        label: getSectionCategoryName(index),
        points,
        percent,
        color: index === 0 ? "#f0b51a" : index === 1 ? "#41c97f" : index === 2 ? "#5ec76d" : index === 3 ? "#4fb3ff" : "#e7b11f",
      };
    });

    const overallScore = Math.round(categories.reduce((total, category) => total + category.points, 0));
    const risk = getRiskLabel(overallScore);
    const sortedAscending = [...categories].sort((a, b) => a.points - b.points);
    const sortedDescending = [...categories].sort((a, b) => b.points - a.points);
    const strengths = categories.filter((category) => category.percent >= 90);
    const actions = [
      "Document a formal succession plan naming a specific successor",
      "Create and maintain SOPs for all critical business processes",
      "Establish a deputy who can run day-to-day operations",
      "Separate personal and business assets with formal structures",
      "Review asset protection strategies with a financial advisor",
    ].map((title, index) => ({
      title,
      category: categories[index]?.label || "BCI Assessment",
    }));

    return {
      categories,
      overallScore,
      riskLabel: risk.label,
      riskRange: risk.range,
      strengths,
      improvements: sortedAscending.slice(0, 2),
      actions,
    };
  }

  function openResultsPage() {
    const results = getResultsData();
    const completionDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const sheetSubmissionPayload = buildSheetSubmissionPayload(results, completionDate);

    const payload = {
      ...results,
      fullName: getFullName() || "Your",
      completionDate,
      sheetSubmissionPayload,
    };

    submitResultsToSheet({ sheetSubmissionPayload });
    sessionStorage.setItem("bci-payment-payload", JSON.stringify(payload));
    sessionStorage.removeItem("bci-results-payload");
    window.location.href = "payment.html";
  }

  function submitResultsToSheet(payload) {
    const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbygZQv_903p-8O02toDHwdEHfbVk8tkNT_xzAE6_vMXAAE-2pRs7WzZvThAk7-ZsVPv/exec";
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

  function buildSheetSubmissionPayload(results, completionDate) {
    const formValues = state.formValues[5] || {};
    const field = (label) => formValues[label] || "";
    const lowestCategory = [...results.categories].sort((a, b) => a.points - b.points)[0] || null;
    const topReviewAreas = [...results.categories]
      .sort((a, b) => a.points - b.points)
      .slice(0, 3);

    const rawAnswersSaved = {
      sections: sections.slice(0, 5).map((section, sectionIndex) => ({
        section: section.stepLabel || `Section ${sectionIndex + 1}`,
        questions: (section.questions || []).map((question, questionIndex) => {
          const selectedIndex = state.answers[sectionIndex]?.[questionIndex];
          return {
            question: question.prompt,
            selectedIndex,
            selectedAnswer: selectedIndex === null || selectedIndex === undefined ? "" : (question.options[selectedIndex] || ""),
          };
        }),
      })),
      details: formValues,
    };

    return {
      timestamp: new Date().toISOString(),
      completion_date: completionDate,
      full_name: getFullName() || "",
      company_name: field("Company Name"),
      position_title: field("Position / Title"),
      email_address: field("Email Address"),
      phone_number: field("Phone Number"),
      industry: field("Industry"),
      annual_revenue: field("Annual Revenue"),
      number_of_employees: field("Number of Employees"),
      overall_score: results.overallScore,
      risk_label: results.riskLabel,
      risk_range: results.riskRange,
      business_continuity_score: results.categories[0]?.percent ?? "",
      ownership_control_score: results.categories[1]?.percent ?? "",
      management_succession_score: results.categories[2]?.percent ?? "",
      family_wealth_transition_score: results.categories[3]?.percent ?? "",
      legal_documentation_score: results.categories[4]?.percent ?? "",
      lowest_dimension: lowestCategory ? lowestCategory.label : "",
      top_review_area_1: topReviewAreas[0] ? topReviewAreas[0].label : "",
      top_review_area_2: topReviewAreas[1] ? topReviewAreas[1].label : "",
      top_review_area_3: topReviewAreas[2] ? topReviewAreas[2].label : "",
      raw_answers_saved: JSON.stringify(rawAnswersSaved),
    };
  }

  function buildRadarChart(categories) {
    const size = 360;
    const center = size / 2;
    const radius = 112;
    const angleOffset = -Math.PI / 2;
    const labels = categories.map((category) => category.label);
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

  function getFieldValidationMessage(field, value) {
    const trimmedValue = String(value || "").trim();

    if (field.required && !trimmedValue) {
      return `${field.label} is required`;
    }

    if (field.label === "Email Address" && trimmedValue) {
      const isGmail = /^[^\s@]+@gmail\.com$/i.test(trimmedValue);
      if (!isGmail) {
        return "Email Address must be a Gmail address";
      }
    }

    return "";
  }

  function validateCurrentFormSection() {
    const section = sections[state.sectionIndex];
    if (!Array.isArray(section.form)) {
      return true;
    }

    const values = state.formValues[state.sectionIndex] || {};
    const errors = {};
    let firstInvalidLabel = null;

    section.form.forEach((field) => {
      const message = getFieldValidationMessage(field, values[field.label]);
      if (message) {
        errors[field.label] = message;
        if (!firstInvalidLabel) {
          firstInvalidLabel = field.label;
        }
      }
    });

    state.formErrors[state.sectionIndex] = errors;

    if (Object.keys(errors).length > 0) {
      renderSection({ animate: false });
      updateAnsweredLabel();
      const firstInvalidInput = app.querySelector(`[data-field-label="${firstInvalidLabel}"]`);
      if (firstInvalidInput && typeof firstInvalidInput.focus === "function") {
        firstInvalidInput.focus({ preventScroll: true });
      }
      scrollToTop();
      return false;
    }

    return true;
  }

  function isSectionComplete(sectionIndex) {
    return state.answers[sectionIndex].every((value) => value !== null);
  }

  function updateAnsweredLabel() {
    const answeredCount = getAnsweredCount();
    answeredText.textContent = `${answeredCount}/${totalQuestionCount} answered`;
  }

  function getAnsweredCount() {
    return state.answers.reduce(
      (total, sectionAnswers) => total + sectionAnswers.filter((answer) => answer !== null).length,
      0,
    );
  }

  function attachQuestionHandlers() {
    const questionBlocks = Array.from(app.querySelectorAll(".question"));
    questionBlocks.forEach((block, questionIndex) => {
      const choices = Array.from(block.querySelectorAll(".choice"));

      choices.forEach((choice) => {
          choice.addEventListener("click", () => {
          const optionIndex = Number(choice.dataset.option);
          state.answers[state.sectionIndex][questionIndex] = optionIndex;
          renderSection({ animate: false });
          updateAnsweredLabel();
        });

        choice.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            choice.click();
          }
        });
      });
    });
  }

  function attachFormHandlers() {
    const closeAllSelectMenus = () => {
      Array.from(app.querySelectorAll(".field-select[aria-expanded='true']")).forEach((button) => {
        button.setAttribute("aria-expanded", "false");
      });
      Array.from(app.querySelectorAll(".select-menu.is-open")).forEach((menu) => {
        menu.classList.remove("is-open");
      });
      state.openSelect = null;
    };

    const selectButtons = Array.from(app.querySelectorAll("[data-select-field]"));
    selectButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const fieldLabel = button.dataset.selectField;
        if (!fieldLabel) return;
        const fieldShell = button.closest(".field");
        const menu = fieldShell ? fieldShell.querySelector(".select-menu") : null;
        const isOpen = button.getAttribute("aria-expanded") === "true";
        closeAllSelectMenus();
        if (!isOpen && menu) {
          button.setAttribute("aria-expanded", "true");
          menu.classList.add("is-open");
          state.openSelect = fieldLabel;
        }
      });
    });

    const selectOptions = Array.from(app.querySelectorAll("[data-select-option]"));
    selectOptions.forEach((optionButton) => {
      optionButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const fieldLabel = optionButton.dataset.selectField;
        const value = optionButton.dataset.selectOption || "";
        if (!fieldLabel) return;
        state.formValues[state.sectionIndex][fieldLabel] = value;
        state.openSelect = null;
        renderSection({ animate: false });
      });
    });

    const inputs = Array.from(app.querySelectorAll(".field-input"));
    inputs.forEach((input) => {
      const digitsOnly = input.dataset.digitsOnly === "true";

      if (digitsOnly) {
        input.addEventListener("beforeinput", (event) => {
          if (event.inputType && event.inputType.startsWith("delete")) {
            return;
          }

          if (typeof event.data === "string" && /[^\d]/.test(event.data)) {
            event.preventDefault();
          }
        });

        input.addEventListener("paste", (event) => {
          event.preventDefault();
          const pasted = (event.clipboardData || window.clipboardData).getData("text");
          const digits = String(pasted).replace(/\D+/g, "");
          const start = input.selectionStart ?? input.value.length;
          const end = input.selectionEnd ?? input.value.length;
          const nextValue = `${input.value.slice(0, start)}${digits}${input.value.slice(end)}`.replace(/\D+/g, "");
          input.value = nextValue;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
      }

      input.addEventListener("input", (event) => {
        const fieldLabel = event.target.dataset.fieldLabel;
        if (!fieldLabel) return;
        const cleanedValue = digitsOnly ? event.target.value.replace(/\D+/g, "") : event.target.value;
        if (digitsOnly && event.target.value !== cleanedValue) {
          event.target.value = cleanedValue;
        }

        state.formValues[state.sectionIndex][fieldLabel] = cleanedValue;
        const section = sections[state.sectionIndex];
        const field = Array.isArray(section.form)
          ? section.form.find((item) => item.label === fieldLabel)
          : null;
        if (!field) return;

        const message = getFieldValidationMessage(field, cleanedValue);
        const fieldShell = event.target.closest(".field");
        const errorNode = fieldShell ? fieldShell.querySelector(".field-error") : null;
        if (message) {
          state.formErrors[state.sectionIndex][fieldLabel] = message;
          if (fieldShell) {
            fieldShell.classList.add("has-error");
          }
          event.target.setAttribute("aria-invalid", "true");
          event.target.setAttribute("aria-describedby", `${event.target.id}-error`);
          if (errorNode) {
            errorNode.querySelector("span:last-child").textContent = message;
          }
        } else {
          delete state.formErrors[state.sectionIndex][fieldLabel];
          if (fieldShell) {
            fieldShell.classList.remove("has-error");
          }
          event.target.setAttribute("aria-invalid", "false");
          event.target.removeAttribute("aria-describedby");
          if (errorNode) {
            errorNode.remove();
          }
        }
      });
    });
  }

  function attachNavHandlers() {
    const nextButton = app.querySelector(".next");
    const backButton = app.querySelector(".back");

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (!isSectionComplete(state.sectionIndex)) return;
        if (state.sectionIndex === sections.length - 1) {
          if (!validateCurrentFormSection()) return;
          openResultsPage();
          return;
        }
        if (state.sectionIndex < sections.length - 1) {
          state.sectionIndex += 1;
          renderSection({ animate: true });
          scrollToTop();
          updateAnsweredLabel();
        }
      });
    }

    if (backButton && !backButton.hasAttribute("hidden")) {
      backButton.addEventListener("click", () => {
        if (state.sectionIndex > 0) {
          state.sectionIndex -= 1;
          renderSection({ animate: true });
          scrollToTop();
          updateAnsweredLabel();
        }
      });
    }
  }

  function attachResultsHandlers() {
    const retakeButton = app.querySelector(".results-retake");
    const downloadButton = app.querySelector(".results-download");

    if (retakeButton) {
      retakeButton.addEventListener("click", () => {
        state.mode = "assessment";
        state.sectionIndex = 0;
        state.openSelect = null;
        state.answers = sections.map((section) => Array(section.questions ? section.questions.length : 0).fill(null));
        state.formValues = sections.map((section) => {
          if (!Array.isArray(section.form)) {
            return {};
          }

          return Object.fromEntries(section.form.map((field) => [field.label, ""]));
        });
        state.formErrors = sections.map((section) => {
          if (!Array.isArray(section.form)) {
            return {};
          }

          return Object.fromEntries(section.form.map((field) => [field.label, ""]));
        });
        renderSection({ animate: true });
        scrollToTop();
      });
    }

    if (downloadButton) {
      downloadButton.addEventListener("click", () => {
        window.print();
      });
    }
  }

  updateAnsweredLabel();
  renderSection({ animate: true });
})();
