const fs = require('fs');
const chatHistory = 'chat.json';
const uuid = require('uuid'); 
const chat = JSON.parse(fs.readFileSync(chatHistory));


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
   
    chat.push(data);
    saveChat();
    
    return chat;
}



module.exports = {newMessage};