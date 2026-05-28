const {Event}=require("../models/event")


async function validate(req,res,next){
    try{
        const event=await Event.findById(req.params.id);
        if(!event)
        {
            return res.redirect('/event');
        }

        
        if(event.createdBy._id.toString()!==req.user._id && req.user.role!=="admin"){
            console.log(`${event.createdBy} and ${req.user._id}`)
            return res.redirect("/event/?msg=You Are Not allowed to manage the event")
        }

        next();

    }catch(error){
        console.log("Error in validate middleware ",error);
        res.send("ERROR DURING VALIDATION ");
    }
}

module.exports={validate};