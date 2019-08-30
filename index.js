
var Discord = require('discord.io');

const fs = require('fs');
var TYPINGBOOL = false;
var oni = "";
var backTics = "```";
const GoogleImages = require('google-images');
const client = new GoogleImages('secret', 'secret');
var bot = new Discord.Client({
    token: "secret",
    autorun: true
});


var setting = {
    main: "-1"
}
function getRandom(start, end) {
    return Math.floor(Math.random() * (end + 1)) + start;
}

function getServerID(channelID) {
    return bot.channels[channelID.toString()].guild_id;
}

function getServerName(channelID) {
    return bot.servers[bot.channels[channelID.toString()].guild_id.toString()].name;
}

bot.on('ready', function () {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
    updateSetting();
   // console.log(setting.servers[0].nogreet);
    //  console.log(setting.main);
    //check if a bot has already left a server and udpate the database
    for (i = setting.servers.length - 1; i >= 0; i--) {
        for (j = 0; j < bot.servers.length; i++) {

        }
    }

    
    for (i = 0; i < setting.servers.length; i++) {
        if (setting.servers[i].id !== "") {
            if(setting.servers[i].tooglegreet !== undefined){
                if(setting.servers[i].tooglegreet){
                    bot.sendMessage({
                        to: setting.servers[i].mainChannel,
                        message: "I am back!",
                        typing: TYPINGBOOL
                    });
                }
            }
            
        }
        /*  if (setting.main !== "-1") {
              bot.sendMessage({
                  to: setting.main,
                  message: "I am back!",
                  typing: TYPINGBOOL
              });*/
    }
});

function updateSetting() {
    var fresiaSetting = fs.readFileSync('fresiaSetting.json');
    setting = JSON.parse(fresiaSetting);
}

bot.on('disconnect', function (errMsg, code) {
    bot.sendMessage({
        to: setting.main,
        message: "Good bye!",
        typing: TYPINGBOOL
    });
});

function mention(userID) {
    return "<" + "@" + userID + ">";
    // return userID;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function getReplies() {
    var replySetting = fs.readFileSync('replySetting.json');
    return repSet = JSON.parse(replySetting);
}
bot.on('presence', function (user, userID, status, game, event) {
    updateSetting();
    if (setting.checkPresence) {
        if (status === "online") {
            // bot.guilds.get('GUILD-ID').channels.get('CHANNEL-ID').send("Message");
            bot.sendMessage({
                to: setting.main,
                message: replaceAll(setting.onlineMessages[getRandom(0, setting.onlineMessages.length - 1)], "%s", setting.mention === false ? user : mention(userID)),
                typing: TYPINGBOOL
            });
        }

        /*    if(status === "idle"){
                bot.sendMessage({
                    to: setting.main,
                    message: replaceAll((setting.idleMessages[getRandom(0, setting.idleMessages.length-1)], "%s", setting.mention === false? user : mention(userID))),
                    typing: TYPINGBOOL
                });
            }*/

        if (status === "offline") {
            bot.sendMessage({
                to: setting.main,
                message: replaceAll(setting.offlineMessages[getRandom(0, setting.offlineMessages.length - 1)], "%s", setting.mention === false ? user : mention(userID)),
                typing: TYPINGBOOL
            });
        }

    }


});
function getResultEmbed() {
    var resultEmbed = {
        title: "---List of random word replies---",
        color: 62207
    }
    var fields = [];
    resultEmbed.fields = fields;
    return resultEmbed;
}


function updateRepliesSetting(replySetting) {
    let data = JSON.stringify(replySetting, null, 2);
    fs.writeFile('replySetting.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');

        /*   bot.sendMessage({
               to: setting.main,
               message: msg,
               typing: TYPINGBOOL
           });*/
    });
}

function changeBoolValue(boolValue) {
    return (boolValue === true ? "on" : "off");
}

function updateModeSetting(serverIndex, mode) {
    //   var repSet = getReplies();

    for (i = 0; i < setting.servers[serverIndex].reply_mode.length; i++) {
        if (setting.servers[serverIndex].reply_mode[i].name === mode) {
            setting.servers[serverIndex].reply_mode[i].use = !setting.servers[serverIndex].reply_mode[i].use;
            break;
        }
    }

    writeToSetting();
    //updateRepliesSetting(repSet);

    return setting.servers[serverIndex].reply_mode[i].use;
}

