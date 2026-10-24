// ==========================================
// Virtual Lab Simulator & Physics Engine Logic
// ==========================================

let currentScore = 100;
let errorCount = 0;

function updateScore(penalty, note) {
    currentScore = Math.max(0, currentScore - penalty);
    if (penalty > 0) errorCount++;
    
    const scoreDisplay = document.getElementById('score-display');
    const errorDisplay = document.getElementById('error-count');
    const scoreNote = document.getElementById('score-note');

    if (scoreDisplay) scoreDisplay.innerText = currentScore + '%';
    if (errorDisplay) errorDisplay.innerText = errorCount;
    if (scoreNote && note) scoreNote.innerText = note;
}

function switchExperiment(expId) {
    const expGram = document.getElementById('exp-gram');
    const expBlood = document.getElementById('exp-blood');
    const expCentrifuge = document.getElementById('exp-centrifuge');

    if (expGram) expGram.classList.add('hidden');
    if (expBlood) expBlood.classList.add('hidden');
    if (expCentrifuge) expCentrifuge.classList.add('hidden');

    const btnGram = document.getElementById('btn-exp-gram');
    const btnBlood = document.getElementById('btn-exp-blood');
    const btnCentrifuge = document.getElementById('btn-exp-centrifuge');

    const defaultClass = "w-full text-right p-3.5 rounded-xl glass-card text-slate-200 flex items-center gap-3";
    const activeClass = "w-full text-right p-3.5 rounded-xl glass-card text-slate-200 border-cyan-500/50 bg-cyan-950/30 flex items-center gap-3";

    if (btnGram) btnGram.className = defaultClass;
    if (btnBlood) btnBlood.className = defaultClass;
    if (btnCentrifuge) btnCentrifuge.className = defaultClass;

    const selectedExp = document.getElementById('exp-' + expId);
    const selectedBtn = document.getElementById('btn-exp-' + expId);

    if (selectedExp) selectedExp.classList.remove('hidden');
    if (selectedBtn) selectedBtn.className = activeClass;
}

// ------------------------------------------
// 1. Gram Stain & Realistic Microscope Engine
// ------------------------------------------
let gramStep = 0;
let currentObjective = 4;
let stageX = 0;
let stageY = 0;
let hasOil = false;
let coarseFocus = 0;
let fineFocus = 50;

let appliedHeat = false;
let appliedViolet = false;
let appliedIodine = false;
let appliedDecolor = false;
let appliedSafranin = false;

function resetGramStain() {
    gramStep = 0;
    currentObjective = 4;
    stageX = 0;
    stageY = 0;
    hasOil = false;
    coarseFocus = 0;
    fineFocus = 50;

    appliedHeat = false;
    appliedViolet = false;
    appliedIodine = false;
    appliedDecolor = false;
    appliedSafranin = false;

    const smear = document.getElementById('slide-smear');
    const smearLabel = document.getElementById('smear-label');
    const resultText = document.getElementById('gram-result-text');
    const oilWarning = document.getElementById('oil-warning');
    const oilBtn = document.getElementById('btn-oil');
    const magLabel = document.getElementById('mag-level');

    if (smear) smear.className = "w-12 h-12 rounded-full bg-slate-400/20 border border-dashed border-slate-400 transition-all duration-700 flex items-center justify-center";
    if (smearLabel) smearLabel.innerText = "مسحة";
    if (resultText) resultText.innerHTML = '<span class="text-amber-400 font-bold"><i class="fa-solid fa-circle-info"></i> الحالة:</span> يرجى إكمال خطوات التثبيت والصبغ لمشاهدة العينة بوضوح.';
    if (oilWarning) oilWarning.classList.add('hidden');
    if (magLabel) magLabel.innerText = "العدسة الحالية: 4x";
    if (oilBtn) {
        oilBtn.className = "px-3 py-1 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 text-[11px] font-medium transition flex items-center gap-1.5";
        oilBtn.innerHTML = '<i class="fa-solid fa-droplet"></i> إضافة قطرة زيت';
    }

    updateRealisticMicroscopeView();

    for (let i = 1; i <= 5; i++) {
        const stepElem = document.getElementById('gstep-' + i);
        if (stepElem) {
            stepElem.className = i === 1 
                ? "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold" 
                : "p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400";
        }
    }
}

