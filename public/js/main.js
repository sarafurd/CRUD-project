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
        const errorMessage = document.querySelector('.error-message');

        const animeName = animeNameInput.value.trim();
        const desc = descInput.value.trim();

        if (animeName === '' || desc === '') {
            errorMessage.textContent = 'Please enter both the anime name and description';

            setTimeout(() => {
                errorMessage.textContent = '';
            }, 3000);
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

// function handleEditAnime(event, id) {
//     event.stopPropagation();
//     const editButton = event.target;
//     const tableRow = editButton.closest('tr');
//     const animeId = tableRow.id;
//     const animeNameCell = tableRow.cells[0];
//     const descCell = tableRow.cells[1];

//     const currentAnimeName = animeNameCell.textContent;
//     const currentDesc = descCell.textContent;

//     const newAnimeName = prompt('Enter the new anime name:', currentAnimeName);
//     const newDesc = prompt('Enter the new description:', currentDesc);

//     if (newAnimeName !== null && newDesc !== null) {
//         const data = {
//             animeName: newAnimeName,
//             desc: newDesc,
//         };

//         fetch(`/updateAnime/${encodeURIComponent(animeId)}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(data),
//             })
//             .then((response) => {
//                 if (response.status === 200) {
//                     animeNameCell.textContent = newAnimeName;
//                     descCell.textContent = newDesc;
//                     console.log('Anime updated successfully');
//                 } else {
//                     console.log('Failed to update anime');
//                 }
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }

//     // Set cursor position to the end of the input value
//     setTimeout(() => {
//         const animeNameInput = document.querySelector('.prompt input');
//         const descInput = document.querySelectorAll('.prompt input')[1];

//         if (animeNameInput) {
//             animeNameInput.setAttribute('dir', 'auto');
//             animeNameInput.focus();
//             animeNameInput.setSelectionRange(animeNameInput.value.length, animeNameInput.value.length);
//         }

//         if (descInput) {
//             descInput.setAttribute('dir', 'auto');
//             descInput.focus();
//             descInput.setSelectionRange(descInput.value.length, descInput.value.length);
//         }
//     }, 0);
// }

function handleEditAnime(event, animeId) {
    const row = event.target.closest('tr');
    const animeNameCell = row.querySelector('td:nth-child(1)');
    const animeDescCell = row.querySelector('td:nth-child(2)');

    // Store the current content for undoing changes
    const previousAnimeName = animeNameCell.textContent.trim();
    const previousAnimeDesc = animeDescCell.textContent.trim();

    // Check if the row is already in editable state
    if (row.classList.contains('editable')) {
        // Exit early if the row is already in editable state
        return;
    }

    // Set the table cells to be editable
    animeNameCell.contentEditable = true;
    animeDescCell.contentEditable = true;

    // Add a class to indicate the editable state
    row.classList.add('editable');

    // Save the changes on pressing Enter key
    row.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            // Remove the editable state and class
            animeNameCell.contentEditable = false;
            animeDescCell.contentEditable = false;
            row.classList.remove('editable');

            // Get the edited values
            const editedAnimeName = animeNameCell.textContent.trim();
            const editedAnimeDesc = animeDescCell.textContent.trim();

            // Perform an AJAX request to update the anime data on the server
            const data = {
                animeName: editedAnimeName,
                desc: editedAnimeDesc,
            };

            fetch(`/updateAnime/${encodeURIComponent(animeId)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                .then((response) => {
                    if (response.status === 200) {
                        console.log('Anime updated successfully');
                    } else {
                        console.log('Failed to update anime');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });

    // Revert the changes on pressing Escape key
    row.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            event.preventDefault();

            // Revert the table cells to the previous content
            animeNameCell.textContent = previousAnimeName;
            animeDescCell.textContent = previousAnimeDesc;

            // Remove the editable state and class
            animeNameCell.contentEditable = false;
            animeDescCell.contentEditable = false;
            row.classList.remove('editable');
        }
    });
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