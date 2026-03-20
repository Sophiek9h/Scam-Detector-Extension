// console.log('Scam detector running!!');

// first rule for https & http
function checkProtocol() {
    if (window.location.protocol !== "https:"){
        console.log("This site is unsafe! (HTTP)");
        return 50;
    }
    return 0;
}

// second rule for suspicious keywords in url
function checkSuspiciousWords() {
    const url = window.location.href.toLowerCase();
    let score = 0;

    const suspiciousWords = {
    "urgent": 50,
    "prize": 50,
    "crypto": 50,
    "money": 80,
    "free": 40,
    "win": 40,
    "offer": 35,
    "click": 80,
    "download": 35,
    "bonus": 40
    };

    for (let word in suspiciousWords) {
        if (url.includes(word)) {
            score += suspiciousWords[word];
            console.log(`Suspicious word found in URL: ${word}`);
        } 

    }
    return score;
}

// calculate score based on all rules 
let riskScore = 0;

riskScore += checkProtocol();
riskScore += checkSuspiciousWords();


// Decision logic based on risk score
let isUnSafe = riskScore >= 50;
let isWarning = riskScore >= 20 && riskScore < 50;


// Reusable function to create and display banner 
function showBanner (message, color) {

    let banner = document.createElement('div');

    banner.textContent = message;
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.backgroundColor = color;
    banner.style.transition = "opacity 0.5s ease";
    banner.style.color = "white";
    banner.style.textAlign = "center";
    banner.style.padding = "10px";
    banner.style.zIndex = "9999";

    document.body.appendChild(banner);

    setTimeout(() => {
        banner.style.opacity = "0";
        setTimeout(() => {banner.remove();}, 500);
    }, 5000);
}


if (isUnSafe) {
    showBanner("Warning: This site is unsafe!", "red");
}else if (isWarning) {
    showBanner("Caution: This site may be suspicious!", "orange");
}else {
    showBanner("This site appears to be safe.", "green");
}

console.log(`Risk Score: ${riskScore}`);