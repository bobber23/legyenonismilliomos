document.addEventListener('DOMContentLoaded', () => {
    kerdes();
});

let level = 1;
const kerdes = async () => {
    try {
        const result = await getMethodFetch(`http://127.0.0.1:3000/api/questions/${level}`);
        const kerdesText = result.kerdes.kerdes;
        console.log(kerdesText);

        valaszok(result.kerdes.id);
    } catch (error) {
        console.log(error);
    }
};

const valaszok = async (kid) => {
    try {
        const result = await getMethodFetch(`http://127.0.0.1:3000/api/answers/${kid}`);
        const buttondiv = document.getElementById('buttonDiv');
        buttondiv.replaceChildren();
        let buttonId = 1;
        result.valaszok.forEach((element) => {
            const button = document.createElement('button');
            button.dataset.id = element.id;
            button.innerHTML = element.valasz;
            button.addEventListener('click', () => {
                checkValasz(element.id);
            });
            buttonId++;
            buttondiv.appendChild(button);
        });
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
        } else {
            console.log('A játéknak vége');
            level = 1;
        }
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

// function showAlert(message) {
//     document.getElementById('alertMessage').innerText = message;
//     document.getElementById('alert').style.display = 'flex';
// }

// function closeAlert() {
//     document.getElementById('alert').style.display = 'none';
// }
