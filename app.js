// 1. الوضع المظلم والفاتح (Dark / Light Theme Toggle)
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        icon.className = 'fa-solid fa-sun text-amber-400';
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        icon.className = 'fa-solid fa-moon text-sky-400';
        localStorage.setItem('theme', 'dark');
    }
}

// ضبط المظهر الافتراضي عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.className = 'fa-solid fa-sun text-amber-400';
    } else {
        document.documentElement.classList.add('dark');
    }
});

// 2. محرك البحث الذكي والشامل (Smart Universal Search)
function filterContent(query) {
    const term = query.toLowerCase().trim();
    const rows = document.querySelectorAll('.searchable-table tr');
    
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 3. تبديل الجداول
function switchSchedule(scheduleKey) {
    const contents = document.querySelectorAll('.schedule-content');
    contents.forEach(el => el.classList.add('hidden'));
    
    const selected = document.getElementById(`sched-${scheduleKey}`);
    if (selected) {
        selected.classList.remove('hidden');
    }
}

// 4. حاسبة المعدل
function addGpaRow() {
    const tbody = document.getElementById('gpa-rows');
    if (!tbody) return;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="p-3"><input type="text" placeholder="اسم المادة" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-sky-500 course-name"></td>
        <td class="p-3"><input type="number" min="1" max="6" value="3" class="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-sky-500 course-units"></td>
        <td class="p-3"><input type="number" min="0" max="100" placeholder="الدرجة" class="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-sky-500 course-grade"></td>
        <td class="p-3 text-center"><button onclick="removeGpaRow(this)" class="text-rose-400 hover:text-rose-300 p-1"><i class="fa-solid fa-trash-can"></i></button></td>
    `;
    tbody.appendChild(row);
}

function removeGpaRow(btn) {
    const row = btn.closest('tr');
    if (document.querySelectorAll('#gpa-rows tr').length > 1) {
        row.remove();
    } else {
        alert('يجب إبقاء مادة واحدة على الأقل.');
    }
}

function calculateGPA() {
    const rows = document.querySelectorAll('#gpa-rows tr');
    let totalPoints = 0;
    let totalUnits = 0;
    let isValid = true;

    rows.forEach(row => {
        const units = parseFloat(row.querySelector('.course-units').value);
        const grade = parseFloat(row.querySelector('.course-grade').value);

        if (isNaN(units) || isNaN(grade) || grade < 0 || grade > 100) {
            isValid = false;
        } else {
            totalPoints += (grade * units);
            totalUnits += units;
        }
    });

    if (!isValid || totalUnits === 0) {
        alert('يرجى التأكد من صحة الدرجات والوحدات.');
        return;
    }

    const gpa = totalPoints / totalUnits;
    document.getElementById('gpa-result').innerText = gpa.toFixed(2);
}


// إظهار أو إخفاء حقل الحالة المرضية الأخرى
function toggleMedicalInput(val) {
    const otherInput = document.getElementById('reg-medical-other');
    if (!otherInput) return;
    if (val === 'أخرى') {
        otherInput.classList.remove('hidden');
        otherInput.required = true;
    } else {
        otherInput.classList.add('hidden');
        otherInput.required = false;
        otherInput.value = '';
    }
}

// دالة طباعة جدول التسجيل كملف PDF
function printRegistrationPDF() {
    const printWindow = window.open('', '', 'height=700,width=1000');
    printWindow.document.write('<html><head><title>سجل طلبة المرحلة الأولى - تقنيات التخدير</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Tahoma, sans-serif; direction: rtl; padding: 20px; color: #000; }');
    printWindow.document.write('h2 { text-align: center; margin-bottom: 5px; }');
    printWindow.document.write('p { text-align: center; font-size: 12px; color: #555; margin-bottom: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #333; padding: 6px; text-align: right; }');
    printWindow.document.write('th { background-color: #f2f2f2; }');
    printWindow.document.write('.no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>قسم تقنيات المختبرات الطبية - سجل طلبة المرحلة الأولى (تخدير)</h2>');
    printWindow.document.write('<p>العام الدراسي: 2026-2027</p>');
    
    // نسخ جدول الطلبة بدون أعمدة الإجراءات
    const tableHTML = document.querySelector('.printable-table').outerHTML;
    // إزالة خلية الإجراءات إن وجدت في النسخة المطبوعة
    const parser = new DOMParser();
    const doc = parser.parseFromString(tableHTML, 'text/html');
    const noPrintElements = doc.querySelectorAll('.no-print');
    noPrintElements.forEach(el => el.remove());
    
    printWindow.document.write(doc.body.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// تعديل دالة إضافة الطالب لتأخذ الحالة المرضية المخصصة
const originalAddStudent = window.addStudentRecord;
window.addStudentRecord = function(e) {
    e.preventDefault();
    const medicalSelect = document.getElementById('reg-medical').value;
    const medicalOther = document.getElementById('reg-medical-other').value.trim();
    const finalMedical = medicalSelect === 'أخرى' ? (medicalOther || 'أخرى') : 'سليم';

    const student = {
        name: document.getElementById('reg-name').value.trim(),
        studyType: document.getElementById('reg-study-type').value,
        gender: document.getElementById('reg-gender').value,
        channel: document.getElementById('reg-channel').value,
        prevStudy: document.getElementById('reg-prev-study').value.trim(),
        gpa: document.getElementById('reg-gpa').value,
        blood: document.getElementById('reg-blood').value,
        medical: finalMedical,
        dob: document.getElementById('reg-dob').value,
        address: document.getElementById('reg-address').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        guardianPhone: document.getElementById('reg-guardian-phone').value.trim(),
        receipt: document.getElementById('reg-receipt').value.trim() || 'غير مسجل'
    };

    if (typeof registeredStudents !== 'undefined') {
        registeredStudents.push(student);
        localStorage.setItem('first_year_students', JSON.stringify(registeredStudents));
        if (typeof renderStudentsTable === 'function') renderStudentsTable();
        document.getElementById('student-reg-form').reset();
        document.getElementById('reg-medical-other').classList.add('hidden');
        alert('تم تسجيل الطالب بنجاح!');
    }
}


// ==================== ربط المشرفين المباشر بـ Supabase ====================

// 1. التحقق وتسجيل دخول المشرف عبر Supabase
async function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin-username').value.trim();
    const pin = document.getElementById('admin-password').value.trim();

    if (supabaseClient) {
        try {
            // الاستعلام من جدول المشرفين في Supabase
            const { data, error } = await supabaseClient
                .from('supervisors')
                .select('*')
                .or(`name.eq.${user},email.eq.${user}`)
                .eq('pin', pin);

            if (error) throw error;

            if (data && data.length > 0) {
                currentLoggedInAdmin = data[0];
                sessionStorage.setItem('active_admin_session', JSON.stringify(currentLoggedInAdmin));
                showAdminDashboard();
                return;
            }
        } catch (err) {
            console.error('Supabase Login Error:', err);
        }
    }

    // التحقق المحلي السريع كبديل في حال عدم الاتصال
    const localMatched = supervisors.find(s => (s.name === user || s.email === user) && s.pin === pin);
    if (localMatched || (user === 'admin' && pin === '123456')) {
        currentLoggedInAdmin = localMatched || { name: user, role: 'مدير نظام كامل' };
        sessionStorage.setItem('active_admin_session', JSON.stringify(currentLoggedInAdmin));
        showAdminDashboard();
    } else {
        alert('رمز الدخول أو اسم المشرف غير صحيح!');
    }
}

// 2. إضافة مشرف جديد وتخزينه فوراً في Supabase
async function addNewSupervisor(e) {
    e.preventDefault();
    const name = document.getElementById('new-sup-name').value.trim();
    const email = document.getElementById('new-sup-email').value.trim();
    const pin = document.getElementById('new-sup-pin').value.trim();
    const role = document.getElementById('new-sup-role').value;

    const newSupervisor = { name, email, pin, role };

    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('supervisors')
                .insert([newSupervisor]);

            if (error) {
                alert('حدث خطأ أثناء الحفظ في Supabase: ' + error.message);
                return;
            }
            alert('تم حَفظ وإضافة المشرف الجديد في Supabase بنجاح!');
        } catch (err) {
            console.error('Supabase Insert Error:', err);
        }
    }

    // التحديث المحلي
    supervisors.push(newSupervisor);
    localStorage.setItem('sys_supervisors', JSON.stringify(supervisors));
    fetchAndRenderSupervisors();
    e.target.reset();
}

// 3. جلب قائمة المشرفين من Supabase
async function fetchAndRenderSupervisors() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('supervisors')
                .select('*')
                .order('id', { ascending: true });

            if (!error && data) {
                supervisors = data;
            }
        } catch (err) {
            console.error('Fetch Supervisors Error:', err);
        }
    }
    renderSupervisorsList();
}

// 4. حذف مشرف من Supabase
async function deleteSupervisor(idx) {
    const targetSup = supervisors[idx];
    if (!targetSup) return;

    if (confirm(`هل أنت متأكد من إلغاء صلاحية المشرف (${targetSup.name})؟`)) {
        if (supabaseClient && targetSup.id) {
            try {
                await supabaseClient
                    .from('supervisors')
                    .delete()
                    .eq('id', targetSup.id);
            } catch (err) {
                console.error('Delete Supervisor Error:', err);
            }
        }

        supervisors.splice(idx, 1);
        localStorage.setItem('sys_supervisors', JSON.stringify(supervisors));
        renderSupervisorsList();
    }
}


// إدارة حسابات المشرفين وحس النمط الأمني
let supervisors = JSON.parse(localStorage.getItem('sys_supervisors')) || [
    { name: 'المدير الرئيسي', email: 'admin@mlt.edu', pin: '123456', role: 'مدير نظام كامل' }
];

let currentLoggedInAdmin = JSON.parse(sessionStorage.getItem('active_admin_session')) || null;

// معالجة دخول المشرف
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin-username').value.trim();
    const pin = document.getElementById('admin-password').value.trim();

    const matched = supervisors.find(s => (s.name === user || s.email === user) && s.pin === pin);

    if (matched || (user === 'admin' && pin === '123456')) {
        currentLoggedInAdmin = matched || { name: user, role: 'مدير نظام كامل' };
        sessionStorage.setItem('active_admin_session', JSON.stringify(currentLoggedInAdmin));
        showAdminDashboard();
    } else {
        alert('رمز الدخول أو اسم المشرف غير صحيح!');
    }
}

// عرض لوحة التحكم بعد التحقق
function showAdminDashboard() {
    document.getElementById('admin-login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard-screen').classList.remove('hidden');
    document.getElementById('current-admin-name').innerText = currentLoggedInAdmin.name;
    renderSupervisorsList();
}

// تسجيل الخروج
function logoutAdmin() {
    currentLoggedInAdmin = null;
    sessionStorage.removeItem('active_admin_session');
    document.getElementById('admin-login-screen').classList.remove('hidden');
    document.getElementById('admin-dashboard-screen').classList.add('hidden');
}

// تبديل الأبواب داخل لوحة الإدارة
function switchAdminTab(tab) {
    document.getElementById('admin-tab-announcement').classList.toggle('hidden', tab !== 'announcement');
    document.getElementById('admin-tab-supervisors').classList.toggle('hidden', tab !== 'supervisors');
    
    document.getElementById('tab-btn-announcement').className = tab === 'announcement' ? 'pb-2 border-b-2 border-teal-400 text-teal-400' : 'pb-2 text-slate-400 hover:text-white';
    document.getElementById('tab-btn-supervisors').className = tab === 'supervisors' ? 'pb-2 border-b-2 border-teal-400 text-teal-400' : 'pb-2 text-slate-400 hover:text-white';
}

// إضافة مشرف جديد
function addNewSupervisor(e) {
    e.preventDefault();
    const name = document.getElementById('new-sup-name').value.trim();
    const email = document.getElementById('new-sup-email').value.trim();
    const pin = document.getElementById('new-sup-pin').value.trim();
    const role = document.getElementById('new-sup-role').value;

    if (supervisors.some(s => s.name === name)) {
        alert('اسم المشرف موجود مسبقاً!');
        return;
    }

    supervisors.push({ name, email, pin, role });
    localStorage.setItem('sys_supervisors', JSON.stringify(supervisors));
    renderSupervisorsList();
    e.target.reset();
    alert('تمت إضافة المشرف الجديد بنجاح وتفعيل رمز الدخول الخاص به!');
}

// عرض المشرفين
function renderSupervisorsList() {
    const tbody = document.getElementById('supervisors-list-rows');
    if (!tbody) return;
    tbody.innerHTML = '';
    supervisors.forEach((s, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2.5 font-bold">${s.name} <span class="block text-[10px] text-slate-400">${s.email || ''}</span></td>
            <td class="p-2.5"><span class="bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded text-[10px]">${s.role}</span></td>
            <td class="p-2.5 text-center">
                ${idx > 0 ? `<button onclick="deleteSupervisor(${idx})" class="text-rose-400 hover:text-rose-300 p-1"><i class="fa-solid fa-user-minus"></i></button>` : '<span class="text-[10px] text-slate-500">رئيسي</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// حذف مشرف
function deleteSupervisor(idx) {
    if (confirm('هل أنت متأكد من إلغاء صلاحية هذا المشرف؟')) {
        supervisors.splice(idx, 1);
        localStorage.setItem('sys_supervisors', JSON.stringify(supervisors));
        renderSupervisorsList();
    }
}

// فتح نافذة الإدارة المؤمّنة
const origOpenModal = window.openAdminModal;
window.openAdminModal = function() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    if (currentLoggedInAdmin) {
        showAdminDashboard();
    } else {
        document.getElementById('admin-login-screen').classList.remove('hidden');
        document.getElementById('admin-dashboard-screen').classList.add('hidden');
    }
}
