document.addEventListener('DOMContentLoaded', function () {
    const participantsTableBody = document.querySelector('#participantsTable tbody');
    const teamsTableBody = document.querySelector('#teamsTable tbody');
    const addParticipantButton = document.getElementById('addParticipantButton');
    const addTeamButton = document.getElementById('addTeamButton');
    const bracket = document.getElementById('bracket');

    // Загрузка данных из localStorage
    loadTableData();
    updateBracket();

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
            updateBracket(); // Обновляем сетку при удалении команды
        });

        teamsTableBody.appendChild(newRow);
        updateBracket(); // Обновляем сетку при добавлении команды
    }

    // Функция для обновления турнирной сетки
    function updateBracket() {
        const teams = [];
        teamsTableBody.querySelectorAll('tr').forEach(row => {
            const teamName = row.querySelector('input[type="text"]').value;
            if (teamName.trim() !== '') {
                teams.push(teamName);
            }
        });

        bracket.innerHTML = ''; // Очищаем сетку
        if (teams.length === 0) return;

        // Случайное перемешивание команд
        teams.sort(() => Math.random() - 0.5);

        // Создание сетки
        let roundCount = Math.ceil(Math.log2(teams.length));
        let matches = teams.map(team => ({ team, winner: false }));

        for (let i = 0; i < roundCount; i++) {
            const round = document.createElement('div');
            round.className = 'round';

            for (let j = 0; j < matches.length; j += 2) {
                const match = document.createElement('div');
                match.className = 'match';

                const team1 = matches[j] ? matches[j].team : '';
                const team2 = matches[j + 1] ? matches[j + 1].team : '';

                match.innerHTML = `
                    <div>${team1}</div>
                    <div>${team2}</div>
                    <button class="select-winner" data-index="${j}">Выбрать победителя</button>
                `;

                if (!team1 || !team2) {
                    match.classList.add('empty');
                }

                // Обработчик выбора победителя
                const winnerButton = match.querySelector('.select-winner');
                winnerButton.addEventListener('click', function () {
                    const winnerIndex = parseInt(this.getAttribute('data-index'));
                    matches[winnerIndex].winner = true;
                    updateBracket(); // Обновляем сетку
                    saveTableData();
                });

                round.appendChild(match);
            }

            bracket.appendChild(round);
            matches = matches.filter((match, index) => index % 2 === 0 && match.winner);
        }
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