function applyGramStep(step) {
    const smear = document.getElementById('slide-smear');
    const smearLabel = document.getElementById('smear-label');

    if (step === 'heat') {
        appliedHeat = true;
        gramStep = Math.max(gramStep, 1);
        if (smear) smear.style.backgroundColor = "rgba(234, 88, 12, 0.3)";
        if (smearLabel) smearLabel.innerText = "مثبتة حرارياً";
        const g2 = document.getElementById('gstep-2');
        if (g2) g2.className = "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold";
    } 
    else if (step === 'violet') {
        if (!appliedHeat) { 
            updateScore(10, 'خطأ: لم تقم بالتثبيت الحراري أولاً!'); 
            alert('تحذير السلامة: يجب تثبيت المسحة حرارياً قبل إضافة الصبغة لمنع غسلها!'); 
            return; 
        }
        appliedViolet = true;
        gramStep = Math.max(gramStep, 2);
        if (smear) smear.style.backgroundColor = "rgba(147, 51, 234, 0.6)";
        if (smearLabel) smearLabel.innerText = "Crystal Violet";
        const g3 = document.getElementById('gstep-3');
        if (g3) g3.className = "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold";
    } 
    else if (step === 'iodine') {
        if (!appliedViolet) { 
            updateScore(10, 'خطأ ترتيب الصبغات!'); 
            alert('خطأ إجرائي: يجب إضافة صبغة Crystal Violet قبل مثبت اليود!'); 
            return; 
        }
        appliedIodine = true;
        gramStep = Math.max(gramStep, 3);
        const g4 = document.getElementById('gstep-4');
        if (g4) g4.className = "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold";
    } 
    else if (step === 'decolor') {
        if (!appliedIodine) { 
            updateScore(15, 'خطأ في التوقيت الإجرائي!'); 
            alert('خطأ: تم إزالة اللون قبل إضافة المثبت (Iodine)!'); 
            return; 
        }
        appliedDecolor = true;
        gramStep = Math.max(gramStep, 4);
        if (smear) smear.style.backgroundColor = "rgba(56, 189, 248, 0.4)";
        if (smearLabel) smearLabel.innerText = "Decolorized";
        const g5 = document.getElementById('gstep-5');
        if (g5) g5.className = "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold";
    } 
    else if (step === 'safranin') {
        if (!appliedDecolor) { 
            updateScore(10, 'خطأ إجرائي بالصبغة المقابلة!'); 
            return; 
        }
        appliedSafranin = true;
        gramStep = 5;
        if (smear) smear.style.backgroundColor = "rgba(244, 63, 94, 0.6)";
        if (smearLabel) smearLabel.innerText = "Safranin Ready";
    } 
    else if (step === 'wash') {
        // غسل بالماء
    }
    updateRealisticMicroscopeView();
}

function setObjectiveLens(lens) {
    currentObjective = lens;
    const magLabel = document.getElementById('mag-level');
    const oilWarning = document.getElementById('oil-warning');

    if (magLabel) magLabel.innerText = "العدسة الحالية: " + lens + "x";

    if (lens === 100 && !hasOil) {
        if (oilWarning) oilWarning.classList.remove('hidden');
    } else {
        if (oilWarning) oilWarning.classList.add('hidden');
    }

    updateRealisticMicroscopeView();
}

function applyImmersionOil() {
    hasOil = true;
    const oilBtn = document.getElementById('btn-oil');
    const oilWarning = document.getElementById('oil-warning');

    if (oilBtn) {
        oilBtn.className = "px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[11px] font-medium flex items-center gap-1.5";
        oilBtn.innerHTML = '<i class="fa-solid fa-check"></i> تم وضع زيت الغمر';
    }
    if (oilWarning) oilWarning.classList.add('hidden');

    updateRealisticMicroscopeView();
}

function adjustFocusPhysics() {
    const coarseElem = document.getElementById('coarse-knob');
    const fineElem = document.getElementById('fine-knob');
    
    if (coarseElem) {
        coarseFocus = parseInt(coarseElem.value);
        const cVal = document.getElementById('coarse-val');
        if (cVal) cVal.innerText = coarseFocus;
    }
    if (fineElem) {
        fineFocus = parseInt(fineElem.value);
        const fVal = document.getElementById('fine-val');
        if (fVal) fVal.innerText = fineFocus;
    }

    updateRealisticMicroscopeView();
}

function moveStage(direction) {
    const step = 20;
    if (direction === 'up') stageY += step;
    if (direction === 'down') stageY -= step;
    if (direction === 'left') stageX += step;
    if (direction === 'right') stageX -= step;

    updateRealisticMicroscopeView();
}

