
var express=require("express");
var app=express();
var bodyParser=require("body-parser"); 
var Dog=require("./models/dog");
var Comment=require("./models/comment");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var methodOverride=require("method-override");
var flash=require("connect-flash");


var CommentRoutes=require("./routes/comments"),
    dogRoutes    =require("./routes/dogs"),
    indexRoutes  =require("./routes/index"),
    ngoRoutes    =require("./routes/ngo");


// monogoose part tp connect monodb
var mongoose = require('mongoose');
var MONGODB_URI='mongodb+srv://siddharth:siddharth888@cluster0-ad5ly.mongodb.net/test?retryWrites=true&w=majority';
mongoose.set('useFindAndModify', false);

mongoose.connect(MONGODB_URI || 'mongodb://localhost/golden_paws',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected',()=> {
    console.log('mongoose is connected!!!');
});


//

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(methodOverride("_method"));
//SCHEMA SETUP


// For 1ST DATA
/*
Dog.create(
    {
      breed:"Siberian Husky",
      image:"https://bowwowinsurance.com.au/wp-content/uploads/2018/10/siberian-husky-sitting-isolated-700x700.jpg",
      description:"The Siberian Husky is a gentle but strong medium sized dog.  They are best known as working sled dogs but they are popular all around the world.  These fun loving dogs come in a variety of colours including piebald, black and white, red and white, brown, grey, silver, red-orange.  Their eyes can be half blue and half brown or they can have one brown eye and one blue eye.  It could be said that their haunting eyes are one of their most distinctive features.Their medium length double coat can withstand temperatures well below freezing, but they are also comfortable in warmer climates.  Siberian Huskies do shed a large amount of hair so regular brushing is a must.They blow their coats twice a year and that’s when you will see what shedding it all about.  The Husky has two coats, one topcoat made of long water repellent fur that insulates the dog from heat and cold and a fluffy undercoat.Huskies need plenty of exercise and they are also escape artists so it is recommend that they be kept in yards with six foot and over fences.  They do enjoy the company of other dogs and if left home alone for long periods they will become bored and start to destroy things because like a lot of other working dogs they like to keep busy.They love exercise but can overheat in warmer climates when exercising.  They are ideal companions for families with older children and singles who have heaps of energy to burn.Male Siberian Huskies usually weigh between 20 and 27 kg and stand at an average of 58 cm tall.  Females weigh between 16 and 23 kg and stand at about 54 cm tall.The average lifespan of a Siberian Husky is around 12-15 years."
    },function(err,dog){
      if(err){
          console.log(err);
      } else{
        Comment.create({
          text:"This dog is really very nice to play with",
          author:"Homer"
        },function(err,comment){
          if(err)
          {
            console.log(err);
          }
          else{
          dog.comments.push(comment);
          dog.save();
          }
        });
          console.log("NEWLY CREATED DOG");
          console.log(dog);  
      }
    
});

*/





/*var dogs=[
    {breed:"Siberian Husky",image:"https://bowwowinsurance.com.au/wp-content/uploads/2018/10/siberian-husky-sitting-isolated-700x700.jpg"},
    {breed:"Lebrador Retriever",image:"https://bowwowinsurance.com.au/wp-content/uploads/2018/10/chocolate-labrador-700x700.jpg"},
    {breed:"Golden Retriever",image:"https://bowwowinsurance.com.au/wp-content/uploads/2018/10/golden-retriever-700x700.jpg"},
    {breed:"Alaskan Malamute",image:"https://bowwowinsurance.com.au/wp-content/uploads/2018/10/alaskan-malamute-700x700.jpg"},
    {breed:"Rottweiler",image:"https://bowwowinsurance.com.au/wp-content/uploads/2018/10/rottweiler-700x700.jpg"},
];*/

//PASSPORT Configuration
app.use(require("express-session")({
  secret:"Siberian Husky is the best",
  resave: false,
  saveUninitialized: false
}));
app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//PASSPORT ENDS
//flash
app.use(flash());
//

app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
});

//adding stylesheets
app.use(express.static(__dirname + "/public"));
//
app.use(indexRoutes);
app.use(dogRoutes);
app.use(CommentRoutes);
app.use(ngoRoutes);





app.listen(8000, function(){
    console.log("The GoldenPaws Server has Started")
});