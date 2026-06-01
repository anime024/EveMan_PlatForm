const {Event}=require("../models/event")

const {User}=require("../models/user")

async function handleGetAllEvents(req, res) {
    try{
        const sort=req.query.sort;
        let sortOption={};
        if(sort==="newest")
        {
            sortOption={createdAt:-1}
        }
        else if(sort==="oldest")
        {
            sortOption={createdAt:1}
        }
        else if(sort==="category")
        {
            sortOption={category:1}
        }

        let filter={};
        if(req.user.role==="admin")
        {
            filter={};
        }
        else {
            filter={$or:[{visibility:"public"},{createdBy:req.user._id}]}
        }

        const allEvents=await Event.find(filter).sort(sortOption).populate("createdBy","_id name");
        const message=req.query.msg||null;
        return res.render("events/allEvents",{allEvents,message,user:req.user})
    }catch(error){
        console.log(`Error during getallEvents ${error}`);
        return res.send("ERROR CREATING EVENT ")
    }
}

async function handleGetCreateEventPage(req, res) {
  return res.render("events/createEvent", { message: null });
}

async function handlePostCreateEvent(req, res) {
    try{
        const {title,description,category,date,visibility}=req.body;

    if(!title || !description || !category || !date)
    {
        return res.render("events/createEvent",{message:"All fields are required"})
    }
    console.log(req.user)
    await Event.create({ title,description,category,date,visibility,createdBy:req.user._id })
    return res.redirect("/event/?msg=Event Created Successfully ");
    }catch(error){
        console.log(`Error during Event Creaation ${error}`);
        return res.send("ERROR CREATING EVENT")
    }
}

async function handleGetSingleEvent(req, res) {
    try{
        const event=await Event.findById(req.params.id).populate("createdBy","_id name").populate("media","url _id");
        if(!event)
        {
            return res.send("Event not found");
        }

        return res.render("events/singleEvent",{event,user:req.user});

    }catch(error){
        console.log(`ERROR IN SINGLE EVENT ${error}`);
        return res.send("Error getting single event");
    }
}
async function handleGetEditEventPage(req, res) {
    try{
        const event=await Event.findById(req.params.id);
        if(!event)
        {
            return res.send("Event not found for edit ");
        }
        return res.render("events/editEvent",{event});
    }catch(error){
        console.log(`ERROR IN  get Edit EVENT ${error}`);
        return res.send("Error in editing event");
    }
}
async function handlePostEditEvent(req, res) {
    try{
        const {title,description,category,date,visibility}=req.body;
        await Event.findByIdAndUpdate(req.params.id,{ title,description,category,date,visibility});
        return res.redirect(`/event/${req.params.id}`);
    } catch(error){
        console.log(`ERROR IN  post Edit EVENT ${error}`);
        return res.send("Error in  editing event");
    }
}
async function handlePostDeleteEvent(req, res) {
    try{

        const result=await Event.findByIdAndDelete(req.params.id);
        return res.redirect('/event/?msg=Event Deleted Succesfully ')
    }catch(error){
        console.log(`ERROR IN  deleting  EVENT ${error}`);
        return res.send("Error while  deleting event");
    }
}

module.exports = {
  handleGetAllEvents,
  handleGetCreateEventPage,
  handlePostCreateEvent,
  handleGetSingleEvent,
  handleGetEditEventPage,
  handlePostEditEvent,
  handlePostDeleteEvent,
};
