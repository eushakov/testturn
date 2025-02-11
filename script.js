// Ожидаем загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
    // Находим кнопку и добавляем обработчик события
    const addButton = document.getElementById('addRowButton');
    addButton.addEventListener('click', function () {
        // Находим тело таблицы
        const tableBody = document.querySelector('#participantsTable tbody');

        // Создаем новую строку
        const newRow = document.createElement('tr');

        // Добавляем ячейки с полями ввода
        newRow.innerHTML = `
            <td><input type="text" placeholder="Никнейм ТГ"></td>
            <td><input type="number" placeholder="Faceit lvl"></td>
            <td><input type="number" placeholder="Premier lvl"></td>
            <td><input type="number" placeholder="Оценка игры"></td>
            <td><input type="checkbox"></td>
        `;

        // Добавляем строку в таблицу
        tableBody.appendChild(newRow);
    });
});
