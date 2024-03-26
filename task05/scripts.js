const fetch_data = async () => {
    const name = 'KUD0132';
    const URL = 'https://homel.vsb.cz/~mor03/TAMZ/TAMZ22.php';
    const params = new URLSearchParams();
    params.append('user', name);
    params.append('timestamp', Date.now().toString());

    try {
        const response = await fetch(`${URL}?${params.toString()}`);
        const token = await response.text();

        const response2 = await fetch(URL, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
        });
        
        const data = await response2.text();

        document.getElementById('data-display').textContent = data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


const fetch_button = document.getElementById('fetch-data');

fetch_button.addEventListener('click', function() {
    fetch_data()
})

