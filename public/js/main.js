document.addEventListener('DOMContentLoaded', () => {
    const addAnimeForm = document.querySelector('#addanime form');
    const submitButton = addAnimeForm.querySelector('input[type="submit"]');

    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        validateForm();
    });

    function validateForm() {
        const animeNameInput = document.querySelector('input[name="animeName"]');
        const descInput = document.querySelector('textarea[name="desc"]');

        const animeName = animeNameInput.value.trim();
        const desc = descInput.value.trim();

        if (animeName === '' || desc === '') {
            alert('Please enter both the anime name and description');
        } else {
            addAnimeForm.submit();
        }
    }

    const table = document.querySelector('.anime-table');
    if (table) {
        table.addEventListener('click', (event) => {
            const deleteButton = event.target.closest('.fa-trash');
            const editButton = event.target.closest('.fa-pencil');

            if (deleteButton) {
                deleteAnime(deleteButton);
            } else if (editButton) {
                handleEditAnime(editButton);
            }
        });
    }
});

async function deleteAnime(deleteButton) {
    const row = deleteButton.closest('tr');
    const animeId = row.id;

    try {
        const response = await fetch(`/deleteAnime/${encodeURIComponent(animeId)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            row.remove();
            updateTableVisibility();
        } else {
            console.log('Failed to delete anime');
        }
    } catch (err) {
        console.log(err);
    }
}

function handleEditAnime(event, id) {
    event.stopPropagation();
    const editButton = event.target;
    const tableRow = editButton.closest('tr');
    const animeId = tableRow.id;
    const animeNameCell = tableRow.cells[0];
    const descCell = tableRow.cells[1];

    const currentAnimeName = animeNameCell.textContent;
    const currentDesc = descCell.textContent;

    const newAnimeName = prompt('Enter the new anime name:', currentAnimeName);
    const newDesc = prompt('Enter the new description:', currentDesc);

    if (newAnimeName !== null && newDesc !== null) {
        const data = {
            animeName: newAnimeName,
            desc: newDesc,
        };

        fetch(`/updateAnime/${encodeURIComponent(animeId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then((response) => {
                if (response.status === 200) {
                    animeNameCell.textContent = newAnimeName;
                    descCell.textContent = newDesc;
                    console.log('Anime updated successfully');
                } else {
                    console.log('Failed to update anime');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

function findParentRow(element) {
    let parent = element.parentNode;
    while (parent && parent.tagName !== 'TR') {
        parent = parent.parentNode;
    }
    return parent || null;
}

function updateTableVisibility() {
    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');
    if (tbody.children.length === 0) {
        table.style.display = 'none';
    } else {
        table.style.display = 'table';
    }
}