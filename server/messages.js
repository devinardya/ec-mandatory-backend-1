const fs = require('fs');
const chatHistory = 'chat.json';
const uuid = require('uuid'); 
const chat = JSON.parse(fs.readFileSync(chatHistory));
//let greeting = []

function saveChat() {
    return new Promise((resolve, reject) => {
        fs.writeFile(chatHistory, JSON.stringify(chat), function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

function newMessage({data}){

    data.id = uuid.v4();
    console.log("CHAT DATA", data)

    chat.push(data);
    saveChat();
    
    return chat;
}

function statusMessages({data}) {
    console.log("CHAT DATA FROM ADMIN", data)

   chat.push(data);
   saveChat();
    return chat;
}

module.exports = {newMessage, statusMessages};