function updateRealisticMicroscopeView() {
    const container = document.getElementById('bacteria-container');
    const view = document.getElementById('microscope-view');
    
    if (!container || !view) return;

    view.style.transform = `translate(${stageX}px, ${stageY}px)`;

    let blurAmount = 0;
    if (currentObjective === 100) {
        let coarseDiff = Math.abs(coarseFocus - 50);
        let fineDiff = Math.abs(fineFocus - 50);
        blurAmount = (coarseDiff * 0.4) + (fineDiff * 0.1);
        if (!hasOil) blurAmount += 15;
    } else if (currentObjective === 40) {
        blurAmount = Math.abs(50 - fineFocus) * 0.15;
    } else {
        blurAmount = 2;
    }

    view.style.filter = `blur(${Math.max(0, blurAmount)}px)`;

    let html = '';
    let gramPositiveColor = "#7e22ce";
    let gramNegativeColor = "#f43f5e";

    if (!appliedViolet) {
        gramPositiveColor = gramNegativeColor = "#475569";
    } else if (appliedDecolor && !appliedSafranin) {
        gramNegativeColor = "rgba(100, 116, 139, 0.2)";
    } else if (appliedSafranin) {
        gramNegativeColor = "#e11d48";
    }

    for (let i = 0; i < 25; i++) {
        let posX = (i * 45) % 350 + 20;
        let posY = (i * 65) % 350 + 20;

        if (i % 2 === 0) {
            html += `
                <div style="position:absolute; left:${posX}px; top:${posY}px; display:flex; flex-wrap:wrap; width:18px;">
                    <div style="width:6px; height:6px; border-radius:50%; background:${gramPositiveColor}; margin:1px;"></div>
                    <div style="width:6px; height:6px; border-radius:50%; background:${gramPositiveColor}; margin:1px;"></div>
                    <div style="width:6px; height:6px; border-radius:50%; background:${gramPositiveColor}; margin:1px;"></div>
                    <div style="width:6px; height:6px; border-radius:50%; background:${gramPositiveColor}; margin:1px;"></div>
                </div>`;
        } else {
            html += `
                <div style="position:absolute; left:${posX + 40}px; top:${posY + 30}px; width:12px; height:6px; border-radius:3px; background:${gramNegativeColor}; transform:rotate(${i * 25}deg);"></div>`;
        }
    }

    container.innerHTML = html;
}

function diagnoseGram() {
    if (!appliedSafranin) {
        alert('يرجى إكمال خطوات صبغة غرام كاملة وضبط المجهر قبل اعتماد النتيجة.');
        return;
    }
    const resultText = document.getElementById('gram-result-text');
    if (resultText) {
        resultText.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-check-circle"></i> نتيجة التشخيص دقيقة:</span> عينة مختلطة تحتوي على Staphylococcus aureus و Escherichia coli بوضوح تام تحت العدسة الزيتية!';
    }
    updateScore(0, 'تم إنجاز تجربة صبغة غرام والمجهر الواقعي بنجاح تام.');
}

// ------------------------------------------
// 2. Blood Typing Simulator Logic
// ------------------------------------------
let addedA = false, addedB = false, addedD = false;
let mixedA = false, mixedB = false, mixedD = false;
const targetBlood = "A+";

function resetBloodTyping() {
    addedA = addedB = addedD = false;
    mixedA = mixedB = mixedD = false;

    const bloodA = document.getElementById('blood-a');
    const bloodB = document.getElementById('blood-b');
    const bloodD = document.getElementById('blood-d');
    const status = document.getElementById('blood-result-status');

    if (bloodA) { bloodA.className = "w-16 h-16 rounded-full bg-red-700/30 transition-all duration-500 flex items-center justify-center"; bloodA.innerHTML = ''; }
    if (bloodB) { bloodB.className = "w-16 h-16 rounded-full bg-red-700/30 transition-all duration-500 flex items-center justify-center"; bloodB.innerHTML = ''; }
    if (bloodD) { bloodD.className = "w-16 h-16 rounded-full bg-red-700/30 transition-all duration-500 flex items-center justify-center"; bloodD.innerHTML = ''; }
    if (status) status.innerText = "في انتظار إجراء الاختبار...";
}

