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

    const table = document.querySelector('table');
    if (table) {
        table.addEventListener('click', (event) => {
            const deleteButton = event.target.closest('.fa-trash');
            if (deleteButton) {
                deleteAnime(event);
            } else {
                const editButton = event.target.closest('.fa-pencil');
                if (editButton) {
                    handleEditAnime(event);
                }
            }
        });
    }

    attachDeleteListeners();
});

async function deleteAnime(event) {
    const deleteButton = event.target;
    const row = deleteButton.closest('tr');
    const animeName = row.cells[0].innerText;

    try {
        const response = await fetch(`/deleteAnime/${encodeURIComponent(animeName)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
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

    // Update table visibility
    updateTableVisibility();
}

function updateTableVisibility() {
    const table = document.querySelector('table');
    if (table && table.querySelector('tbody').children.length > 0) {
        table.style.display = 'block';
    } else {
        table.style.display = 'none';
    }
}

function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.fa-trash');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', deleteAnime);
    });
}

async function handleEditAnime(event) {
    const row = findParentRow(event.target);
    if (!row) {
        console.log('Unable to find parent row');
        return;
    }

    const editButton = event.target.closest('.fa-pencil');
    if (!editButton) {
        console.log('Unable to find edit button');
        return;
    }

    editButton.removeEventListener('click', handleEditAnime); // Remove event listener temporarily

    const animeId = row.id;
    const animeNameCell = row.cells[0];
    const descCell = row.cells[1];

    const currentAnimeName = animeNameCell.textContent;
    const currentDesc = descCell.textContent;

    const newAnimeName = prompt('Enter the new anime name:', currentAnimeName);
    const newDesc = prompt('Enter the new description:', currentDesc);

    if (newAnimeName !== null && newDesc !== null) {
        const data = {
            animeName: newAnimeName,
            desc: newDesc
        };

        try {
            const response = await fetch(`/updateAnime/${encodeURIComponent(animeId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.status === 200) {
                animeNameCell.textContent = newAnimeName;
                descCell.textContent = newDesc;
                console.log('Anime updated successfully');
            } else {
                console.log('Failed to update anime');
            }
        } catch (err) {
            console.log(err);
        }
    }

    editButton.addEventListener('click', handleEditAnime); // Add event listener back
}

function findParentRow(element) {
    while (element) {
        if (element.tagName === 'TR') {
            return element;
        }
        element = element.parentNode;
    }
    return null;
}