//CAPTURANDO OS BOTÕES
const button = document.querySelectorAll('button');

//PROGRAMAÇÃO DO RELÓGIO
let time;
button[3].addEventListener('click', () => {
    document.querySelector('.resources').style["margin-left"] = "0vw";
});
button[0].addEventListener('click', () => {
    if(button[0].innerText == 'Parar Hora'){
        clearInterval(time);
        button[0].innerText = 'Ver Hora';
    } else {
        button[0].innerText = 'Parar Hora';
        time = setInterval(() => {
            const date = new Date();
            document.querySelector('.time-display').innerHTML = `${("00" + date.getHours()).slice(-2)}:${("00" + date.getMinutes()).slice(-2)}:${("00" + date.getSeconds()).slice(-2)}`;
        } , 1000);
    }
});

//PROGRAMAÇÃO DO CRONÔMETRO
button[4].addEventListener('click', () => {
    document.querySelector('.resources').style["margin-left"] = "-100vw";
});

class Cronometro {
    constructor(volta, tempoDasVoltas, tempoGeral){
        this.volta = volta;
        this.tempoDasVoltas = tempoDasVoltas;
        this.tempoGeral = tempoGeral;
    }
}
let maxKey = 0, minKey = 0;

function getKeyByMaxValue(array){
    let maxValue = array[0], key = 0;
    for(i in array){
       if(array[i] > maxValue){
            maxValue = array[i];
            key = i;
       }
    }
    return key;
}

function getKeyByMinValue(array){
    let minValue = array[0], key = 0;
    for(i in array){
       if(array[i] < minValue){
            minValue = array[i];
            key = i;
       }
    }
    return key;
}


//Tempo Total
let time1;
let miliTime1 = 0;
let cronoStart = false;
const cronoDate = new Date();

//Tempo Parcial
let volta = 0;
const voltas = [];
let time2;
let miliTime2;
let cronoPartialStart = false;
let html = "";

button[1].addEventListener('mouseover', () => {
    cronoStart ? (button[1].setAttribute('class', 'voltaRestaurar')) : (button[1].setAttribute('class', 'cursor'), button[1].style.opacity = .5);
});

button[1].addEventListener('click', () => {
    if(button[1].innerText == 'Restaurar') {
        button[2].innerText = 'Iniciar';
        button[1].innerText = 'Volta';
        button[2].removeAttribute('class');
        document.querySelector('.crono-fullTimeDisplay').innerHTML = "00:00:00.<span>000</span>"
        document.querySelector('.crono-partialTimeDisplay').innerHTML = "";
        document.querySelector('.time-record--table tbody').innerHTML = "";
        document.querySelector('.time-record--table').style.display = 'none';
        clearInterval(time1);
        clearInterval(time2);
        miliTime1 = 0;
        miliTime2 = 0;
        cronoStart = false;
        cronoPartialStart = false;
        volta = 0;
        voltas.length = 0;
        maxKey = 0;
        minKey = 0;
    } else {

        if(cronoStart){
            cronoPartialStart = true;
            document.querySelector('.time-record--table').style.display = 'initial';
            if(volta == 0){
                volta++;
                cronoDate.setHours(0, 0, 0, miliTime1);
                let tempoDasVoltas = miliTime1;
                let tempoGeral = `${("00" + cronoDate.getHours()).slice(-2)}:${("00" + cronoDate.getMinutes()).slice(-2)}:${("00" + cronoDate.getSeconds()).slice(-2)}.${("000" + cronoDate.getMilliseconds()).slice(-3)}`;
                voltas.push(new Cronometro(volta, tempoDasVoltas, tempoGeral));
            } else {
                volta++;
                cronoDate.setHours(0, 0, 0, miliTime2);
                let tempoDasVoltas = miliTime2;
                cronoDate.setHours(0, 0, 0, miliTime1);
                let tempoGeral = `${("00" + cronoDate.getHours()).slice(-2)}:${("00" + cronoDate.getMinutes()).slice(-2)}:${("00" + cronoDate.getSeconds()).slice(-2)}.${("000" + cronoDate.getMilliseconds()).slice(-3)}`;
                voltas.push(new Cronometro(volta, tempoDasVoltas, tempoGeral));
            }

            html = ""; 
            for(i in voltas){
                cronoDate.setHours(0, 0, 0, voltas[i].tempoDasVoltas);
                html += `<tr><td class="volta">${voltas[i].volta}</td><td>${("00" + cronoDate.getHours()).slice(-2)}:${("00" + cronoDate.getMinutes()).slice(-2)}:${("00" + cronoDate.getSeconds()).slice(-2)}.${("000" + cronoDate.getMilliseconds()).slice(-3)}</td><td>${voltas[i].tempoGeral}</td></tr>`;
            }
            
            document.querySelector('.time-record--table tbody').innerHTML = html;

            const volta2 = document.querySelectorAll('.volta');

            
            volta2[maxKey].classList.remove('red');
            volta2[minKey].classList.remove('blueviolet');
            
            if(voltas.length > 2){
                const tempoDasVoltas = voltas.map((e) => e.tempoDasVoltas);
                maxKey = getKeyByMaxValue(tempoDasVoltas);
                minKey = getKeyByMinValue(tempoDasVoltas);
                volta2[maxKey].classList.add('red');
                volta2[minKey].classList.add('blueviolet');
            }
            
            
            miliTime2 = 0;
            clearInterval(time2);
            time2 = setInterval(() => {
                cronoDate.setHours(0, 0, 0, miliTime2);
                document.querySelector('.crono-partialTimeDisplay').innerHTML = `${("00" + cronoDate.getHours()).slice(-2)}:${("00" + cronoDate.getMinutes()).slice(-2)}:${("00" + cronoDate.getSeconds()).slice(-2)}.${("000" + cronoDate.getMilliseconds()).slice(-3)}`;
                miliTime2 += 31;
            }, 31);
        }
    }
});

button[2].addEventListener('click', () => {
    if(button[2].innerText == 'Iniciar' || button[2].innerText == 'Retomar'){
        button[2].innerText = 'Parar';
        button[1].innerText = 'Volta';
        button[2].setAttribute('class', 'parar');
        cronoStart = true;
        time1 = setInterval(() => {
            cronoDate.setHours(0, 0, 0, miliTime1);
            document.querySelector('.crono-fullTimeDisplay').innerHTML = `${("00" + cronoDate.getHours()).slice(-2)}:${("00" + cronoDate.getMinutes()).slice(-2)}:${("00" + cronoDate.getSeconds()).slice(-2)}.<span>${("000" + cronoDate.getMilliseconds()).slice(-3)}</span>`;
            miliTime1 += 31;
        }, 31);
        if(cronoPartialStart){
            time2 = setInterval(() => {
                cronoDate.setHours(0, 0, 0, miliTime2);
                document.querySelector('.crono-partialTimeDisplay').innerHTML = `${("00" + cronoDate.getHours()).slice(-2)}:${("00" + cronoDate.getMinutes()).slice(-2)}:${("00" + cronoDate.getSeconds()).slice(-2)}.${("000" + cronoDate.getMilliseconds()).slice(-3)}`;
                miliTime2 += 31;
            }, 31);
        }
    } else {
        button[1].innerText = 'Restaurar';
        button[2].innerText = 'Retomar';
        button[2].setAttribute('class', 'retomar');
        clearInterval(time1);
        clearInterval(time2);
    }
})  