function addReagent(type) {
    if (type === 'A') { addedA = true; const well = document.getElementById('well-a'); if (well) well.style.borderColor = "#3b82f6"; }
    if (type === 'B') { addedB = true; const well = document.getElementById('well-b'); if (well) well.style.borderColor = "#eab308"; }
    if (type === 'D') { addedD = true; const well = document.getElementById('well-d'); if (well) well.style.borderColor = "#94a3b8"; }
}

function mixWell(type) {
    if (type === 'A' && addedA) {
        mixedA = true;
        const bloodA = document.getElementById('blood-a');
        if (bloodA) {
            bloodA.className = "w-16 h-16 rounded-full bg-red-600 transition-all duration-500 flex items-center justify-center shadow-lg scale-110 border-2 border-red-400";
            bloodA.innerHTML = '<span class="text-[10px] text-white font-bold">تلازن (+)</span>';
        }
    }
    if (type === 'B' && addedB) {
        mixedB = true;
        const bloodB = document.getElementById('blood-b');
        if (bloodB) {
            bloodB.className = "w-16 h-16 rounded-full bg-red-900/40 transition-all duration-500 flex items-center justify-center";
            bloodB.innerHTML = '<span class="text-[10px] text-slate-300">سالب (-)</span>';
        }
    }
    if (type === 'D' && addedD) {
        mixedD = true;
        const bloodD = document.getElementById('blood-d');
        if (bloodD) {
            bloodD.className = "w-16 h-16 rounded-full bg-red-600 transition-all duration-500 flex items-center justify-center shadow-lg scale-110 border-2 border-red-400";
            bloodD.innerHTML = '<span class="text-[10px] text-white font-bold">تلازن Rh (+)</span>';
        }
    }
}

function checkBloodAnswer(ans) {
    if (!mixedA || !mixedD) {
        alert('يرجى إضافة الأجسام المضادة وخلطها في الآبار أولاً!');
        return;
    }
    const status = document.getElementById('blood-result-status');
    if (ans === targetBlood) {
        if (status) status.innerHTML = '<span class="text-emerald-400 font-bold">إجابة صحيحة!</span> الفصيلة المستنتجة هي A+ بنجاح.';
        updateScore(0, 'تم تحديد فصيلة الدم بدقة.');
    } else {
        updateScore(15, 'خطأ في قراءة تفاعل التلازن.');
        if (status) status.innerHTML = '<span class="text-rose-400 font-bold">إجابة خاطئة!</span> راجع تفاعل التلازن في الآبار.';
    }
}

// ------------------------------------------
// 3. Centrifuge Simulator Logic
// ------------------------------------------
let isBalanced = false;

function toggleBalanceTube(checked) {
    isBalanced = checked;
    const tube2 = document.getElementById('rotor-tube-2');
    if (tube2) {
        tube2.className = checked ? "w-full h-full rounded-b-lg bg-red-600/80 transition-all" : "w-full h-full rounded-b-lg bg-transparent transition-all";
    }
}

function startCentrifuge() {
    if (!isBalanced) {
        updateScore(25, 'خطأ خطير: اهتزاز الجهاز بسبب عدم وجود أنبوب الموازنة!');
        alert('تنبيه أمان حراري: تشغيل جهاز الطرد المركزي بدون أنبوب موازنة يسبب تلفاً خطيراً واهتزازاً للدوار!');
        return;
    }

    const disk = document.getElementById('rotor-disk');
    const btnSpin = document.getElementById('btn-spin');
    const layerPlasma = document.getElementById('layer-plasma');

    if (disk) disk.classList.add('spinning');
    if (btnSpin) btnSpin.innerText = "جاري الطرد المركزي...";

    setTimeout(() => {
        if (disk) disk.classList.remove('spinning');
        if (btnSpin) btnSpin.innerText = "تم الفصل بنجاح";
        if (layerPlasma) layerPlasma.style.height = "55%";
        updateScore(0, 'عملية الطرد المركزي تمت بأمان وبدون أخطاء.');
    }, 3000);
}

function resetCentrifuge() {
    const balanceCheck = document.getElementById('balance-check');
    const btnSpin = document.getElementById('btn-spin');
    const layerPlasma = document.getElementById('layer-plasma');

    if (balanceCheck) balanceCheck.checked = false;
    toggleBalanceTube(false);
    if (btnSpin) btnSpin.innerText = "بدء عملية الطرد المركزي";
    if (layerPlasma) layerPlasma.style.height = "100%";
}