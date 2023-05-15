const table = document.querySelector('table');
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


    table.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.fa-trash');
        if (deleteButton) {
            deleteAnime(event);
        } else {
            const editButton = event.target.closest('.fa-pencil');
            if (editButton) {
                editAnime(event);
            }
        }
    });

    // Attach delete listeners to delete buttons
    attachDeleteListeners();

    // Update table visibility
    updateTableVisibility();

});

function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.fa-trash');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', deleteAnime);
    });
}

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
}

function updateTableVisibility() {
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length === 0) {
        table.style.display = 'none';
    } else {
        table.style.display = 'table';
    }
}


// Reattach event listeners after page refresh
if (performance.navigation.type === 1) {
    attachDeleteListeners();
}

function findParentRow(element) {
    let currentElement = element;
    while (currentElement && currentElement.nodeName !== 'TR') {
        currentElement = currentElement.parentNode;
    }
    return currentElement;
}

function editAnime(animeId) {
    const row = document.getElementById(animeId);
    if (!row) {
        console.log('Unable to find parent row');
        return;
    }

    const animeNameCell = row.querySelector('td:nth-child(1)');
    const descCell = row.querySelector('td:nth-child(2)');

    if (!animeNameCell || !descCell) {
        console.log('Unable to retrieve the necessary data');
        return;
    }

    const animeName = animeNameCell.textContent.trim();
    const desc = descCell.textContent.trim();

    const newAnimeName = prompt('Enter the edited anime name:', animeName);
    const newDesc = prompt('Enter the edited description:', desc);

    if (newAnimeName !== null && newDesc !== null) {
        updateAnime(animeId, newAnimeName, newDesc);
    }
}

function findParentRow(element) {
    let parent = element.parentElement;
    while (parent) {
        if (parent.tagName === 'TR') {
            return parent;
        }
        parent = parent.parentElement;
    }
    return null;
}

function updateAnime(animeId, newAnimeName, newDesc) {
    const row = document.getElementById(animeId);
    const animeNameCell = row.cells[0];
    const descCell = row.cells[1];

    // Update the data in the code immediately
    animeNameCell.innerText = newAnimeName;
    descCell.innerText = newDesc;

    // Perform an AJAX request to update the anime data on the server
    fetch(`/updateAnime/${encodeURIComponent(animeId)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ animeName: newAnimeName, desc: newDesc })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.success === true) {
                console.log('Anime updated successfully');
            } else {
                console.log('Failed to update anime');
            }
        })
        .catch(err => console.log(err));
}