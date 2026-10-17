// =========================================================================
// المنظومة الرقمية الشاملة - تقنيات المختبرات الطبية
// تطوير: ki © 2026
// =========================================================================

const SUPABASE_URL = 'https://sjmmssgeadjtkmiapmvp.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_UkVJrnG04BQXDBdUSNcxMQ_4Bw1jbun';

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let cachedStudents = [];
let cachedLabs = [];
let cachedAnnouncements = [];
let isUserAdmin = false;

const ADMIN_USER = "ki";
const ADMIN_PASS = "211621";

document.addEventListener('DOMContentLoaded', () => {
    loadAllSystemData();
});

async function loadAllSystemData() {
    await Promise.all([
        fetchStudents(),
        fetchLabs(),
        fetchAnnouncements()
    ]);
}

function openAdminModal() {
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function verifyAdmin() {
    const userInput = document.getElementById('admin-user-input').value.trim();
    const passInput = document.getElementById('admin-pass-input').value.trim();

    if (userInput === ADMIN_USER && passInput === ADMIN_PASS) {
        alert('مرحباً بك يا ki! تم تفعيل لوحة التحكم الإدارية الخاصة بالمختبرات الطبية.');
        isUserAdmin = true;
        closeAdminModal();
        
        document.body.innerHTML = document.getElementById('admin-dashboard-wrapper').outerHTML;
        loadAllSystemData();
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة!');
    }
}

function logoutAdmin() {
    location.reload();
}

async function fetchStudents() {
    const tbody = document.getElementById('students-table-body');
    if (!tbody || !supabaseClient) return;

    try {
        const { data, error } = await supabaseClient.from('students').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        cachedStudents = data || [];
        renderStudentsTable(cachedStudents, isUserAdmin);
    } catch (err) { console.error(err); }
}

function renderStudentsTable(data, isAdmin = false) {
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-5 text-center text-slate-500">لا توجد سجلات مطابقة</td></tr>`;
        return;
    }

    data.forEach((item, idx) => {
        const adminActions = isAdmin ? `
            <button onclick="deleteStudent('${item.id}')" class="px-2 py-1 bg-rose-500/20 text-rose-300 rounded text-[10px] font-bold">حذف</button>
        ` : `<span class="text-slate-500 text-[10px]">محمي</span>`;

        tbody.innerHTML += `
            <tr class="hover:bg-slate-900/60 transition">
                <td class="p-4 font-mono text-slate-500">0${idx + 1}</td>
                <td class="p-4 font-bold text-white">${item.full_name}</td>
                <td class="p-4 font-mono text-sky-400">دفعة ${item.batch_year}</td>
                <td class="p-4 text-slate-300">${item.stage}</td>
                <td class="p-4">${adminActions}</td>
            </tr>
        `;
    });
}

async function adminAddStudent(e) {
    e.preventDefault();
    const name = document.getElementById('adm-name').value;
    const batch = document.getElementById('adm-batch').value;
    const stage = document.getElementById('adm-stage').value;
    const status = document.getElementById('adm-status').value;

    try {
        const { error } = await supabaseClient.from('students').insert([{ full_name: name, batch_year: batch, stage: stage, status: status }]);
        if (error) throw error;
        alert('تمت الإضافة بنجاح!');
        e.target.reset();
        fetchStudents();
    } catch (err) { alert(err.message); }
}

async function deleteStudent(id) {
    if (!confirm('حذف السجل؟')) return;
    try {
        await supabaseClient.from('students').delete().eq('id', id);
        fetchStudents();
    } catch (err) { alert(err.message); }
}

async function fetchLabs() {
    const container = document.getElementById('labs-container');
    if (!container || !supabaseClient) return;
    try {
        const { data } = await supabaseClient.from('labs_sections').select('*');
        cachedLabs = data || [];
        renderLabsGrid(cachedLabs, isUserAdmin);
    } catch (err) { console.error(err); }
}

function renderLabsGrid(data, isAdmin = false) {
    const container = document.getElementById('labs-container');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(item => {
        container.innerHTML += `
            <div class="glass-panel p-6 rounded-2xl space-y-3">
                <div class="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-400 text-xl border border-sky-500/20">
                    <i class="${item.icon_class || 'fa-solid fa-flask'}"></i>
                </div>
                <h4 class="font-bold text-white text-base">${item.title}</h4>
                <p class="text-xs text-slate-400">${item.description}</p>
            </div>
        `;
    });
}

async function fetchAnnouncements() {
    const container = document.getElementById('announcements-container');
    if (!container || !supabaseClient) return;
    try {
        const { data } = await supabaseClient.from('announcements').select('*');
        cachedAnnouncements = data || [];
        renderAnnouncements(cachedAnnouncements);
    } catch (err) { console.error(err); }
}

function renderAnnouncements(data) {
    const container = document.getElementById('announcements-container');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(item => {
        container.innerHTML += `
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400">${item.category}</span>
                <h5 class="font-bold text-white text-sm">${item.title}</h5>
                <p class="text-xs text-slate-400">${item.content}</p>
            </div>
        `;
    });
}