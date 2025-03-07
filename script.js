window.appState = {
    counter: 0,
    cards: []
};

const button = document.getElementById('button');
const download = document.getElementById('download');

button.addEventListener('click', () => {
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.textContent = `Card ${window.appState.counter}`;
    newCard.id = `card-${window.appState.counter}`;
    window.appState.counter += 1;
    window.appState.cards.push(newCard);
    
    newCard.newX = 0;
    newCard.newY = 0;
    newCard.startX = 0;
    newCard.startY = 0;

    document.body.appendChild(newCard);
    newCard.addEventListener('mousedown', mouseDown);
});

const coords = Array.from(document.querySelectorAll('tr')).map(tr => tr.offsetTop);

function mouseDown(e) {
    const card = e.target;

    card.startX = e.clientX;
    card.startY = e.clientY;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}

function mouseMove(e) {
    const card = e.target;

    card.newX = card.startX - e.clientX;
    card.newY = card.startY - e.clientY;

    card.startX = e.clientX;
    card.startY = e.clientY;

    card.style.top = `${card.offsetTop - card.newY}px`;
    card.style.left = `${card.offsetLeft - card.newX}px`;
}

function mouseUp(e) {
    const card = e.target;  

    card.startX = card.newX;
    card.startY = card.newY;
    
    card.style.top = findClosest(coords, card.offsetTop);
    card.style.left = findClosest(coords, card.offsetLeft);

    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
}

function findClosest(arr, target){
    return arr.sort((a, b) => Math.abs(target - a) - Math.abs(target - b))[0];
}

function downloadHTML(){
    const html = document.documentElement.cloneNode(true);
    const buttons = html.querySelectorAll('button');
    buttons.forEach(button => button.remove());

    const htmlContent = html.outerHTML;
    const blob = new Blob([htmlContent], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
}

download.addEventListener('click', downloadHTML);