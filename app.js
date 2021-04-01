//1. requiring modules that we installed through terminal
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//2. creating new app instance using express
const app = express();

//3. setting view engine to use EJS as templating engine
app.set('view engine', 'ejs');

//4. use bodyParser in order to use pass the requests
app.use(bodyParser.urlencoded({extended: true}));

//5. use the public directory to store static files(images and css code)
app.use(express.static("public"));

//7. connect to the ususal mongodb location
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

//8. create schema
const wikiSchema = {
  title: String,
  content: String
};

//9. create model
const Article = mongoose.model("article", wikiSchema);


/////////////////////////////////Requests Targeting all articles//////////////////
app.route("/articles")

.get(function(req, res){
  //10. tap into the model and find the documents that match a particular condtion
  //leave that condition empty and that will find us everything inside a particular colletion
  Article.find(function(err,foundArticles){
    //11. error 처리
    if(!err){
    res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})

.post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

//12. save new object into our database
  const newArticle = new Article ({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted a new article.");
    }else{
      res.send(err);
    }
  });
});

/////////////////////////////////13. Requests Targeting specific articles//////////////////
//route parameters is where inside that particular URL we added in a colon and then a variable name which we will assign to whatever the client assigns to their URL request.
app.route("/articles/:articlesTitle")

.get(function(req,res){

  //14. read from the database to look for a specific article using app.findOne()
  //route parameters로 값을 받아올때는 req.params.사용자가입력한값을 사용하면 된다!!
  Article.findOne({title:req.params.articlesTitle},function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle)
    }else{
      res.send("No articles matching that title was found.");
    }
  });
})

//15. handling put requests on a specific resource
.put(function(req,res){
  Article.update(
    {title: req.params.articlesTitle},
    //클라이언트가 입력한 title과 content를 bodyParser로 받아온다.
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }
    }
  );
})

//16. update particular article but only the fields that we acutally provided data for
.patch(function(req,res){
  Article.update(
    {title: req.params.articlesTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }else{
        res.send(err);
      }
    }
  );
})

//17. delete particular article
.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articlesTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the corresponding article.");
      }else{
        res.send(err);
      }
    }
  );
});


//6. set up the app to listen on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
