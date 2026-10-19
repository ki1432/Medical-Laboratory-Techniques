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
