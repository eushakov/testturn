document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#participantsTable tbody');
    const addButton = document.getElementById('addRowButton');

    // Загружаем данные из localStorage при загрузке страницы
    loadTableData();

    // Добавляем новую строку
    addButton.addEventListener('click', function () {
        addRow('', '', '', '', false);
        saveTableData(); // Сохраняем данные после добавления строки
    });

    // Функция для добавления строки
    function addRow(nickname, faceitLevel, premierLevel, rating, isPaid) {
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td><input type="text" value="${nickname}" placeholder="Введите никнейм ТГ"></td>
            <td><input type="number" value="${faceitLevel}" placeholder="Введите faceit lvl"></td>
            <td><input type="number" value="${premierLevel}" placeholder="Введите premier lvl"></td>
            <td><input type="number" value="${rating}" placeholder="Укажите уровень вашей игры от 1-10"></td>
            <td><input type="checkbox" ${isPaid ? 'checked' : ''}></td>
            <td><button class="delete-button">Удалить</button></td>
        `;

        // Добавляем обработчик удаления строки
        const deleteButton = newRow.querySelector('.delete-button');
        deleteButton.addEventListener('click', function () {
            tableBody.removeChild(newRow);
            saveTableData(); // Сохраняем данные после удаления строки
        });

        tableBody.appendChild(newRow);
    }

    // Функция для сохранения данных в localStorage
    function saveTableData() {
        const rows = tableBody.querySelectorAll('tr');
        const data = [];

        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            data.push({
                nickname: inputs[0].value,
                faceitLevel: inputs[1].value,
                premierLevel: inputs[2].value,
                rating: inputs[3].value,
                isPaid: inputs[4].checked
            });
        });

        localStorage.setItem('tableData', JSON.stringify(data));
    }

    // Функция для загрузки данных из localStorage
    function loadTableData() {
        const data = JSON.parse(localStorage.getItem('tableData')) || [];

        data.forEach(item => {
            addRow(item.nickname, item.faceitLevel, item.premierLevel, item.rating, item.isPaid);
        });
    }

    // Сохраняем данные при изменении полей ввода
    tableBody.addEventListener('input', function (event) {
        if (event.target.tagName === 'INPUT') {
            saveTableData();
        }
    });

    // Сохраняем данные при изменении чекбокса
    tableBody.addEventListener('change', function (event) {
        if (event.target.type === 'checkbox') {
            saveTableData();
        }
    });
});
