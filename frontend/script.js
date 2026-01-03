

import axios from "axios"

document.getSelection()
const formStartServer = document.querySelectorAll(".formStartServer")

formStartServer.forEach(form => {

    form.addEventListener("submit", (event) => {

        event.preventDefault();
        const button = event.submitter;
        const serverName = button.value;

        axios.post('http://localhost:3000/startServerGame', {
            nameServerGame: serverName
        })
        .then(response => {
            console.log('Success:', response.data);
            alert(response.data.message)
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Erreur lors de l'appel à l'API");
        });
    })
})

