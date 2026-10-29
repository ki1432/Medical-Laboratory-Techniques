document.addEventListener("DOMContentLoaded", () => {
    console.log("Anesthesia Department Portal Initialized successfully.");
    const form = document.getElementById("studentRegisterForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("تم معالجة بيانات طالب التخدير وإضافتها بنجاح.");
        });
    }
});
