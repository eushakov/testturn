document.addEventListener('DOMContentLoaded', function () {
    // Получаем ссылки на элементы
    const participantsTableBody = document.querySelector('#participantsTable tbody');
    const teamsTableBody = document.querySelector('#teamsTable tbody');
    const addParticipantButton = document.getElementById('addParticipantButton');
    const addTeamButton = document.getElementById('addTeamButton');
    const generateBracketButton = document.getElementById('generateBracketButton');
    const bracket = document.getElementById('bracket');
    const winnerBlock = document.getElementById('winnerBlock');

    if (!addParticipantButton || !addTeamButton) {
        console.error('Кнопки "+" не найдены. Проверьте id в HTML.');
        return;
    }

    let bracketData = JSON.parse(localStorage.getItem('bracketData')) || null;

    // Загрузка данных из localStorage
    loadTableData();
    if (bracketData) {
        renderBracket(bracketData);
    }

    // Добавление строки в таблицу участников
    addParticipantButton.addEventListener('click', function () {
        console.log('Клик по кнопке "Добавить участника"');
        addParticipantRow('', '', '', '', false);
        saveTableData();
    });

    // Добавление строки в таблицу составов команд
    addTeamButton.addEventListener('click', function () {
        console.log('Клик по кнопке "Добавить команду"');
        addTeamRow('', '', '', '', '', '', '', '');
        saveTableData();
    });

    // Генерация турнирной сетки
    generateBracketButton.addEventListener('click', function () {
        if (bracketData && bracketData.some(round => round.some(match => match.winner))) {
            alert('Нельзя перемешать пары, пока есть выбранные победители!');
            return;
        }
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
        bracketData = generateOlympicBracket(teams);
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
        const inputs = newRow.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', function () {
                if (index === 0 && input.value.trim() !== '') {
                    input.parentElement.classList.add('filled-green');
                } else if (index === 0) {
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

    // Генерация олимпийской сетки
    function generateOlympicBracket(teams) {
        const totalRounds = Math.ceil(Math.log2(teams.length));
        const initialMatches = [];

        for (let i = 0; i < teams.length; i++) {
            initialMatches.push({ team: teams[i], opponent: null, winner: null });
        }

        const bracket = [initialMatches];

        for (let round = 1; round < totalRounds; round++) {
            const prevRound = bracket[round - 1];
            const nextRound = [];

            for (let i = 0; i < prevRound.length; i += 2) {
                const match = { team: null, opponent: null, winner: null };
                if (prevRound[i]) match.team = prevRound[i].team;
                if (prevRound[i + 1]) match.opponent = prevRound[i + 1].team;
                nextRound.push(match);
            }

            bracket.push(nextRound);
        }

        return bracket;
    }

    // Отрисовка сетки
    function renderBracket(data) {
        bracket.innerHTML = '';
        data.forEach((round, roundIndex) => {
            const roundContainer = document.createElement('div');
            roundContainer.className = `tournament__round tournament__round--round-${roundIndex + 1}`;
            if (data.length - 1 === roundIndex) {
                roundContainer.className += ' tournament__round--final';
            }
            if (data.length === roundIndex + 1) {
                roundContainer.className += ' tournament__round--winner';
            }

            round.forEach((match, matchIndex) => {
                const matchContainer = document.createElement('div');
                matchContainer.className = 'tournament__match';

                const team1 = document.createElement('a');
                team1.className = 'tournament__match__team';
                team1.textContent = match.team || 'Пусто';
                team1.dataset.team = match.team;
                team1.addEventListener('click', () => handleMatchClick(roundIndex, matchIndex, 'team'));

                const team2 = document.createElement('a');
                team2.className = 'tournament__match__team';
                team2.textContent = match.opponent || 'Пусто';
                team2.dataset.team = match.opponent;
                team2.addEventListener('click', () => handleMatchClick(roundIndex, matchIndex, 'opponent'));

                matchContainer.appendChild(team1);
                matchContainer.appendChild(team2);

                roundContainer.appendChild(matchContainer);
            });

            bracket.appendChild(roundContainer);
        });
    }

    // Обработка выбора победителя
    function handleMatchClick(roundIndex, matchIndex, teamType) {
        const currentRound = bracketData[roundIndex];
        const match = currentRound[matchIndex];

        if (!match) return;

        const selectedTeam = teamType === 'team' ? match.team : match.opponent;

        if (!selectedTeam) return;

        // Установка победителя
        match.winner = selectedTeam;
        match.loser = teamType === 'team' ? match.opponent : match.team;

        // Обновление следующего раунда
        updateNextRound(roundIndex, matchIndex, selectedTeam);

        renderBracket(bracketData);
        saveTableData();
    }

    // Обновление следующего раунда
    function updateNextRound(roundIndex, matchIndex, winner) {
        const nextRound = bracketData[roundIndex + 1];
        if (!nextRound) return;

        const nextMatchIndex = Math.floor(matchIndex / 2);
        const nextMatch = nextRound[nextMatchIndex];

        if (!nextMatch) return;

        if (matchIndex % 2 === 0) {
            nextMatch.team = winner;
        } else {
            nextMatch.opponent = winner;
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
