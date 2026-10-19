let registeredStudents = JSON.parse(localStorage.getItem('first_year_students')) || [];
let supervisors = JSON.parse(localStorage.getItem('sys_supervisors')) || [
    { name: 'المدير الرئيسي', email: 'admin@mlt.edu', pin: '123456', role: 'مدير نظام كامل' }
];
let currentLoggedInAdmin = JSON.parse(sessionStorage.getItem('active_admin_session')) || null;

// تصفية المحتوى والبحث العام
function filterContent() {
    const query = document.getElementById('global-search')?.value.toLowerCase() || '';
    console.log('Searching for:', query);
}

// فتح وإغلاق نافذة الإدارة
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

// إدارة الحالة المرضية المخصصة
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

// إضافة سجل طالب جديد
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
    const otherInput = document.getElementById('reg-medical-other');
    if (otherInput) otherInput.classList.add('hidden');
    alert('تم تسجيل الطالب بنجاح!');
}

// عرض جدول الطلبة المسجلين
function renderStudentsTable() {
    const tbody = document.getElementById('students-reg-rows');
    if (!tbody) return;
    tbody.innerHTML = '';
    registeredStudents.forEach((s, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-3">${idx + 1}</td>
            <td class="p-3 font-bold">${s.name}</td>
            <td class="p-3">${s.studyType}</td>
            <td class="p-3">${s.gender}</td>
            <td class="p-3">${s.channel}</td>
            <td class="p-3">${s.prevStudy || '-'}</td>
            <td class="p-3">${s.gpa || '-'}</td>
            <td class="p-3">${s.blood}</td>
            <td class="p-3">${s.medical}</td>
            <td class="p-3">${s.dob || '-'}</td>
            <td class="p-3">${s.address || '-'}</td>
            <td class="p-3">${s.phone || '-'}</td>
            <td class="p-3">${s.guardianPhone || '-'}</td>
            <td class="p-3">${s.receipt}</td>
            <td class="p-3 text-center no-print">
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

// طباعة جدول التسجيل كملف PDF
function printRegistrationPDF() {
    const printWindow = window.open('', '', 'height=700,width=1000');
    printWindow.document.write('<html><head><title>سجل طلبة المرحلة الأولى - تقنيات المختبرات الطبية</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Tahoma, sans-serif; direction: rtl; padding: 20px; color: #000; }');
    printWindow.document.write('h2 { text-align: center; margin-bottom: 5px; }');
    printWindow.document.write('p { text-align: center; font-size: 12px; color: #555; margin-bottom: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #333; padding: 6px; text-align: right; }');
    printWindow.document.write('th { background-color: #f2f2f2; }');
    printWindow.document.write('.no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>قسم تقنيات المختبرات الطبية - سجل طلبة المرحلة الأولى</h2>');
    printWindow.document.write('<p>العام الدراسي: 2026-2027</p>');
    
    const tableEl = document.querySelector('.printable-table');
    if (tableEl) {
        const clone = tableEl.cloneNode(true);
        clone.querySelectorAll('.no-print').forEach(el => el.remove());
        printWindow.document.write(clone.outerHTML);
    } else {
        printWindow.document.write('<p>لا توجد بيانات مسجلة حالياً.</p>');
    }
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// تصدير إلى Excel
function exportToExactExcel() {
    if (registeredStudents.length === 0) {
        alert('لا توجد بيانات لتصديرها!');
        return;
    }
    let csv = '\ufeffت,اسم الطالب,نوع الدراسة,الجنس,قناة القبول,الدراسة السابقة,المعدل,فصيلة الدم,الحالة المرضية,تاريخ التولد,عنوان السكن,الهاتف,هاتف ولي الامر,رقم الوصل\n';
    registeredStudents.forEach((s, i) => {
        csv += `${i+1},"${s.name}","${s.studyType}","${s.gender}","${s.channel}","${s.prevStudy}","${s.gpa}","${s.blood}","${s.medical}","${s.dob}","${s.address}","${s.phone}","${s.guardianPhone}","${s.receipt}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'students_registration_2026_2027.csv';
    link.click();
}

// تسجيل دخول المشرف
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
    const btnAnn = document.getElementById('tab-btn-announcement');
    const btnSup = document.getElementById('tab-btn-supervisors');

    if (annTab) annTab.classList.toggle('hidden', tab !== 'announcement');
    if (supTab) supTab.classList.toggle('hidden', tab !== 'supervisors');
    
    if (btnAnn) btnAnn.className = tab === 'announcement' ? 'pb-2 border-b-2 border-teal-400 text-teal-400 font-bold text-xs' : 'pb-2 text-slate-400 hover:text-white font-bold text-xs';
    if (btnSup) btnSup.className = tab === 'supervisors' ? 'pb-2 border-b-2 border-teal-400 text-teal-400 font-bold text-xs' : 'pb-2 text-slate-400 hover:text-white font-bold text-xs';
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

window.addEventListener('DOMContentLoaded', () => {
    renderStudentsTable();
});
