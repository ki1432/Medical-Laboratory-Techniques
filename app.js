// ==================== النظام البرمجي الشامل - تقنيات المختبرات الطبية ====================

let registeredStudents = JSON.parse(localStorage.getItem('first_year_students')) || [];
let supervisors = JSON.parse(localStorage.getItem('sys_supervisors')) || [
    { name: 'المدير الرئيسي', email: 'admin@mlt.edu', pin: '123456', role: 'مدير نظام كامل' }
];
let currentLoggedInAdmin = JSON.parse(sessionStorage.getItem('active_admin_session')) || null;

// 1. الوضع الليلي والنهاري


// 2. إدارة الجداول الدراسية






_${type}`;
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

// 3. لوحة التحكم والإدارة
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
}

function updateAnnouncement() {
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
    localStorage.setItem('latest_announcement', newText);
    alert('تم نشر وتحديث الإعلان بنجاح!');
    input.value = '';
}

function addStudentRecord(e) {
    e.preventDefault();
    const student = {
        name: document.getElementById('reg-name').value.trim(),
        studyType: document.getElementById('reg-study-type').value,
        gender: document.getElementById('reg-gender').value,
        channel: document.getElementById('reg-channel').value,
        gpa: document.getElementById('reg-gpa').value,
        blood: document.getElementById('reg-blood').value,
        phone: document.getElementById('reg-phone').value.trim()
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
            <td class="p-2.5">${s.blood}</td>
            <td class="p-2.5">${s.phone || '-'}</td>
            <td class="p-2.5 text-center">
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

function filterLabTests() {
    const query = document.getElementById('lab-search-input')?.value.toLowerCase() || '';
    document.querySelectorAll('.lab-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(query) ? 'block' : 'none';
    });
}

window.addEventListener('DOMContentLoaded', () => {
    
    renderStudentsTable();
    const savedAnn = localStorage.getItem('latest_announcement');
    if (savedAnn) {
        document.querySelectorAll('.announcement-ticker-text').forEach(el => el.innerText = savedAnn);
    }
});

// تصدير الدوال عالمياً للوصول المباشر من عناصر HTML



window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.handleAdminLogin = handleAdminLogin;
window.logoutAdmin = logoutAdmin;
window.switchAdminTab = switchAdminTab;
window.updateAnnouncement = updateAnnouncement;
window.addStudentRecord = addStudentRecord;
