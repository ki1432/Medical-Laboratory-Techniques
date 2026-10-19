// ==================== النظام البرمجي الشامل - تقنيات المختبرات الطبية ====================

let registeredStudents = JSON.parse(localStorage.getItem('first_year_students')) || [];
let supervisors = JSON.parse(localStorage.getItem('sys_supervisors')) || [
    { name: 'المدير الرئيسي', email: 'admin@mlt.edu', pin: '123456', role: 'مدير نظام كامل' }
];
let currentLoggedInAdmin = JSON.parse(sessionStorage.getItem('active_admin_session')) || null;

// 1. دالة الوضع الليلي والنهاري (toggleTheme)
function toggleTheme() {
    const htmlEl = document.documentElement;
    const isDark = htmlEl.classList.toggle('dark');
    
    if (isDark) {
        document.body.style.backgroundColor = '#020617';
        document.body.style.color = '#f8fafc';
    } else {
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#0f172a';
    }
    
    localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
}

// 2. إدارة الجداول الدراسية بدقة عالية (switchSchedule & renderTimetable)
const timetablesData = {
    "1_morning": [
        { day: "الأحد", p1: "فيزياء طبية (نظري)", p2: "كيمياء عامة (نظري)", p3: "كيمياء عامة (عملي)", break: "استراحة", p4: "حاسوب (نظري)", p5: "حاسوب (عملي)" },
        { day: "الإثنين", p1: "أحياء عامة (نظري)", p2: "أحياء عامة (عملي)", p3: "لغة عربية", break: "استراحة", p4: "لغة إنجليزية", p5: "حقوق الإنسان" },
        { day: "الثلاثاء", p1: "تشريح ونسيج (نظري)", p2: "تشريح ونسيج (عملي)", p3: "فيزياء طبية (عملي)", break: "استراحة", p4: "مصطلحات طبية", p5: "مصطلحات طبية" },
        { day: "الأربعاء", p1: "كيمياء عضوية", p2: "كيمياء عضوية", p3: "سلامة مهنية", break: "استراحة", p4: "تاريخ علوم", p5: "نشاط رياضي" },
        { day: "الخميس", p1: "مختبر افتراضي", p2: "مختبر افتراضي", p3: "مراجعة عامة", break: "استراحة", p4: "إرشاد أكاديمي", p5: "إرشاد أكاديمي" }
    ],
    "2_morning": [
        { day: "الأحد", p1: "أحياء مجهرية (عملي)", p2: "أحياء مجهرية (عملي)", p3: "كيمياء سريرية (نظري)", break: "استراحة", p4: "طفيليات (نظري)", p5: "مناعة (عملي)" },
        { day: "الإثنين", p1: "كيمياء حيوية (عملي)", p2: "كيمياء حيوية (عملي)", p3: "أمراض دم (نظري)", break: "استراحة", p4: "لغة إنجليزية", p5: "حاسوب (عملي)" },
        { day: "الثلاثاء", p1: "أمراض دم (عملي)", p2: "أمراض دم (عملي)", p3: "أحياء مجهرية (نظري)", break: "استراحة", p4: "تشريح مرضي", p5: "تشريح مرضي" },
        { day: "الأربعاء", p1: "طفيليات (عملي)", p2: "طفيليات (عملي)", p3: "مناعة (نظري)", break: "استراحة", p4: "أخلاقيات مهنة", p5: "نشاط إرشادي" },
        { day: "الخميس", p1: "دم ومناعة (مراجعة)", p2: "كيمياء سريرية (عملي)", p3: "كيمياء سريرية (عملي)", break: "استراحة", p4: "حلقات بحثية", p5: "حلقات بحثية" }
    ]
};

function switchSchedule() {
    const stageSelect = document.getElementById('schedule-stage') || document.querySelector('select[onchange*="switchSchedule"]');
    const typeSelect = document.getElementById('schedule-type');
    
    const stage = stageSelect ? stageSelect.value : '2';
    const type = typeSelect ? typeSelect.value : 'morning';
    
    renderTimetableData(stage, type);
}

