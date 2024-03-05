
let name_input = document.getElementById("name_input")
let name_value = ""

let confirm_button = document.getElementById("calculate_button")
let zodiacImg = null

let date_time = null
let selectedDate = null

name_input.addEventListener('ionInput',(ev) =>{
    name_value = ev.target.value
    if (name_value == ""){
        document.getElementById("name_display").innerHTML = 'To display days until your birthday, please input your name and select date. Then click the Calculate button.'
        document.getElementById("result").innerHTML = ""
        if (zodiacImg != null){
            zodiacImg.remove()
            zodiacImg = null
        }
    }
})



document.getElementById("date_time_selector").addEventListener('ionChange',(ev) =>{
    selectedDate = new Date(ev.detail.value)

})

function getDaysDifference(selectedDate){
    if (selectedDate == null){
        return;
    }
    var current = new Date();
    
    // Set both dates to the same year to disregard the year component
    selectedDate.setFullYear(current.getFullYear());
    
    // If selected date is behind the current date, move it to next year
    if (selectedDate < current) {
        selectedDate.setFullYear(current.getFullYear() + 1);
    }
    
    var differenceInTime = Math.abs(selectedDate.getTime() - current.getTime());
    var differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
    date_time = differenceInDays
}

confirm_button.addEventListener('click', (ev) => {
    if (name_value != "" && selectedDate != null){
        getDaysDifference(selectedDate)
    } else {
        presentAlert()
        return
    }
    if (date_time == 365){
        document.getElementById("name_display").innerHTML = "Happy birthday!"
        document.getElementById("result").innerHTML = ""
        if (zodiacImg != null){
            zodiacImg.remove()
        }
        getZodiacSign(selectedDate)
    } else {
        document.getElementById("name_display").innerHTML = name_value + " you will have birthday in "
        document.getElementById("result").innerHTML = date_time + " days"
        if (zodiacImg != null){
            zodiacImg.remove()
        }
        getZodiacSign(selectedDate)
    }
})

async function presentAlert() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Error';
    alert.message = 'To display days until your birthday, please input your name and select date. Then click the Calculate button.';
    alert.buttons = ['Close'];

    document.body.appendChild(alert);
    await alert.present();
}


function getZodiacSign(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        createImage("Beran","./img/beran.png")
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        createImage("Býk","./img/byk.png")
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
        createImage("Blíženci","./img/blizenci.png")
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
        createImage("Rak","./img/rak.png")
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        createImage("Lev","./img/lev.png")
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        createImage("Panna","./img/panna.png")
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
        createImage("Váhy","./img/vaha.png")
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
        createImage("Štír","./img/stir.png")
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
        createImage("Střelec","./img/strelec.png")
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        createImage("Kozoroh","./img/kozoroh.png")
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        createImage("Vodnář","./img/vodnar.png")
    } else {
        createImage("Ryby","./img/ryby.png")
    }
}


function createImage(zodiac,path){
    zodiacImg = document.createElement("ion-img")
    zodiacImg.setAttribute("id","zodiac-img")
    zodiacImg.setAttribute("src", path);
    zodiacImg.setAttribute("alt", zodiac)
    document.getElementById("info_card").appendChild(zodiacImg)
}