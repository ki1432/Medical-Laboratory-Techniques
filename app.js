// إدارة حسابات المشرفين والحماية
let supervisors = JSON.parse(localStorage.getItem('sys_supervisors')) || [
    { name: 'المدير الرئيسي', email: 'admin@mlt.edu', pin: '123456', role: 'مدير نظام كامل' }
];

let currentLoggedInAdmin = JSON.parse(sessionStorage.getItem('active_admin_session')) || null;

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

// معالجة تسجيل دخول المشرف
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

    // التحقق المحلي
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
