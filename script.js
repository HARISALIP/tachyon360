const names = [];
const pairs = [];

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const content = event.target.result;
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);

        if (lines.length < 2) {
            alert('Please add at least two names in the file.');
            return;
        }

        const uniqueNames = [...new Set(lines)];
        names.push(...uniqueNames.filter(name => !names.includes(name)));
        updateNamesList();
    };

    reader.readAsText(file);
}

function addName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Name cannot be empty.');
        return;
    }

    if (names.includes(name)) {
        alert('This name already exists.');
        return;
    }

    names.push(name);
    nameInput.value = '';
    updateNamesList();
}

function updateNamesList() {
    const namesList = document.getElementById('namesList');
    namesList.innerHTML = '<h3>Names:</h3>' + names.map(name => `<p class="name-item">${name}</p>`).join('');
}

function filterNames() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const nameItems = document.querySelectorAll('.name-item');

    nameItems.forEach(item => {
        const name = item.textContent.toLowerCase();
        item.style.display = name.includes(searchInput) ? '' : 'none';
    });
}

function generateSecretSanta() {
    if (names.length < 2) {
        alert('Add at least 2 names to generate Secret Santa pairs.');
        return;
    }

    let givers = [...names];
    let receivers = [...names];

    pairs.length = 0; // Clear existing pairs
    while (givers.length) {
        const giver = givers.pop();
        const possibleReceivers = receivers.filter(receiver => receiver !== giver);

        if (possibleReceivers.length === 0) {
            alert('Error occurred. Retrying pairing...');
            generateSecretSanta();
            return;
        }

        const recipient = possibleReceivers[Math.floor(Math.random() * possibleReceivers.length)];
        receivers = receivers.filter(receiver => receiver !== recipient);

        pairs.push(`${giver} ➡️ ${recipient}`);
    }

    const results = document.getElementById('results');
    results.innerHTML = '<h3>Secret Santa Pairs:</h3>' + pairs.map(pair => `<p class="pair-item">${pair}</p>`).join('');
}

function filterPairs() {
    const searchPairsInput = document.getElementById('searchPairsInput').value.toLowerCase();
    const pairItems = document.querySelectorAll('.pair-item');

    pairItems.forEach(item => {
        const pair = item.textContent.toLowerCase();
        item.style.display = pair.includes(searchPairsInput) ? '' : 'none';
    });
}

function downloadResults() {
    if (!pairs.length) {
        alert('No pairs generated to download.');
        return;
    }

    const text = pairs.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'secret-santa-pairs.txt';
    link.click();
}
