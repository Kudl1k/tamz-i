let shopListAddModal;
function createAddShopingItemModal(){
    const modal_container = document.getElementById('shoplist_add_modal');

    const modalHTML = `
        <ion-modal id="shop_list_add_modal_w" trigger="add_shoplist_item_button">
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
                <ion-item>
                    <ion-input id="add_shoplist_item_name" label="Enter your item" label-placement="stacked" type="text" placeholder="Hamburgers (2 pieces)"></ion-input>
                </ion-item>
            </ion-content>
        </ion-modal>
    `;
    modal_container.innerHTML = modalHTML;
    shopListAddModal = document.getElementById('shop_list_add_modal_w');
}

function cancel(){
    shopListAddModal.dismiss(null,'cancel')
}


function saveItem() {
    const text = document.getElementById('add_shoplist_item_name').value
    const checked = false
    const items = getItems()

    const item = {
        id: items.length,
        text: text,
        checked: checked,
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
        if (!item.checked){
            html += `
                <ion-card>
                    <ion-card-content>
                        <ion-row class="shoplist-item">
                            <ion-col size="10">
                                <p class="shoplist-text">${item.text}</p>
                            </ion-col>
                            <ion-col size="2" class="shoplist-checkbox">
                                <ion-checkbox ${item.checked ? 'checked' : ''} data-id="${item.id}"></ion-checkbox>
                            </ion-col>
                        </ion-row>
                    </ion-card-content>
                </ion-card>
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
            item.checked = true;
            item.dateChecked = new Date();
            break;
        }
    }
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
    displayHistory();
}


createAddShopingItemModal()
displayItems()
displayHistory()