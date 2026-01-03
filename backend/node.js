import { exec } from 'child_process';
import express from 'express';

async function runCommand(command) {
    let output = { success: null, data: null, message: "" };

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                output.success = 'error';
                output.data = error.message;
                return reject(output);
            }
            // On vérifie stderr mais on ne bloque pas forcément si c'est juste un warning
            if (stderr) {
                output.success = 'warning';
                output.data = stderr;
                // Pour les serveurs de jeux, il vaut mieux souvent resolve ici
                return resolve(output); 
            }
            
            output.success = 'success';
            output.data = stdout;
            return resolve(output);
        });
    });
}

// Grâce au mode ES Module ("type": "module"), tu peux faire ça directement :
try {
    let outputCommandCheck = await runCommand("dir");
    console.log("Test réussi :", outputCommandCheck.data);
} catch (err) {
    console.error("Test échoué :", err);
}