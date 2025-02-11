document.getElementById('addRowButton').addEventListener('click', function() {
    // Получаем таблицу и тело таблицы
    const table = document.getElementById('participantsTable').getElementsByTagName('tbody')[0];

    // Создаем новую строку
    const newRow = table.insertRow();

    // Добавляем ячейки в строку
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);

    // Добавляем поля ввода в ячейки
    cell1.innerHTML = '<input type="text" placeholder="Никнейм ТГ">';
    cell2.innerHTML = '<input type="number" placeholder="Faceit lvl">';
    cell3.innerHTML = '<input type="number" placeholder="Premier lvl">';
    cell4.innerHTML = '<input type="number" placeholder="Оценка игры">';
    cell5.innerHTML = '<input type="checkbox">';
});
