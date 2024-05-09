let shopListAddModal;
let shopListEditModal;
let settingsModal;
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
                <h5>Recent Items</h5>
                <ion-list>
                <div id="recent-items">

                    ${recentItemsHTML}        
                </div>
                </ion-list>
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
        recentItemsHTML += `<ion-item class="recent-item" onclick="fillInput('${item}')"><ion-label>${item}</ion-label></ion-item>`;
    }
    document.getElementById('recent-items').innerHTML = recentItemsHTML;
}

function fillInput(text) {
    document.getElementById('add_shoplist_item_name').value = text;
}

function cancel(){
    shopListAddModal.dismiss(null,'cancel')
    settingsModal.dismiss(null,'cancel')
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
    if (settings == 'local_storage'){
        localStorage.setItem('items', JSON.stringify(items));
    } else if (settings == 'file') {
        
    } else if (settings == 'api') {

    }
    displayItems()
    cancel()
}

function getItems() {
    if (settings == 'local_storage'){
        let items = localStorage.getItem('items');
        return Promise.resolve(JSON.parse(items));
    } else if (settings == 'file') {
        return fetch("./items.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .catch((error) => console.error("Unable to fetch data:", error));
    } else if (settings == 'api') {
        // Implement API fetching here
    }

    return Promise.resolve([]);
}

function displayItems() {
    let items = null
    getItems().then(loaded_items => {
        console.log(loaded_items);
        items = loaded_items
    });
    const shoplist = document.getElementById('shoplist_item_list');

    let html = '<ion-list>';
    let rest = '';
    for (let item of items) {
        if (!item.archived && !item.checked){
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
        } else if (!item.archived && item.checked){
            rest += `
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
    shoplist.innerHTML = html + rest + '</ion-list>';
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
            if (item.checked){
                let audio = new Audio('/sounds/tamz-check.mp3');
                audio.play();
            } else {
                let audio = new Audio('/sounds/tamz-uncheck.mp3');
                audio.play();
            }
            break;
        }
    }
    if (settings == 'local_storage'){
        localStorage.setItem('items', JSON.stringify(items));
    } else if (settings == 'file') {

    } else if (settings == 'api') {

    }
    
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
    if (settings == 'local_storage'){
        localStorage.setItem('items', JSON.stringify(items));
    } else if (settings == 'file') {

    } else if (settings == 'api') {

    }
    displayItems();
    displayHistory();
}

function openModal() {
    shopListAddModal.present();
    updateRecentItems();
}

function openSettingsModal() {
    settingsModal.present();
}

function fetchItems() {
    fetch('http://localhost:8080/items')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let apiitems = []
        apiitems = data;
        console.log(apiitems)
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
}

function createSettingsModal(){
    const modal_container = document.getElementById('settings_modal');
    loadSettings()
    const modalHTML = `
        <ion-modal id="settings_modal_w" trigger="">
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-button onclick="cancel()">Cancel</ion-button>
                    </ion-buttons>
                    <ion-title>Settings</ion-title>
                    <ion-buttons slot="end">
                        <ion-button onclick="saveSettings()" strong="true">Save</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <h1>Load from:</h1>
                    <ion-list>
                        <ion-radio-group id="settings_group" value="${settings}">
                        <ion-item class="reverse-order">
                            <ion-radio value="local_storage" justify="start">Local Storage</ion-radio>
                        </ion-item>
                        <ion-item class="reverse-order">
                            <ion-radio value="file" justify="start">File</ion-radio>
                        </ion-item>
                        <ion-item class="reverse-order">
                            <ion-radio value="api" justify="start">Api</ion-radio>
                        </ion-item>
                        </ion-radio-group>
                    </ion-list> 
                    <div class="button-container">
                        <ion-button onclick="saveItemsToFile()" strong="true">Save to File</ion-button>
                    </div>
            </ion-content>
        </ion-modal>
    `;
    modal_container.innerHTML = modalHTML;
    settingsModal = document.getElementById('settings_modal_w')
}

function saveSettings() {
    const radioGroup = document.getElementById('settings_group');
    const selectedValue = radioGroup.value;
    localStorage.setItem('settings', selectedValue);
    loadSettings();
    displayItems()
    cancel()
}
let settings;

function loadSettings() {
    settings = localStorage.getItem('settings');
    if (settings === null) {
        settings = 'local_storage';
    }
}

function saveItemsToFile() {
    const items = getItems();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "items.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

loadSettings();
displayItems()
createAddShopingItemModal()
createSettingsModal()
displayHistory()
fetchItems()


document.getElementById('add_shoplist_item_button').addEventListener('click', openModal);
document.getElementById('settings_button').addEventListener('click',openSettingsModal);
