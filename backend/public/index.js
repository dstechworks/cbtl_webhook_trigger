const form = document.getElementById('submitForm');
const nameInput = document.getElementById('dataInput');
const displayInput = document.getElementById('displayInput');
const dropdownBox = document.getElementById('dropdownBox');
const alertBox = document.getElementById('topAlert');
const loader = document.getElementById('formLoader');
const submitButton = form.querySelector('button');
let displayOptions = [];

nameInput.addEventListener('input', () => {
    nameInput.value = nameInput.value.toUpperCase();
});

displayInput.addEventListener('focus', () => {
    filterDropdown('');
    dropdownBox.style.display = 'block';
});

displayInput.addEventListener('input', () => {
    const value = displayInput.value.toLowerCase();
    filterDropdown(value);
});

document.addEventListener('click', (e) => {
    if (!dropdownBox.contains(e.target) && e.target !== displayInput) {
        dropdownBox.style.display = 'none';
    }
});

function filterDropdown(query) {
    dropdownBox.innerHTML = '';
    const filtered = displayOptions.filter(item =>
        item.display.toLowerCase().includes(query)
    );
    if (filtered.length === 0) {
        dropdownBox.innerHTML = '<div>No matches found</div>';
        return;
    }
    filtered.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.display;
        div.addEventListener('click', () => {
            displayInput.value = item.display;
            dropdownBox.style.display = 'none';
        });
        dropdownBox.appendChild(div);
    });
}

async function populateDisplayList() {
    try {
        const response = await fetch('http://64.227.136.248:3013/getListOfDisplay');
        if (!response.ok) throw new Error("Failed to fetch display list");
        const result = await response.json();
        displayOptions = result.data || [];
    } catch (error) {
        console.error("Error loading display list:", error);
    }
}

populateDisplayList();

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameValue = nameInput.value.trim();
    const displayValue = displayInput.value.trim();

    if (!nameValue || !displayValue) {
        showAlert("Please fill in both fields.", true);
        return;
    }

    const selectedDisplay = displayOptions.find(item =>
        item.display.trim().toLowerCase() === displayValue.toLowerCase()
    );

    if (!selectedDisplay) {
        showAlert("Please select a valid display from dropdown.", true);
        return;
    }

    const displayId = selectedDisplay.displayId;

    // Show loader and disable button
    submitButton.disabled = true;
    loader.style.display = 'block';

    fetch('/triggerServerWebhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: nameValue,
            display: displayValue,
            displayId: displayId
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.text();
        })
        .then(data => {
            nameInput.value = '';
            displayInput.value = '';
            showAlert("Submitted Successfully!");
        })
        .catch(error => {
            showAlert("Submission failed!", true);
            console.error(error);
        })
        .finally(() => {
            submitButton.disabled = false;
            loader.style.display = 'none';
        });
});

function showAlert(message, isError = false) {
    alertBox.textContent = message;
    alertBox.style.backgroundColor = isError ? '#dc3545' : '#28a745';
    alertBox.classList.add('show');

    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}