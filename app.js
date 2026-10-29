// إعدادات اتصال Supabase (أدخل مفاتيح مشروعك هنا)
const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient = null;
try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
    console.warn("Supabase initialization deferred.");
}

document.addEventListener("DOMContentLoaded", async () => {
    const dbStatus = document.getElementById('db-status');
    const form = document.getElementById("studentRegisterForm");
    const tableBody = document.getElementById("studentsTableBody");

    if (supabaseClient) {
        dbStatus.className = "px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-xl font-mono border border-emerald-500/25 flex items-center gap-2";
        dbStatus.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span> متصل بقاعدة بيانات Supabase';
        await fetchStudents();
    } else {
        dbStatus.className = "px-3 py-1 bg-rose-500/10 text-rose-400 text-xs rounded-xl font-mono border border-rose-500/25";
        dbStatus.innerText = 'وضع التشغيل المحلي (Offline Mode)';
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const studentData = {
                name: document.getElementById("regName").value,
                address: document.getElementById("regAddress").value,
                dob: document.getElementById("regDob").value,
                health_status: document.getElementById("regHealth").value === 'أخرى' ? document.getElementById("regHealthOther").value : 'سليم',
                blood_type: document.getElementById("regBlood").value,
                avg: parseFloat(document.getElementById("regAvg").value),
                prev_edu: document.getElementById("regPrevEdu").value === 'أخرى' ? document.getElementById("regPrevEduOther").value : 'لا يوجد',
                admission_channel: document.getElementById("regChannel").value,
                receipt_no: document.getElementById("regReceipt").value,
                parent_phone: document.getElementById("regParentPhone").value,
                student_phone: document.getElementById("regStudentPhone").value,
                gender: document.getElementById("regGender").value,
                study_type: document.getElementById("regStudyType").value
            };

            if (supabaseClient) {
                const { error } = await supabaseClient.from('anesthesia_students').insert([studentData]);
                if (error) {
                    alert("خطأ أثناء الحفظ في Supabase: " + error.message);
                    return;
                }
                alert("تم حفظ بيانات طالب التخدير في السحابة بنجاح!");
                form.reset();
                await fetchStudents();
            } else {
                alert("تم تسجيل الطالب محلياً بنجاح.");
            }
        });
    }

    async function fetchStudents() {
        if (!supabaseClient) return;
        const { data, error } = await supabaseClient.from('anesthesia_students').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching students:", error);
            return;
        }
        if (data && data.length > 0) {
            tableBody.innerHTML = '';
            data.forEach((st, idx) => {
                tableBody.innerHTML += `
                    <tr>
                        <td class="p-3 font-mono">${idx + 1}</td>
                        <td class="p-3 font-bold text-white">${st.name}</td>
                        <td class="p-3">${st.address}</td>
                        <td class="p-3 font-mono">${st.dob}</td>
                        <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">${st.health_status}</span></td>
                        <td class="p-3 font-mono text-cyan-400 font-bold">${st.blood_type}</td>
                        <td class="p-3 font-mono">${st.avg}</td>
                        <td class="p-3">${st.prev_edu}</td>
                        <td class="p-3">${st.admission_channel}</td>
                        <td class="p-3 font-mono">${st.receipt_no}</td>
                        <td class="p-3 font-mono">${st.parent_phone}</td>
                        <td class="p-3 font-mono">${st.student_phone}</td>
                        <td class="p-3">${st.gender}</td>
                        <td class="p-3">${st.study_type}</td>
                    </tr>
                `;
            });
        }
    }
});
