'use strict';
// Educational cases: authored examples, not patient data. Increment VERSION when scoring changes.
const VERSION = 1;
const STORAGE_KEY = 'mlt-virtual-lab-v1';
const SOURCES = {
 cbc: {name:'NHS · متطلبات عينة تعداد الدم',url:'https://www.nbt.nhs.uk/severn-pathology/requesting/test-information/full-blood-count'},
 anemia: {name:'Merck Manual · فقر الدم بعوز الحديد',url:'https://www.merckmanuals.com/professional/hematology/anemias-caused-by-deficient-erythropoiesis/iron-deficiency-anemia'},
 urine: {name:'MedlinePlus · النتريت في البول وجمع العينة',url:'https://medlineplus.gov/lab-tests/nitrites-in-urine/'},
 gram: {name:'OpenStax · صبغ العينات المجهرية',url:'https://openstax.org/books/microbiology/pages/2-4-staining-microscopic-specimens'},
 asm: {name:'ASM · مرجع صبغة غرام (PDF)',url:'https://asm.org/getcontentasset/4b39bb62-6b77-4db3-8bfd-af8faba12a98/dfc3d011-8f63-43f6-9ed8-4b444333a1d0/gram-stain-protocols.pdf?language=en-US'}
};
const CASES = [
 {id:'anemia',title:'لغز فقر الدم',subject:'علم الدم',time:'6–8 دقائق',badge:'قارئ مؤشرات الدم',description:'من أنبوب العينة إلى تفسير مؤشرات كريات الدم الحمراء.',story:'حالة افتراضية: طالبة عمرها 22 عاماً تشكو التعب. طُلب تعداد دم كامل (CBC). مهمتك تقييم العينة وقراءة النتائج، دون وصف علاج.',sources:['cbc','anemia'],figure:'blood',table:[['Hb','9.0 g/dL','12–16'],['MCV','68 fL','80–100'],['Ferritin','8 ng/mL','15–150']],tableNote:'قيم ومجالات مرجعية افتراضية لامرأة بالغة في هذا التمرين؛ تُستخدم مجالات المختبر الفعلية عند العمل.',steps:[
 {stage:'اختيار العينة',q:'أي عينة تختار لفحص CBC؟',options:['مصل في أنبوب دون مانع تخثر','دم كامل في أنبوب يحتوي EDTA','بول في وعاء معقم'],answer:1,why:'يحتاج CBC إلى خلايا الدم في عينة دم كامل مع EDTA. المصل لا يحتوي المكونات الخلوية اللازمة للعد. اعتمد اسم المادة المضافة؛ ألوان الأغطية قد تختلف.',source:'cbc'},
 {stage:'جودة العينة',q:'وُجدت خثرة في عينة CBC. ما التصرف المناسب؟',options:['إزالة الخثرة ثم إصدار النتائج','رجّ الأنبوب بقوة لإذابة الخثرة','رفض العينة وفق سياسة المختبر وطلب إعادة الجمع'],answer:2,why:'قد تُحتجز الخلايا في الخثرة فتتأثر دقة العد. إزالة الخثرة لا تعيد صلاحية العينة. تُوثّق المشكلة وتُعاد العينة وفق الإجراء المعتمد.',source:'cbc'},
 {stage:'قراءة النتائج',context:'وصلت عينة بديلة مقبولة، وأصبحت النتائج الافتراضية في الجدول متاحة.',showResults:true,q:'Hb = 9.0 g/dL وMCV = 68 fL. كيف تصنف النمط؟',options:['فقر دم صغير الكريات','فقر دم كبير الكريات','لا يوجد فقر دم وفق المجال المعروض'],answer:0,why:'الهيموغلوبين أقل من المجال المعروض، وMCV أقل من 80 fL؛ إذن النمط صغير الكريات. هذا وصف للنمط وليس تحديداً نهائياً للسبب.',source:'anemia'},
 {stage:'ربط الأدلة',showResults:true,q:'مع هذا النمط، ماذا تدعم قيمة Ferritin = 8 ng/mL؟',options:['نقص مخزون الحديد','زيادة مخزون الحديد','أن سبب فقر الدم قد حُسم دون أي سياق آخر'],answer:0,why:'الفيريتين المنخفض يدعم نقص مخزون الحديد. تفسير السبب يحتاج القصة السريرية وبقية الفحوص؛ الفيريتين قد يرتفع أيضاً مع الالتهاب.',source:'anemia'},
 {stage:'حدود الاستنتاج',showResults:true,q:'أي خلاصة تعليمية هي الأدق لهذه النتائج؟',options:['بدء علاج بجرعة محددة من الموقع','نمط يدعم عوز الحديد ويحتاج تقييماً سريرياً لسببه','انخفاض MCV يثبت الثلاسيميا وحدها'],answer:1,why:'اجتماع انخفاض Hb وMCV والفيريتين يدعم عوز الحديد في هذا المثال. يُقيّم الطبيب السبب؛ مؤشرات الدم وحدها لا تبرر وصف علاج أو استبعاد كل الاحتمالات.',source:'anemia'}]},
 {id:'urine',title:'ما الذي تخبرنا به العينة؟',subject:'تحليل البول',time:'5–7 دقائق',badge:'مستكشف تحليل البول',description:'اجمع الدليل من جودة العينة وشريط الفحص ونتائجها.',story:'حالة افتراضية: شخص بالغ لديه حرقة وتكرار تبول. طُلب تحليل بول. ركّز على جمع العينة ومعنى النتائج وحدودها.',sources:['urine'],figure:'urine',table:[['Nitrite','Positive','Negative'],['Leukocyte esterase','Positive','Negative']],tableNote:'نتائج تعليمية افتراضية. لا تُحدد هذه النتائج وحدها نوع البكتريا أو العلاج.',steps:[
 {stage:'اختيار العينة',q:'ما الاختيار الأنسب لعينة نظيفة في هذه الحالة؟',options:['عينة من منتصف جريان البول في الوعاء المخصص وفق التعليمات','عينة تُجمع من المرحاض','عينة في وعاء منزلي مستخدم'],answer:0,why:'جمع منتصف الجريان في وعاء مخصص وباتباع تعليمات النظافة يقلل تلوث العينة بجراثيم الجلد.',source:'urine'},
 {stage:'تسلسل الجمع',type:'order',q:'رتّب مراحل الجمع المبسطة، من الأولى إلى الأخيرة.',context:'هذا ترتيب تعليمي؛ تُتبع تعليمات الجمع التفصيلية الصادرة من المختبر.',items:['غسل اليدين وتنظيف المنطقة وفق التعليمات','بدء التبول في المرحاض','جمع منتصف الجريان دون لمس داخل الوعاء','إغلاق الوعاء وتسليمه وفق تعليمات المختبر'],display:[2,0,3,1],answer:[0,1,2,3],why:'النظافة أولاً، ثم يُترك الجزء الأول، ويُجمع منتصف الجريان مع حماية الوعاء من التلوث، ثم يُغلق ويُسلّم.',source:'urine'},
 {stage:'قراءة الشريط',showResults:true,q:'النتريت موجب في العينة. أي تفسير هو الأنسب؟',options:['يثبت نوع البكتريا بدقة','يدعم احتمال وجود عدوى بولية ضمن السياق السريري','يثبت أن العينة طبيعية'],answer:1,why:'بعض البكتريا تحوّل النترات إلى نتريت. إيجابيته تدعم احتمال العدوى، لكنها لا تحدد النوع الجرثومي.',source:'urine'},
 {stage:'اكتشاف الاستنتاج الخاطئ',q:'في عينة أخرى كانت نتيجة النتريت سلبية رغم وجود أعراض. ماذا نستنتج؟',options:['تُستبعد العدوى البولية قطعياً','لا حاجة لأي تقييم آخر','النتيجة السلبية لا تنفي العدوى البولية'],answer:2,why:'ليست كل البكتريا المسببة للعدوى تنتج النتريت؛ لذلك لا تكفي النتيجة السلبية لنفي العدوى.',source:'urine'},
 {stage:'الخطوة التالية',showResults:true,q:'ما دور زرع البول عند طلبه ضمن تقييم الحالة؟',options:['المساعدة في تحديد الجرثومة وتوجيه تقييم حساسيتها','استبدال جميع بيانات المريض','اختيار دواء تلقائياً دون تقييم طبي'],answer:0,why:'قد يُطلب الزرع للمساعدة في تحديد الجرثومة وتقييم حساسيتها. تُربط النتائج بالأعراض والتقييم الطبي.',source:'urine'}]},
 {id:'gram',title:'شيفرة اللون البنفسجي',subject:'البكتريا الطبية والتشخيصية',time:'6–8 دقائق',badge:'محقق صبغة غرام',description:'رتّب الصبغات، اقرأ الشكل واللون، واكتشف خطأ الجودة.',story:'أمامك لطاخة تعليمية افتراضية مُحضّرة مسبقاً. ستراجع تسلسل الصبغ وتصف مظهراً توضيحياً، ثم تقيّم خطأ في ضبط الجودة. لا يتضمن التدريب زراعة كائنات أو التعامل مع عينات حقيقية.',sources:['gram','asm'],figure:'gram',steps:[
 {stage:'ترتيب الكواشف',type:'order',q:'رتّب الكواشف الأساسية لصبغة غرام.',context:'رتّب الكواشف فقط؛ لا يمثل هذا السؤال إجراء تشغيل مختبرياً كاملاً.',items:['البنفسجي البلوري · Crystal violet','يود غرام · Iodine','مزيل اللون · Decolorizer','السافرانين · Safranin'],display:[3,1,0,2],answer:[0,1,2,3],why:'تبدأ الصبغة الأولية، يليها اليود لتكوين المعقّد، ثم إزالة اللون، ثم الصبغة المقابلة. مراحل التحضير والغسل وضبط الجودة تُراجع في إجراء المختبر.',source:'asm'},
 {stage:'فهم الكاشف',q:'ما الدور الأساسي ليود غرام؟',options:['صبغ الخلايا بالوردي كصبغة مقابلة','تكوين معقّد مع البنفسجي البلوري','تحديد النوع البكتيري وحده'],answer:1,why:'اليود عامل تثبيت للصبغة (mordant)؛ يتفاعل مع البنفسجي البلوري لتكوين المعقّد الذي يختلف احتفاظ الخلايا به بعد إزالة اللون.',source:'gram'},
 {stage:'قراءة المشهد',showResults:true,q:'يُظهر الرسم مكورات بنفسجية متجمعة. ما الوصف المبدئي المناسب؟',options:['عصيات سالبة غرام','مكورات موجبة غرام في تجمعات','تحديد مؤكد للنوع Staphylococcus aureus'],answer:1,why:'في صبغة صحيحة، يشير البنفسجي إلى إيجابية غرام، والشكل الكروي إلى مكورات. هذا الوصف لا يثبت نوعاً بعينه.',source:'gram'},
 {stage:'ضبط الجودة',q:'ظهر شاهد موجب غرام بلون وردي بعد إزالة لون مفرطة. ما الخطأ المحتمل؟',options:['نتيجة سالبة غرام كاذبة بسبب فقد الصبغة','نجاح الفحص بالضرورة','يمكن تجاهل الشاهد وإصدار النتيجة'],answer:0,why:'الإفراط في إزالة اللون قد يفقد الخلايا الموجبة معقّد الصبغة فتظهر وردية. فشل الشاهد يستلزم مراجعة الصبغ وإعادته وفق إجراء الجودة قبل اعتماد النتائج.',source:'asm'},
 {stage:'حدود الفحص',showResults:true,q:'ما الذي تستطيع صبغة غرام تقديمه وحدها؟',options:['هوية النوع وحساسية المضادات بشكل مؤكد','وصف مبدئي لتفاعل غرام والشكل والترتيب','وصفة علاجية نهائية'],answer:1,why:'غرام فحص تفريقي يعطي وصفاً أولياً. تحديد النوع وحساسية المضادات يحتاج فحوصاً إضافية معتمدة وسياقاً سريرياً.',source:'gram'}]}
];
const $ = id => document.getElementById(id);
function element(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
function button(text,fn,secondary=false){const b=element('button',text,'btn'+(secondary?' secondary':''));b.type='button';b.addEventListener('click',fn);return b;}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function validAnswer(step,value){return step.type==='order'?Array.isArray(value)&&value.length===step.items.length&&new Set(value).size===step.items.length&&value.every(x=>Number.isInteger(x)&&x>=0&&x<step.items.length):Number.isInteger(value)&&value>=0&&value<step.options.length;}
function fresh(c){return {answers:Array(c.steps.length).fill(null),best:null,attempts:0,done:false};}
let storageOK=true;
function readProgress(){
 let raw;try{raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');}catch{storageOK=false;}
 const output={};
 for(const c of CASES){
  const v=raw&&raw.version===VERSION&&raw.cases&&raw.cases[c.id];const p=fresh(c);
  if(v&&Array.isArray(v.answers)&&v.answers.length===c.steps.length){
   let gap=false;
   p.answers=v.answers.map((a,i)=>{if(gap||!validAnswer(c.steps[i],a)){gap=true;return null;}return a;});
   p.done=v.done===true&&p.answers.every(a=>a!==null);
   p.best=Number.isInteger(v.best)&&v.best>=0&&v.best<=100?v.best:null;
   p.attempts=Number.isInteger(v.attempts)&&v.attempts>=0?v.attempts:0;
  }output[c.id]=p;
 }return output;
}
let progress=readProgress();
let active=null,stepIndex=0,draft=null;
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:VERSION,cases:progress}));}catch{storageOK=false;}storageStatus();}
function storageStatus(){if(!storageOK)$('storage-note').textContent='تعذّر الاعتماد على التخزين المحلي. يمكنك إكمال التدريب الآن، لكن قد لا يُحفظ تقدمك بعد إغلاق الصفحة.';}
function score(c){return Math.round(progress[c.id].answers.filter((a,i)=>same(a,c.steps[i].answer)).length/c.steps.length*100);}
function complete(c){const p=progress[c.id];if(!p.done&&p.answers.every(a=>a!==null)){p.done=true;p.attempts++;p.best=Math.max(p.best||0,score(c));}}
function drawDashboard(){
 const list=$('case-list');list.replaceChildren();
 for(const [i,c] of CASES.entries()){
  const p=progress[c.id];const count=p.answers.filter(a=>a!==null).length;
  const card=element('article',undefined,'case-card'+(active===c.id?' active':''));
  const top=element('div',undefined,'case-top');top.append(element('span','0'+(i+1),'case-number'),element('span',p.best>=80?'✦ '+c.badge:c.subject,'tag'));card.append(top,element('h3',c.title),element('p',c.description));
  const meta=element('div',undefined,'case-meta');meta.append(element('p','5 خطوات · '+c.time));
  meta.append(element('p',p.best!==null?'أفضل نتيجة: '+p.best+'% · محاولات مكتملة: '+p.attempts:count?'تقدمك: '+count+' من 5 خطوات':'جاهز لأول تجربة'));
  meta.append(button(p.done?'عرض النتيجة':count?'استكمال الحالة':'ابدأ الحالة',()=>openCase(c.id)));card.append(meta);list.append(card);
 }
 const finished=CASES.filter(c=>progress[c.id].best!==null).length;const badges=CASES.filter(c=>progress[c.id].best!==null&&progress[c.id].best>=80).length;
 $('total-progress').textContent=finished+' / 3 حالات مكتملة · '+badges+' شارات';storageStatus();
}
function sourceLink(key){const s=SOURCES[key];const a=element('a',s.name+' ↗');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function diagram(kind){
 const fig=element('figure',undefined,'figure');
 // Original schematic SVGs: deliberately stylised and not microscope photographs.
 let shapes='',label='';
 if(kind==='blood'){
  shapes='<circle cx="62" cy="76" r="28" fill="#dc7c8a"/><circle cx="62" cy="76" r="10" fill="#fff0f1"/>';
  [[150,55],[199,86],[143,112],[225,47]].forEach(([x,y])=>{shapes+='<circle cx="'+x+'" cy="'+y+'" r="19" fill="#e6a0ab"/><circle cx="'+x+'" cy="'+y+'" r="11" fill="#fff0f1"/>';});
  shapes+='<path d="M108 25V145" stroke="#b8b2c8" stroke-dasharray="4 5"/>';
  label='رسم تخطيطي: خلية مرجعية كبيرة يساراً، وخلايا أصغر ذات شحوب مركزي أوسع يميناً. ليس مقياساً للحجم أو لطاخة حقيقية.';
 }else if(kind==='gram'){
  [[70,65],[85,57],[89,75],[66,83],[80,94],[104,89],[175,92],[190,81],[207,90],[191,103],[213,108],[177,113]].forEach(([x,y])=>{shapes+='<circle cx="'+x+'" cy="'+y+'" r="8" fill="#7545a3" stroke="#58327c" stroke-width="2"/>';});
  label='رسم تخطيطي لمكورات بنفسجية في تجمعات. يوضح الشكل واللون فقط، ولا يحدد النوع الجرثومي.';
 }else{
  shapes='<rect x="38" y="62" width="210" height="32" rx="6" fill="#e1ded0"/><rect x="48" y="67" width="23" height="22" rx="2" fill="#bd89b6"/><rect x="84" y="67" width="23" height="22" rx="2" fill="#ec9ba5"/><rect x="120" y="67" width="23" height="22" rx="2" fill="#e6cb80"/><rect x="156" y="67" width="23" height="22" rx="2" fill="#92bdb3"/>';
  label='رسم توضيحي لشريط فحص فقط. الألوان لا تمثل دليل قراءة لأي شركة؛ استند إلى النتائج المكتوبة في الجدول.';
 }
 fig.innerHTML='<svg viewBox="0 0 280 170" role="img" aria-label="'+label+'"><circle cx="140" cy="85" r="80" fill="#f0edf7"/>'+shapes+'</svg>';
 fig.append(element('figcaption',label));return fig;
}
function makeSidebar(c,showResults){
 const aside=element('aside',undefined,'panel sidebar');const info=element('section');info.append(element('p','ملف الحالة','mini-title'),element('h3',c.subject),element('p',c.story));aside.append(info);
 if(showResults){const evidence=element('section');evidence.append(element('p','لوحة الأدلة','mini-title'),diagram(c.figure));
  if(c.table){const table=element('table',undefined,'results-table');table.append(element('caption','نتائج العينة الافتراضية'));const head=element('thead');const tr=element('tr');['الفحص','النتيجة','المجال / المتوقع'].forEach(t=>{const th=element('th',t);th.scope='col';tr.append(th);});head.append(tr);table.append(head);const body=element('tbody');c.table.forEach(row=>{const tr=element('tr');row.forEach(t=>{const td=element('td',t);td.dir='ltr';tr.append(td);});body.append(tr);});table.append(body);evidence.append(table,element('p',c.tableNote,'muted'));}aside.append(evidence);
 }
 const sources=element('section');sources.append(element('p','للمراجعة والتوسع','mini-title'));const ul=element('ul',undefined,'source-list');for(const s of c.sources){const li=element('li');li.append(sourceLink(s));ul.append(li);}sources.append(ul,element('p','إعداد المحتوى: 22 أكتوبر 2026 · بانتظار مراجعة التدريسي.','storage-note'));aside.append(sources);return aside;
}
function openCase(id,focus=true){const c=CASES.find(x=>x.id===id);if(!c)return;active=id;const p=progress[id];stepIndex=p.done?c.steps.length:p.answers.findIndex(a=>a===null);if(stepIndex<0){complete(c);save();stepIndex=c.steps.length;}draft=null;try{history.replaceState(null,'','#'+id);}catch{}drawDashboard();renderWorkspace(focus);}
function focusHeading(){const h=$('question-heading');if(h){h.focus({preventScroll:true});$('workspace').scrollIntoView({behavior:'auto',block:'start'});}}
function renderWorkspace(focus=true){
 if(!active)return;const c=CASES.find(x=>x.id===active),p=progress[active];const root=$('workspace');root.hidden=false;root.replaceChildren();
 const header=element('div',undefined,'work-header');header.append(element('div',c.title,'eyebrow'),button('العودة إلى الحالات',()=>{active=null;root.hidden=true;try{history.replaceState(null,'',location.pathname+location.search);}catch{}drawDashboard();const first=$('case-list').querySelector('button');if(first)first.focus();},true));root.append(header);
 const layout=element('div',undefined,'work-layout'),panel=element('div',undefined,'panel');layout.append(panel);root.append(layout);
 if(p.done||stepIndex>=c.steps.length){renderResult(c,p,panel);layout.append(makeSidebar(c,true));if(focus)focusHeading();return;}
 const q=c.steps[stepIndex],saved=p.answers[stepIndex],locked=saved!==null;
 const meter=element('progress');meter.max=c.steps.length;meter.value=p.answers.filter(a=>a!==null).length;meter.setAttribute('aria-label','الخطوات المجاب عنها');panel.append(meter,element('p','الخطوة '+(stepIndex+1)+' من 5 · '+q.stage,'stage-label'));
 const h=element('h2',q.q,'question-title');h.id='question-heading';h.tabIndex=-1;panel.append(h);
 if(q.context)panel.append(element('p',q.context,'context'));
 const field=element('fieldset',undefined,'choices');const legend=element('legend',q.type==='order'?'اختر العناصر بالترتيب المطلوب':'اختر إجابة واحدة','sr-only');field.append(legend);panel.append(field);
 const submit=button('تحقق من الإجابة',()=>submitAnswer(c,q));submit.disabled=locked||draft===null;
 if(q.type==='order'){
  const selected=locked?saved:(Array.isArray(draft)?draft:[]);draft=locked?null:selected;
  field.append(element('p','اضغط العناصر تباعاً لبناء الترتيب من الأول إلى الأخير.','muted'));
  const order=element('ol',undefined,'order-preview');order.setAttribute('aria-live','polite');selected.forEach(i=>order.append(element('li',q.items[i])));field.append(order);
  const bank=element('div',undefined,'order-bank');for(const i of q.display){const b=element('button',q.items[i]);b.type='button';b.disabled=locked||selected.includes(i);b.addEventListener('click',()=>{draft=[...selected,i];renderWorkspace(false);const next=$('workspace').querySelector('.order-bank button:not(:disabled)')||$('workspace').querySelector('.actions button');if(next)next.focus({preventScroll:true});});bank.append(b);}field.append(bank);
  const clear=button('إعادة الترتيب',()=>{draft=[];renderWorkspace(false);},true);clear.disabled=locked||selected.length===0;field.append(clear);submit.disabled=locked||selected.length!==q.items.length;
 }else{
  q.options.forEach((text,i)=>{const label=element('label',undefined,'choice');const input=element('input');input.type='radio';input.name='answer';input.value=i;input.checked=locked?saved===i:draft===i;input.disabled=locked;input.addEventListener('change',()=>{draft=i;submit.disabled=false;});label.append(input,element('span',text));field.append(label);});
 }
 if(!locked){const actions=element('div',undefined,'actions');actions.append(submit);panel.append(actions);}else{
  const correct=same(saved,q.answer);const feed=element('div',undefined,'feedback'+(correct?'':' wrong'));feed.setAttribute('role','status');feed.append(element('strong',correct?'✓ إجابة صحيحة':'↻ فرصة للتعلّم'),element('p',q.why));if(!correct)feed.append(element('p','الإجابة الصحيحة: '+answerText(q,q.answer)));feed.append(sourceLink(q.source));panel.append(feed);
  const actions=element('div',undefined,'actions');actions.append(button(stepIndex===c.steps.length-1?'عرض النتيجة':'الخطوة التالية',()=>{stepIndex++;draft=null;if(stepIndex===c.steps.length){complete(c);save();drawDashboard();}renderWorkspace();}));panel.append(actions);
 }
 layout.append(makeSidebar(c,!!q.showResults));if(focus)focusHeading();
}
function answerText(q,a){return q.type==='order'?a.map((i,n)=>(n+1)+'. '+q.items[i]).join(' ← '):q.options[a];}
function submitAnswer(c,q){const p=progress[c.id];if(p.done||p.answers[stepIndex]!==null||!validAnswer(q,draft))return;p.answers[stepIndex]=Array.isArray(draft)?[...draft]:draft;save();drawDashboard();renderWorkspace(false);const f=$('workspace').querySelector('.feedback');if(f){f.tabIndex=-1;f.focus();}}
function renderResult(c,p,panel){
 const total=score(c),wrap=element('div',undefined,'completion');const title=element('h2','أكملت الحالة','question-title');title.id='question-heading';title.tabIndex=-1;wrap.append(title,element('div',total+'%','score'),element('p',p.answers.filter((a,i)=>same(a,c.steps[i].answer)).length+' إجابات صحيحة من 5'));
 wrap.append(element('span',total>=80?'✦ حصلت على شارة «'+c.badge+'»':'راجِع التفسير، ثم حاول مجدداً','tag'),element('p','أفضل نتيجة محفوظة: '+p.best+'% · الشارة تُمنح من 80%.','storage-note'));
 const actions=element('div',undefined,'actions');actions.append(button('إعادة المحاولة',()=>{const freshAttempt=fresh(c);freshAttempt.best=p.best;freshAttempt.attempts=p.attempts;progress[c.id]=freshAttempt;save();openCase(c.id);}));const next=CASES[(CASES.indexOf(c)+1)%CASES.length];actions.append(button('جرّب: '+next.title,()=>openCase(next.id),true));wrap.append(actions);panel.append(wrap);
 const review=element('div',undefined,'review');review.append(element('h3','راجع قراراتك'));c.steps.forEach((q,i)=>{const correct=same(p.answers[i],q.answer);const detail=element('details');detail.open=!correct;detail.append(element('summary',(correct?'✓ ':'↻ ')+(i+1)+'. '+q.stage),element('p',q.q),element('p','إجابتك: '+answerText(q,p.answers[i])));if(!correct)detail.append(element('p','الصحيح: '+answerText(q,q.answer)));detail.append(element('p',q.why),sourceLink(q.source));review.append(detail);});panel.append(review);
}
drawDashboard();
const requested=location.hash.slice(1);if(CASES.some(c=>c.id===requested))openCase(requested,false);
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(CASES.some(c=>c.id===id))openCase(id);});
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
