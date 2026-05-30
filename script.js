const viewMeta = {
  invoice: ["Estimate / Invoice", "見積書・請求書 自動生成"],
  threads: ["Threads Scheduler", "Threads投稿ツール"],
  research: ["SNS Research", "競合SNSリサーチツール"],
  youtube: ["Script / Thumbnail", "YouTube台本・サムネ案 自動生成"],
};

const state = {
  threads: [
    {
      account: "@ryoya_ai",
      status: "scheduled",
      date: "2026-06-01T09:00",
      text: "Codexは、質問に答えるAIじゃなくて仕事を終わらせるAI。",
    },
    {
      account: "@luckymine_ai",
      status: "draft",
      date: "",
      text: "AI副業で一番差がつくのは、ツールを知っているかではなく、作業を渡せるか。",
    },
  ],
  sns: "YouTube",
};

const pageViewMap = {
  "estimate-invoice.html": "invoice",
  "threads-scheduler.html": "threads",
  "sns-research.html": "research",
  "youtube-script-thumbnail.html": "youtube",
};

const snsPresets = {
  YouTube: {
    metrics: [
      ["伸びている尺", "18-32分"],
      ["強い導入", "実演先見せ"],
      ["視聴者の不安", "何から触ればいいか"],
    ],
    insights: [
      ["導入5分が勝負", "料金、対象者、今日できることを先に言うと離脱が減る。"],
      ["実演のBefore/After", "完成品だけでなく、入力から完成までの変化を見せる。"],
      ["特典導線", "マニュアル配布は最後だけでなく中盤でも一度伏線を置く。"],
    ],
    ideas: [
      ["CodexでAI秘書を作る", "初心者でもコピペで始められる導線にする。"],
      ["月20ドルの元を取る使い方", "画像生成、資料化、リサーチの3本に絞る。"],
      ["設定ミスで損しない", "自動レビューとフルアクセスを比較する。"],
    ],
  },
  Instagram: {
    metrics: [
      ["伸びている型", "保存版カルーセル"],
      ["強い1枚目", "結論+数字"],
      ["CTA", "無料特典"],
    ],
    insights: [
      ["1枚目は強い断定", "「ChatGPT課金者の9割が損してる」系が刺さる。"],
      ["比較表が強い", "ChatGPTだけ/Codexありの作業差を見せる。"],
      ["保存理由を作る", "設定チェックリストは保存されやすい。"],
    ],
    ideas: [
      ["Codex初期設定チェック", "5枚で設定だけを解説。"],
      ["AIが作業する時代", "会話AIから作業AIへの変化を図解。"],
      ["危険な設定3選", "フルアクセス、APIキー、機密ファイルを扱う。"],
    ],
  },
  Threads: {
    metrics: [
      ["伸びる投稿", "短文+強い比喩"],
      ["反応が出る型", "あるある問題提起"],
      ["投稿時間", "朝/夜"],
    ],
    insights: [
      ["1投稿1メッセージ", "Codexの価値を詰め込みすぎない。"],
      ["体験談が強い", "「実際に作ったら30分でできた」が反応を取りやすい。"],
      ["ツリーで深掘り", "本文で興味を作り、返信欄で手順を補足。"],
    ],
    ideas: [
      ["ChatGPT課金者へ", "Codex使ってないのはかなり損。"],
      ["AI副業の差", "知識より作業をAIへ渡す設計力。"],
      ["撮影裏話", "Codexで動画準備を丸ごと作った話。"],
    ],
  },
  note: {
    metrics: [
      ["読まれる型", "実践レポート"],
      ["強い見出し", "失敗談+改善"],
      ["販売導線", "テンプレ配布"],
    ],
    insights: [
      ["長文は手順化", "思想だけでなく、再現手順がある記事が強い。"],
      ["スクショが重要", "設定画面や成果物を見せると信用が上がる。"],
      ["テンプレ価値", "プロンプト集より、運用マニュアルの方が使われる。"],
    ],
    ideas: [
      ["Codex導入レポート", "初心者が詰まるポイントを先回り。"],
      ["AI秘書の作り方", "プロンプトとフォルダ構成をセットで配布。"],
      ["セキュリティ設定", "安全な始め方を記事化。"],
    ],
  },
};

const navButtons = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const viewKicker = document.querySelector("#viewKicker");
const viewTitle = document.querySelector("#viewTitle");
const statusPill = document.querySelector("#statusPill");

function switchView(viewName) {
  navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === viewName));
  views.forEach((view) => view.classList.toggle("is-active", view.id === `${viewName}View`));
  const [kicker, title] = viewMeta[viewName];
  viewKicker.textContent = kicker;
  viewTitle.textContent = title;
  statusPill.textContent = viewName === "youtube" ? "Climax" : "Ready";
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

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
  estimateDoc.innerHTML = renderDocument("御見積書", data, "EST-2026-0530");
  invoiceDoc.innerHTML = renderDocument("御請求書", data, "INV-2026-0530");
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

