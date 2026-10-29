console.log("Anesthesia Virtual Simulator loaded successfully.");
setInterval(() => {
    const hr = Math.floor(Math.random() * (85 - 72 + 1)) + 72;
    const hrEl = document.getElementById('hr-val');
    if(hrEl) hrEl.innerText = hr + " bpm";
}, 2000);
