// ==================== النظام البرمجي الشامل - تقنيات المختبرات الطبية (إصدار الخبير) ====================

let registeredStudents = JSON.parse(localStorage.getItem('first_year_students')) || [];
let supervisors = JSON.parse(localStorage.getItem('sys_supervisors')) || [
    { name: 'المدير الرئيسي', email: 'admin@mlt.edu', pin: '123456', role: 'مدير نظام كامل' }
];
let currentLoggedInAdmin = JSON.parse(sessionStorage.getItem('active_admin_session')) || null;

// --- 1. نظام المظهر (الوضع الليلي والنهاري) ---
function toggleTheme() {
    const htmlEl = document.documentElement;
    if (!htmlEl) return;
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

// --- 2. لوحة الإدارة (فتح، إغلاق، تسجيل الدخول) ---
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
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const userInput = document.getElementById('admin-username');
    const pinInput = document.getElementById('admin-password');
    if (!userInput || !pinInput) return;

    const user = userInput.value.trim();
    const pin = pinInput.value.trim();

    // التحقق عبر Supabase إن وجد
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
            console.warn('Supabase offline or error, falling back to local storage:', err);
        }
    }

    // التحقق المحلي
    const localMatched = supervisors.find(s => (s.name === user || s.email === user) && s.pin === pin);
    if (localMatched || (user === 'admin' && pin === '123456')) {
        currentLoggedInAdmin = localMatched || { name: user || 'المدير', role: 'مدير نظام كامل' };
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
    
    if (typeof fetchAndRenderSupervisors === 'function') fetchAndRenderSupervisors();
    if (typeof renderStudentsTable === 'function') renderStudentsTable();
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

// --- 3. الإعلانات والتنويهات ---
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
    alert('تم نشر وتحديث الإعلان بنجاح!');
    input.value = '';
}

