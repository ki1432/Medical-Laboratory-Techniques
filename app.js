// بيانات تجريبية لأرشيف الطلبة والدفعات (2024 - 2026)
const studentsData = [
    { id: 1, name: "أحمد علي حسن", batch: "2026", stage: "المرحلة الأولى", status: "مستمر" },
    { id: 2, name: "فاطمة محمد كريم", batch: "2026", stage: "المرحلة الأولى", status: "مستمر" },
    { id: 3, name: "حيدر جاسم محمد", batch: "2025", stage: "المرحلة الثانية", status: "مستمر" },
    { id: 4, name: "زينب عبد الله كاظم", batch: "2025", stage: "المرحلة الثانية", status: "مستمر" },
    { id: 5, name: "مصطفى رعد عبد اللطيف", batch: "2024", stage: "المرحلة الثالثة / خريج", status: "خريج" },
    { id: 6, name: "مريم صبيح عبد الحسين", batch: "2024", stage: "المرحلة الثالثة / خريج", status: "خريج" }
];

// دالة الدخول من شاشة البداية السينمائية
function enterPortal() {
    const splash = document.getElementById('splash-screen');
    const main = document.getElementById('main-content');
    
    splash.classList.add('splash-hidden');
    setTimeout(() => {
        splash.style.display = 'none';
        main.classList.remove('hidden');
        renderStudents(studentsData);
    }, 800);
}

// عرض جدول الطلبة والدفعات
function renderStudents(data) {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-500">لا توجد نتائج مطابقة للبحث</td></tr>`;
        return;
    }

    data.forEach((student, index) => {
        const statusBadge = student.status === 'خريج' 
            ? `<span class="px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px]">خريج</span>`
            : `<span class="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">مستمر</span>`;

        const row = `
            <tr class="hover:bg-slate-900/50 transition">
                <td class="p-3.5 font-mono text-slate-400">0${index + 1}</td>
                <td class="p-3.5 font-medium text-white">${student.name}</td>
                <td class="p-3.5 text-sky-300 font-mono">دفعة ${student.batch}</td>
                <td class="p-3.5 text-slate-300">${student.stage}</td>
                <td class="p-3.5">${statusBadge}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// تصفية حسب الدفعة أو البحث النصي
document.addEventListener('DOMContentLoaded', () => {
    const batchFilter = document.getElementById('batch-filter');
    const studentSearch = document.getElementById('student-search');

    function filterStudents() {
        const batchValue = batchFilter.value;
        const searchValue = studentSearch.value.toLowerCase().trim();

        const filtered = studentsData.filter(student => {
            const matchesBatch = (batchValue === 'all' || student.batch === batchValue);
            const matchesSearch = student.name.toLowerCase().includes(searchValue);
            return matchesBatch && matchesSearch;
        });

        renderStudents(filtered);
    }

    if (batchFilter && studentSearch) {
        batchFilter.addEventListener('change', filterStudents);
        studentSearch.addEventListener('input', filterStudents);
    }
});

// معالجة نموذج التسجيل
function handleRegistration(event) {
    event.preventDefault();
    alert('تم إرسال استمارة التسجيل بنجاح! سيتم مراجعة البيانات من قبل شؤون الطلبة.');
    event.target.reset();
}