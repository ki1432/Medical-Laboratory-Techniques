// =========================================================================
// المنظومة الرقمية الشاملة - قسم تقنيات المختبرات الطبية
// نظام إدارة المحتوى والتحكم المطلق (CMS) تطوير: ki © 2026
// =========================================================================

const SUPABASE_URL = 'https://sjmmssgeadjtkmiapmvp.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_UkVJrnG04BQXDBdUSNcxMQ_4Bw1jbun';

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let cachedStudents = [];
let cachedLabs = [];
let cachedAnnouncements = [];
let isUserAdmin = false;
const ADMIN_SECRET_KEY = "ki2026";

// 1. الدخول إلى المنظومة
function enterSystem() {
    const splash = document.getElementById('splash-screen');
    const portal = document.getElementById('main-portal');
    
    if (splash && portal) {
        splash.classList.add('splash-hidden');
        setTimeout(() => {
            splash.style.display = 'none';
            portal.classList.remove('hidden');
            loadAllSystemData();
        }, 800);
    }
}

// 2. تحميل كافة البيانات من Supabase
async function loadAllSystemData() {
    await Promise.all([
        fetchStudents(),
        fetchLabs(),
        fetchAnnouncements()
    ]);
}

// -------------------------------------------------------------------------
// قسم إدارة الطلبة والدفعات (CRUD)
// -------------------------------------------------------------------------
async function fetchStudents() {
    const tbody = document.getElementById('students-table-body');
    if (!tbody || !supabaseClient) return;

    tbody.innerHTML = `<tr><td colspan="6" class="p-5 text-center text-sky-400 font-semibold animate-pulse"><i class="fa-solid fa-spinner fa-spin ml-2"></i> جاري استعلام أرشيف الطلبة...</td></tr>`;

    try {
        const { data, error } = await supabaseClient.from('students').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        cachedStudents = data || [];
        renderStudentsTable(cachedStudents, isUserAdmin);
    } catch (err) {
        console.error('Students Fetch Error:', err.message);
    }
}

function renderStudentsTable(data, isAdmin = false) {
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-5 text-center text-slate-500">لا توجد سجلات مطابقة في قاعدة البيانات</td></tr>`;
        return;
    }

    data.forEach((item, idx) => {
        const isGraduate = item.status && item.status.includes('خريج');
        const badgeClass = isGraduate ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

        const adminActions = isAdmin ? `
            <div class="flex items-center gap-2">
                <button onclick="editStudent('${item.id}', '${item.full_name}', '${item.stage}')" class="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg border border-amber-500/30 transition text-[10px] font-bold">تعديل</button>
                <button onclick="deleteStudent('${item.id}')" class="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-lg border border-rose-500/30 transition text-[10px] font-bold">حذف</button>
            </div>
        ` : `<span class="text-slate-500 text-[10px]"><i class="fa-solid fa-shield text-emerald-500 ml-1"></i> محمي</span>`;

        tbody.innerHTML += `
            <tr class="hover:bg-slate-900/60 transition duration-200">
                <td class="p-4 font-mono text-slate-500">0${idx + 1}</td>
                <td class="p-4 font-bold text-white">${item.full_name}</td>
                <td class="p-4 font-mono text-sky-400">دفعة ${item.batch_year}</td>
                <td class="p-4 text-slate-300">${item.stage}</td>
                <td class="p-4"><span class="px-2.5 py-1 rounded-lg border text-[10px] font-bold ${badgeClass}">${item.status}</span></td>
                <td class="p-4">${adminActions}</td>
            </tr>
        `;
    });
}

// -------------------------------------------------------------------------
// قسم إدارة المختبرات والأقسام (CRUD)
// -------------------------------------------------------------------------
async function fetchLabs() {
    const container = document.getElementById('labs-container');
    if (!container || !supabaseClient) return;

    try {
        const { data, error } = await supabaseClient.from('labs_sections').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        cachedLabs = data || [];
        renderLabsGrid(cachedLabs, isUserAdmin);
    } catch (err) {
        console.error('Labs Fetch Error:', err.message);
    }
}

