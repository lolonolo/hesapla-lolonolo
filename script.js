document.addEventListener('DOMContentLoaded', () => {
    // --- SEKME DEĞİŞTİRME MANTIĞI ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.calculator-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.dataset.tab;
            const targetContent = document.getElementById(targetId);

            contents.forEach(content => {
                content.style.display = 'none';
            });

            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });

    // --- GANO HESAPLAYICI KODLARI ---
    const ganoSystemSelect = document.getElementById('system-select');
    const coursesTbody = document.getElementById('courses-tbody');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calculateGpaBtn = document.getElementById('calculate-gpa-btn');
    const gpaResultArea = document.getElementById('gpa-result-area');

    const gradePointValues = { 'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FF': 0.0 };
    const universitySystems = {
        'auzef_acik':    { weights: { vize: 0.4, final: 0.6 }, rules: { minFinal: 50, minAverage: 35 } },
        'auzef_uzaktan': { weights: { vize: 0.3, final: 0.7 }, rules: { minFinal: 50, minAverage: 35 } },
        'anadolu_aof':   { weights: { vize: 0.3, final: 0.7 }, rules: { minFinal: 50, minAverage: 35 } },
        'ata_aof':       { weights: { vize: 0.3, final: 0.7 }, rules: { minFinal: 50, minAverage: 35 } }
    };

    const getLetterGrade = (score) => {
        if (score >= 88) return 'AA'; if (score >= 81) return 'BA';
        if (score >= 74) return 'BB'; if (score >= 67) return 'CB';
        if (score >= 60) return 'CC'; if (score >= 53) return 'DC';
        if (score >= 46) return 'DD'; return 'FF';
    };

    const getPassStatus = (finalGrade, successGrade, letterGrade, rules) => {
        if (finalGrade < rules.minFinal || successGrade < rules.minAverage) {
            return { text: 'Kaldı', className: 'status-failed' };
        }
        if (letterGrade === 'DC' || letterGrade === 'DD') {
            return { text: 'Şartlı Geçti', className: 'status-conditional' };
        }
        return { text: 'Geçti', className: 'status-passed' };
    };

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

    const calculateAndDisplayGpaResults = () => {
        const selectedSystemKey = ganoSystemSelect.value;
        const selectedSystem = universitySystems[selectedSystemKey];
        const rows = coursesTbody.querySelectorAll('tr');
        let totalCredits = 0, totalWeightedPoints = 0;

        rows.forEach(row => {
            const credit = parseFloat(row.querySelector('.credit-input').value);
            const vize = parseFloat(row.querySelector('.vize-input').value);
            const final = parseFloat(row.querySelector('.final-input').value);
            const successGradeCell = row.querySelector('.success-grade');
            const letterGradeCell = row.querySelector('.letter-grade');
            const statusCell = row.querySelector('.status');
            
            statusCell.className = 'result-cell status';

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
                successGradeCell.textContent = '-'; letterGradeCell.textContent = '-'; statusCell.textContent = '-';
            }
        });

        if (totalCredits === 0) {
            gpaResultArea.innerHTML = 'Lütfen en az bir ders için geçerli bilgiler girin.';
            gpaResultArea.style.display = 'block';
            gpaResultArea.className = 'result-area status-failed';
        } else {
            const gpa = totalWeightedPoints / totalCredits;
            gpaResultArea.innerHTML = `<strong>Dönem Ortalamanız (GANO / AGNO):</strong> ${gpa.toFixed(2)}`;
            gpaResultArea.style.display = 'block';
            gpaResultArea.className = 'result-area status-passed';
        }
    };

    addCourseBtn.addEventListener('click', addCourseRow);
    calculateGpaBtn.addEventListener('click', calculateAndDisplayGpaResults);
    coursesTbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-row-btn')) {
            e.target.closest('tr').remove();
        }
    });

    // --- DERS GEÇME HESAPLAYICI KODLARI ---
    const passVizeInput = document.getElementById('pass-vize-input');
    const targetGradeSelect = document.getElementById('target-grade-select');
    const calculatePassBtn = document.getElementById('calculate-pass-btn');
    const passResultArea = document.getElementById('pass-result-area');

    const calculateRequiredFinal = () => {
        const selectedSystemKey = ganoSystemSelect.value;
        const system = universitySystems[selectedSystemKey];
        const vize = parseFloat(passVizeInput.value);
        const targetScore = parseFloat(targetGradeSelect.value);

        if (isNaN(vize) || vize < 0 || vize > 100) {
            passResultArea.innerHTML = 'Lütfen 0-100 arasında geçerli bir Vize notu girin.';
            passResultArea.className = 'result-area status-failed';
            passResultArea.style.display = 'block';
            return;
        }

        let requiredFinal = (targetScore - (vize * system.weights.vize)) / system.weights.final;
        const finalMinScore = system.rules.minFinal;

        let finalResult = Math.max(requiredFinal, finalMinScore);
        
        if (finalResult > 100) {
            passResultArea.innerHTML = `Bu vize notuyla hedefinize ulaşmak için Final'den <strong>100'den yüksek</strong> almanız gerekiyor. Maalesef mümkün değil.`;
            passResultArea.className = 'result-area status-failed';
        } else {
            passResultArea.innerHTML = `Hedefinize ulaşmak için Final'den almanız gereken minimum not: <strong>${Math.ceil(finalResult)}</strong>`;
            passResultArea.className = 'result-area status-passed';
        }
        passResultArea.style.display = 'block';
    };

    calculatePassBtn.addEventListener('click', calculateRequiredFinal);
    
    // Sayfa ilk yüklendiğinde GANO için 7 satır ekle
    for (let i = 0; i < 7; i++) {
        addCourseRow();
    }
});
