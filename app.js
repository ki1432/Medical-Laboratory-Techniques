// =========================================================================
// إعدادات الاتصال بقاعدة بيانات Supabase وصلاحيات التحكم الكاملة
// المطور: ki © 2026
// =========================================================================

const SUPABASE_URL = 'https://sjmmssgeadjtkmiapmvp.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_UkVJrnG04BQXDBdUSNcxMQ_4Bw1jbun'; // تأكد من وضع المفتاح الخاص بك هنا

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let cachedStudents = [];
let isUserAdmin = false;
const ADMIN_SECRET_KEY = "ki2026";

// 1. الدخول السينمائي المصحح
function enterSystem() {
    const splash = document.getElementById('splash-screen');
    const portal = document.getElementById('main-portal');
    
    if (splash && portal) {
        splash.classList.add('splash-hidden');
        setTimeout(() => {
            splash.style.display = 'none';
            portal.classList.remove('hidden');
            fetchStudentsFromSupabase();
        }, 800);
    }
}

// 2. جلب البيانات من Supabase
async function fetchStudentsFromSupabase() {
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" class="p-5 text-center text-sky-400 font-semibold animate-pulse"><i class="fa-solid fa-spinner fa-spin ml-2"></i> جاري اتصال واستعلام Supabase...</td></tr>`;

    if (!supabaseClient) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-5 text-center text-rose-400">مكتبة Supabase غير متصلة. تأكد من المفاتيح.</td></tr>`;
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('students')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch Error:', error.message);
            tbody.innerHTML = `<tr><td colspan="6" class="p-5 text-center text-rose-400">خطأ في جلب البيانات: ${error.message}</td></tr>`;
            return;
        }

        cachedStudents = data || [];
        renderTable(cachedStudents, isUserAdmin);

    } catch (err) {
        console.error(err);
    }
}

// 3. عرض جدول الطلبة والدفعات مع أدوات التحكم (تعديل + حذف)
function renderTable(data, isAdmin = false) {
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-5 text-center text-slate-500">لا توجد سجلات مطابقة في قاعدة البيانات</td></tr>`;
        return;
    }

    data.forEach((item, idx) => {
        const isGraduate = item.status && item.status.includes('خريج');
        const badgeClass = isGraduate 
            ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

        const adminActions = isAdmin ? `
            <div class="flex items-center gap-2">
                <button onclick="editStudent('${item.id}', '${item.full_name}', '${item.batch_year}', '${item.stage}', '${item.status}')" class="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg border border-amber-500/30 transition text-[10px] font-bold">
                    <i class="fa-solid fa-pen"></i> تعديل
                </button>
                <button onclick="deleteStudent('${item.id}')" class="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-lg border border-rose-500/30 transition text-[10px] font-bold">
                    <i class="fa-solid fa-trash-can"></i> حذف
                </button>
            </div>
        ` : `<span class="text-slate-500 text-[10px]"><i class="fa-solid fa-shield text-emerald-500 ml-1"></i> محمي</span>`;

        tbody.innerHTML += `
            <tr class="hover:bg-slate-900/60 transition duration-200">
                <td class="p-4 font-mono text-slate-500">0${idx + 1}</td>
                <td class="p-4 font-bold text-white">${item.full_name || item.name}</td>
                <td class="p-4 font-mono text-sky-400">دفعة ${item.batch_year || item.batch}</td>
                <td class="p-4 text-slate-300">${item.stage}</td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-lg border text-[10px] font-bold ${badgeClass}">${item.status}</span></td>
                <td class="p-4">${adminActions}</td>
            </tr>
        `;
    });
}

// 4. التحقق من دخول المشرف
function verifyAdmin() {
    const inputVal = document.getElementById('admin-pass-input').value;
    const loginBox = document.getElementById('admin-login-box');
    const dashboard = document.getElementById('admin-dashboard-content');

    if (inputVal === ADMIN_SECRET_KEY) {
        alert('مرحباً بك يا ki! تم تفعيل الصلاحيات الكاملة (إضافة، تعديل، حذف).');
        isUserAdmin = true;
        if (loginBox) loginBox.style.display = 'none';
        if (dashboard) dashboard.classList.remove('hidden');
        renderTable(cachedStudents, true);
    } else {
        alert('كلمة المرور غير صحيحة!');
    }
}

// 5. إضافة طالب جديد (Create)
async function adminAddStudent(e) {
    e.preventDefault();
    const name = document.getElementById('adm-name').value;
    const batch = document.getElementById('adm-batch').value;
    const stage = document.getElementById('adm-stage').value;
    const status = document.getElementById('adm-status').value;

    if (!supabaseClient) return alert('قاعدة البيانات غير متصلة');

    try {
        const { error } = await supabaseClient
            .from('students')
            .insert([{ full_name: name, batch_year: batch, stage: stage, status: status }]);

        if (error) {
            alert('فشلت الإضافة: ' + error.message);
        } else {
            alert('تمت الإضافة بنجاح إلى Supabase!');
            e.target.reset();
            fetchStudentsFromSupabase();
        }
    } catch (err) {
        console.error(err);
    }
}

// 6. تعديل بيانات طالب (Update)
async function editStudent(id, oldName, oldBatch, oldStage, oldStatus) {
    const newName = prompt("تعديل اسم الطالب:", oldName);
    if (!newName) return;

    const newStage = prompt("تعديل المرحلة/الصفة:", oldStage);
    if (!newStage) return;

    try {
        const { error } = await supabaseClient
            .from('students')
            .update({ full_name: newName, stage: newStage })
            .eq('id', id);

        if (error) {
            alert('فشل التعديل: ' + error.message);
        } else {
            alert('تم تحديث البيانات بنجاح!');
            fetchStudentsFromSupabase();
        }
    } catch (err) {
        console.error(err);
    }
}

// 7. حذف طالب (Delete)
async function deleteStudent(id) {
    if (!confirm('هل أنت متأكد من حذف هذا السجل نهائياً من قاعدة البيانات؟')) return;

    try {
        const { error } = await supabaseClient
            .from('students')
            .delete()
            .eq('id', id);

        if (error) {
            alert('فشل الحذف: ' + error.message);
        } else {
            alert('تم حذف السجل بنجاح!');
            fetchStudentsFromSupabase();
        }
    } catch (err) {
        console.error(err);
    }
}

// 8. الفلترة السريعة
document.addEventListener('DOMContentLoaded', () => {
    const bFilter = document.getElementById('batch-filter');
    const sSearch = document.getElementById('student-search');

    function filterData() {
        const bVal = bFilter ? bFilter.value : 'all';
        const sVal = sSearch ? sSearch.value.toLowerCase().trim() : '';

        const filtered = cachedStudents.filter(item => {
            const batchYear = item.batch_year || item.batch;
            const studentName = item.full_name || item.name || '';

            const matchBatch = (bVal === 'all' || batchYear === bVal);
            const matchName = studentName.toLowerCase().includes(sVal);
            return matchBatch && matchName;
        });
        
        renderTable(filtered, isUserAdmin);
    }

    if (bFilter) bFilter.addEventListener('change', filterData);
    if (sSearch) sSearch.addEventListener('input', filterData);
});