function renderLabsGrid(data, isAdmin = false) {
    const container = document.getElementById('labs-container');
    if (!container) return;
    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = `<div class="col-span-3 text-center text-slate-500 py-6">لا توجد مختبرات أو أقسام مضافة حالياً.</div>`;
        return;
    }

    data.forEach(item => {
        const deleteBtn = isAdmin ? `
            <button onclick="deleteLab('${item.id}')" class="text-xs text-rose-400 hover:text-rose-300 font-bold mt-2 inline-block">
                <i class="fa-solid fa-trash-can"></i> حذف القسم
            </button>
        ` : '';

        container.innerHTML += `
            <div class="glass-card p-6 rounded-2xl space-y-4 relative">
                <div class="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 text-2xl border border-sky-500/30">
                    <i class="${item.icon_class || 'fa-solid fa-flask'}"></i>
                </div>
                <h4 class="font-bold text-white text-lg">${item.title}</h4>
                <p class="text-xs text-slate-400 leading-relaxed">${item.description}</p>
                ${deleteBtn}
            </div>
        `;
    });
}

// -------------------------------------------------------------------------
// قسم الإعلانات والأخبار (CRUD)
// -------------------------------------------------------------------------
async function fetchAnnouncements() {
    const container = document.getElementById('announcements-container');
    if (!container || !supabaseClient) return;

    try {
        const { data, error } = await supabaseClient.from('announcements').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        cachedAnnouncements = data || [];
        renderAnnouncements(cachedAnnouncements, isUserAdmin);
    } catch (err) {
        console.error('Announcements Error:', err.message);
    }
}

function renderAnnouncements(data, isAdmin = false) {
    const container = document.getElementById('announcements-container');
    if (!container) return;
    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = `<div class="text-center text-slate-500 py-4 text-xs">لا توجد إعلانات مضافة حالياً.</div>`;
        return;
    }

    data.forEach(item => {
        const deleteBtn = isAdmin ? `
            <button onclick="deleteAnnouncement('${item.id}')" class="text-xs text-rose-400 hover:underline font-bold mr-3">حذف الإعلان</button>
        ` : '';

        container.innerHTML += `
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">${item.category}</span>
                    ${deleteBtn}
                </div>
                <h5 class="font-bold text-white text-sm">${item.title}</h5>
                <p class="text-xs text-slate-400">${item.content}</p>
            </div>
        `;
    });
}

// -------------------------------------------------------------------------
// دوال التحكم والإدارة العليا (Admin Functions)
// -------------------------------------------------------------------------
function verifyAdmin() {
    const inputVal = document.getElementById('admin-pass-input').value;
    const loginBox = document.getElementById('admin-login-box');
    const dashboard = document.getElementById('admin-dashboard-content');

    if (inputVal === ADMIN_SECRET_KEY) {
        alert('مرحباً بك يا ki! تم تفعيل لوحة التحكم الإدارية المطلقة لجميع أركان المنظومة.');
        isUserAdmin = true;
        if (loginBox) loginBox.style.display = 'none';
        if (dashboard) dashboard.classList.remove('hidden');
        renderStudentsTable(cachedStudents, true);
        renderLabsGrid(cachedLabs, true);
        renderAnnouncements(cachedAnnouncements, true);
    } else {
        alert('كلمة المرور غير صحيحة!');
    }
}

// إضافة طالب
async function adminAddStudent(e) {
    e.preventDefault();
    const name = document.getElementById('adm-name').value;
    const batch = document.getElementById('adm-batch').value;
    const stage = document.getElementById('adm-stage').value;
    const status = document.getElementById('adm-status').value;

    try {
        const { error } = await supabaseClient.from('students').insert([{ full_name: name, batch_year: batch, stage: stage, status: status }]);
        if (error) throw error;
        alert('تمت إضافة الطالب بنجاح!');
        e.target.reset();
        fetchStudents();
    } catch (err) { alert('خطأ الإضافة: ' + err.message); }
}

