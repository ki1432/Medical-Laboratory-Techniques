<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>المختبر الافتراضي المتقدم | قسم تقنيات المختبرات الطبية</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts Tajawal & Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">

    <style>
        * {
            font-family: 'Tajawal', 'Inter', sans-serif;
            user-select: none;
        }
        body {
            background: radial-gradient(circle at top right, #0f172a, #020617, #090d16);
            color: #f8fafc;
            min-height: 100vh;
        }
        .glass-panel {
            background: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        .glass-card {
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card:hover {
            border-color: rgba(56, 189, 248, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
        }
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }
            50% { box-shadow: 0 0 30px rgba(56, 189, 248, 0.7); }
        }
        .glow-active {
            animation: pulse-glow 2s infinite;
        }
        @keyframes spin-centrifuge {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .spinning {
            animation: spin-centrifuge 0.15s linear infinite;
        }
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #020617;
        }
        ::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #475569;
        }
    </style>
</head>
<body class="p-3 md:p-6 antialiased selection:bg-cyan-500 selection:text-white">

    <!-- Header & Navigation -->
    <header class="max-w-7xl mx-auto mb-6">
        <div class="glass-panel rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-lg shadow-cyan-500/30">
                    <i class="fa-solid fa-flask-vial"></i>
                </div>
                <div>
                    <h1 class="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                        المختبر الطبي الافتراضي المتقدم
                    </h1>
                    <p class="text-xs md:text-sm text-slate-400">قسم تقنيات المختبرات الطبية - محاكاة تشخيصية تفاعلية</p>
                </div>
            </div>
            
            <div class="flex items-center gap-3">
                <a href="index.html" class="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs md:text-sm font-medium transition border border-slate-700/50 flex items-center gap-2">
                    <i class="fa-solid fa-house"></i> الواجهة الرئيسية
                </a>
                <a href="student-portal.html" class="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs md:text-sm font-medium transition border border-slate-700/50 flex items-center gap-2">
                    <i class="fa-solid fa-graduation-cap"></i> بوابة الطالب
                </a>
            </div>
        </div>
    </header>

    <!-- Biosafety Banner -->
    <section class="max-w-7xl mx-auto mb-6">
        <div class="glass-panel rounded-xl p-4 border-r-4 border-amber-500 flex items-start gap-3 bg-amber-500/10">
            <i class="fa-solid fa-shield-virus text-amber-400 text-xl mt-1"></i>
            <div>
                <h2 class="text-sm font-bold text-amber-300">بروتوكول السلامة الأحيائية (Biosafety Level 2)</h2>
                <p class="text-xs text-slate-300 mt-0.5">تأكد دائماً من ارتداء معطف المختبر (Lab Coat)، القفازات الواقية (Gloves)، ونظارات الأمان قبل البدء بالتجارب. اختر التجربة أدناه للبدء بالمحاكاة.</p>
            </div>
        </div>
    </section>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Sidebar Navigation for Experiments -->
        <aside class="lg:col-span-3 space-y-3">
            <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">التجارب المتاحة</h2>
            
            <button onclick="switchExperiment('gram')" id="btn-exp-gram" class="w-full text-right p-3.5 rounded-xl glass-card text-slate-200 border-cyan-500/50 bg-cyan-950/30 flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg">
                    <i class="fa-solid fa-bacteria"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold">1. صبغة غرام (Gram Stain)</h3>
                    <p class="text-[11px] text-slate-400">التشخيص البكتيري والمجهر</p>
                </div>
            </button>

            <button onclick="switchExperiment('blood')" id="btn-exp-blood" class="w-full text-right p-3.5 rounded-xl glass-card text-slate-200 flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center text-lg">
                    <i class="fa-solid fa-droplet"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold">2. فصائل الدم (Blood Typing)</h3>
                    <p class="text-[11px] text-slate-400">تفاعل التلازن ABO & Rh</p>
                </div>
            </button>

            <button onclick="switchExperiment('centrifuge')" id="btn-exp-centrifuge" class="w-full text-right p-3.5 rounded-xl glass-card text-slate-200 flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                    <i class="fa-solid fa-rotate"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold">3. الطرد المركزي (Centrifuge)</h3>
                    <p class="text-[11px] text-slate-400">فصل مكونات الدم والرواسب</p>
                </div>
            </button>

            <!-- Live Performance Score Box -->
            <div class="glass-panel rounded-xl p-4 mt-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs text-slate-400">سجل الأداء التعليمي</span>
                    <i class="fa-solid fa-award text-yellow-400"></i>
                </div>
                <div class="text-2xl font-bold text-cyan-400" id="score-display">100%</div>
                <p class="text-[11px] text-slate-400 mt-1" id="score-note">أداء ممتاز، بدون أخطاء إجرائية.</p>
                <div class="mt-3 pt-3 border-t border-slate-700/50 flex justify-between text-[11px]">
                    <span class="text-slate-400">الأخطاء الإجرائية:</span>
                    <span class="text-rose-400 font-bold" id="error-count">0</span>
                </div>
            </div>
        </aside>

        <!-- Dynamic Interactive Area -->
        <section class="lg:col-span-9">

            <!-- 1. GRAM STAIN SIMULATOR -->
            <div id="exp-gram" class="glass-panel rounded-2xl p-4 md:p-6">
                <div class="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4 pb-4 border-b border-slate-700/50">
                    <div>
                        <h2 class="text-lg font-bold text-cyan-300 flex items-center gap-2">
                            <i class="fa-solid fa-microscope text-cyan-400"></i> محاكاة صبغة غرام والمجهر التشخيصي
                        </h2>
                        <p class="text-xs text-slate-400">قم بصبغ المسحة البكتيرية بالخطوات الصحيحة بالترتيب ثم افحصها تحت المجهر</p>
                    </div>
                    <button onclick="resetGramStain()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 self-start">
                        <i class="fa-solid fa-rotate-left"></i> إعادة التجربة
                    </button>
                </div>

                <!-- Step Navigator -->
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 text-center text-xs">
                    <div id="gstep-1" class="p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold">1. تثبيت حراري</div>
                    <div id="gstep-2" class="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400">2. Crystal Violet</div>
                    <div id="gstep-3" class="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400">3. Iodine</div>
                    <div id="gstep-4" class="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400">4. Decolorizer</div>
                    <div id="gstep-5" class="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400">5. Safranin</div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Glass Slide & Reagents Area -->
                    <div class="glass-card rounded-xl p-4 flex flex-col items-center justify-between min-h-[320px]">
                        <span class="text-xs text-slate-400 self-start">منصة التفاعل والتثبيت</span>
                        
                        <div class="relative w-64 h-20 bg-slate-200/20 backdrop-blur border-2 border-slate-400/50 rounded-md flex items-center justify-center my-6 overflow-hidden shadow-inner">
                            <div class="absolute left-2 text-[10px] text-slate-400 font-mono">Sample #A4</div>
                            <div id="slide-smear" class="w-12 h-12 rounded-full bg-slate-400/20 border border-dashed border-slate-400 transition-all duration-700 flex items-center justify-center">
                                <span id="smear-label" class="text-[9px] text-slate-300 opacity-70">مسحة</span>
                            </div>
                        </div>

                        <div class="w-full grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <button onclick="applyGramStep('heat')" class="p-2 rounded-lg bg-orange-950/40 border border-orange-500/40 hover:bg-orange-900/50 text-orange-300 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                                <i class="fa-solid fa-fire"></i> موقد بنسن
                            </button>
                            <button onclick="applyGramStep('violet')" class="p-2 rounded-lg bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/50 text-purple-300 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                                <i class="fa-solid fa-vial"></i> Crystal Violet
                            </button>
                            <button onclick="applyGramStep('iodine')" class="p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/50 text-amber-300 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                                <i class="fa-solid fa-bottle-droplet"></i> Gram's Iodine
                            </button>
                            <button onclick="applyGramStep('decolor')" class="p-2 rounded-lg bg-sky-950/40 border border-sky-500/40 hover:bg-sky-900/50 text-sky-300 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                                <i class="fa-solid fa-whiskey-glass"></i> Alcohol (95%)
                            </button>
                            <button onclick="applyGramStep('safranin')" class="p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/50 text-rose-300 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                                <i class="fa-solid fa-eye-dropper"></i> Safranin
                            </button>
                            <button onclick="applyGramStep('wash')" class="p-2 rounded-lg bg-blue-950/40 border border-blue-500/40 hover:bg-blue-900/50 text-blue-300 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                                <i class="fa-solid fa-faucet-drip"></i> غسل بالماء
                            </button>
                        </div>
                    </div>

                    <!-- Interactive Microscope Display -->
                    <div class="glass-card rounded-xl p-4 flex flex-col items-center justify-between">
                        <div class="w-full flex justify-between items-center text-xs text-slate-400 mb-2">
                            <span>عدسة المجهر الافتراضي</span>
                            <span id="mag-level" class="text-cyan-400 font-bold">التكبير: 10x</span>
                        </div>

                        <div class="relative w-56 h-56 rounded-full border-4 border-slate-700 bg-black overflow-hidden flex items-center justify-center shadow-2xl my-2">
                            <div class="absolute inset-0 border border-slate-800/40 rounded-full pointer-events-none"></div>
                            
                            <div id="microscope-view" class="w-full h-full flex items-center justify-center transition-all duration-300 filter blur-[8px]">
                                <div id="bacteria-container" class="relative w-full h-full flex items-center justify-center">
                                    <div class="text-[10px] text-slate-500">ضع الشريحة واضبط التركيز</div>
                                </div>
                            </div>

                            <div class="absolute w-full h-[1px] bg-cyan-500/20"></div>
                            <div class="absolute h-full w-[1px] bg-cyan-500/20"></div>
                        </div>

                        <div class="w-full space-y-3 mt-2">
                            <div class="flex justify-center gap-2">
                                <button onclick="setMagnification(10)" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300">10x</button>
                                <button onclick="setMagnification(40)" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300">40x</button>
                                <button onclick="setMagnification(100)" class="px-2.5 py-1 rounded bg-cyan-900 border border-cyan-500/40 text-[11px] text-cyan-200 font-bold">100x Oil</button>
                            </div>

                            <div class="flex items-center gap-2 text-xs text-slate-400">
                                <span>الضبط الدقيق (Focus):</span>
                                <input type="range" id="focus-knob" min="0" max="10" value="0" oninput="adjustFocus(this.value)" class="w-full accent-cyan-400">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col md:flex-row items-center justify-between gap-3">
                    <div id="gram-result-text" class="text-slate-300">
                        <span class="text-amber-400 font-bold"><i class="fa-solid fa-circle-info"></i> الحالة:</span> يرجى إكمال خطوات التثبيت والصبغ لمشاهدة العينة بوضوح.
                    </div>
                    <button onclick="diagnoseGram()" class="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs whitespace-nowrap transition shadow-lg shadow-cyan-600/30">
                        اعتماد النتيجة التشخيصية
                    </button>
                </div>
            </div>

            <!-- 2. BLOOD TYPING SIMULATOR -->
            <div id="exp-blood" class="glass-panel rounded-2xl p-4 md:p-6 hidden">
                <div class="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4 pb-4 border-b border-slate-700/50">
                    <div>
                        <h2 class="text-lg font-bold text-red-400 flex items-center gap-2">
                            <i class="fa-solid fa-droplet text-red-500"></i> محاكاة فحص فصائل الدم وتفاعل التلازن (ABO & Rh)
                        </h2>
                        <p class="text-xs text-slate-400">أضف الأجسام المضادة (Anti-A, Anti-B, Anti-D) على العينة واخلطها لتحديد الفصيلة</p>
                    </div>
                    <button onclick="resetBloodTyping()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 self-start">
                        <i class="fa-solid fa-rotate-left"></i> عينة جديدة
                    </button>
                </div>

                <div class="glass-card rounded-2xl p-6 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Well A -->
                        <div class="flex flex-col items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <span class="text-xs font-bold text-blue-400 mb-2">مصل Anti-A (أزرق)</span>
                            <div id="well-a" class="w-32 h-32 rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center relative overflow-hidden my-2 shadow-inner">
                                <div id="blood-a" class="w-16 h-16 rounded-full bg-red-700/30 transition-all duration-500 flex items-center justify-center"></div>
                            </div>
                            <div class="flex gap-2 mt-2 w-full">
                                <button onclick="addReagent('A')" class="w-1/2 py-1.5 rounded bg-blue-900/50 hover:bg-blue-800 border border-blue-500/30 text-[11px] text-blue-300 font-medium">قطرة Anti-A</button>
                                <button onclick="mixWell('A')" class="w-1/2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300">خلط عود</button>
                            </div>
                        </div>

                        <!-- Well B -->
                        <div class="flex flex-col items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <span class="text-xs font-bold text-yellow-400 mb-2">مصل Anti-B (أصفر)</span>
                            <div id="well-b" class="w-32 h-32 rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center relative overflow-hidden my-2 shadow-inner">
                                <div id="blood-b" class="w-16 h-16 rounded-full bg-red-700/30 transition-all duration-500 flex items-center justify-center"></div>
                            </div>
                            <div class="flex gap-2 mt-2 w-full">
                                <button onclick="addReagent('B')" class="w-1/2 py-1.5 rounded bg-yellow-900/50 hover:bg-yellow-800 border border-yellow-500/30 text-[11px] text-yellow-300 font-medium">قطرة Anti-B</button>
                                <button onclick="mixWell('B')" class="w-1/2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300">خلط عود</button>
                            </div>
                        </div>

                        <!-- Well D (Rh) -->
                        <div class="flex flex-col items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <span class="text-xs font-bold text-slate-300 mb-2">مصل Anti-D / Rh (شفاف)</span>
                            <div id="well-d" class="w-32 h-32 rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center relative overflow-hidden my-2 shadow-inner">
                                <div id="blood-d" class="w-16 h-16 rounded-full bg-red-700/30 transition-all duration-500 flex items-center justify-center"></div>
                            </div>
                            <div class="flex gap-2 mt-2 w-full">
                                <button onclick="addReagent('D')" class="w-1/2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] text-slate-200 font-medium">قطرة Anti-D</button>
                                <button onclick="mixWell('D')" class="w-1/2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300">خلط عود</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <span class="text-xs text-slate-400">حدد فصيلة الدم المستنتجة بناءً على التلازن (Agglutination):</span>
                        <div class="flex flex-wrap gap-2 mt-2" id="blood-type-selectors">
                            <button onclick="checkBloodAnswer('A+')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-red-950 hover:border-red-500 border border-slate-700 text-xs font-bold text-slate-200">A+</button>
                            <button onclick="checkBloodAnswer('A-')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-red-950 hover:border-red-500 border border-slate-700 text-xs font-bold text-slate-200">A-</button>
                            <button onclick="checkBloodAnswer('B+')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-red-950 hover:border-red-500 border border-slate-700 text-xs font-bold text-slate-200">B+</button>
                            <button onclick="checkBloodAnswer('B-')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-red-950 hover:border-red-500 border border-slate-700 text-xs font-bold text-slate-200">B-</button>
                            <button onclick="checkBloodAnswer('AB+')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-red-950 hover:border-red-500 border border-slate-700 text-xs font-bold text-slate-200">AB+</button>
                            <button onclick="checkBloodAnswer('AB-')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-red-950 hover:border-red-500 border border-slate-700 text-xs font-bold text-slate-200">AB-</button>
                            <button onclick="checkBloodAnswer('O+')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-red-950 hover:border-red-500 border border-slate-700 text-xs font-bold text-slate-200">O+</button>
                            <button onclick="checkBloodAnswer('O-')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-red-950 hover:border-red-500 border border-slate-700 text-xs font-bold text-slate-200">O-</button>
                        </div>
                    </div>
                    <div id="blood-result-status" class="text-xs text-slate-400 font-semibold text-center md:text-left">
                        في انتظار إجراء الاختبار...
                    </div>
                </div>
            </div>

            <!-- 3. CENTRIFUGE SIMULATOR -->
            <div id="exp-centrifuge" class="glass-panel rounded-2xl p-4 md:p-6 hidden">
                <div class="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4 pb-4 border-b border-slate-700/50">
                    <div>
                        <h2 class="text-lg font-bold text-emerald-400 flex items-center gap-2">
                            <i class="fa-solid fa-rotate text-emerald-500"></i> محاكاة جهاز الطرد المركزي (Centrifuge)
                        </h2>
                        <p class="text-xs text-slate-400">ضع أنبوب الدم مع الموازنة (Balance Tube) وضبط السرعة لعملية فصل المصل</p>
                    </div>
                    <button onclick="resetCentrifuge()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 self-start">
                        <i class="fa-solid fa-rotate-left"></i> إعادة التهيئة
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="glass-card rounded-xl p-6 flex flex-col items-center justify-center">
                        <span class="text-xs text-slate-400 mb-4">دوار الطرد المركزي (Rotor)</span>
                        
                        <div class="relative w-56 h-56 rounded-full border-8 border-slate-700 bg-slate-950 flex items-center justify-center shadow-2xl">
                            <div id="rotor-disk" class="w-48 h-48 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center relative transition-all">
                                <div class="absolute top-2 w-8 h-16 rounded-b-xl border border-red-500/40 bg-slate-800 flex flex-col items-center p-1">
                                    <div id="rotor-tube-1" class="w-full h-full rounded-b-lg bg-red-600/80 transition-all"></div>
                                </div>
                                <div class="absolute bottom-2 w-8 h-16 rounded-b-xl border border-slate-600 bg-slate-800 flex flex-col items-center p-1">
                                    <div id="rotor-tube-2" class="w-full h-full rounded-b-lg bg-transparent transition-all"></div>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center shadow-lg">
                                    <i class="fa-solid fa-gear text-slate-400"></i>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 flex items-center gap-3">
                            <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                <input type="checkbox" id="balance-check" onchange="toggleBalanceTube(this.checked)" class="rounded accent-emerald-500 w-4 h-4">
                                إضافة أنبوب الموازنة (Balance Tube)
                            </label>
                        </div>
                    </div>

                    <div class="glass-card rounded-xl p-6 flex flex-col justify-between space-y-4">
                        <div>
                            <h3 class="text-sm font-bold text-slate-200 mb-3">إعدادات جهاز الطرد</h3>
                            
                            <div class="space-y-2 mb-4">
                                <div class="flex justify-between text-xs text-slate-400">
                                    <span>سرعة الدوران (RPM):</span>
                                    <span id="rpm-val" class="text-emerald-400 font-bold">3500 RPM</span>
                                </div>
                                <input type="range" id="rpm-slider" min="1000" max="5000" step="500" value="3500" oninput="document.getElementById('rpm-val').innerText = this.value + ' RPM'" class="w-full accent-emerald-400">
                            </div>

                            <div class="space-y-2 mb-4">
                                <div class="flex justify-between text-xs text-slate-400">
                                    <span>زمن الطرد:</span>
                                    <span id="time-val" class="text-emerald-400 font-bold">5 دقائق</span>
                                </div>
                                <input type="range" id="time-slider" min="1" max="15" value="5" oninput="document.getElementById('time-val').innerText = this.value + ' دقائق'" class="w-full accent-emerald-400">
                            </div>

                            <button id="btn-spin" onclick="startCentrifuge()" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2">
                                <i class="fa-solid fa-play"></i> بدء عملية الطرد المركزي
                            </button>
                        </div>

                        <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div class="text-xs space-y-1">
                                <div class="text-amber-300 font-bold">نتيجة الفصل:</div>
                                <div class="text-[11px] text-slate-400"><span class="inline-block w-2 h-2 rounded-full bg-yellow-400 ml-1"></span> البلازما (Plasma): ~55%</div>
                                <div class="text-[11px] text-slate-400"><span class="inline-block w-2 h-2 rounded-full bg-slate-200 ml-1"></span> طبقة الكريات البيضاء (Buffy Coat): ~1%</div>
                                <div class="text-[11px] text-slate-400"><span class="inline-block w-2 h-2 rounded-full bg-red-600 ml-1"></span> كريات الدم الحمراء (RBCs): ~45%</div>
                            </div>
                            <div id="result-tube" class="w-6 h-24 rounded-b-xl border border-slate-500 bg-slate-800 flex flex-col overflow-hidden shadow-md">
                                <div id="layer-plasma" class="w-full h-full bg-red-600 transition-all duration-1000"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </main>

    <!-- JavaScript Simulator Logic -->
    <script>
        let currentScore = 100;
        let errorCount = 0;

        function updateScore(penalty, note) {
            currentScore = Math.max(0, currentScore - penalty);
            if (penalty > 0) errorCount++;
            document.getElementById('score-display').innerText = currentScore + '%';
            document.getElementById('error-count').innerText = errorCount;
            if (note) document.getElementById('score-note').innerText = note;
        }

        function switchExperiment(expId) {
            document.getElementById('exp-gram').classList.add('hidden');
            document.getElementById('exp-blood').classList.add('hidden');
            document.getElementById('exp-centrifuge').classList.add('hidden');

            document.getElementById('btn-exp-gram').className = "w-full text-right p-3.5 rounded-xl glass-card text-slate-200 flex items-center gap-3";
            document.getElementById('btn-exp-blood').className = "w-full text-right p-3.5 rounded-xl glass-card text-slate-200 flex items-center gap-3";
            document.getElementById('btn-exp-centrifuge').className = "w-full text-right p-3.5 rounded-xl glass-card text-slate-200 flex items-center gap-3";

            document.getElementById('exp-' + expId).classList.remove('hidden');
            document.getElementById('btn-exp-' + expId).className = "w-full text-right p-3.5 rounded-xl glass-card text-slate-200 border-cyan-500/50 bg-cyan-950/30 flex items-center gap-3";
        }

        // Gram Stain State
        let gramStep = 0;
        let currentMag = 10;
        let currentFocus = 0;
        let appliedHeat = false;
        let appliedViolet = false;
        let appliedIodine = false;
        let appliedDecolor = false;
        let appliedSafranin = false;

        function resetGramStain() {
            gramStep = 0;
            appliedHeat = false;
            appliedViolet = false;
            appliedIodine = false;
            appliedDecolor = false;
            appliedSafranin = false;
            document.getElementById('slide-smear').className = "w-12 h-12 rounded-full bg-slate-400/20 border border-dashed border-slate-400 transition-all duration-700 flex items-center justify-center";
            document.getElementById('smear-label').innerText = "مسحة";
            document.getElementById('gram-result-text').innerHTML = '<span class="text-amber-400 font-bold"><i class="fa-solid fa-circle-info"></i> الحالة:</span> يرجى إكمال خطوات التثبيت والصبغ لمشاهدة العينة بوضوح.';
            updateMicroscopeView();
            for(let i=1; i<=5; i++) {
                document.getElementById('gstep-'+i).className = i===1 ? "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold" : "p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400";
            }
        }

        function applyGramStep(step) {
            if (step === 'heat') {
                appliedHeat = true;
                gramStep = Math.max(gramStep, 1);
                document.getElementById('slide-smear').style.backgroundColor = "rgba(234, 88, 12, 0.3)";
                document.getElementById('smear-label').innerText = "مثبتة حرارياً";
                document.getElementById('gstep-2').className = "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold";
            } else if (step === 'violet') {
                if(!appliedHeat) { updateScore(10, 'خطأ: لم تقم بالتثبيت الحراري أولاً!'); alert('تحذير السلامة: يجب تثبيت المسحة حرارياً قبل إضافة الصبغة لمنع غسلها!'); return; }
                appliedViolet = true;
                gramStep = Math.max(gramStep, 2);
                document.getElementById('slide-smear').style.backgroundColor = "rgba(147, 51, 234, 0.6)";
                document.getElementById('smear-label').innerText = "Crystal Violet";
                document.getElementById('gstep-3').className = "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold";
            } else if (step === 'iodine') {
                if(!appliedViolet) { updateScore(10, 'خطأ ترتيب الصبغات!'); alert('خطأ إجرائي: يجب إضافة صبغة Crystal Violet قبل مثبت اليود!'); return; }
                appliedIodine = true;
                gramStep = Math.max(gramStep, 3);
                document.getElementById('gstep-4').className = "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold";
            } else if (step === 'decolor') {
                if(!appliedIodine) { updateScore(15, 'خطأ في التوقيت الإجرائي!'); alert('خطأ: تم إزالة اللون قبل إضافة المثبت (Iodine)!'); return; }
                appliedDecolor = true;
                gramStep = Math.max(gramStep, 4);
                document.getElementById('slide-smear').style.backgroundColor = "rgba(56, 189, 248, 0.4)";
                document.getElementById('smear-label').innerText = "Decolorized";
                document.getElementById('gstep-5').className = "p-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold";
            } else if (step === 'safranin') {
                if(!appliedDecolor) { updateScore(10, 'خطأ إجرائي بالصبغة المقابلة!'); return; }
                appliedSafranin = true;
                gramStep = 5;
                document.getElementById('slide-smear').style.backgroundColor = "rgba(244, 63, 94, 0.6)";
                document.getElementById('smear-label').innerText = "Safranin Ready";
            } else if (step === 'wash') {
                // water wash step
            }
            updateMicroscopeView();
        }

        function setMagnification(mag) {
            currentMag = mag;
            document.getElementById('mag-level').innerText = "التكبير: " + mag + "x";
            updateMicroscopeView();
        }

        function adjustFocus(val) {
            currentFocus = parseInt(val);
            updateMicroscopeView();
        }

        function updateMicroscopeView() {
            const container = document.getElementById('bacteria-container');
            const view = document.getElementById('microscope-view');
            
            let blurAmount = Math.abs(8 - currentFocus);
            if (currentMag === 100) blurAmount = Math.max(0, blurAmount - 2);
            view.style.filter = `blur(${blurAmount}px)`;

            if (currentMag < 40) {
                container.innerHTML = '<span class="text-[10px] text-slate-400">انتقل إلى عدسة 100x Oil لمشاهدة البكتيريا بوضوح</span>';
                return;
            }

            let html = '';
            let color = "#64748b";
            if (appliedViolet && !appliedDecolor) color = "#7e22ce";
            else if (appliedDecolor && !appliedSafranin) color = "#7e22ce";
            else if (appliedSafranin) color = "#e11d48";

            for(let i=0; i<12; i++) {
                let left = 20 + (i * 15) % 180;
                let top = 20 + (i * 23) % 160;
                if(i % 2 === 0) {
                    let cColor = color;
                    html += `<div style="position:absolute; left:${left}px; top:${top}px; width:8px; height:8px; border-radius:50%; background:${cColor};"></div>`;
                } else {
                    let bColor = (appliedSafranin) ? "#f43f5e" : color;
                    html += `<div style="position:absolute; left:${left}px; top:${top}px; width:12px; height:6px; border-radius:3px; background:${bColor}; transform:rotate(45deg);"></div>`;
                }
            }
            container.innerHTML = html;
        }

        function diagnoseGram() {
            if(!appliedSafranin) {
                alert('يرجى إكمال خطوات صبغة غرام كاملة قبل اعتماد النتيجة.');
                return;
            }
            document.getElementById('gram-result-text').innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-check-circle"></i> نتيجة التشخيص دقيقة:</span> عينة مختلطة تحتوي على (Staphylococcus aureus - مكورات موجبة لغرام بنفجية) و (Escherichia coli - عصيات سالبة لغرام وردية). ممتاز!';
            updateScore(0, 'تم إنجاز تجربة صبغة غرام بنجاح تام.');
        }

        // Blood Typing State
        let addedA = false, addedB = false, addedD = false;
        let mixedA = false, mixedB = false, mixedD = false;
        const targetBlood = "A+";

        function resetBloodTyping() {
            addedA = addedB = addedD = false;
            mixedA = mixedB = mixedD = false;
            document.getElementById('blood-a').className = "w-16 h-16 rounded-full bg-red-700/30 transition-all duration-500 flex items-center justify-center";
            document.getElementById('blood-b').className = "w-16 h-16 rounded-full bg-red-700/30 transition-all duration-500 flex items-center justify-center";
            document.getElementById('blood-d').className = "w-16 h-16 rounded-full bg-red-700/30 transition-all duration-500 flex items-center justify-center";
            document.getElementById('blood-result-status').innerText = "في انتظار إجراء الاختبار...";
        }

        function addReagent(type) {
            if(type === 'A') { addedA = true; document.getElementById('well-a').style.borderColor = "#3b82f6"; }
            if(type === 'B') { addedB = true; document.getElementById('well-b').style.borderColor = "#eab308"; }
            if(type === 'D') { addedD = true; document.getElementById('well-d').style.borderColor = "#94a3b8"; }
        }

        function mixWell(type) {
            if(type === 'A' && addedA) {
                mixedA = true;
                document.getElementById('blood-a').className = "w-16 h-16 rounded-full bg-red-600 transition-all duration-500 flex items-center justify-center shadow-lg scale-110 border-2 border-red-400";
                document.getElementById('blood-a').innerHTML = '<span class="text-[10px] text-white font-bold">تلازن (+)</span>';
            }
            if(type === 'B' && addedB) {
                mixedB = true;
                document.getElementById('blood-b').className = "w-16 h-16 rounded-full bg-red-900/40 transition-all duration-500 flex items-center justify-center";
                document.getElementById('blood-b').innerHTML = '<span class="text-[10px] text-slate-300">سالب (-)</span>';
            }
            if(type === 'D' && addedD) {
                mixedD = true;
                document.getElementById('blood-d').className = "w-16 h-16 rounded-full bg-red-600 transition-all duration-500 flex items-center justify-center shadow-lg scale-110 border-2 border-red-400";
                document.getElementById('blood-d').innerHTML = '<span class="text-[10px] text-white font-bold">تلازن Rh (+)</span>';
            }
        }

        function checkBloodAnswer(ans) {
            if(!mixedA || !mixedD) {
                alert('يرجى إضافة الأجسام المضادة وخلطها في الآبار أولاً!');
                return;
            }
            if(ans === targetBlood) {
                document.getElementById('blood-result-status').innerHTML = '<span class="text-emerald-400 font-bold">إجابة صحيحة!</span> الفصيلة المستنتجة هي A+ بنجاح.';
                updateScore(0, 'تم تحديد فصيلة الدم بدقة.');
            } else {
                updateScore(15, 'خطأ في قراءة تفاعل التلازن.');
                document.getElementById('blood-result-status').innerHTML = '<span class="text-rose-400 font-bold">إجابة خاطئة!</span> راجع تفاعل التلازن في آبار Anti-A و Anti-D.';
            }
        }

        // Centrifuge State
        let isBalanced = false;
        function toggleBalanceTube(checked) {
            isBalanced = checked;
            const tube2 = document.getElementById('rotor-tube-2');
            if(checked) {
                tube2.className = "w-full h-full rounded-b-lg bg-red-600/80 transition-all";
            } else {
                tube2.className = "w-full h-full rounded-b-lg bg-transparent transition-all";
            }
        }

        function startCentrifuge() {
            if(!isBalanced) {
                updateScore(25, 'خطأ خطير: اهتزاز الجهاز بسبب عدم وجود أنبوب الموازنة!');
                alert('تنبيه أمان حراري: تشغيل جهاز الطرد المركزي بدون أنبوب موازنة (Balance Tube) يسبب تلفاً خطيراً واهتزازاً مدمراً للدوار!');
                return;
            }
            const disk = document.getElementById('rotor-disk');
            disk.classList.add('spinning');
            document.getElementById('btn-spin').innerText = "جاري الطرد المركزي...";
            
            setTimeout(() => {
                disk.classList.remove('spinning');
                document.getElementById('btn-spin').innerText = "تم الفصل بنجاح";
                document.getElementById('layer-plasma').style.height = "55%";
                updateScore(0, 'عملية الطرد المركزي تمت بأمان وبدون أخطاء.');
            }, 3000);
        }

        function resetCentrifuge() {
            document.getElementById('balance-check').checked = false;
            toggleBalanceTube(false);
            document.getElementById('btn-spin').innerText = "بدء عملية الطرد المركزي";
            document.getElementById('layer-plasma').style.height = "100%";
        }
    </script>
</body>
</html>