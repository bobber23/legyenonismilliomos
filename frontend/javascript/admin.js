document.addEventListener('DOMContentLoaded', () => {
    isAdmin();
    document.getElementById('addQuestionBtn').addEventListener('click', addQuestion);
    document.getElementById('difficultyInput').addEventListener('input', checkForValue);
});

async function isAdmin() {
    const { isAdmin } = await Get('/api/isAdmin');
    if (!isAdmin) {
        window.location.href = '/login';
    }
}

async function addQuestion() {
    let radioButtons = document.querySelectorAll('.correctRadio');
    let j = 0;
    while (j < radioButtons.length && !radioButtons[j].checked) {
        j++;
    }
    console.log(j);
    if (j == radioButtons.length) {
        alert('Nem választott ki helyes választ!');
    } else {
        const form = document.getElementById('newQuestion');
        let formData = new FormData();

        let isValid = true;
        let inputs = document.querySelectorAll('.formInput');

        for (let input of inputs) {
            if (input.value == '') {
                console.log('ads');
                input.classList.add('invalid');
                isValid = false;
            } else {
                input.classList.remove('invalid');
                formData.append(input.name, input.value);
            }
        }
        formData.append('correctAnswer', radioButtons[j].value);

        if (isValid) {
            try {
                const response = await Post('/api/addQuestion', formData);
                form.reset();
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Hiba a mezőkben');
        }
    }
}

async function Get(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Státusz: (${response.status})\nMessage: (${response.statusText})`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(error);
    }
}

async function Post(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data
        });
        if (!response.ok) {
            throw new Error(`Státusz: (${response.status})\nMessage: (${response.statusText})`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(error);
    }
}

function checkForValue() {
    let regex = /^[0-9]/;
    if (!regex.test(this.value)) {
        this.value = '';
    }
    if (this.value < 1 && this.value != '') {
        this.value = '1';
    }
    if (this.value > 15) {
        this.value = '15';
    }
}