const threadsForm = document.querySelector("#threadsForm");
const threadsQueue = document.querySelector("#threadsQueue");
const threadsCount = document.querySelector("#threadsCount");
const threadsDraftButton = document.querySelector("#threadsDraftButton");

function renderThreads() {
  threadsCount.textContent = `${state.threads.length}件`;
  threadsQueue.innerHTML = state.threads
    .map(
      (post) => `
        <article class="post-item">
          <span class="badge ${post.status}">${post.status === "scheduled" ? "予約済み" : "下書き"}</span>
          <strong>${post.account}</strong>
          <p>${post.text.replace(/\n/g, "<br />")}</p>
          <div class="post-meta">${post.date ? new Date(post.date).toLocaleString("ja-JP") : "日時未設定"}</div>
        </article>
      `,
    )
    .join("");
}

function addThreadPost(status) {
  const data = Object.fromEntries(new FormData(threadsForm).entries());
  state.threads.unshift({
    account: data.account,
    status,
    date: status === "scheduled" ? data.scheduledAt : "",
    text: data.text,
  });
  renderThreads();
  statusPill.textContent = status === "scheduled" ? "Scheduled" : "Draft saved";
}

threadsForm.scheduledAt.value = `${addDays(1)}T09:00`;
threadsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addThreadPost("scheduled");
});
threadsDraftButton.addEventListener("click", () => addThreadPost("draft"));

const snsTabs = document.querySelectorAll("#snsTabs button");
const researchForm = document.querySelector("#researchForm");
const researchTitle = document.querySelector("#researchTitle");
const metricGrid = document.querySelector("#metricGrid");
const insightList = document.querySelector("#insightList");
const ideaList = document.querySelector("#ideaList");

function renderResearch() {
  const preset = snsPresets[state.sns];
  researchTitle.textContent = `${state.sns}分析`;
  metricGrid.innerHTML = preset.metrics
    .map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  insightList.innerHTML = preset.insights
    .map(([title, body]) => `<article class="insight"><strong>${title}</strong><span>${body}</span></article>`)
    .join("");
  ideaList.innerHTML = preset.ideas
    .map(([title, body]) => `<article class="idea"><strong>${title}</strong><span>${body}</span></article>`)
    .join("");
}

snsTabs.forEach((button) => {
  button.addEventListener("click", () => {
    state.sns = button.dataset.sns;
    snsTabs.forEach((tab) => tab.classList.toggle("is-active", tab === button));
    renderResearch();
  });
});
researchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  statusPill.textContent = `${state.sns} researched`;
  renderResearch();
});

const youtubeForm = document.querySelector("#youtubeForm");
const scriptOutput = document.querySelector("#scriptOutput");
const thumbnailOutput = document.querySelector("#thumbnailOutput");

function renderYoutube() {
  const data = Object.fromEntries(new FormData(youtubeForm).entries());
  const points = String(data.points || "")
    .split("\n")
    .map((point) => point.trim())
    .filter(Boolean);
  scriptOutput.innerHTML = `
    <div class="panel-head">
      <h3>台本構成</h3>
      <span class="badge scheduled">生成済み</span>
    </div>
    <div class="script-block"><strong>冒頭</strong><p>ChatGPTに課金してるのにCodexを使ってない人、かなり損してます。</p></div>
    <div class="script-block"><strong>問題提起</strong><p>${data.audience}がつまずく「何をAIに任せればいいか」を先に整理。</p></div>
    <div class="script-block"><strong>実演</strong><p>${points.slice(0, 4).join("、")}を順番に見せる。</p></div>
    <div class="script-block"><strong>クライマックス</strong><p>テーマ入力だけでYouTube台本とサムネ案が出る瞬間を見せる。</p></div>
    <div class="script-block"><strong>CTA</strong><p>セットアップマニュアルとセキュリティ設定特典へ誘導。</p></div>
  `;
  thumbnailOutput.innerHTML = `
    <div class="panel-head">
      <h3>サムネ案</h3>
      <span class="mini-label">${data.theme}</span>
    </div>
    <div class="thumb-grid">
      <div class="thumb-card"><strong>課金者の9割 損してます</strong><span>ChatGPTだけはもったいない</span></div>
      <div class="thumb-card"><strong>Codexで仕事が終わる</strong><span>AI副業の作業を丸投げ</span></div>
      <div class="thumb-card"><strong>月20ドルでここまで!?</strong><span>画像・資料・操作まで実演</span></div>
      <div class="thumb-card"><strong>初心者こそCodex</strong><span>設定と安全な使い方を解説</span></div>
    </div>
  `;
  statusPill.textContent = "Generated";
}

youtubeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderYoutube();
});

generateDocuments();
renderThreads();
renderResearch();
renderYoutube();

const currentPage = window.location.pathname.split("/").filter(Boolean).pop();
const initialView = document.body.dataset.initialView || pageViewMap[currentPage] || "invoice";
switchView(initialView);
