document.addEventListener('DOMContentLoaded', () => {
    // HTML elementlerini seçiyoruz
    const systemSelect = document.getElementById('system-select');
    const coursesTbody = document.getElementById('courses-tbody');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calculateGpaBtn = document.getElementById('calculate-gpa-btn');
    const gpaResultArea = document.getElementById('gpa-result-area');

    // Harf notlarının 4'lük sistemdeki karşılıkları (FD Kaldırıldı)
    const gradePointValues = {
        'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FF': 0.0
    };

    // Her okul/sistem için özel kurallar ve ağırlıklar
    // İleride her okulun kendi kuralını buraya kolayca ekleyebiliriz
    const universitySystems = {
        'auzef_acik':    { weights: { vize: 0.4, final: 0.6 }, rules: { minFinal: 50, minAverage: 35 } },
        'auzef_uzaktan': { weights: { vize: 0.3, final: 0.7 }, rules: { minFinal: 50, minAverage: 35 } },
        'anadolu_aof':   { weights: { vize: 0.3, final: 0.7 }, rules: { minFinal: 50, minAverage: 35 } }, // Varsayılan kurallar
        'ata_aof':       { weights: { vize: 0.3, final: 0.7 }, rules: { minFinal: 50, minAverage: 35 } }  // Varsayılan kurallar
    };

    // Başarı notuna göre harf notunu bulan fonksiyon (FD Kaldırıldı)
    const getLetterGrade = (score) => {
        if (score >= 88) return 'AA';
        if (score >= 81) return 'BA';
        if (score >= 74) return 'BB';
        if (score >= 67) return 'CB';
        if (score >= 60) return 'CC';
        if (score >= 53) return 'DC';
        if (score >= 46) return 'DD';
        return 'FF';
    };
    
    // Geçti/Kaldı/Şartlı Geçti durumunu belirleyen fonksiyon
    const getPassStatus = (finalGrade, successGrade, letterGrade, rules) => {
        if (finalGrade < rules.minFinal || successGrade < rules.minAverage) {
            return { text: 'Kaldı', className: 'status-failed' };
        }
        if (letterGrade === 'DC' || letterGrade === 'DD') {
            return { text: 'Şartlı Geçti', className: 'status-conditional' };
        }
        return { text: 'Geçti', className: 'status-passed' };
    };

    // Yeni bir ders satırı ekleyen fonksiyon
    const addCourseRow = () => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="number" class="credit-input" placeholder="AKTS" min="1"></td>
            <td><input type="number" class="vize-input" placeholder="Vize Notu" min="0" max="100"></td>
            <td><input type="number" class="final-input" placeholder="Final Notu" min="0" max="100"></td>
            <td class="result-cell success-grade">-</td>
            <td class="result-cell letter-grade">-</td>
            <td class="result-cell status">-</td>
            <td><button class="delete-row-btn">X</button></td>
        `;
        coursesTbody.appendChild(row);
    };

    // Hesaplama ve GANO'yu gösterme ana fonksiyonu
    const calculateAndDisplayResults = () => {
        const selectedSystemKey = systemSelect.value;
        const selectedSystem = universitySystems[selectedSystemKey];
        
        const rows = coursesTbody.querySelectorAll('tr');
        let totalCredits = 0;
        let totalWeightedPoints = 0;

        rows.forEach(row => {
            const creditInput = row.querySelector('.credit-input');
            const vizeInput = row.querySelector('.vize-input');
            const finalInput = row.querySelector('.final-input');

            const successGradeCell = row.querySelector('.success-grade');
            const letterGradeCell = row.querySelector('.letter-grade');
            const statusCell = row.querySelector('.status');
            
            statusCell.className = 'result-cell status';

            const credit = parseFloat(creditInput.value);
            const vize = parseFloat(vizeInput.value);
            const final = parseFloat(finalInput.value);

            if (!isNaN(credit) && credit > 0 && !isNaN(vize) && !isNaN(final)) {
                const successGrade = (vize * selectedSystem.weights.vize) + (final * selectedSystem.weights.final);
                const letterGrade = getLetterGrade(successGrade);
                const status = getPassStatus(final, successGrade, letterGrade, selectedSystem.rules);

                successGradeCell.textContent = successGrade.toFixed(2);
                letterGradeCell.textContent = letterGrade;
                statusCell.textContent = status.text;
                statusCell.classList.add(status.className);

                const gradePoint = gradePointValues[letterGrade];
                if (gradePoint !== undefined) {
                    totalCredits += credit;
                    totalWeightedPoints += credit * gradePoint;
                }
            } else {
                successGradeCell.textContent = '-';
                letterGradeCell.textContent = '-';
                statusCell.textContent = '-';
            }
        });

        if (totalCredits === 0) {
            gpaResultArea.innerHTML = 'Lütfen en az bir ders için geçerli bilgiler girin.';
            gpaResultArea.style.display = 'block';
            gpaResultArea.className = 'result-area status-failed';
            return;
        }

        const gpa = totalWeightedPoints / totalCredits;
        gpaResultArea.innerHTML = `<strong>Dönem Ortalamanız (GANO / AGNO):</strong> ${gpa.toFixed(2)}`;
        gpaResultArea.style.display = 'block';
        gpaResultArea.className = 'result-area status-passed';
    };

    // Event Listeners
    addCourseBtn.addEventListener('click', addCourseRow);
    calculateGpaBtn.addEventListener('click', calculateAndDisplayResults);

    coursesTbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-row-btn')) {
            e.target.closest('tr').remove();
        }
    });

    // Sayfa ilk yüklendiğinde başlangıç için 7 ders satırı ekle
    for (let i = 0; i < 7; i++) {
        addCourseRow();
    }
});
