document.addEventListener('DOMContentLoaded', () => {
    // loginCheck();
    kerdes();
    levelszinezes();
    document.getElementById('half').addEventListener('click', felezo);
    document.getElementById('crowd').addEventListener('click', kozonseg);
    document.getElementById('phone').addEventListener('click', telefon);
});

const loginCheck = async () => {
    try {
        const result = await getMethodFetch('http://127.0.0.1:3000/api/me');
        if (result.loggedIn === false) {
            window.location.href = '/login';
        }
    } catch (error) {
        console.log(error);
    }
};

let level = 1;
let kerdesId;
const kerdes = async () => {
    try {
        const result = await getMethodFetch(`http://127.0.0.1:3000/api/questions/${level}`);
        const kerdesText = result.kerdes.kerdes;
        const kerdes = document.getElementById('kerdes');
        kerdes.innerHTML = kerdesText;
        kerdesId = result.kerdes.id;

        valaszok(result.kerdes.id);
    } catch (error) {
        console.log(error);
    }
};

const valaszok = async (kid) => {
    try {
        const result = await getMethodFetch(`http://127.0.0.1:3000/api/answers/${kid}`);
        const buttondiv = document.getElementById('valaszok');
        buttondiv.replaceChildren();
        result.valaszok.forEach((element) => {
            const button = document.createElement('button');
            button.dataset.id = element.id;
            button.innerHTML = element.valasz;
            button.classList.add('valasz-btn');
            button.addEventListener('click', () => {
                checkValasz(element.id);
            });
            buttondiv.appendChild(button);
        });
    } catch (error) {
        console.log(error);
    }
};

const felezo = async () => {
    try {
        document.getElementById('half').classList.add('usedHelp');
        document.getElementById('half').classList.add('disabledHelp');
        const result = await getMethodFetch(`http://127.0.0.1:3000/api/half/${kerdesId}`);
        const buttondiv = document.getElementById('valaszok');
        buttondiv.replaceChildren();
        result.result.forEach((element) => {
            const button = document.createElement('button');
            button.dataset.id = element.id;
            button.innerHTML = element.valasz;
            button.classList.add('valasz-btn');
            button.addEventListener('click', () => {
                checkValasz(element.id);
            });
            buttondiv.appendChild(button);
        });
    } catch (error) {
        console.log(error);
    }
};

const kozonseg = async () => {
    try {
        let crowd = document.getElementById('crowd');
        if (!crowd.classList.contains('usedHelp')) {
            const { status, result } = await postMethodFetch(`http://127.0.0.1:3000/api/crowd`, {
                questionId: kerdesId,
                difficulty: level
            });

            crowd.classList.add('usedHelp');
            let helps = document.querySelectorAll('.helpBtn');

            for (const help of helps) {
                if (help != crowd) {
                    help.classList.add('disabledHelp');
                }
            }

            let percentageDiv = document.getElementById('crowdPercentageDiv');
            percentageDiv.replaceChildren();
            let answerDiv = document.getElementById('crowdAnswerDiv');
            answerDiv.replaceChildren();
            for (const answer of result) {
                console.log(answer);
                const answerTitle = document.createElement('p');
                answerTitle.innerText = answer.valasz;
                answerDiv.appendChild(answerTitle);

                const percentage = document.createElement('div');
                percentage.classList.add('percentageColumn');
                percentage.style.height = answer.szazelek + '%';
                percentage.style.textAlign = 'center';
                percentageDiv.appendChild(percentage);
            }
            document.getElementById('crowd').classList.add('usedHelp');
        }
    } catch (error) {
        console.log(error);
    }
};

let helpDialog = '';
const telefon = async () => {
    let dialogs = [
        'HALLÓ, KI AZ?\nHALLÓ!\nVISZLÁT!',
        'Pfú, elég nehéz kérdés, de én szerintem a helyes válasz a(z): ',
        'Nagyon egyszerű a válasz a(z): ',
        'Hát haver asszem a(z): ',
        'Kisfiam ez bizony a(z): '
    ];
    try {
        if (helpDialog == '') {
            let phone = document.getElementById('phone');
            phone.classList.add('usedHelp');

            let helps = document.querySelectorAll('.helpBtn');

            for (const help of helps) {
                if (help != phone) {
                    help.classList.add('disabledHelp');
                }
            }

            const { status, result } = await postMethodFetch(`http://127.0.0.1:3000/api/phone`, {
                questionId: kerdesId,
                difficulty: level
            });
            let random = Math.floor(Math.random() * dialogs.length);
            if (random == 0) {
                helpDialog = dialogs[random];
            } else {
                helpDialog = dialogs[random] + result[0].valasz;
            }
        }
        document.getElementById('phoneP').innerText = helpDialog;
    } catch (error) {
        console.log(error);
    }
};

const checkValasz = async (valaszid) => {
    try {
        const isCorrect = await getMethodFetch(`http://127.0.0.1:3000/api/answer/${valaszid}`);
        if (isCorrect.isCorrect === true) {
            level++;
            kerdes();
            levelszinezes();
            let helps = document.querySelectorAll('.helpBtn');
            for (const help of helps) {
                if (help.classList.contains('usedHelp')) {
                    help.classList.add('disabledHelp');
                } else {
                    help.classList.remove('disabledHelp');
                }
            }
        } else {
            console.log('A játéknak vége');
            level = 1;
        }
    } catch (error) {
        console.log(error);
    }
};

const levelszinezes = async () => {
    try {
        const li = document.querySelectorAll('li');
        li.forEach((element) => {
            element.classList.remove('active-level');
        });
        li[15 - level].classList.add('active-level');
    } catch (error) {
        console.log(error);
    }
};

const getMethodFetch = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GET Hiba: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Hiba történt: ${error}`);
    }
};

const postMethodFetch = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`POST Hiba: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Hiba történt: ${error}`);
    }
};

function showAlert(message) {
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('alert').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('alert').style.display = 'none';
}
