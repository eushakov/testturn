// Пример логики для взаимодействия таблиц
document.addEventListener('DOMContentLoaded', function () {
    const banButtons = document.querySelectorAll('.ban');
    const deciderButtons = document.querySelectorAll('.decider');

    banButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.backgroundColor = '#ff0000';
        });
    });

    deciderButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.backgroundColor = '#00ff00';
        });
    });

    // Логика для обновления турнирной сетки на основе результатов
    const resultsTable = document.getElementById('results');
    resultsTable.addEventListener('input', () => {
        // Обновите турнирную сетку на основе введенных результатов
    });
});
