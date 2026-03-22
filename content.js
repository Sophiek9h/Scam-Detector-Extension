// console.log('Scam detector running!!');

function checkProtocol() {
  if (window.location.protocol !== "https:") {
    return {
      score: 50,
      reasons: ["This site is using HTTP instead of HTTPS. HTTP does not encrypt data, making it vulnerable to interception and attacks."]
    };
  }
  return { score: 0, reasons: [] };
}


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
      console.log(`Suspicious word found in URL: ${word}`);
      reasons.push(`Suspicious word found in URL: ${word}`);
    }
  }
  return { score, reasons };
}


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


let totalScore = 0;
let allReasons = [];

let result1 = checkProtocol();
totalScore += result1.score;
allReasons.push(...result1.reasons);

let result2 = checkSuspiciousWords();
totalScore += result2.score;
allReasons.push(...result2.reasons);

let result3 = checkUrlStructure();
totalScore += result3.score;
allReasons.push(...result3.reasons);


let isUnSafe = totalScore >= 50;
let isWarning = totalScore >= 20 && totalScore < 50;


function showModal(score, reasons, color) {
  // Overlay (dark background behind modal)
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9998;
  `;

  // Modal box
  const modal = document.createElement('div');
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

  // Close button (X)
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: absolute; top: 10px; right: 16px;
    background: none; border: none;
    font-size: 16px; cursor: pointer;
    color: #666;
  `;
  closeBtn.onclick = () => {
    overlay.remove();
    modal.remove();
  };

  // Coloured top strip
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
  strip.textContent = isUnSafe ? "⚠️ Unsafe Site Detected" : "⚠️ Suspicious Site Detected";

  // Risk score
  const scoreEl = document.createElement('p');
  scoreEl.style.cssText = `margin: 0 0 12px; font-size: 14px; color: #333;`;
  scoreEl.textContent = `Risk Score: ${score}`;

  // Reasons heading
  const reasonsHeading = document.createElement('p');
  reasonsHeading.style.cssText = `margin: 0 0 8px; font-weight: bold; font-size: 14px; color: #333;`;
  reasonsHeading.textContent = 'Reasons:';

  // Reasons list
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

  // Clicking the overlay also closes the modal
  overlay.onclick = () => {
    overlay.remove();
    modal.remove();
  };
}

if (isUnSafe) {
  showModal(totalScore, allReasons, "red");
} else if (isWarning) {
  showModal(totalScore, allReasons, "orange");
} else {
  console.log("This site appears to be safe.");
}


console.log(`Risk Score: ${totalScore}`);