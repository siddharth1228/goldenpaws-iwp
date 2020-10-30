// middlewares
var Dog=require("../models/dog");
var Comment = require("../models/comment");
//DogOwenership
var middlewareObj={};
middlewareObj.checkDogOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Dog.findById(req.params.id, function (err, foundDog) {
            if (err) {
                res.redirect("back");

            }
            else {
                if (foundDog.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error","You don't have the permission");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error","You need to logged in First");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    }
    req.flash("error","Please Login First!");
    res.redirect("/login");

}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Sorry, that comment does not exist!");
        res.redirect("/dogs");
      } else if (
        foundComment.author.id.equals(req.user._id) 
        
      ) {
        req.comment = foundComment;
        next();
      } else {
        req.flash("error", "You don't have permission to do that!");
        res.redirect("/dogs/" + req.params.id);
      }
    });
  };


module.exports=middlewareObj;