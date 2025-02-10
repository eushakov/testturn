document.addEventListener('DOMContentLoaded', function () {
    // Добавление участника
    function addParticipant() {
        const table = document.querySelector('#participants tbody');
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text" placeholder="Ник"></td>
            <td><input type="number" placeholder="Уровень"></td>
            <td><input type="number" placeholder="ELO"></td>
            <td><input type="number" placeholder="Оценка"></td>
            <td><input type="text" placeholder="Взнос"> <input type="checkbox"></td>
        `;
    }

    // Добавление команды
    function addTeam() {
        const table = document.querySelector('#teams tbody');
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text" placeholder="Капитан"></td>
            <td><input type="text" placeholder="Игрок 1"></td>
            <td><input type="text" placeholder="Замена 1"></td>
        `;
    }

    // Логика для пиков карт
    const mapButtons = document.querySelectorAll('.map-button');
    let banCount = 0;
    let deciderCount = 0;

    mapButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (banCount < 3 && !button.classList.contains('decider')) {
                button.classList.add('banned');
                banCount++;
            } else if (deciderCount < 2 && !button.classList.contains('banned')) {
                button.classList.add('decider');
                deciderCount++;
            }
        });
    });

    // Логика для выбора матча в результатах
    const resultsTable = document.querySelector('#results tbody');
    const bracketMatches = document.querySelectorAll('.match');

    bracketMatches.forEach(match => {
        match.addEventListener('click', () => {
            const team1 = match.querySelector('.team-cell:nth-child(1) input').value;
            const team2 = match.querySelector('.team-cell:nth-child(2) input').value;
            const row = resultsTable.insertRow();
            row.innerHTML = `
                <td>${team1} vs ${team2}</td>
                <td><input type="text" placeholder="Результат"></td>
            `;
        });
    });
});
