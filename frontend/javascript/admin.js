document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addQuestionBtn').addEventListener('click', addQuestion);
});

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
        let formData = new FormData(form);
        let isValid = true;

        for (let entry of formData.entries()) {
            if (entry[0] == 'difficulty' && (entry[1] > 15 || entry[1] < 1)) {
                isValid = false;
            }
            if (entry[1] == '') {
                isValid = false;
            }
        }

        if (isValid) {
            try {
                const response = await Post('/api/addQuestion', formData);
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Hiba a mezőkben');
        }
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
