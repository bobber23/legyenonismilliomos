document.addEventListener('DOMContentLoaded', () => {
    // loginCheck();
    kerdes();
    levelszinezes();
    document.getElementById('half').addEventListener('click', felezo);
    document.getElementById('crowd').addEventListener('click', kozonseg);
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
        const result = await getMethodFetch(`http://127.0.0.1:3000/api/crowd/${kerdesId}`);

        showAlert(SEGITSEGGG);
    } catch (error) {
        console.log(error);
    }
};

const telefon = async () => {
    try {
        const result = await getMethodFetch(`http://127.0.0.1:3000/api/phone/${kid}`);
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
