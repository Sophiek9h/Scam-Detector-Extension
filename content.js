// check if site is using https
function checkProtocol() {
  if (window.location.protocol !== "https:") {
    return {
      score: 50,
      reasons: ["This site is using HTTP instead of HTTPS. HTTP does not encrypt data, making it vulnerable to interception and attacks."]
    };
  }
  return { score: 0, reasons: [] };
}

// check for suspicious words in url
function checkSuspiciousWords() {
  const url = window.location.href.toLowerCase();
  let score = 0;
  let reasons = [];
  const suspiciousWords = {
    "urgent": 50, "prize": 50, "crypto": 50, "money": 80,
    "free": 40, "win": 40, "offer": 35, "click": 80, "download": 35, "bonus": 40
  };
  for (let word in suspiciousWords) {
    if (url.includes(word)) {
      score += suspiciousWords[word];
      reasons.push(`Suspicious word found in URL: ${word}`);
    }
  }
  return { score, reasons };
}

// check url structure
function checkUrlStructure() {
  const url = window.location.href.toLowerCase();
  const host = window.location.host.toLowerCase();
  let score = 0;
  let reasons = [];

  if (url.length > 75) {
    score += 30;
    reasons.push("URL is unusually long, which can be a tactic to hide malicious intent.");
  }
  if (host.split('.').length > 3) {
    score += 20;
    reasons.push("Domain has too many subdomains, which can be a tactic to mimic legitimate sites.");
  }
  const hyphenCount = (host.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 40;
    reasons.push("Too many hyphens in domain, which can be a tactic to mimic legitimate sites.");
  }
  return { score, reasons };
}

// Check for raw IP address as domain
function checkIpAddress() {
  const host = window.location.hostname;
  let score = 0;
  let reasons = [];

  const ipPattern = /^\d{1,3}(\.\d{1,3}){3}$/;
  if (ipPattern.test(host)) {
    score += 80;
    reasons.push("Site is using a raw IP address instead of a domain name. Legitimate sites almost never do this.");
  }
  return { score, reasons };
}

// Check for typosquatting
function checkTyposquatting() {
  const host = window.location.hostname.toLowerCase();
  let score = 0;
  let reasons = [];

  const popularSites = [
    "paypal", "google", "facebook", "amazon", "apple",
    "microsoft", "netflix", "instagram", "twitter", "youtube",
    "whatsapp", "linkedin", "tiktok", "snapchat", "pinterest"
  ];

  popularSites.forEach(site => {
    // Flag if the domain contains the brand name but isn't the real domain
    if (host.includes(site) && !host.endsWith(`${site}.com`)) {
      score += 80;
      reasons.push(`Domain may be impersonating ${site} — it contains the name but is not the real ${site}.com.`);
    }
  });

  return { score, reasons };
}

function runScan() {
  let totalScore = 0;
  let allReasons = [];

  const checks = [
    checkProtocol(),
    checkSuspiciousWords(),
    checkUrlStructure(),
    checkIpAddress(),       
    checkTyposquatting()   
  ];

  checks.forEach(result => {
    totalScore += result.score;
    allReasons.push(...result.reasons);
  });

  return { totalScore, allReasons };
}

function showModal(score, reasons, color) {
  document.getElementById('scam-detector-overlay')?.remove();
  document.getElementById('scam-detector-modal')?.remove();

  const isUnSafe = score >= 50;

  const overlay = document.createElement('div');
  overlay.id = 'scam-detector-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9998;
  `;

  const modal = document.createElement('div');
  modal.id = 'scam-detector-modal';
  modal.style.cssText = `
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 420px;
    max-width: 90%;
    z-index: 9999;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    font-family: sans-serif;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: absolute; top: 10px; right: 16px;
    background: none; border: none;
    font-size: 16px; cursor: pointer;
    color: #666;
  `;
  closeBtn.onclick = () => { overlay.remove(); modal.remove(); };

  const strip = document.createElement('div');
  strip.style.cssText = `
    background: ${color};
    border-radius: 8px;
    padding: 10px 16px;
    margin-top: 10px;
    margin-bottom: 16px;
    color: white;
    font-size: 18px;
    font-weight: bold;
  `;
  strip.textContent = color === "green"
    ? "✅ This Site Appears Safe"
    : isUnSafe
      ? "⚠️ Unsafe Site Detected"
      : "⚠️ Suspicious Site Detected";

  const scoreEl = document.createElement('p');
  scoreEl.style.cssText = `margin: 0 0 12px; font-size: 14px; color: #333;`;
  scoreEl.textContent = `Risk Score: ${score}`;

  const reasonsHeading = document.createElement('p');
  reasonsHeading.style.cssText = `margin: 0 0 8px; font-weight: bold; font-size: 14px; color: #333;`;
  reasonsHeading.textContent = reasons.length > 0 ? 'Reasons:' : '';

  const list = document.createElement('ul');
  list.style.cssText = `margin: 0; padding-left: 18px; font-size: 13px; color: #555; line-height: 1.6;`;
  reasons.forEach(reason => {
    const li = document.createElement('li');
    li.textContent = reason;
    list.appendChild(li);
  });

  modal.appendChild(closeBtn);
  modal.appendChild(strip);
  modal.appendChild(scoreEl);
  modal.appendChild(reasonsHeading);
  modal.appendChild(list);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  overlay.onclick = () => { overlay.remove(); modal.remove(); };
}

// Auto-scan on page load
const { totalScore, allReasons } = runScan();
if (totalScore >= 50) {
  showModal(totalScore, allReasons, "red");
} else if (totalScore >= 20) {
  showModal(totalScore, allReasons, "orange");
}

// Re-scan when icon is clicked
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showResult") {
    const { totalScore, allReasons } = runScan();
    if (totalScore >= 50) {
      showModal(totalScore, allReasons, "red");
    } else if (totalScore >= 20) {
      showModal(totalScore, allReasons, "orange");
    } else {
      showModal(totalScore, allReasons, "green");
    }
  }
  return true;
});