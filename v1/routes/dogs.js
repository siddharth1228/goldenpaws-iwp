var express=require("express");
var router=express.Router();
var Dog=require("../models/dog");
var middleware=require("../middleware/index.js");

//upload through cloudinary
var multer = require("multer");
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

var upload = multer({
  storage: storage,
  fileFilter: imageFilter
});

var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dl182kpmu",
  api_key:"838477746566299",
  api_secret:"MssIK5Mqny5Uzs7XwC1I3Tkb1fg"
});



//upload image ends

router.get("/dogs", function (req, res) {

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    
    // Get (search)dogs from DB
    Dog.find({$or:[{ breed: regex},{location: regex}]}, function (err, allDogs) {
      if (err) {
        console.log("err");
      } else {
        if (allDogs.length < 1) {
        
          req.flash("error","No information found");
          res.redirect("dogs");
     
        }
        else{
        res.render("dogs", { dogs: allDogs });} 
      }
    });

    //get all dogs from DB
  } else {
    Dog.find({}, function (err, allDogs) {
      if (err) {
        console.log(err);
      } else {
        res.render("dogs", { dogs: allDogs });
      }
    });
  }

});

//CREATE-add a new dog to DB
//CREATE - add new dog to DB
router.post("/dogs", middleware.isLoggedIn, upload.single("image"),function(req, res){
  // get data from form and add to dogs array
  
  cloudinary.v2.uploader.upload(
    req.file.path,
    {
      width: 700,
      height: 700,
      crop: "scale"
    },
    function (err, result) {
      if (err) {
        req.flash("error", err.message);
        return res.render("login");
      }

      var breed = req.body.breed;
      var image = result.secure_url;
      var imageId = result.public_id;
      var email = req.body.email;
      var phone = req.body.phone;
      var description = req.body.description;
      var price = req.body.price;
      if(price<0)
      {
        price=0;
      }
      var location = req.body.location;
      var author = {
        id: req.user._id,
        username: req.user.username
      }

      var newDog = { breed: breed, image: image, imageId, email: email, description: description, author: author, price: price, phone: phone, location: location };
      // Create a new dog and save to DB
      Dog.create(newDog, function (err, newlyCreated) {
        if (err) {
          console.log(err);
        } else {
          //redirect back to dogs page
          console.log(newlyCreated);
          res.redirect("/dogs");
        }

      });
    },
    {
      moderation: "webpurify"
    }
  );
});

//NEW-show form to create new dog

router.get("/dogs/new_dog",middleware.isLoggedIn,function(req,res){
    res.render("new_dog");
});
  

 
// Show dog

router.get("/dogs/:id", function(req, res) {
  Dog.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundDog) {
      if (err || !foundDog) {
        console.log(err);
        req.flash("error", "Sorry, that dog does not exist!");
        return res.render("landing");
      }
      var ratingsArray = [];

      foundDog.comments.forEach(function(rating) {
        ratingsArray.push(rating.rating);
      });
      if (ratingsArray.length === 0) {
        foundDog.rateAvg = 0;
      } else {
        var ratings = ratingsArray.reduce(function(total, rating) {
          return total + rating;
        });
        foundDog.rateAvg = ratings / foundDog.comments.length;
        foundDog.rateCount = foundDog.comments.length;
      }
      foundDog.save();
      res.render("show", {
        dog: foundDog
      });
    });
});
//EDIT DOG ROUTE
router.get("/dogs/:id/edit_dog",middleware.checkDogOwnership,middleware.isLoggedIn,function(req,res){
  Dog.findById(req.params.id,function(err,foundDog){
      res.render("edit_dog",{dog:foundDog});
    
  });
 
});

// UPDATE DOG ROUTE
router.put("/dogs/:id",upload.single("image") ,middleware.checkDogOwnership, function(req, res){
 

    Dog.findByIdAndUpdate(req.params.id, req.body.dog, async function(err, dog){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {

          if (req.file) {
            try {
              await cloudinary.v2.uploader.destroy(dog.imageId);
              var result = await cloudinary.v2.uploader.upload(
                req.file.path,
                {
                  width: 700,
                  height: 700,
                  crop: "scale"
                },

                function(err,result) { console.log(result)}
              );
              dog.imageId = result.public_id;
              dog.image = result.secure_url;
            } catch (err) {
              req.flash("error", err.message);
              console.log(err.message);
              return res.render("login");
            }
          }
          dog.save();

            req.flash("success","Successfully Updated!");
            res.redirect("/dogs/" + dog._id);
        }
    });
  });


//DESTROY DOG ROUTE
router.delete("/dogs/:id",middleware.checkDogOwnership,middleware.isLoggedIn,function(req,res){
  Dog.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/dogs");
    }
    else{
      res.redirect("/dogs")
    }
  })
})

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;