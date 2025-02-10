document.addEventListener('DOMContentLoaded', function () {
    const participantsTable = document.querySelector('#participants tbody');
    const teamsTable = document.querySelector('#teams tbody');
    const bracket = document.getElementById('bracket');
    const resultsTable = document.querySelector('#results tbody');
    const mapPicksContainer = document.getElementById('map-picks-container');

    let matches = []; // Хранение матчей для сетки
    let mapPicks = []; // Хранение пиков карт

    // Добавление участника
    function addParticipant() {
        const row = participantsTable.insertRow();
        row.innerHTML = `
            <td><input type="text" placeholder="Ник"></td>
            <td><input type="number" placeholder="Уровень"></td>
            <td><input type="number" placeholder="ELO"></td>
            <td><input type="number" placeholder="Оценка"></td>
            <td><input type="text" placeholder="Взнос"> <input type="checkbox"></td>
            <td><button class="delete-button" onclick="deleteRow(this)">Удалить</button></td>
        `;
    }

    // Добавление команды
    function addTeam() {
        const row = teamsTable.insertRow();
        row.innerHTML = `
            <td><input type="text" placeholder="Капитан"></td>
            <td><input type="text" placeholder="Игрок 1"></td>
            <td><input type="text" placeholder="Замена 1"></td>
            <td><button class="delete-button" onclick="deleteRow(this)">Удалить</button></td>
        `;
    }

    // Удаление строки
    function deleteRow(button) {
        const row = button.closest('tr');
        row.remove();
    }

    // Построение турнирной сетки
    function buildBracket() {
        bracket.innerHTML = ''; // Очистка сетки
        matches = []; // Очистка матчей

        // Пример для 4 команд
        const teams = ['Команда 1', 'Команда 2', 'Команда 3', 'Команда 4'];
        for (let i = 0; i < teams.length; i += 2) {
            const match = {
                team1: teams[i],
                team2: teams[i + 1],
                winner: null,
                loser: null
            };
            matches.push(match);
        }

        // Отображение матчей
        matches.forEach((match, index) => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';
            matchDiv.innerHTML = `
                <div class="team-cell"><input type="text" value="${match.team1}" readonly></div>
                <div class="team-cell"><input type="text" value="${match.team2}" readonly></div>
            `;
            bracket.appendChild(matchDiv);

            // Добавление матча в результаты
            const resultRow = resultsTable.insertRow();
            resultRow.innerHTML = `
                <td>${match.team1} vs ${match.team2}</td>
                <td><input type="text" placeholder="Результат"></td>
                <td><button class="delete-button" onclick="deleteRow(this)">Удалить</button></td>
            `;
        });
    }

    // Пики карт
    function addMapPicks() {
        const mapPicksDiv = document.createElement('div');
        mapPicksDiv.className = 'map-picks';
        mapPicksDiv.innerHTML = `
            <h3>Пики карт для игры</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ban</th>
                        <th>Ban</th>
                        <th>Ban</th>
                        <th>Decider</th>
                        <th>Decider</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><button class="map-button" data-map="mirage">Mirage</button></td>
                        <td><button class="map-button" data-map="dust2">Dust 2</button></td>
                        <td><button class="map-button" data-map="inferno">Inferno</button></td>
                        <td><button class="map-button" data-map="nuke">Nuke</button></td>
                        <td><button class="map-button" data-map="anubis">Anubis</button></td>
                    </tr>
                    <tr>
                        <td><button class="map-button" data-map="ancient">Ancient</button></td>
                        <td><button class="map-button" data-map="train">Train</button></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        `;
        mapPicksContainer.appendChild(mapPicksDiv);

        // Логика для пиков карт
        const mapButtons = mapPicksDiv.querySelectorAll('.map-button');
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
    }

    // Инициализация
    buildBracket();
    addMapPicks();
});
