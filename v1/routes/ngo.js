var express=require("express");
var router=express.Router();
var Ngo=require("../models/ngo");
var middleware=require("../middleware/index.js");

router.get("/new_ngo",middleware.isLoggedIn,function(req,res){
  res.render("new_ngo");
});



router.get("/ngo", function (req, res) {

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      
      // Get (search)dogs from DB
      Ngo.find({$or:[{ name: regex},{location: regex}]}, function (err, allDogs) {
        if (err) {
          console.log("err");
        } else {
          if (allDogs.length < 1) {
          
            req.flash("error","No information found");
            res.redirect("dogs");
       
          }
          else{
          res.render("ngos", { ngos: allDogs });} 
        }
      });
  
      //get all dogs from DB
    } else {
      Ngo.find({}, function (err, allDogs) {
        if (err) {
          console.log(err);
        } else {
          res.render("ngos", { ngos: allDogs });
        }
      });
    }
  
  });



//CREATE-add a new dog to DB
//CREATE - add new dog to DB
router.post("/ngo", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name= req.body.name;
    var image = req.body.image;
    var email=req.body.email;
    var phone=req.body.phone;
    var description = req.body.description;
    var location=req.body.location;
    var mapUrl=req.body.mapUrl;
   
  
      var newNgo = {name: name, image: image,email:email ,description: description,phone:phone,location:location,mapUrl:mapUrl};
      // Create a new dog and save to DB
      Ngo.create(newNgo, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              //redirect back to dogs page
              console.log(newlyCreated);
              res.redirect("/ngo");
          }
      });
    });
  





    router.get("/ngo/:id", function(req, res) {
        Ngo.findById(req.params.id)
          .exec(function(err, foundDog) {
            if (err || !foundDog) {
              console.log(err);
              req.flash("error", "Sorry, that dog does not exist!");
              return res.render("error");
            }
            
      
            foundDog.save();
            res.render("show_ngo", {
              ngo: foundDog
            });
          });
      });    



module.exports=router;