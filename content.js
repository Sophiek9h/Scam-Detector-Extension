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
let status = isUnSafe ? "⚠️ Unsafe Site" : "⚠️ Suspicious Site";
let message = `${status}\n\n Risk Score: ${totalScore}.\n\n Reasons:\n- ${allReasons.join("\n- ")}`;


function showBanner(message, color) {
  let banner = document.createElement('div');

  banner.textContent = message;

  banner.style.cssText = `position:fixed; top:0; left:0; width:100%; background:${color};
    color:white; text-align:center; padding:10px; z-index:9999; transition:opacity 0.5s ease;`;

  document.body.appendChild(banner);

  setTimeout(() => {
    banner.style.opacity = "0";
    setTimeout(() => banner.remove(), 500);
  }, 5000);

}


if (isUnSafe) {
  showBanner(message, "red");
} else if (isWarning) {
  showBanner(message, "orange");
} else {
  console.log("This site appears to be safe.");
}


console.log(`Risk Score: ${totalScore}`);