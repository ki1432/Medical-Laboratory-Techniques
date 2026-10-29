console.log("Anesthesia Virtual Simulator loaded.");
setInterval(() => {
    const hr = Math.floor(Math.random() * (85 - 70 + 1)) + 70;
    const hrEl = document.getElementById('hr-val');
    if(hrEl) hrEl.innerText = hr + " bpm";
}, 2000);
