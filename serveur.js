const express = require('express')
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require('cors')
let userModel = require('./models/user');
const { ClientRequest } = require('http');
app.use(express.json())
dotenv.config({path:'./config/.env'})
app.use(cors())

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, options)
  .then(() => console.log("Connected."))
  .catch((error) => console.log(`Error connecting to MongoDB ${error}`));


//GET______________________________
app.get('/get',function(req,res){
  userModel.find(function(err,val){
    res.send(val);
  })
})


//POST_______________________________
app.post("/post", async (req, res) => {
  console.log('inside post');
  const user = new userModel({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email
  });
  const val = await user.save();
  res.json(val);
})

//PUT______________________________________
app.put("/update/:id", async (req, res) => {
  const upid = req.params.id;
  const upname = req.body.name;
  const upemail = req.body.email;
  const upage = req.body.age
  userModel.findByIdAndUpdate(upid,
    { $set: { name: upname, email: upemail, "age":upage } },
    { new: true },
    (err, user) => {
      if (user == null) {
        res.send("nothing")
      } else {
        res.send(user)
      }
    })
})

//DELET_______________________________
app.delete("/del/:id",function(req,res){
  const delid=req.params.id;
  userModel.findByIdAndDelete(delid,function(err,doc){
    res.send(doc);
  })
})
app.listen(4000, () => console.log('app listening to port 4000'))