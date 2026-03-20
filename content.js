// console.log('Scam detector running!!');

let riskScore = 0;

const protocol = window.location.protocol;
const url = window.location.href.toLowerCase();

const suspiciousWords = [
  "free",
  "crypto",
  "urgent",
  "bonus",
  "win",
  "prize",
  "money",
  "offer",
  "click",
  "download"
];



// first rule for https & http
if (protocol !== "https:"){
    riskScore += 50;
    // console.log("This site is unsafe! (HTTP)");
}

// second rule for suspicious keywords in url
suspiciousWords.forEach(word => {
    if (url.includes(word)){
        riskScore += 30;
        console.log(`Suspicious word found in URL: ${word}`);
    }
})

if (riskScore >= 50){
    console.log("This site is unsafe!");

    let banner = document.createElement("div");

    banner.textContent = `⚠️ Risk Score: ${riskScore} - This site may be unsafe`;
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.backgroundColor = "red";
    banner.style.transition = "opacity 0.5s ease";
    banner.style.color = "white";
    banner.style.textAlign = "center";
    banner.style.padding = "10px";
    banner.style.zIndex = "9999";

    document.body.appendChild(banner);

    // timeout to remove the banner after 5 seconds
    setTimeout(() => {
        banner.style.opacity = "0";
        setTimeout(() => {banner.remove();}, 500);
    }, 5000);


}else{
    console.log("This site is safe!");

    let banner = document.createElement("div");

    banner.textContent = `✅ Risk Score: ${riskScore} - This site is safe`;
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.backgroundColor = "green";
    banner.style.transition = "opacity 0.5s ease";
    banner.style.color = "white";
    banner.style.textAlign = "center";
    banner.style.padding = "10px";
    banner.style.zIndex = "9999";

    document.body.appendChild(banner);

    setTimeout(() => {
        banner.style.transition = "0"

        setTimeout(() => {banner.remove();}, 500);

    }, 5000);

}


console.log("risk score: " + riskScore);