function writeToSetting() {
    let data = JSON.stringify(setting, null, 2);
    fs.writeFile('fresiaSetting.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

function checkIfServerExist(serverID) {
    for (i = 0; i < setting.servers.length; i++) {
        if (serverID === setting.servers[i].id) {
            return true;
        }
    }
    return false;
}

function addServer(serverID, serverName) {
    var server = {
        id: serverID,
        name: serverName,
        mainChannel: "",
        ignoreIDs: [],
        priorityIDs: [],
        replyChance: 100,
        typingbool: false,
        all_mode: false,
        reply_mode: [
            {
                name: "english",
                use: true,
                desc: "English language reply",
                index: 1
            },
            {
                name: "indonesia",
                use: true,
                desc: "Indonesian language reply",
                index: 2
            }
        ],
        tooglegreet: false
    }


    setting.servers.push(server);
    writeToSetting();
}

function getServer(serverID) {
    for (i = 0; i < setting.servers.length; i++) {
        if (serverID === setting.servers[i].id) {
            return setting.servers[i];
        }
    }
    return null;
}

function getServerIndex(serverID) {
    for (i = 0; i < setting.servers.length; i++) {
        if (serverID === setting.servers[i].id) {
            return i;
        }
    }
    return null;
}

function isUserFavorite(serverIndex, userID) {
    for (i = 0; i < setting.servers[serverIndex].priorityIDs.length; i++) {
        if (setting.servers[serverIndex].priorityIDs[i].id === userID) {
            return true;
        }
    }
    return false;
}

bot.on('message', function (user, userID, channelID, message, event) {
    if (userID === setting.FresiaID) {
        return;
    }
    
    //  
    updateSetting();
    if(setting.showUserInConsole){
        console.log(userID + " " + user + ": " + message);
    }
    var curServerID = getServerID(channelID);

    if (!checkIfServerExist(curServerID)) {
        addServer(curServerID, getServerName(channelID));
    }
    var serverIndex = getServerIndex(curServerID);
    //  console.log("server index: " + serverIndex);

    /* for (a = 0; a < setting.ignoreIDs.length; a++) {
         if (userID === setting.ignoreIDs[a].id) {
             return;
         }
     }*/
    if (userID !== setting.fearliteID) {
        for (i = 0; i < setting.servers[serverIndex].ignoreIDs.length; i++) {
            if (userID === setting.servers[serverIndex].ignoreIDs[i].id) {
                return;
            }
        }
    }


    if (message === ".main") {
        setting.main = channelID;
        if (setting.servers[serverIndex].mainChannel !== channelID) {
            setting.servers[serverIndex].mainChannel = channelID;
        }
        let data = JSON.stringify(setting, null, 2);
        fs.writeFile('fresiaSetting.json', data, (err) => {
            if (err) throw err;
            console.log('Data written to file');

            bot.sendMessage({
                to: channelID,
                message: "Main channel is set to this channel " + (isUserFavorite(serverIndex, userID) ? "!" : ""),
                typing: TYPINGBOOL
            });
        });
        return;
    }


    var commandPrefix = setting.commandPrefix;
    if (message.substr(0, (commandPrefix.length)) === commandPrefix) {
        //    console.log("asd");

        var command = message.substr(commandPrefix.length, message.length);
        command = command.trim();

        var commWord = "help";
        if (command.substr(0, commWord.length) == commWord) {
            // var msg = "* Use .cal {params} to do scientific calculation. Ex: .cal 5*4 + 5 - 4 / 2 (result: 23) \n*Use .main to set the main channel \nHave a nice day !"
            var resultEmbed = {
                title: "---List of commands---",
                color: 62207
            }
            var fields = [];

            resultEmbed.fields = fields;


            var tempName = "";
            var tempValue = "";
            tempName = "List for all user: ";
            for (i = 0; i < setting.normalhelpList.length; i++) {

                tempValue += "* " + (setting.commandPrefix + setting.normalhelpList[i]);
                tempValue += "\n";
            }
            var field1 = {
                name: "",
                value: ""
            }
            field1.name = tempName;
            field1.value = tempValue;
            resultEmbed.fields.push(field1)
            tempName = "Extra List for my favorites: ";
            tempValue = "";
            for (i = 0; i < setting.favoritehelpList.length; i++) {
                tempValue += "* " + (setting.commandPrefix + setting.favoritehelpList[i]);
                tempValue += "\n";
            }


            var field2 = {
                name: "",
                value: ""
            }
            field2.name = tempName;
            field2.value = tempValue;
            resultEmbed.fields.push(field2)

            var msg = "";
            bot.sendMessage({
                to: channelID,
                embed: resultEmbed
            });

            return;
        }

        commWord = "cal";
        if (command.substr(0, commWord.length) === commWord) {
            var com = command.substr(commWord.length, message.length);
            // console.log(com);
            com = com.trim();
            var finalcom = com.replace(/\s/g, '');
            if (finalcom === "") {
                return;
            }
            var result = 0;
            var mes = "";
            try {
                result = eval(finalcom);
            } catch (e) {
                mes = e.message;
            }



            bot.sendMessage({
                to: channelID,
                message: mes === "" ? "The answer is " + result.toString() + (isUserFavorite(serverIndex, userID) ? " !" : "!") :
                    (isUserFavorite(serverIndex, userID) ? ", " : "") + "there is some error when calculating: " + mes,
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "tooglegreet";
        if (command.substr(0, commWord.length) === commWord) {
            if(setting.servers[serverIndex].tooglegreet !== undefined){
                setting.servers[serverIndex].tooglegreet = !setting.servers[serverIndex].tooglegreet;
            }else{
                setting.servers[serverIndex].tooglegreet = false;
            }

            writeToSetting();
            
            bot.sendMessage({
                to: channelID,
                message: "Fresia will" + (setting.servers[serverIndex].tooglegreet? "" : " no longer") + " greet when I'm available in this server...",
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "replylist";
        if (command.substr(0, commWord.length) === commWord) {
            var repSet = getReplies();
            var result = "";
            var resultEmbed = getResultEmbed();
            for (j = 0; j < repSet.messages.length; j++) {
                var field = {
                    name: "",
                    value: ""
                }
                var tempwords = "For words: ";
                for (k = 0; k < repSet.messages[j].word.length; k++) {
                    tempwords += repSet.messages[j].word[k] + (k === repSet.messages[j].word.length ? "" : ", ");
                }

                var tempvalues = "\n";
                for (k = 0; k < repSet.messages[j].replies.length; k++) {
                    //tempvalues += "* " + repSet.replies[k] + ": ";
                    for (l = 0; l < repSet.messages[j].replies[k].length; l++) {
                        tempvalues += repSet.messages[j].replies[k][l] + (l === repSet.messages[j].replies[k].length - 1 ? "" : ", ");
                    }
                    tempvalues += "\n";
                }
                field.name = tempwords;
                field.value = tempvalues;
                resultEmbed.fields.push(field);
            }
            bot.sendMessage({
                to: channelID,
                //  message: resMsg,
                embed: resultEmbed,
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "replymode";
        if (command.substr(0, commWord.length) === commWord) {
            //   var repSet = getReplies();
            var resultEmbed = {
                title: "---List of random word replies---",
                description: "Reply chance: " + setting.servers[serverIndex].replyChance + "%",
                color: 62207
            }
            var fields = [];
            var field = {
                name: "",
                value: ""
            }
            resultEmbed.fields = fields;
            var tempresult = "All mode : " + (setting.servers[serverIndex].all_mode === true ? "on" : "off");
            var tempvalue = "Desc : (If this is on, Fresia will use all reply modes regardless of the settings below!)";

            field.name = tempresult;

            resultEmbed.fields.push(field);
            resultEmbed.fields[0].value = tempvalue;

            for (i = 0; i < setting.servers[serverIndex].reply_mode.length; i++) {
                var field = {
                    name: ""
                }
                tempresult = "Mode " + (i + 1) + ": " + setting.servers[serverIndex].reply_mode[i].name + " " + (setting.servers[serverIndex].reply_mode[i].use === true ? "(on)" : "(off)");
                tempvalue = "Desc: " + setting.servers[serverIndex].reply_mode[i].desc;
                field.name = tempresult;
                field.value = tempvalue;
                resultEmbed.fields.push(field);
            }
            bot.sendMessage({
                to: channelID,
                embed: resultEmbed,
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "checknoticelist";
        if (command.substr(0, commWord.length) === commWord) {
            //    var repSet = getReplies();
            var resultEmbed = {
                title: "---List of favorite and ignored users---",
                color: 62207
            }
            var fields = [];
            resultEmbed.fields = fields;
            tempresult = "List of my favorite: ";
            var tempvalue = "";
            var field1 = {
                name: "",
                value: ""
            }
            for (i = 0; i < setting.servers[serverIndex].priorityIDs.length; i++) {
                tempvalue += "- " + mention(setting.servers[serverIndex].priorityIDs[i].id);
                tempvalue += "\n";
            }

            field1.value = (tempvalue !== "" ? tempvalue : "empty");
            field1.name = tempresult;
            resultEmbed.fields.push(field1);

            tempresult = "List of ignored: ";
            tempvalue = "";
            var field2 = {
                name: "",
                value: ""
            }

            for (i = 0; i < setting.servers[serverIndex].ignoreIDs.length; i++) {
                tempvalue += "- " + mention(setting.servers[serverIndex].ignoreIDs[i].id);
                tempvalue += "\n";
            }

            field2.value = (tempvalue !== "" ? tempvalue : "empty");
            field2.name = tempresult;
            resultEmbed.fields.push(field2);
            //   console.log(resultEmbed);
            bot.sendMessage({
                to: channelID,
                embed: resultEmbed,
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "all_mode";
        if (command.substr(0, commWord.length) === commWord) {
            setting.servers[serverIndex].all_mode = !setting.servers[serverIndex].all_mode;
            //  var repSet = getReplies();
            //    repSet.all_mode = !repSet.all_mode;
            //  updateRepliesSetting(repSet);

            bot.sendMessage({
                to: channelID,
                message: commWord + " is now " + changeBoolValue(setting.servers[serverIndex].all_mode),
                typing: TYPINGBOOL
            });
            return;
        }



        commWord = "english";
        if (command.substr(0, commWord.length) === commWord) {
            var res = updateModeSetting(serverIndex, commWord);

            bot.sendMessage({
                to: channelID,
                message: "Mode " + commWord + " is now " + changeBoolValue(res),
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "indonesia";
        if (command.substr(0, commWord.length) === commWord) {
            var res = updateModeSetting(serverIndex, commWord);

            bot.sendMessage({
                to: channelID,
                message: "Mode " + commWord + " is now " + changeBoolValue(res),
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "gimage";
        if (command.substr(0, commWord.length) === commWord) {
            try {
                var search = command.substr(commWord.length, command.length);
                var search = search.trim();
                if (search === "") {
                    return;
                }
                /* GoogleImageSearch.searchImage("cats")
                 .then((res) => {
                     console.log(res); // This will return array of image URLs
                 })*/

                client.search(search)
                    .then(images => {
                        if(images.length === 0){
                            bot.sendMessage({
                                to: channelID,
                                message: "Fresia cannot found any image with that keyword!" ,
                                
                                typing: TYPINGBOOL
                            });
                        }else{

                        }
                        bot.sendMessage({
                            to: channelID,
                            //message: "I hope this is what you want ! " +images[getRandom(0, 10)].url ,
                            embed: {
                                description: "Fresia hopes this is what you want" + (isUserFavorite(serverIndex, userID) ? " !" : "!"),
                                image: {
                                    "url": images[getRandom(0, 10)].url
                                },
                                color: 62207
                            },
                            typing: TYPINGBOOL
                        });


                    });
                return;
            } catch (e) {
                bot.sendMessage({
                    to: channelID,
                    message: "Errahh: " + e.message,
                    typing: TYPINGBOOL
                });
            }

            /*
                [{
                    "url": "http://steveangello.com/boss.jpg",
                    "type": "image/jpeg",
                    "width": 1024,
                    "height": 768,
                    "size": 102451,
                    "thumbnail": {
                        "url": "http://steveangello.com/thumbnail.jpg",
                        "width": 512,
                        "height": 512
                    }
                }]
                */

        }

        var canAccess = false;
        var shouldCheckFavoriteCommand = false;
        if (userID !== setting.fearliteID) {

            for (i = 0; i < setting.favoriteCommandList.length; i++) {
                commWord = setting.favoriteCommandList[i];
                if (command.substr(0, commWord.length) === commWord) {
                    shouldCheckFavoriteCommand = true;
                    break;
                }
            }

            if (!shouldCheckFavoriteCommand) {
                return;
            }
            for (i = 0; i < setting.servers[serverIndex].priorityIDs.length; i++) {
                if (userID === setting.servers[serverIndex].priorityIDs[i].id) {
                    canAccess = true;
                    break;
                }
            }
            if (!canAccess) {
                bot.sendMessage({
                    to: channelID,
                    message: mention(userID) + ", you are not my ! Only  can use this command!",
                    typing: TYPINGBOOL
                });
                return;
            }
        }



        commWord = "replychance";
        if (command.substr(0, commWord.length) === commWord) {
            var chance = command.substr(commWord.length, command.length);
            chance = chance.trim();
            var msg = "Please input number between 0 to 100 !";
            if (!isNaN(chance) && chance <= 100 && chance >= 0 && chance !== "") {
                setting.servers[serverIndex].replyChance = chance;
                //setting.replyChance = chance;
                writeToSetting();
                msg = "Reply chance updated to " + chance + "% !";
            }

            bot.sendMessage({
                to: channelID,
                message: msg,
                typing: TYPINGBOOL
            });

            return;
        }

        commWord = "ignore";
        if (command.substr(0, commWord.length) === commWord) {
            var params = command.substr(commWord.length, command.length);
            params = params.trim();
            if(params === ""){
                bot.sendMessage({
                    to: channelID,
                    message: "Fresia doesn't recognice that user!",
                    typing: TYPINGBOOL
                });
                return;
            }
            params = params.split(" ");
            params = clearSpaceFromArray(params);
            var id = params[0];
            id = id.trim();

            if(id.indexOf("<") === -1 || id.indexOf("@") === -1 || id.indexOf(">") === -1){
                bot.sendMessage({
                    to: channelID,
                    message: "Fresia doesn't recognice that user!",
                    typing: TYPINGBOOL
                });
                return;
            }
            id = id.replace(/[<>@]/g, "");
            if (checkIgnoreList(serverIndex, id) >= 0) {
                bot.sendMessage({
                    to: channelID,
                    message: mention(id) + " is already ignored!",
                    typing: TYPINGBOOL
                });
            }
            var name = "non";

            if (params.length === 2) {
                name = params[1];
            }
            var ignore = {
                name: name,
                id: id
            }
            setting.servers[serverIndex].ignoreIDs.push(ignore);
            //   setting.ignoreIDs.push(ignore);
            writeToSetting();
            bot.sendMessage({
                to: channelID,
                message: "Fresia will now ignore " + mention(id) + "!",
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "notice";
        if (command.substr(0, commWord.length) === commWord) {
            var id = command.substr(commWord.length, command.length);
            id = id.trim();
            if(id === ""){
                bot.sendMessage({
                    to: channelID,
                    message: "Fresia doesn't recognice that user!",
                    typing: TYPINGBOOL
                });
                return;
            }
            if(id.indexOf("<") === -1 || id.indexOf("@") === -1 || id.indexOf(">") === -1){
                bot.sendMessage({
                    to: channelID,
                    message: "Fresia doesn't recognice that user!",
                    typing: TYPINGBOOL
                });
                return;
            }
            id = id.replace(/[<>@]/g, "");
            var msg = "";
            var checkedIndex = checkIgnoreList(serverIndex, id);
            if (checkedIndex >= 0) {
                msg = "Fresia will now notice " + mention(id);
                setting.servers[serverIndex].ignoreIDs.splice(checkedIndex, 1);
                writeToSetting();
            }
            if (msg === "") {
                msg = "User not found in my ignored list! Already noticed!";
            }
            bot.sendMessage({
                to: channelID,
                message: msg,
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "addfavorite";
        if (command.substr(0, commWord.length) === commWord) {

            var params = command.substr(commWord.length, command.length);

            params = params.trim();
            if(params === ""){
                bot.sendMessage({
                    to: channelID,
                    message: "Fresia doesn't recognice that user!",
                    typing: TYPINGBOOL
                });
                return;
            }
            params = params.split(" ");
            params = clearSpaceFromArray(params);
            var id = params[0];
            id = id.trim();
            if(id.indexOf("<") === -1 || id.indexOf("@") === -1 || id.indexOf(">") === -1){
                bot.sendMessage({
                    to: channelID,
                    message: "Fresia doesn't recognice that user!",
                    typing: TYPINGBOOL
                });
                return;
            }
            id = id.replace(/[<>@]/g, "");


            if (checkPriorityList(serverIndex, id) >= 0) {
                bot.sendMessage({
                    to: channelID,
                    message: mention(id) + " is already my favorite!",
                    typing: TYPINGBOOL
                });
                return;
            }
            var name = "non";
            if (params.length === 2) {
                name = params[1];
            }
            var priority = {
                name: name,
                id: id
            }
            setting.servers[serverIndex].priorityIDs.push(priority);
            writeToSetting();
            bot.sendMessage({
                to: channelID,
                message: "Fresia now have a new favorite " + mention(id) + "!",
                typing: TYPINGBOOL
            });
            return;
        }

        commWord = "removefavorite";
        if (command.substr(0, commWord.length) === commWord) {
            var id = command.substr(commWord.length, command.length);
            id = id.trim();
            if(id === ""){
                bot.sendMessage({
                    to: channelID,
                    message: "Fresia doesn't recognice that user!",
                    typing: TYPINGBOOL
                });
                return;
            }
            if(id.indexOf("<") === -1 || id.indexOf("@") === -1 || id.indexOf(">") === -1){
                bot.sendMessage({
                    to: channelID,
                    message: "Fresia doesn't recognice that user!",
                    typing: TYPINGBOOL
                });
                return;
            }
            id = id.replace(/[<>@]/g, "");
            var msg = "";
            var checkedIndex = checkPriorityList(serverIndex, id);
            if (checkedIndex >= 0) {
                msg = "Fresia will not recognize " + mention(id) + " as my favorite anymore!";
                setting.servers[serverIndex].priorityIDs.splice(checkedIndex, 1);
                writeToSetting();
            }
            if (msg === "") {
                msg = "User not found in my list of favorite!!";
            }
            bot.sendMessage({
                to: channelID,
                message: msg,
                typing: TYPINGBOOL
            });
            return;
        }
    } else {
        var shouldReply = getRandom(0, 100);
        if (shouldReply < setting.servers[serverIndex].replyChance) {
            var words = message.split(" ");

            var repSet = getReplies();

            var randomReplyMode = [];
            if (setting.servers[serverIndex].all_mode) {
                randomReplyMode.push(0, 1, 2);
            } else {
                for (i = 0; i < setting.servers[serverIndex].reply_mode.length; i++) {
                    if (setting.servers[serverIndex].reply_mode[i].use) {
                        randomReplyMode.push(setting.servers[serverIndex].reply_mode[i].index);
                    }
                }
                if (randomReplyMode.length === 0) {
                    randomReplyMode.push(0);
                }
            }

            var result = "";
            var stop = false;

            repSet.messages = shuffleArray(repSet.messages);
            for (j = 0; j < repSet.messages.length; j++) {
                for (k = 0; k < repSet.messages[j].word.length; k++) {
                    if (repSet.messages[j].word[k].split(" ").length > 1) {
                        var replyTemp = repSet.messages[j].word[k];
                        if (message.indexOf(replyTemp) !== -1) {
                            result = getResult(randomReplyMode, repSet);
                            stop = true;
                            break;
                        }
                    } else {
                        for (i = 0; i < words.length; i++) {
                            if (words[i].toLowerCase() === repSet.messages[j].word[k]) {
                                result = getResult(randomReplyMode, repSet);
                                stop = true;
                                break;
                            }
                        }
                        if (stop) {
                            break;
                        }
                    }

                }
                if (stop) {
                    break;
                }
            }
            if (result == "^Error^") {
                return;
            }
            /*  var resultEmbed={
                  "embed":{
                      "description": setting.firstLetterCapital === false? result : result[0].toUpperCase() + result.substr(1, result.length-1)
                  },
                  "color": 62207
              }*/
            bot.sendMessage({
                to: channelID,
                message: setting.firstLetterCapital === false ? result : result[0].toUpperCase() + result.substr(1, result.length - 1),
                //  embed : resultEmbed,
                typing: TYPINGBOOL
            });
        }
    }






});

function clearSpaceFromArray(arr) {
    for (i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === '') {
            arr.splice(i, 1);
        }
    }
    return arr;
}

function checkIgnoreList(serverIndex, userid) {
    for (i = 0; i < setting.servers[serverIndex].ignoreIDs.length; i++) {
        if (setting.servers[serverIndex].ignoreIDs[i].id === userid) {
            return i;
        }
    }
    return -1;
}

function checkPriorityList(serverIndex, userid) {
    for (i = 0; i < setting.servers[serverIndex].priorityIDs.length; i++) {
        if (setting.servers[serverIndex].priorityIDs[i].id === userid) {

            return i;
        }
    }
    return -1;
}

function shuffleArray(arra1) {
    var ctr = arra1.length, temp, index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

function getResult(randomReplyMode, repSet) {
    try {
        var result = "";
        while (result === "") {
            var replyModeIndex = randomReplyMode[getRandom(0, randomReplyMode.length - 1)];
            var resultIndex = getRandom(0, repSet.messages[j].replies[replyModeIndex].length - 1)
            result = repSet.messages[j].replies[replyModeIndex][resultIndex];
        }
        return result;
    }
    catch (e) {
        console.log(e.message);
    }

    return "^Error^";
}
