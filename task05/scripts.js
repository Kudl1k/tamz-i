const urlInput = document.querySelector("#url");
const loginInput = document.querySelector("#login");
const receivedOutput = document.querySelector("#received");
const decocedOutput = document.querySelector("#decoded");
const messageOutput = document.querySelector("#message");

const getCodeButton = document.querySelector("#get-code");
const sendCodeButton = document.querySelector("#send-code");


let data = {}

data['url'] = urlInput.value;
data['login'] = loginInput.value;

console.log(data['login'])

urlInput.addEventListener('ionInput', function (e) {
    data['url'] = e['detail']['value'];
});
loginInput.addEventListener('ionInput', function (e) {
    data['login'] = e['detail']['value'];
});
getCodeButton.addEventListener('click', async (e) => {
    const name = data['login'];
    const URL = data['url'];
    console.log(URL);
    const params = new URLSearchParams();
    params.append('user', name);
    params.append('timestamp', Date.now().toString());
    try {
      const response = await fetch(`${URL}?${params.toString()}`);
      const token = await response.text();
      data['token'] = token;
      receivedOutput.value = token;
      decocedOutput.value = atob(token);

      console.log(data['token'])
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
sendCodeButton.addEventListener('click', async (e) => {
    const URL = data['url'];
    const token = data['token'];
    try {
      const response2 = await fetch(URL, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      const message = await response2.text();
      messageOutput.innerHTML = message;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});