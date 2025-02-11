document.addEventListener('DOMContentLoaded', function () {
    const participantsTableBody = document.querySelector('#participantsTable tbody');
    const teamsTableBody = document.querySelector('#teamsTable tbody');
    const addParticipantButton = document.getElementById('addParticipantButton');
    const addTeamButton = document.getElementById('addTeamButton');
    const generateBracketButton = document.getElementById('generateBracketButton');
    const bracket = document.getElementById('bracket');

    let bracketData = JSON.parse(localStorage.getItem('bracketData')) || null;

    // Загрузка данных из localStorage
    loadTableData();
    if (bracketData) {
        renderBracket(bracketData);
    }

    // Добавление строки в таблицу участников
    addParticipantButton.addEventListener('click', function () {
        addParticipantRow('', '', '', '', false);
        saveTableData();
    });

    // Добавление строки в таблицу составов команд
    addTeamButton.addEventListener('click', function () {
        addTeamRow('', '', '', '', '', '', '', '');
        saveTableData();
    });

    // Генерация турнирной сетки
    generateBracketButton.addEventListener('click', function () {
        const teams = [];
        teamsTableBody.querySelectorAll('tr').forEach(row => {
            const teamName = row.querySelector('input[type="text"]').value;
            if (teamName.trim() !== '') {
                teams.push(teamName);
            }
        });

        if (teams.length < 2) {
            alert('Для генерации сетки нужно минимум 2 команды!');
            return;
        }

        // Случайное перемешивание команд
        teams.sort(() => Math.random() - 0.5);

        // Создание начальной сетки
        bracketData = generateInitialBracket(teams);
        renderBracket(bracketData);
        saveTableData();
    });

    // Функция для добавления строки в таблицу участников
    function addParticipantRow(nickname, faceitLevel, premierLevel, rating, isPaid) {
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td><input type="text" value="${nickname}" placeholder="Никнейм ТГ"></td>
            <td><input type="number" value="${faceitLevel}" placeholder="Faceit lvl"></td>
            <td><input type="number" value="${premierLevel}" placeholder="Premier lvl"></td>
            <td><input type="number" value="${rating}" placeholder="Оценка игры"></td>
            <td><input type="checkbox" ${isPaid ? 'checked' : ''}></td>
            <td><button class="delete-button">Удалить</button></td>
        `;

        const deleteButton = newRow.querySelector('.delete-button');
        deleteButton.addEventListener('click', function () {
            participantsTableBody.removeChild(newRow);
            saveTableData();
        });

        participantsTableBody.appendChild(newRow);
    }

    // Функция для добавления строки в таблицу составов команд
    function addTeamRow(team, player1, player2, player3, player4, player5, sub1, sub2) {
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td><input type="text" value="${team}" placeholder="Команда"></td>
            <td><input type="text" value="${player1}" placeholder="Игрок 1"></td>
            <td><input type="text" value="${player2}" placeholder="Игрок 2"></td>
            <td><input type="text" value="${player3}" placeholder="Игрок 3"></td>
            <td><input type="text" value="${player4}" placeholder="Игрок 4"></td>
            <td><input type="text" value="${player5}" placeholder="Игрок 5"></td>
            <td><input type="text" value="${sub1}" placeholder="Запасной"></td>
            <td><input type="text" value="${sub2}" placeholder="Запасной"></td>
            <td><button class="delete-button">Удалить</button></td>
        `;

        // Обработчик для изменения цвета ячеек
        const inputs = newRow.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', function () {
                if (index === 1 && input.value.trim() !== '') {
                    input.parentElement.classList.add('filled-green');
                } else if (index === 1) {
                    input.parentElement.classList.remove('filled-green');
                }

                if ((index === 6 || index === 7) && input.value.trim() !== '') {
                    input.parentElement.classList.add('filled-yellow');
                } else if (index === 6 || index === 7) {
                    input.parentElement.classList.remove('filled-yellow');
                }

                saveTableData();
            });
        });

        const deleteButton = newRow.querySelector('.delete-button');
        deleteButton.addEventListener('click', function () {
            teamsTableBody.removeChild(newRow);
            saveTableData();
        });

        teamsTableBody.appendChild(newRow);
    }

    // Функция для генерации начальной сетки
    function generateInitialBracket(teams) {
        const matches = [];
        for (let i = 0; i < teams.length; i += 2) {
            const team1 = teams[i];
            const team2 = teams[i + 1] || null;
            matches.push({
                team1,
                team2,
                winner: null,
            });
        }
        return matches;
    }

    // Функция для отрисовки сетки
    function renderBracket(data) {
        bracket.innerHTML = '';
        const round = document.createElement('div');
        round.className = 'tournament__round tournament__round--first-round';

        data.forEach((match, index) => {
            const matchElement = document.createElement('div');
            matchElement.className = 'tournament__match';

            const team1Element = document.createElement('a');
            team1Element.className = 'tournament__match__team';
            team1Element.textContent = match.team1 || '';
            team1Element.href = '#';

            const team2Element = document.createElement('a');
            team2Element.className = 'tournament__match__team';
            team2Element.textContent = match.team2 || '';
            team2Element.href = '#';

            // Обработчик выбора победителя
            team1Element.addEventListener('click', function () {
                if (!match.team1) return;

                if (match.winner === match.team1) {
                    match.winner = null;
                } else {
                    match.winner = match.team1;
                }

                renderBracket(data);
                saveTableData();
            });

            team2Element.addEventListener('click', function () {
                if (!match.team2) return;

                if (match.winner === match.team2) {
                    match.winner = null;
                } else {
                    match.winner = match.team2;
                }

                renderBracket(data);
                saveTableData();
            });

            if (match.winner === match.team1) {
                team1Element.classList.add('winner');
                team2Element.classList.add('loser');
            } else if (match.winner === match.team2) {
                team2Element.classList.add('winner');
                team1Element.classList.add('loser');
            }

            matchElement.appendChild(team1Element);
            matchElement.appendChild(team2Element);
            round.appendChild(matchElement);
        });

        bracket.appendChild(round);
    }

    // Сохранение данных в localStorage
    function saveTableData() {
        const participantsData = [];
        const teamsData = [];

        participantsTableBody.querySelectorAll('tr').forEach(row => {
            const inputs = row.querySelectorAll('input');
            participantsData.push({
                nickname: inputs[0].value,
                faceitLevel: inputs[1].value,
                premierLevel: inputs[2].value,
                rating: inputs[3].value,
                isPaid: inputs[4].checked
            });
        });

        teamsTableBody.querySelectorAll('tr').forEach(row => {
            const inputs = row.querySelectorAll('input');
            teamsData.push({
                team: inputs[0].value,
                player1: inputs[1].value,
                player2: inputs[2].value,
                player3: inputs[3].value,
                player4: inputs[4].value,
                player5: inputs[5].value,
                sub1: inputs[6].value,
                sub2: inputs[7].value
            });
        });

        localStorage.setItem('participantsData', JSON.stringify(participantsData));
        localStorage.setItem('teamsData', JSON.stringify(teamsData));
        localStorage.setItem('bracketData', JSON.stringify(bracketData));
    }

    // Загрузка данных из localStorage
    function loadTableData() {
        const participantsData = JSON.parse(localStorage.getItem('participantsData')) || [];
        const teamsData = JSON.parse(localStorage.getItem('teamsData')) || [];

        participantsData.forEach(item => {
            addParticipantRow(item.nickname, item.faceitLevel, item.premierLevel, item.rating, item.isPaid);
        });

        teamsData.forEach(item => {
            addTeamRow(item.team, item.player1, item.player2, item.player3, item.player4, item.player5, item.sub1, item.sub2);
        });
    }
});
