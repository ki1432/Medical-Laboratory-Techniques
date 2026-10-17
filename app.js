// =========================================================================
// إعدادات وبيانات الاتصال بقاعدة بيانات Supabase
// حقوق الملكية وتطوير المنظومة محفوطة للمطور: ki © 2026
// =========================================================================

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'; // استبدل برابط مشروعك في Supabase
const SUPABASE_ANON_KEY = 'sb_publishable_UkVJrnG04BQXDBdUSNcxMQ_4Bw1jbun';       // استبدل بمفتاح الـ API الخاص بك

// تهيئة عميل Supabase (يتم استدعاء المكتبة عبر CDN من الـ HTML)
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// مصفوفة تخزين البيانات المحلية لتسريع البحث بعد الجلب الأول
let cachedStudents = [];

// =========================================================================
// 1. الدخول السينمائي للبوابة الرسمية
// =========================================================================
function enterSystem() {
    const splash = document.getElementById('splash-screen');
    const portal = document.getElementById('main-portal');
    
    splash.classList.add('splash-hidden');
    setTimeout(() => {
        splash.style.style = 'none';
        splash.classList.add('hidden');
        portal.classList.remove('hidden');
        
        // جلب البيانات الفورية من Supabase عند الدخول
        fetchStudentsFromSupabase();
    }, 800);
}

// =========================================================================
// 2. جلب أرشيف الطلبة والدفعات من Supabase
// =========================================================================
async function fetchStudentsFromSupabase() {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = `<tr><td colspan="5" class="p-5 text-center text-sky-400 font-semibold animate-pulse"><i class="fa-solid fa-spinner fa-spin ml-2"></i> جاري اتصال واستعلام قاعدة بيانات Supabase...</td></tr>`;

    // في حال عدم توفر المكتبة أو المفاتيح، يتم الاعتماد على الاستعلام المحلي كـ Fallback
    if (!supabaseClient) {
        console.warn("Supabase SDK not loaded. Using cached data.");
        renderTable(cachedStudents);
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('students')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Fetch Error:', error.message);
            tbody.innerHTML = `<tr><td colspan="5" class="p-5 text-center text-rose-400">حدث خطأ أثناء جلب البيانات من السيرفر. يرجي التأكد من إعدادات RLS و Keys.</td></tr>`;
            return;
        }

        cachedStudents = data || [];
        renderTable(cachedStudents);

    } catch (err) {
        console.error('Unexpected Error:', err);
        tbody.innerHTML = `<tr><td colspan="5" class="p-5 text-center text-rose-400">خطأ في الاتصال بالشبكة.</td></tr>`;
    }
}

// =========================================================================
// 3. عرض جدول الطلبة والدفعات بنمط Glassmorphism
// =========================================================================
function renderTable(data) {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-5 text-center text-slate-500">لا توجد سجلات مطابقة في قاعدة البيانات</td></tr>`;
        return;
    }

    data.forEach((item, idx) => {
        const isGraduate = item.status && item.status.includes('خريج');
        const badgeClass = isGraduate 
            ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

        tbody.innerHTML += `
            <tr class="hover:bg-slate-900/60 transition duration-200">
                <td class="p-4 font-mono text-slate-500">0${idx + 1}</td>
                <td class="p-4 font-bold text-white">${item.full_name || item.name}</td>
                <td class="p-4 font-mono text-sky-400">دفعة ${item.batch_year || item.batch}</td>
                <td class="p-4 text-slate-300">${item.stage}</td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-lg border text-[10px] font-bold ${badgeClass}">${item.status}</span></td>
            </tr>
        `;
    });
}

// =========================================================================
// 4. الفلترة السريعة حسب الدفعة والاسم
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const bFilter = document.getElementById('batch-filter');
    const sSearch = document.getElementById('student-search');

    function filterData() {
        const bVal = bFilter.value;
        const sVal = sSearch.value.toLowerCase().trim();

        const filtered = cachedStudents.filter(item => {
            const batchYear = item.batch_year || item.batch;
            const studentName = item.full_name || item.name;

            const matchBatch = (bVal === 'all' || batchYear === bVal);
            const matchName = studentName.toLowerCase().includes(sVal);
            return matchBatch && matchName;
        });
        
        renderTable(filtered);
    }

    if (bFilter && sSearch) {
        bFilter.addEventListener('change', filterData);
        sSearch.addEventListener('input', filterData);
    }
});

// =========================================================================
// 5. تسجيل طلبة المرحلة الأولى مباشرة في Supabase
// =========================================================================
async function handleRegistration(e) {
    e.preventDefault();
    const form = e.target;
    const nameInput = form.querySelector('input[type="text"]').value;
    const emailInput = form.querySelector('input[type="email"]').value;

    if (!supabaseClient) {
        alert('تم تسليم الاستمارة محلياً (يرجى إضافة مفاتيح Supabase للتخزين السحابي الحقيقي).');
        form.reset();
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('students')
            .insert([
                {
                    full_name: nameInput,
                    batch_year: '2026',
                    stage: 'المرحلة الأولى - قيد التسجيل',
                    status: 'متقدم جديد'
                }
            ]);

        if (error) {
            alert('حدث خطأ أثناء حفظ التقديم: ' + error.message);
        } else {
            alert('تم تسجيل البيانات بنجاح في قاعدة البيانات السحابية! سيتم تدقيق طلبك من قبل شؤون الطلبة.');
            form.reset();
            // تحديث الجدول فوراً بعد الإضافة
            fetchStudentsFromSupabase();
        }
    } catch (err) {
        console.error(err);
        alert('حدث خطأ في الاتصال بالسيرفر.');
    }
}