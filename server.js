// the dependencies 
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
function getNotes(){
    return readFile('db/db.json','utf-8').then(notes => [].concat(JSON.parse(notes)))
}

//creating the express app 
const app = express();
const PORT = process.env.PORT||3001
app.use(express.json())
app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/index.html'))
})
app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/notes.html'))
})
app.get('/api/notes',(req,res)=>{
    getNotes().then(notes => res.json(notes))
})
app.post('/api/notes',(req,res)=>{
    getNotes().then(oldNotes=>{
        let Note ={
            title:req.body.title, text:req.body.text
        }
        let newNote =[...oldNotes,Note]
        writeFile('db/db.json', JSON.stringify(newNote)).then(()=> res.json({msg:'okay'}))
    })
})
app.listen(PORT,()=> console.log('http://localhost:3001'))