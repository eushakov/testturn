document.addEventListener('DOMContentLoaded', function () {
    // Добавление участника
    function addParticipant() {
        const table = document.querySelector('#participants tbody');
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="checkbox"></td>
            <td><button onclick="removeRow(this)">-</button></td>
        `;
    }

    // Добавление команды
    function addTeam() {
        const table = document.querySelector('#teams tbody');
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><button onclick="removeRow(this)">-</button></td>
        `;
    }

    // Удаление строки
    function removeRow(button) {
        button.closest('tr').remove();
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

    // Обновление результатов матчей
    const bracketMatches = document.querySelectorAll('.match');
    const resultsTable = document.querySelector('#results tbody');

    bracketMatches.forEach(match => {
        match.addEventListener('click', () => {
            const team1 = match.querySelector('input:nth-child(1)').value || match.querySelector('span:nth-child(1)').textContent;
            const team2 = match.querySelector('input:nth-child(3)').value || match.querySelector('span:nth-child(3)').textContent;

            if (team1 && team2) {
                const row = resultsTable.insertRow();
                row.innerHTML = `
                    <td>${team1}</td>
                    <td><input type="text" placeholder="Счет"></td>
                    <td>${team2}</td>
                    <td><button onclick="removeRow(this)">-</button></td>
                `;
            }
        });
    });
});