// --- 4. إدارة المشرفين ---
async function addNewSupervisor(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const nameEl = document.getElementById('new-sup-name');
    const emailEl = document.getElementById('new-sup-email');
    const pinEl = document.getElementById('new-sup-pin');
    const roleEl = document.getElementById('new-sup-role');
    if (!nameEl || !pinEl || !roleEl) return;

    const newSup = {
        name: nameEl.value.trim(),
        email: emailEl ? emailEl.value.trim() : '',
        pin: pinEl.value.trim(),
        role: roleEl.value
    };

    if (window.supabaseClient) {
        try {
            const { error } = await window.supabaseClient.from('supervisors').insert([newSup]);
            if (error) {
                alert('خطأ في الحفظ على Supabase: ' + error.message);
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    supervisors.push(newSup);
    localStorage.setItem('sys_supervisors', JSON.stringify(supervisors));
    renderSupervisorsList();
    if (e && e.target && typeof e.target.reset === 'function') e.target.reset();
    alert('تم إضافة المشرف بنجاح!');
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
            <td class="p-2.5 font-bold">${s.name || ''} <span class="block text-[10px] text-slate-400">${s.email || ''}</span></td>
            <td class="p-2.5"><span class="bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded text-[10px]">${s.role || ''}</span></td>
            <td class="p-2.5 text-center">
                ${idx > 0 ? `<button type="button" onclick="deleteSupervisor(${idx})" class="text-rose-400 hover:text-rose-300 p-1"><i class="fa-solid fa-user-minus"></i></button>` : '<span class="text-[10px] text-slate-500">رئيسي</span>'}
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

// --- 5. إدارة الطلبة والسجلات ---
function addStudentRecord(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const nameEl = document.getElementById('reg-name');
    if (!nameEl) return;

    const medicalSelect = document.getElementById('reg-medical')?.value || 'سليم';
    const medicalOther = document.getElementById('reg-medical-other')?.value.trim() || '';
    const finalMedical = medicalSelect === 'أخرى' ? (medicalOther || 'أخرى') : 'سليم';

    const student = {
        name: nameEl.value.trim(),
        studyType: document.getElementById('reg-study-type')?.value || 'صباحي',
        gender: document.getElementById('reg-gender')?.value || 'ذكر',
        channel: document.getElementById('reg-channel')?.value || 'عامة',
        prevStudy: document.getElementById('reg-prev-study')?.value.trim() || '',
        gpa: document.getElementById('reg-gpa')?.value || '',
        blood: document.getElementById('reg-blood')?.value || 'O+',
        medical: finalMedical,
        dob: document.getElementById('reg-dob')?.value || '',
        address: document.getElementById('reg-address')?.value.trim() || '',
        phone: document.getElementById('reg-phone')?.value.trim() || '',
        guardianPhone: document.getElementById('reg-guardian-phone')?.value.trim() || '',
        receipt: document.getElementById('reg-receipt')?.value.trim() || 'غير مسجل'
    };

    registeredStudents.push(student);
    localStorage.setItem('first_year_students', JSON.stringify(registeredStudents));
    renderStudentsTable();
    const formEl = document.getElementById('student-reg-form');
    if (formEl && typeof formEl.reset === 'function') formEl.reset();
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
            <td class="p-2.5 font-bold">${s.name || ''}</td>
            <td class="p-2.5">${s.studyType || ''}</td>
            <td class="p-2.5">${s.gender || ''}</td>
            <td class="p-2.5">${s.channel || ''}</td>
            <td class="p-2.5">${s.prevStudy || '-'}</td>
            <td class="p-2.5">${s.gpa || '-'}</td>
            <td class="p-2.5">${s.blood || ''}</td>
            <td class="p-2.5">${s.medical || ''}</td>
            <td class="p-2.5">${s.dob || '-'}</td>
            <td class="p-2.5">${s.address || '-'}</td>
            <td class="p-2.5">${s.phone || '-'}</td>
            <td class="p-2.5">${s.guardianPhone || '-'}</td>
            <td class="p-2.5">${s.receipt || '-'}</td>
            <td class="p-2.5 text-center no-print">
                <button type="button" onclick="deleteStudent(${idx})" class="text-rose-400 hover:text-rose-300"><i class="fa-solid fa-trash"></i></button>
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

function printRegistrationPDF() {
    const printWindow = window.open('', '', 'height=700,width=1000');
    if (!printWindow) return;
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
    let csv = '﻿ت,اسم الطالب,نوع الدراسة,الجنس,قناة القبول,الدراسة السابقة,المعدل,فصيلة الدم,الحالة المرضية,تاريخ التولد,عنوان السكن,الهاتف,هاتف ولي الامر,رقم الوصل\n';
    registeredStudents.forEach((s, i) => {
        csv += `${i+1},"${s.name || ''}","${s.studyType || ''}","${s.gender || ''}","${s.channel || ''}","${s.prevStudy || ''}","${s.gpa || ''}","${s.blood || ''}","${s.medical || ''}","${s.dob || ''}","${s.address || ''}","${s.phone || ''}","${s.guardianPhone || ''}","${s.receipt || ''}"\n`;
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

// --- 6. التصدير الحتمي لنطاق الـ Window العالمي لضمان عدم فشل أي زر ---
window.toggleTheme = toggleTheme;
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.handleAdminLogin = handleAdminLogin;
window.showAdminDashboard = showAdminDashboard;
window.logoutAdmin = logoutAdmin;
window.switchAdminTab = switchAdminTab;
window.updateAnnouncement = updateAnnouncement;
window.addNewSupervisor = addNewSupervisor;
window.deleteSupervisor = deleteSupervisor;
window.addStudentRecord = addStudentRecord;
window.deleteStudent = deleteStudent;
window.toggleMedicalInput = toggleMedicalInput;
window.printRegistrationPDF = printRegistrationPDF;
window.exportToExactExcel = exportToExactExcel;
window.filterLabTests = filterLabTests;

// --- 7. التشغيل الآمن عند تحميل الصفحة ---
document.addEventListener('DOMContentLoaded', () => {
    try {
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
    } catch (err) {
        console.error('Initialization error caught safely:', err);
    }
});

window.switchSchedule = function() {};
window.renderTimetable = function() {};
