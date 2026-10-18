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
