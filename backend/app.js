const express = require('express');
const app = express();
const { exec } = require('child_process');

const allowedOrigins = ['http://localhost:5173'];

app.use((req, res, next) => {

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    

    next();
});

app.use(express.json());


const serverGame = [
    {
        'nameServerGame': 'Ark_Fjordur',
        'nameScreen': 'arkserverFjordur',
        'commandRun': `screen -dmS arkserverFjordur bash -c 'cd /home/steam/ARK_server/ShooterGame/Binaries/Linux && ./ShooterGameServer "Fjordur?Port=7777?QueryPort=27015?SessionName=Cluster_Fjordur" -server -log -clusterid=MonCluster -NoBattlEye -crossplay'`
    },
    {
        'nameServerGame': 'Ark_Gen2',
        'nameScreen': 'arkserverGen2',
        'commandRun': `screen -dmS arkserverGen2 bash -c 'cd /home/steam/ARK_server/ShooterGame/Binaries/Linux && ./ShooterGameServer "Gen2?Port=7779?QueryPort=27017?SessionName=Cluster_Gen2" -server -log -clusterid=MonCluster -NoBattlEye -crossplay'`
    }
]

async function runCommand(command) {
    let output = { success: null, data: null, message: "" };

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                output.success = 'error';
                output.data = error.message;
                return reject(output);
            }
            if (stderr) {
                output.success = 'error';
                output.data = error.message;
                return reject(output);
            }
            else {
                output.success = 'success';
                output.data = stdout;
                return resolve(output);
            }
        });
    })
}

app.post('/startServerGame', async (req, res) => {

    if (!req.body.nameServerGame || req.body.nameServerGame == "" ) {
        res.json({
            status: 200,
            success: false,
            message: "Le nom du serveur est requis.",
            data: ""
        });
    }

    let nameServer = req.body.nameServerGame

    let commandRun = "";
    let nameScreen = "";
    serverGame.forEach(element => {
        if (element.nameServerGame === nameServer) {
            commandRun = element.commandRun;
            nameScreen = element.nameScreen;
        }
    });

    if (commandRun === "") {
        res.json({
            status: 200,
            success: false,
            message: "Aucune commande n'existe pour ce serveur.",
            data: ""
        });
    }

    let outputCommand = { success: null, data: null, message: "" }
    try {

        // je verif que le serveur n'est pas deja lancé:
        console.log("1");
        let outputCommandCheck = await runCommand("screen -ls")
        console.log("2");
        if (outputCommandCheck.includes(nameScreen)) {
            console.log("3");
            outputCommand.success = false;
            outputCommand.data = ""
            outputCommand.message = "Le serveur est déjà lancé !"
            
        } else {
            console.log("4");
            outputCommand = await runCommand(commandRun);
            outputCommand.message = "Serveur lancé !";
        }

    }
    catch {
        outputCommand.success = false;
        outputCommand.data = ""
        outputCommand.message = "Erreur lors de l'exécution de la commande"
    }
    
    res.json({
        status: 200,
        success: outputCommand.success,
        message: outputCommand.message,
        data: outputCommand.data
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));