// تعديل طالب
async function editStudent(id, oldName, oldStage) {
    const newName = prompt("تعديل اسم الطالب:", oldName);
    if (!newName) return;
    const newStage = prompt("تعديل المرحلة/الصفة:", oldStage);
    if (!newStage) return;

    try {
        const { error } = await supabaseClient.from('students').update({ full_name: newName, stage: newStage }).eq('id', id);
        if (error) throw error;
        alert('تم التعديل بنجاح!');
        fetchStudents();
    } catch (err) { alert('خطأ التعديل: ' + err.message); }
}

// حذف طالب
async function deleteStudent(id) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
        const { error } = await supabaseClient.from('students').delete().eq('id', id);
        if (error) throw error;
        alert('تم الحذف بنجاح!');
        fetchStudents();
    } catch (err) { alert('خطأ الحذف: ' + err.message); }
}

// إضافة قسم/مختبر جديد
async function adminAddLab(e) {
    e.preventDefault();
    const title = document.getElementById('adm-lab-title').value;
    const desc = document.getElementById('adm-lab-desc').value;
    const icon = document.getElementById('adm-lab-icon').value || 'fa-solid fa-flask';

    try {
        const { error } = await supabaseClient.from('labs_sections').insert([{ title: title, description: desc, icon_class: icon }]);
        if (error) throw error;
        alert('تمت إضافة القسم الجديد بنجاح!');
        e.target.reset();
        fetchLabs();
    } catch (err) { alert('خطأ إضافة القسم: ' + err.message); }
}

// حذف قسم/مختبر
async function deleteLab(id) {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    try {
        const { error } = await supabaseClient.from('labs_sections').delete().eq('id', id);
        if (error) throw error;
        alert('تم حذف القسم بنجاح!');
        fetchLabs();
    } catch (err) { alert('خطأ الحذف: ' + err.message); }
}

// إضافة إعلان جديد
async function adminAddAnnouncement(e) {
    e.preventDefault();
    const title = document.getElementById('adm-ann-title').value;
    const content = document.getElementById('adm-ann-content').value;
    const category = document.getElementById('adm-ann-cat').value;

    try {
        const { error } = await supabaseClient.from('announcements').insert([{ title: title, content: content, category: category }]);
        if (error) throw error;
        alert('تم نشر الإعلان بنجاح!');
        e.target.reset();
        fetchAnnouncements();
    } catch (err) { alert('خطأ نشر الإعلان: ' + err.message); }
}

// حذف إعلان
async function deleteAnnouncement(id) {
    if (!confirm('هل أنت متأكد من حذف الإعلان؟')) return;
    try {
        const { error } = await supabaseClient.from('announcements').delete().eq('id', id);
        if (error) throw error;
        alert('تم حذف الإعلان بنجاح!');
        fetchAnnouncements();
    } catch (err) { alert('خطأ الحذف: ' + err.message); }
}

// الفلترة والبحث
document.addEventListener('DOMContentLoaded', () => {
    const bFilter = document.getElementById('batch-filter');
    const sSearch = document.getElementById('student-search');

    function filterData() {
        const bVal = bFilter ? bFilter.value : 'all';
        const sVal = sSearch ? sSearch.value.toLowerCase().trim() : '';

        const filtered = cachedStudents.filter(item => {
            const batchYear = item.batch_year;
            const studentName = item.full_name || '';
            const matchBatch = (bVal === 'all' || batchYear === bVal);
            const matchName = studentName.toLowerCase().includes(sVal);
            return matchBatch && matchName;
        });
        renderStudentsTable(filtered, isUserAdmin);
    }

    if (bFilter) bFilter.addEventListener('change', filterData);
    if (sSearch) sSearch.addEventListener('input', filterData);
});