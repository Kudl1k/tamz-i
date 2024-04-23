let shopListAddModal;
uniqueItems = new Set()
function createAddShopingItemModal(){
    const modal_container = document.getElementById('shoplist_add_modal');
    const items = getItems();

    let recentItemsHTML = '';
    for (let item of items) {
        uniqueItems.add(item.text)
    }
    for (let item of uniqueItems) {
        recentItemsHTML += `<p class="recent-item">${item}</p>`;
    }

    const modalHTML = `
        <ion-modal id="shop_list_add_modal_w" trigger="">
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-button onclick="cancel()">Cancel</ion-button>
                    </ion-buttons>
                    <ion-title>New Item</ion-title>
                    <ion-buttons slot="end">
                        <ion-button onclick="saveItem()" strong="true">Add</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <div class="input-container">
                    <ion-item>
                        <ion-input id="add_shoplist_item_name" label="Enter your item" label-placement="stacked" type="text" placeholder="Hamburgers"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input id="add_shoplist_item_pieces" class="small-input" label="Pieces" label-placement="stacked" value="1" type="number"  placeholder="1" min="1" max="9"></ion-input>
                    </ion-item>
                </div>
                <div id="recent-items">
                    <h5>Recent Items</h5>
                    ${recentItemsHTML}
                </div>
            </ion-content>
        </ion-modal>
    `;
    modal_container.innerHTML = modalHTML;
    shopListAddModal = document.getElementById('shop_list_add_modal_w');
}

function updateRecentItems() {
    const items = getItems();

    let recentItemsHTML = '';
    uniqueItems = new Set();
    for (let item of items) {
        uniqueItems.add(item.text);
    }
    for (let item of uniqueItems) {
        recentItemsHTML += `<p class="recent-item" onclick="fillInput('${item}')">${item}</p>`;
    }
    document.getElementById('recent-items').innerHTML = recentItemsHTML;
}

function fillInput(text) {
    document.getElementById('add_shoplist_item_name').value = text;
}

function cancel(){
    shopListAddModal.dismiss(null,'cancel')
}


function saveItem() {
    const text = document.getElementById('add_shoplist_item_name').value
    const pieces = document.getElementById('add_shoplist_item_pieces').value
    const checked = false
    const items = getItems()

    const item = {
        id: items.length,
        text: text,
        pieces: pieces,
        checked: checked,
        archived: false,
        dateChecked: checked ? new Date() : null
    };

    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
    displayItems()
    cancel()
}

function getItems() {
    const items = localStorage.getItem('items');

    if (items) {
        return JSON.parse(items);
    }

    return [];
}

function displayItems() {
    const items = getItems();
    const shoplist = document.getElementById('shoplist_item_list');

    let html = '';
    for (let item of items) {
        if (!item.archived){
            html += `
            <ion-item-sliding>
                <ion-item>
                    <ion-label>
                        <ion-checkbox label-placement="end" slot="start" ${item.checked ? 'checked' : ''} data-id="${item.id}"> <span class="shoplist-text ${item.checked ? 'striked' : ''}" style="margin-left: 10px; flex: 1;">${item.text}</span></ion-checkbox>
                    </ion-label>
                    <ion-note class="shoplist-text ${item.checked ? 'striked' : ''}">${item.pieces}x</ion-note>
                </ion-item>
                <ion-item-options side="end">
                    <ion-item-option color="danger" onClick="archiveItem(${item.id})">Archive</ion-item-option>
                </ion-item-options>
            </ion-item-sliding>
        
        

            `;
        }
    }
    shoplist.innerHTML = html;
    const checkboxes = shoplist.querySelectorAll('ion-checkbox');
    for (let checkbox of checkboxes) {
        checkbox.addEventListener('click', function() {
            const id = this.dataset.id;
            checkItem(id);
        });
    }
}

function displayHistory() {
    const items = getItems();
    const shoplistHistory = document.getElementById('shoplist_item_list_history');
    let html = '';
    let checkedItems = items.filter(item => item.checked);
    let itemsByDate = {};
    for (let item of checkedItems) {
        const date = new Date(item.dateChecked);
        const formattedDate = date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        if (!itemsByDate[formattedDate]) {
            itemsByDate[formattedDate] = [];
        }
        itemsByDate[formattedDate].push(item);
    }
    for (let date in itemsByDate) {
        html += `
            <ion-card>
                <ion-card-header>
                    <ion-card-subtitle>Checked ${itemsByDate[date].length} items</ion-card-subtitle>
                    <ion-card-title>${date}</ion-card-title>
                </ion-card-header>
            </ion-card>
        `;
    }
    shoplistHistory.innerHTML = html;
}

function checkItem(id) {
    let items = getItems();
    for (let item of items) {
        if (item.id == id) {
            item.checked = !item.checked;
            item.dateChecked = item.checked ? new Date() : null;
            break;
        }
    }
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
    displayHistory();
}

function archiveItem(id) {
    let items = getItems();
    for (let item of items) {
        if (item.id == id) {
            item.archived = true;
            break;
        }
    }
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
    displayHistory();
}

function openModal() {
    shopListAddModal.present();
    updateRecentItems();
}


displayItems()
createAddShopingItemModal()
displayHistory()

document.getElementById('add_shoplist_item_button').addEventListener('click', openModal);
