const fs = require('fs')

function parse(msg){
    var msgJson = {
        "name": msg.split(']')[1].split(': ')[0],
        "body":  msg.split(']')[1].split(': ')[1],
        "time": msg.split(']')[0].substr(1).split(', ')[1],
        "date": msg.split(']')[0].substr(1).split(', ')[0]
    }
    return msgJson
}

function JSONify(chat){
    var msgs = chat.split(/[\r\n]+/)
    var chatJson = []
    let i = 0
    msgs.forEach(msg => {
        let msgJson = parse(msg)
        chatJson[i++] = msgJson
    });
    return chatJson
}

function chatHTML(chat){
    var html = ""
    for(let i=0; i<chat.length; i++) {
        var nameHeading = '<h2>'+chat[i].name+'</h2>'
        var msgBody = '<p>'+chat[i].body+'</p>'
        html += nameHeading + '\n' + msgBody + '\n'
    }
    return html
}
function getHTML(chatBody){
    var html = ""
    var template = fs.readFileSync('./chat/html/template.html').toString()
    template = template.split('$')
    for(let i=0; i<template.length; i++){
        if(template[i]==='chatBody'){
            html += chatBody
        }
        else { html+= template[i] }
    }
    return html
}
exports.WaChat = (name) => {
    var chat = fs.readFileSync('./chat/texts/'+name+'.txt').toString()
    var chatJson = JSONify(chat)
    var chatBody = chatHTML(chatJson)
    var fullHTML = getHTML(chatBody)
    fs.writeFileSync('./chat/chats/'+name+'.html',fullHTML)
}