const express = require('express')
const bp = require('body-parser')
const mongoose = require('mongoose') //Mongoose para Base de datos
const https = require('https')
const _ = require('lodash')
const app = express()
const port = process.env.PORT




app.use(bp.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', "ejs")

mongoose.connect('mongodb://localhost:27017/dooitDB', { useUnifiedTopology: true, useNewUrlParser: true })

const itemsSchema = {
    name: String
}

const Item = mongoose.model('Item', itemsSchema)

const item1 = new Item({
  name:""
})

const DefaultItems = [item1]

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model('List', listSchema)

app.get("/", function(req,res){



    Item.find({}, function(err,foundItems){

      if(foundItems.length === 0){
        Item.insertMany(DefaultItems, function(err){
          if(err){
            console.log(err)
          } else {
            console.log("Success!")
          }
        })
        res.redirect('/')
      } else {
        res.render('list',{listTitle: 'Default', newListItems: foundItems})

      }

    })
})

app.post("/", function(req,res){
  const itemName = req.body.newItem
  const listName = req.body.list

  const item = new Item({
    name: itemName
  })

  if(listName === 'Default'){
    item.save()
    res.redirect('/')
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item)
      foundList.save()
      res.redirect('/' + listName)
    })
  }


})

app.post('/delete', function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName

  if (listName === 'Default') {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("Successfully deleted Check item");
        res.redirect('/')
      }
    })
  } else {
    List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect('/' + listName)
      }
    })
  }


})

app.get('/:customListName', function(req,res){
  const customListName = _.capitalize(req.params.customListName)

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //crear nueva Lista
        const list = new List({
          name: customListName,
          items: DefaultItems
        })

        list.save()
        res.redirect('/' + customListName)
      } else {
      //mostrar la lista existente
      res.render('list',{listTitle: foundList.name ,newListItems: foundList.items})
      }
    }
  })



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




app.listen (port || 3000, function(req,res){
  console.log("Server running at port " + port)
})
