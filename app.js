import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { title } from "process";

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));


app.use(bodyParser.urlencoded({ extended: true}))

mongoose.connect('mongodb://localhost:27017/wikiDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const articleSchema = new mongoose.Schema({
    title: String,
    content: "String"
})

const Article = mongoose.model("Article", articleSchema);


app.route("/articles")


.get(async (req,res)=>{
  const articleFound = await Article.find()
  res.send(articleFound)
   
})

.post((req,res) => {
  const postTitle = req.body.title  ;
  const postContent = req.body.content;
  
  if(Article.insertMany([{title: postTitle, content: postContent}])){
    res.send("success")
  }
  else{
    res.send("Unsuccess")
  }

  console.log(postContent)
  

})


app.route("/articles/:articleName")
.get( async (req,res) => {
  
  const articlePath = `${req.params.articleName}`;
  console.log(articlePath)
  if ((await Article.findOne({title : articlePath}))){
    res.send(await Article.findOne({title : articlePath}))
  } else{
    res.send("No Article Found")
  }
  
})


.put( async (req,res) => {

  await Article.updateOne({ title: req.params.articleName },
    
    {title: req.body.title, 
    content: req.body.content}
    );

} )

.patch( async (req, res) => {
  if(await Article.updateOne({ title: req.params.articleName },
    
    {$set: req.body})){
      res.send("Success Fully Updated The Content")
    }

  else{
    res.send("Sorry Unable To Update")
  }


})

.delete(async (req, res) => {
  if (await Article.deleteOne({title: req.params.articleName})){
   res.send("Successfully Deleted")
  }
  else{
    res.send("Unable To Delete")
  }

  

})



app.listen(PORT, ()=> {
    console.log(`Server Started On Port: ${PORT}`)

})