const express = require('express')
const bp = require('body-parser')
const https = require('https')
const app = express()
const port = 3000
const date = require(__dirname + "/date.js")

const items = []
const workItems = []

app.use(bp.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', "ejs")

app.get("/", function(req,res){

let day = date.getDate()

 res.render('list',{listTitle: day, newListItems: items})

})

app.post("/", function(req,res){
  let item = req.body.newItem

  items.push(item)

  res.redirect('/')

})

app.get("/work", function(req,res){
  res.render('list', {listTitle: "Work Items", newListItems: workItems})
})

app.post("/work", function(req,res){

  let item = req.body.newListItems
  if(req.body.list ==="Work"){
    workItems.push(item)
    res.redirect('/work')
  } else{
    workItems.push(item)
    res.redirect('/')
  }

})

app.get("/about", function(req,res){
  res.render('about')
})




app.listen (port, function(req,res){
  console.log("Server running at port " + port)
})
