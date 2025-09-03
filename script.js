document.addEventListener('DOMContentLoaded', () => {
    // Gerekli HTML elementlerini seçiyoruz
    const universitySelect = document.getElementById('university-select');
    const coursesTbody = document.getElementById('courses-tbody');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calculateGpaBtn = document.getElementById('calculate-gpa-btn');
    const gpaResultArea = document.getElementById('gpa-result-area');

    // Üniversitelere göre harf notu ve 4'lük sistem karşılıkları
    const gradeValues = {
        standart: { 'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0 },
        auf: { 'AA': 4.0, 'AB': 3.7, 'BA': 3.3, 'BB': 3.0, 'BC': 2.7, 'CB': 2.3, 'CC': 2.0, 'CD': 1.7, 'DC': 1.3, 'DD': 1.0, 'FF': 0.0 },
        auzef: { 'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0 },
        ata_auf: { 'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FF': 0.0 }
    };

    // Harf notu seçeneklerini oluşturan fonksiyon
    const createGradeOptions = () => {
        // Şu anki sistemde tüm harf notları aynı olduğu için standart sistemi kullanabiliriz.
        // İleride farklılaşırsa diye bu yapı korundu.
        const options = gradeValues.standart;
        let html = '<option value="">Seçin</option>';
        for (const grade in options) {
            html += `<option value="${grade}">${grade}</option>`;
        }
        return html;
    };

    // Yeni bir ders satırı ekleyen fonksiyon
    const addCourseRow = () => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="number" class="credit-input" min="1" placeholder="Örn: 3"></td>
            <td><select class="grade-select">${createGradeOptions()}</select></td>
            <td><button class="delete-row-btn">X</button></td>
        `;
        coursesTbody.appendChild(row);
    };

    // Ders satırını silen fonksiyon
    const deleteCourseRow = (button) => {
        button.closest('tr').remove();
    };

    // GANO'yu hesaplayan ana fonksiyon
    const calculateGpa = () => {
        const selectedSystem = universitySelect.value;
        const currentGradeValues = gradeValues[selectedSystem];
        const rows = coursesTbody.querySelectorAll('tr');
        
        let totalCredits = 0;
        let totalWeightedPoints = 0;

        rows.forEach(row => {
            const creditInput = row.querySelector('.credit-input');
            const gradeSelect = row.querySelector('.grade-select');

            const credit = parseFloat(creditInput.value);
            const grade = gradeSelect.value;

            if (!isNaN(credit) && credit > 0 && grade && currentGradeValues[grade] !== undefined) {
                totalCredits += credit;
                totalWeightedPoints += credit * currentGradeValues[grade];
            }
        });

        if (totalCredits === 0) {
            gpaResultArea.innerHTML = 'Lütfen geçerli kredi ve not bilgisi girin.';
            gpaResultArea.style.display = 'block';
            return;
        }

        const gpa = totalWeightedPoints / totalCredits;
        displayResult(gpa);
    };

    // Sonucu ekranda gösteren fonksiyon
    const displayResult = (gpa) => {
        gpaResultArea.innerHTML = `<strong>Dönem Ortalamanız (GANO):</strong> ${gpa.toFixed(2)}`;
        gpaResultArea.style.display = 'block';
    };

    // Butonlara tıklandığında ilgili fonksiyonları çalıştır
    addCourseBtn.addEventListener('click', addCourseRow);
    calculateGpaBtn.addEventListener('click', calculateGpa);

    // Silme butonu için event delegation
    coursesTbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-row-btn')) {
            deleteCourseRow(e.target);
        }
    });

    // Sayfa ilk yüklendiğinde başlangıç için 5 ders satırı ekle
    for (let i = 0; i < 5; i++) {
        addCourseRow();
    }
});
