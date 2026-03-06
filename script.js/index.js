const createElements = (arr) => {
    if (!arr || arr.length === 0) return '';

    return arr.map((el, i) => { 
        const colorClass = i === 0 ? 'btn-soft btn-error rounded-full' : 'btn-soft btn-warning rounded-full';

        let iconClass = '';
        if(i === 0) iconClass = 'fa-solid fa-bug';
        else if(i === 1) iconClass = 'fa-solid fa-spider'; 

        return `<span class="btn btn-sm ${colorClass}"><i class="${iconClass}"></i> ${el}</span>`;
    }).join(' ');
}


const btnContainer = document.getElementById('btn-container');

let allCards =[]

function filterIssues(status, btn){
    const buttons = document.querySelectorAll('#filterBtn button') 
    buttons.forEach(button =>{
        button.classList.remove('btn-primary');
    });

    // clicked 
    btn.classList.add('btn-primary');

    if(status === "all"){
        displayCard(allCards);
        return;
    }

    const filtered = allCards.filter(card => card.status === status);
    displayCard(filtered,status);

}

async function loadCard() {
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    const data = await res.json();
    allCards = data.data;
    displayCard(allCards);
}
function displayCard(cards){
    btnContainer.innerHTML = '';
    cards.forEach(card => {
        const div = document.createElement('div');

        // card.status
        const borderClass = (card.status === 'closed') ? 'border-purple-500' : 'border-green-500';
        
        

        div.className = `card shadow-xl border-t-8 ${borderClass}`;
        div.innerHTML = `
            <div class="">
                <div class="card-body">
                    <div class="flex justify-between">
                        <img class="w-5 h-5" src="./assets/Open-Status.png" alt="">
                        <div class="badge badge-warning">${card.priority}</div>
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