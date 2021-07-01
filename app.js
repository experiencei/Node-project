const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const _ = require("lodash")

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/TodoDB", { useNewUrlParser: true , useUnifiedTopology: true});
 
const itemschema = ({
  name : String,
})  
const item = mongoose.model("item" , itemschema);

const one = new item ({
  name : "we are doing good",
});
const two = new item ({
  name : "we are doing great",
});
const three = new item ({
  name : "we are doing gudder",
});
 
const allModel = [one , two ,three];

const listschema = ({
  name :String,
  items :[itemschema]
})

const list = mongoose.model("list" , listschema);


app.get("/", function(req, res) { 

  item.find({} , (err ,foundItems)=>{
    
   if (foundItems.length === 0) {
    item.insertMany(allModel , (err)=>{
      if (err) {
        console.log("error occured");
      } else {
        console.log("Successfully saved!"); 
      }
    });
    res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems:foundItems});
    }
  })
  
});

app.post("/", function(req, res){

 const itemName = req.body.newItem;
 const listName = req.body.list;
 const four = new item ({
  name : itemName,
})
 if (listName === "Today") {
  four.save();
  res.redirect("/")
 } else {
  list.findOne({name :listName} , (err , foundList)=>{
    foundList.items.push(four)
    foundList.save()
    res.redirect("/" + listName )
  })
 }
});

app.post("/delete" , (req , res)=>{
  const checked = req.body.checkbox;
  const listNme = req.body.method;

  if (listNme === "Today" ) {
    item.findByIdAndRemove( checked , (err)=>{
      if (err) {
        console.log(`error occured check ${err}`);
      }
     })
     res.redirect("/")
  } else {
    list.findOneAndUpdate({name:listNme }, {$pull :{items :{_id : checked }}}, (err , foundItem )=>{
      if (!err) {
        console.log("No error Occured");
        res.redirect("/" + listNme);
      }
    } )
  }
  
})

app.get("/:work", function(req,res){
  const wrk = _.capitalize(req .params.work)
   
   list.findOne({ name : wrk}, (err , findLists)=>{
     if(!err){
       if (!findLists) {
        const five = new list({
          name : wrk,
          items: allModel
        })
        five.save();
        res.redirect(`/${wrk}`)
       }
      else{
        res.render("list", {listTitle: findLists.name , newListItems:findLists.items});
      }
     
     }
     
   })
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
