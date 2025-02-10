document.addEventListener('DOMContentLoaded', function () {
    const participantsTable = document.querySelector('#participants tbody');
    const teamsTable = document.querySelector('#teams tbody');
    const bracket = document.getElementById('bracket');
    const resultsTable = document.querySelector('#results tbody');
    const mapPicksContainer = document.getElementById('map-picks-container');

    let matches = []; // Хранение матчей для сетки
    let mapPicks = []; // Хранение пиков карт

    // Добавление участника
    window.addParticipant = function () {
        const row = participantsTable.insertRow();
        row.innerHTML = `
            <td><input type="text" placeholder="Ник"></td>
            <td><input type="number" placeholder="Уровень"></td>
            <td><input type="number" placeholder="ELO"></td>
            <td><input type="number" placeholder="Оценка"></td>
            <td><input type="text" placeholder="Взнос"> <input type="checkbox"></td>
            <td><button class="delete-button" onclick="deleteRow(this)">Удалить</button></td>
        `;
    };

    // Добавление команды
    window.addTeam = function () {
        const row = teamsTable.insertRow();
        row.innerHTML = `
            <td><input type="text" placeholder="Капитан"></td>
            <td><input type="text" placeholder="Игрок 1"></td>
            <td><input type="text" placeholder="Замена 1"></td>
            <td><button class="delete-button" onclick="deleteRow(this)">Удалить</button></td>
        `;
    };

    // Удаление строки
    window.deleteRow = function (button) {
        const row = button.closest('tr');
        row.remove();
    };

    // Построение турнирной сетки
    function buildBracket() {
        bracket.innerHTML = ''; // О