function renderTimetable() {
    switchSchedule();
}

function renderTimetableData(stage, type) {
    const tbody = document.getElementById('timetable-rows');
    if (!tbody) return;

    const key = `${stage}_${type}`;
    const schedule = timetablesData[key] || timetablesData["2_morning"];

    tbody.innerHTML = '';
    schedule.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/40 transition border-b border-slate-800/60";
        tr.innerHTML = `
            <td class="p-3 font-bold text-sky-400 bg-slate-950/60 text-center">${row.day}</td>
            <td class="p-3 text-center">${row.p1}</td>
            <td class="p-3 text-center">${row.p2}</td>
            <td class="p-3 text-center">${row.p3}</td>
            <td class="p-3 text-center bg-amber-500/10 text-amber-400 font-bold">${row.break}</td>
            <td class="p-3 text-center">${row.p4}</td>
            <td class="p-3 text-center">${row.p5}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. إدارة لوحة التحكم (فتح، إغلاق، تسجيل الدخول)
function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    if (currentLoggedInAdmin) {
        showAdminDashboard();
    } else {
        const loginScreen = document.getElementById('admin-login-screen');
        const dashScreen = document.getElementById('admin-dashboard-screen');
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (dashScreen) dashScreen.classList.add('hidden');
    }
}

function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.classList.add('hidden');
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin-username').value.trim();
    const pin = document.getElementById('admin-password').value.trim();

    if (window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient
                .from('supervisors')
                .select('*')
                .or(`name.eq.${user},email.eq.${user}`)
                .eq('pin', pin);

            if (!error && data && data.length > 0) {
                currentLoggedInAdmin = data[0];
                sessionStorage.setItem('active_admin_session', JSON.stringify(currentLoggedInAdmin));
                showAdminDashboard();
                return;
            }
        } catch (err) {
            console.error('Supabase Login Error:', err);
        }
    }

    const localMatched = supervisors.find(s => (s.name === user || s.email === user) && s.pin === pin);
    if (localMatched || (user === 'admin' && pin === '123456')) {
        currentLoggedInAdmin = localMatched || { name: user, role: 'مدير نظام كامل' };
        sessionStorage.setItem('active_admin_session', JSON.stringify(currentLoggedInAdmin));
        showAdminDashboard();
    } else {
        alert('رمز الدخول أو اسم المشرف غير صحيح!');
    }
}

function showAdminDashboard() {
    const loginScreen = document.getElementById('admin-login-screen');
    const dashScreen = document.getElementById('admin-dashboard-screen');
    if (loginScreen) loginScreen.classList.add('hidden');
    if (dashScreen) dashScreen.classList.remove('hidden');
    const nameSpan = document.getElementById('current-admin-name');
    if (nameSpan && currentLoggedInAdmin) nameSpan.innerText = currentLoggedInAdmin.name;
    fetchAndRenderSupervisors();
    renderStudentsTable();
}

function logoutAdmin() {
    currentLoggedInAdmin = null;
    sessionStorage.removeItem('active_admin_session');
    const loginScreen = document.getElementById('admin-login-screen');
    const dashScreen = document.getElementById('admin-dashboard-screen');
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (dashScreen) dashScreen.classList.add('hidden');
}

function switchAdminTab(tab) {
    const annTab = document.getElementById('admin-tab-announcement');
    const supTab = document.getElementById('admin-tab-supervisors');
    const regTab = document.getElementById('admin-tab-registration');

    const btnAnn = document.getElementById('tab-btn-announcement');
    const btnSup = document.getElementById('tab-btn-supervisors');
    const btnReg = document.getElementById('tab-btn-registration');

    if (annTab) annTab.classList.toggle('hidden', tab !== 'announcement');
    if (supTab) supTab.classList.toggle('hidden', tab !== 'supervisors');
    if (regTab) regTab.classList.toggle('hidden', tab !== 'registration');

    if (btnAnn) btnAnn.className = tab === 'announcement' ? 'pb-2 border-b-2 border-teal-400 text-teal-400 font-bold text-xs' : 'pb-2 text-slate-400 hover:text-white font-bold text-xs';
    if (btnSup) btnSup.className = tab === 'supervisors' ? 'pb-2 border-b-2 border-teal-400 text-teal-400 font-bold text-xs' : 'pb-2 text-slate-400 hover:text-white font-bold text-xs';
    if (btnReg) btnReg.className = tab === 'registration' ? 'pb-2 border-b-2 border-teal-400 text-teal-400 font-bold text-xs' : 'pb-2 text-slate-400 hover:text-white font-bold text-xs';
}

async function updateAnnouncement() {
    const input = document.getElementById('admin-announcement-input');
    if (!input) return;
    const newText = input.value.trim();
    if (!newText) {
        alert('يرجى كتابة نص الإعلان أولاً!');
        return;
    }

    document.querySelectorAll('.announcement-ticker-text').forEach(el => {
        el.innerText = newText;
    });

    if (window.supabaseClient) {
        try {
            await window.supabaseClient.from('announcements').insert([{ content: newText }]);
        } catch (err) {
            console.error('Supabase Announcement Error:', err);
        }
    }

    localStorage.setItem('latest_announcement', newText);
    alert('تم نشر وتحديث الإعلان العاجل بنجاح في الصفحة الرئيسية!');
    input.value = '';
}

async function addNewSupervisor(e) {
    e.preventDefault();
    const name = document.getElementById('new-sup-name').value.trim();
    const email = document.getElementById('new-sup-email').value.trim();
    const pin = document.getElementById('new-sup-pin').value.trim();
    const role = document.getElementById('new-sup-role').value;

    const newSup = { name, email, pin, role };

    if (window.supabaseClient) {
        try {
            const { error } = await window.supabaseClient.from('supervisors').insert([newSup]);
            if (error) {
                alert('خطأ في الحفظ على Supabase: ' + error.message);
                return;
            }
            alert('تم حفظ المشرف الجديد في Supabase بنجاح!');
        } catch (err) {
            console.error(err);
        }
    }

    supervisors.push(newSup);
    localStorage.setItem('sys_supervisors', JSON.stringify(supervisors));
    renderSupervisorsList();
    e.target.reset();
}

async function fetchAndRenderSupervisors() {
    if (window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient.from('supervisors').select('*');
            if (!error && data) {
                supervisors = data;
            }
        } catch (err) {
            console.error(err);
        }
    }
    renderSupervisorsList();
}

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

async function deleteSupervisor(idx) {
    const targetSup = supervisors[idx];
    if (!targetSup) return;

    if (confirm(`هل أنت متأكد من حذف المشرف (${targetSup.name})؟`)) {
        if (window.supabaseClient && targetSup.id) {
            try {
                await window.supabaseClient.from('supervisors').delete().eq('id', targetSup.id);
            } catch (err) {
                console.error(err);
            }
        }
        supervisors.splice(idx, 1);
        localStorage.setItem('sys_supervisors', JSON.stringify(supervisors));
        renderSupervisorsList();
    }
}

function addStudentRecord(e) {
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

    registeredStudents.push(student);
    localStorage.setItem('first_year_students', JSON.stringify(registeredStudents));
    renderStudentsTable();
    document.getElementById('student-reg-form').reset();
    alert('تم إضافة الطالب بنجاح!');
}

function renderStudentsTable() {
    const tbody = document.getElementById('students-reg-rows');
    if (!tbody) return;
    tbody.innerHTML = '';
    registeredStudents.forEach((s, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2.5">${idx + 1}</td>
            <td class="p-2.5 font-bold">${s.name}</td>
            <td class="p-2.5">${s.studyType}</td>
            <td class="p-2.5">${s.gender}</td>
            <td class="p-2.5">${s.channel}</td>
            <td class="p-2.5">${s.prevStudy || '-'}</td>
            <td class="p-2.5">${s.gpa || '-'}</td>
            <td class="p-2.5">${s.blood}</td>
            <td class="p-2.5">${s.medical}</td>
            <td class="p-2.5">${s.dob || '-'}</td>
            <td class="p-2.5">${s.address || '-'}</td>
            <td class="p-2.5">${s.phone || '-'}</td>
            <td class="p-2.5">${s.guardianPhone || '-'}</td>
            <td class="p-2.5">${s.receipt}</td>
            <td class="p-2.5 text-center no-print">
                <button onclick="deleteStudent(${idx})" class="text-rose-400 hover:text-rose-300"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteStudent(idx) {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
        registeredStudents.splice(idx, 1);
        localStorage.setItem('first_year_students', JSON.stringify(registeredStudents));
        renderStudentsTable();
    }
}

function printTimetablePDF() {
    const printWindow = window.open('', '', 'height=700,width=1000');
    printWindow.document.write('<html><head><title>الجدول الدراسي الأسبوعي - تقنيات المختبرات الطبية</title>');
    printWindow.document.write('<style>body{font-family:Tahoma,sans-serif;direction:rtl;padding:20px;color:#000;}h2{text-align:center;}table{width:100%;border-collapse:collapse;margin-top:15px;}th,td{border:1px solid #333;padding:8px;text-align:center;font-size:11px;}th{background-color:#f2f2f2;}</style></head><body>');
    printWindow.document.write('<h2>قسم تقنيات المختبرات الطبية - الجدول الدراسي الأسبوعي</h2>');
    const tableEl = document.querySelector('.printable-timetable');
    if (tableEl) {
        printWindow.document.write(tableEl.outerHTML);
    }
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
}

function printRegistrationPDF() {
    const printWindow = window.open('', '', 'height=700,width=1000');
    printWindow.document.write('<html><head><title>سجل طلبة المرحلة الأولى - تقنيات المختبرات الطبية</title>');
    printWindow.document.write('<style>body{font-family:Tahoma,sans-serif;direction:rtl;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #333;padding:6px;text-align:right;font-size:10px;}.no-print{display:none;}</style></head><body>');
    printWindow.document.write('<h2>سجل طلبة المرحلة الأولى - قسم تقنيات المختبرات الطبية</h2>');
    const tableEl = document.querySelector('.printable-table');
    if (tableEl) {
        const clone = tableEl.cloneNode(true);
        clone.querySelectorAll('.no-print').forEach(el => el.remove());
        printWindow.document.write(clone.outerHTML);
    }
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
}

function exportToExactExcel() {
    if (registeredStudents.length === 0) {
        alert('لا توجد بيانات مسجلة للتصدير!');
        return;
    }
    let csv = '﻿ت,اسم الطالب,نوع الدراسة,الجنس,قناة القبول,الدراسة السابقة,المعدل,فصيلة الدم,الحالة المرضية,تاريخ التولد,عنوان السكن,الهاتف,هاتف ولي الامر,رقم الوصل
';
    registeredStudents.forEach((s, i) => {
        csv += `${i+1},"${s.name}","${s.studyType}","${s.gender}","${s.channel}","${s.prevStudy}","${s.gpa}","${s.blood}","${s.medical}","${s.dob}","${s.address}","${s.phone}","${s.guardianPhone}","${s.receipt}"
`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'students_registry.csv';
    link.click();
}

function filterLabTests() {
    const query = document.getElementById('lab-search-input')?.value.toLowerCase() || '';
    document.querySelectorAll('.lab-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(query) ? 'block' : 'none';
    });
}

window.addEventListener('DOMContentLoaded', () => {
    switchSchedule();
    renderStudentsTable();
    const savedAnn = localStorage.getItem('latest_announcement');
    if (savedAnn) {
        document.querySelectorAll('.announcement-ticker-text').forEach(el => el.innerText = savedAnn);
    }
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#0f172a';
    } else {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#020617';
        document.body.style.color = '#f8fafc';
    }
});