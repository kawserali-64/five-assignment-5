const createElements = (arr) => {
    if (!arr || arr.length === 0) return '';

    return arr.map((el, i) => {
        const colorClass = i === 0 ? 'btn-soft btn-error rounded-full' : 'btn-soft btn-warning rounded-full';

        let iconClass = '';
        if (i === 0) iconClass = 'fa-solid fa-bug';
        else if (i === 1) iconClass = 'fa-solid fa-spider';

        return `<span class="btn btn-sm ${colorClass}"><i class="${iconClass}"></i> ${el}</span>`;
    }).join(' ');
}

const btnContainer = document.getElementById('btn-container');
const issueCount = document.getElementById('issueCount');
const spinner = document.getElementById('spinner');  

let allCards = []

function filterIssues(status, btn) {
    const buttons = document.querySelectorAll('#filterBtn button')
    buttons.forEach(button => {
        button.classList.remove('btn-primary');
    });

    btn.classList.add('btn-primary');

    loadCard(status); 
}

async function loadCard(status = "all") {
    spinner.classList.remove('hidden');
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();
    allCards = data.data;
    let cardsToShow = allCards;
    if (status !== "all") {
        cardsToShow = allCards.filter(card => card.status === status);
    }
    displayCard(cardsToShow);
    spinner.classList.add('hidden');
}

const loadModal = async (id) => {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    const res = await fetch(url)
    const data = await res.json()
    displayModal(data.data);
}

const displayModal = (card) => {
    let statusText = card.status === "closed" ? "Closed" : "Opened";
    let statusClass = card.status === "closed" ? "badge-error" : "badge-success";
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
        <div>
            <h1 class="text-2xl font-bold">${card.title}</h1>
        </div>

        <div class="flex gap-3 items-center">
            <div class="badge ${statusClass}">${statusText}</div>

            <div>
                <p>${statusText} by ${card.author}</p>
            </div>

            <div>
                <p>${card.updatedAt}</p>
            </div>
        </div>

        <div>
            ${createElements(card.labels)}
        </div>

        <p class="text-[#64748B]">${card.description}</p>
        
         <div class="flex bg-slate-200 p-5 rounded-sm">
            <div>
                <h3>Assignee:</h3>
                <h2>${card.author}</h2>
            </div>
            <div class="ml-20">
                <h3>Priority:</h3>
                <div class="badge badge-error">${card.priority}</div>
            </div>
        </div>
        
    `;

    document.getElementById('cardModal').showModal();
}

function displayCard(cards) {
    btnContainer.innerHTML = '';
    issueCount.innerText = cards.length;
    cards.forEach(card => {
        const div = document.createElement('div');
        const borderClass = (card.status === 'closed') ? 'border-purple-500' : 'border-green-500';
        let priorityClass = '';
        if (card.priority.toLowerCase() === 'high') priorityClass = 'badge badge-soft badge-error';
        else if (card.priority.toLowerCase() === 'medium') priorityClass = 'badge badge-soft badge-warning';
        else if (card.priority.toLowerCase() === 'low') priorityClass = 'badge badge-soft badge-info';
        else priorityClass = 'badge-outline';
        const statusImg = card.status === 'closed' ? './assets/Closed- Status .png' : 'assets/Open-Status.png';
        div.className = `card shadow-xl border-t-8 ${borderClass}`;
        div.innerHTML = `
            <div  onclick="loadModal(${card.id})" class="">
                <div class="card-body">
                    <div class="flex justify-between">
                       <img class="w-5 h-5" src="${statusImg}" alt="${card.status}">
                       <div class="badge ${priorityClass}">${card.priority}</div>
                    </div>
                    <h2 class="text-xl font-bold">${card.title}</h2>
                    <p class=" text-[#64748B]">${card.description}</p>
                    
                    <div class="flex gap-3">${createElements(card.labels)}</div>

                    <hr class="border-gray-400 border-t-2 w-full mt-4 mb-4">
                    <div>
                        <p class="text-[#64748B]">${card.assignee}</p>
                        <p class="text-[#64748B]">${card.updatedAt}</p>
                    </div>
                </div>
            </div>
        `;
        btnContainer.appendChild(div);
    });
}
loadCard()

// search input select 
const searchInput = document.querySelector('input[type="search"]');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allCards.filter(card =>
        card.title.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query)
    );
    displayCard(filtered);
});