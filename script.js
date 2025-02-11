document.addEventListener('DOMContentLoaded', function () {
    const participantsTableBody = document.querySelector('#participantsTable tbody');
    const teamsTableBody = document.querySelector('#teamsTable tbody');
    const addParticipantButton = document.getElementById('addParticipantButton');
    const addTeamButton = document.getElementById('addTeamButton');

    // Загрузка данных из localStorage
    loadTableData();

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
        });

        teamsTableBody.appendChild(newRow);
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
