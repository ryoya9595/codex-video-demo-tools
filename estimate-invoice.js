const statusPill = document.querySelector("#statusPill");
const invoiceForm = document.querySelector("#invoiceForm");
const estimateDoc = document.querySelector("#estimateDoc");
const invoiceDoc = document.querySelector("#invoiceDoc");
const invoiceSampleButton = document.querySelector("#invoiceSampleButton");

function yen(value) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(value);
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function renderDocument(type, data, number) {
  const amount = Number(data.amount || 0);
  const tax = Math.round(amount * Number(data.tax || 0));
  const total = amount + tax;
  const items = String(data.items || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return `
    <div class="doc-head">
      <div>
        <div class="doc-type">${type}</div>
        <div class="doc-number">No. ${number}</div>
      </div>
      <div class="doc-meta">
        発行日: ${data.issueDate}<br />
        支払期限: ${data.dueDate}
      </div>
    </div>
    <div class="doc-client">${data.client} 御中</div>
    <p class="doc-meta">${data.project}</p>
    <div class="doc-items">
      ${items
        .map(
          (item, index) => `
            <div class="doc-item">
              <span>${index + 1}. ${item}</span>
              <strong>${index === 0 ? yen(amount) : "-"}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="doc-total-row">
      <div>
        <div class="mini-label">税込合計</div>
        <div class="doc-meta">税額 ${yen(tax)}</div>
      </div>
      <div class="doc-total">${yen(total)}</div>
    </div>
  `;
}

function generateDocuments() {
  const data = Object.fromEntries(new FormData(invoiceForm).entries());
  estimateDoc.innerHTML = renderDocument("御見積書", data, "EST-2026-0601");
  invoiceDoc.innerHTML = renderDocument("御請求書", data, "INV-2026-0601");
  statusPill.textContent = "Generated";
}

invoiceForm.issueDate.value = new Date().toISOString().slice(0, 10);
invoiceForm.dueDate.value = addDays(30);
invoiceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  generateDocuments();
});

invoiceSampleButton.addEventListener("click", () => {
  invoiceForm.client.value = "株式会社アベプラニング";
  invoiceForm.project.value = "YouTube導線改善コンサルティング";
  invoiceForm.amount.value = "500000";
  invoiceForm.items.value = "競合YouTube分析\n動画構成改善\nLINE特典設計\n撮影用資料作成";
  generateDocuments();
});

generateDocuments();
