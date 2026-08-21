(() => {
  const app = document.querySelector(".content");
  const paymentKey = "bci-payment-payload";

  const pendingPayload = readPendingPayload();
  if (!pendingPayload) {
    window.location.replace("index.html");
    return;
  }

  document.title = `${pendingPayload.fullName}'s Payment`;
  renderPaymentPage(pendingPayload);
  attachHandlers();

  function readPendingPayload() {
    try {
      const raw = sessionStorage.getItem(paymentKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function renderPaymentPage(payload) {
    const fullName = payload.fullName || "Your";
    const invoiceAmount = "MYR 800";
    const completionDate = payload.completionDate || "";

    app.innerHTML = `
      <div class="payment-shell">
        <section class="payment-hero">
          <div class="payment-hero-copy">
            <div class="eyebrow">MANUAL PAYMENT</div>
            <h1>Complete Your Payment</h1>
            <p>Make the transfer using the details below, upload your receipt, and we’ll redirect you to your results.</p>
          </div>

          <aside class="payment-invoice">
            <div class="payment-invoice-label">Estimated Invoice</div>
            <div class="payment-invoice-amount">${invoiceAmount}</div>
            <div class="payment-invoice-note">Prepared for ${escapeHtml(fullName)}${completionDate ? ` · Completed ${escapeHtml(completionDate)}` : ""}</div>
          </aside>
        </section>

        <div class="payment-grid">
          <section class="payment-card payment-card-qr">
            <h2><i class="fa-solid fa-qrcode" aria-hidden="true"></i>DuitNow Placeholder</h2>
            <div class="duitnow-box">
              <div class="duitnow-qr">
                <i class="fa-solid fa-mobile-screen-button" aria-hidden="true"></i>
                <span>DuitNow QR Placeholder</span>
              </div>
              <div class="duitnow-id">DuitNow ID: <strong>BCI-800-PLACEHOLDER</strong></div>
              <p>Scan from your banking app or use the bank transfer details provided below.</p>
            </div>
          </section>

          <section class="payment-card payment-card-bank">
            <h2><i class="fa-solid fa-building-columns" aria-hidden="true"></i>Bank Details</h2>
            <dl class="bank-details">
              <div>
                <dt>Bank</dt>
                <dd>Maybank (Dummy)</dd>
              </div>
              <div>
                <dt>Account Number</dt>
                <dd>5123 4567 8901</dd>
              </div>
              <div>
                <dt>Bank Owner</dt>
                <dd>Trust Advisory / CW Group</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>BCI-${escapeHtml(fullName)}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section class="payment-card payment-upload-card">
          <h2><i class="fa-solid fa-upload" aria-hidden="true"></i>Attach Verified Transfer Slip</h2>
          <label class="receipt-dropzone" for="receipt-file">
            <input id="receipt-file" type="file" accept="image/*,application/pdf" hidden />
            <span class="receipt-dropzone-content" data-receipt-preview aria-live="polite">
              <span class="receipt-icon" aria-hidden="true">
                <i class="fa-solid fa-file-arrow-up"></i>
              </span>
              <span class="receipt-title">Click to choose a receipt image or PDF</span>
              <span class="receipt-sub">JPEG, PNG, PDF</span>
            </span>
          </label>

          <div class="payment-upload-actions">
            <button class="payment-secondary" type="button" data-remove-receipt>Remove slip</button>
            <button class="payment-primary" type="button" data-submit-receipt>Submit Receipt</button>
          </div>

          <p class="payment-help" data-payment-help>After receipt submission you will be redirected to your results page.</p>
        </section>
      </div>
    `;
  }

  function attachHandlers() {
    const fileInput = app.querySelector("#receipt-file");
    const receiptPreview = app.querySelector("[data-receipt-preview]");
    const submitButton = app.querySelector("[data-submit-receipt]");
    const removeButton = app.querySelector("[data-remove-receipt]");
    const helpText = app.querySelector("[data-payment-help]");
    const dropzone = app.querySelector(".receipt-dropzone");

    let selectedFile = null;
    let previewObjectUrl = null;
    let redirectTimer = null;
    let successOverlay = null;

    const setHelp = (message, isError = false) => {
      if (!helpText) return;
      helpText.textContent = message;
      helpText.classList.toggle("is-error", Boolean(isError));
    };

    const renderPreview = (file) => {
      if (!receiptPreview) return;

      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = null;
      }

      if (!file) {
        receiptPreview.classList.remove("has-preview", "is-pdf");
        receiptPreview.innerHTML = `
          <span class="receipt-icon" aria-hidden="true">
            <i class="fa-solid fa-file-arrow-up"></i>
          </span>
          <span class="receipt-title">Click to choose a receipt image or PDF</span>
          <span class="receipt-sub">JPEG, PNG, PDF</span>
        `;
        return;
      }

      if (file.type && file.type.startsWith("image/")) {
        previewObjectUrl = URL.createObjectURL(file);
        receiptPreview.classList.add("has-preview");
        receiptPreview.classList.remove("is-pdf");
        receiptPreview.innerHTML = `
          <div class="receipt-dropzone-preview-image">
            <img src="${previewObjectUrl}" alt="Receipt preview" />
          </div>
          <span class="receipt-dropzone-filename">${escapeHtml(file.name)}</span>
        `;
        return;
      }

      receiptPreview.classList.add("has-preview", "is-pdf");
      receiptPreview.innerHTML = `
        <div class="receipt-dropzone-preview-file">
          <i class="fa-solid fa-file-pdf" aria-hidden="true"></i>
          <span>${escapeHtml(file.name)}</span>
        </div>
      `;
    };

    const updateReceiptLabel = () => {
      dropzone?.classList.toggle("has-file", Boolean(selectedFile));
      renderPreview(selectedFile);
    };

    fileInput?.addEventListener("change", () => {
      selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
      updateReceiptLabel();
      dropzone?.classList.remove("is-error");
      setHelp(selectedFile ? "Receipt attached. You can now submit it." : "After receipt submission you will be redirected to your results page.");
    });

    removeButton?.addEventListener("click", () => {
      selectedFile = null;
      if (fileInput) fileInput.value = "";
      updateReceiptLabel();
      dropzone?.classList.remove("is-error");
      setHelp("Receipt removed. Please attach a new slip to continue.");
    });

    window.addEventListener("beforeunload", () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = null;
      }
      if (redirectTimer) {
        window.clearTimeout(redirectTimer);
        redirectTimer = null;
      }
    });

    const closeSuccessOverlay = () => {
      if (redirectTimer) {
        window.clearTimeout(redirectTimer);
        redirectTimer = null;
      }

      if (successOverlay) {
        successOverlay.remove();
        successOverlay = null;
      }

      window.location.href = "results.html";
    };

    const showSuccessOverlay = () => {
      if (successOverlay) return;

      successOverlay = document.createElement("div");
      successOverlay.className = "payment-success-overlay";
      successOverlay.innerHTML = `
        <div class="payment-success-modal" role="dialog" aria-modal="true" aria-labelledby="payment-success-title">
          <button class="payment-success-close" type="button" aria-label="Close success message">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
          <div class="payment-success-icon" aria-hidden="true">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h2 id="payment-success-title">Receipt submitted successfully</h2>
          <p>Your receipt has been uploaded. Redirecting you to your results page...</p>
        </div>
      `;

      document.body.appendChild(successOverlay);

      const closeButton = successOverlay.querySelector(".payment-success-close");
      closeButton?.addEventListener("click", closeSuccessOverlay);
      successOverlay.addEventListener("click", (event) => {
        if (event.target === successOverlay) {
          closeSuccessOverlay();
        }
      });

      redirectTimer = window.setTimeout(closeSuccessOverlay, 1500);
    };

    submitButton?.addEventListener("click", () => {
      if (!selectedFile) {
        setHelp("Please attach a receipt image or PDF before submitting.", true);
        dropzone?.classList.add("is-error");
        return;
      }

      const finalPayload = {
        ...pendingPayload,
        paymentReceipt: {
          fileName: selectedFile.name,
          fileType: selectedFile.type || "",
          fileSize: selectedFile.size || 0,
          submittedAt: new Date().toISOString(),
        },
      };

      sessionStorage.setItem("bci-results-payload", JSON.stringify(finalPayload));
      sessionStorage.removeItem(paymentKey);
      showSuccessOverlay();
    });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
