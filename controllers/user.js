const User=require("../models/user");
const Vehicle = require("../models/vehicle");
const Travel = require("../models/Travel");

const SNCloud = require("../models/SNCloud");
const { validationResult } = require("express-validator");

exports.getIndex= async (req,res,next)=>{
    const vehicles= await Vehicle.find({ userId: req.user._id });
        res.render("user/index",{
            pageTitle:"Vehicle List",
            vehicles: vehicles,
            user:req.user,
        })
    
}
exports.getVehicleTravels=async (req,res,next)=>{
    const id = req.params.id;
    try {
        const vehicles = await Vehicle.find({ userId: req.user._id })
        const vehicle = await Vehicle.findById(id);

        res.render("user/vehicle-travels", {
            pageTitle: "Vehicle Travels",
            path:'/travels',
            vehicle: vehicle,
            vehicles: vehicles,
            user: req.user,

        })
    }catch (err) {
        console.log(err);
    }
    
}

exports.getVehicleDetails=async (req,res,next)=>{
    const id = req.params.id;
    try{
    const vehicles = await Vehicle.find({ userId: req.user._id });
    const vehicle= await Vehicle.findById(id)
        res.render("user/vehicle-details", {
          pageTitle: "Vehicle Details",
          path: "/details",
          vehicle: vehicle,
          vehicles: vehicles,
          user: req.user,
        });
    } catch (err) {
        console.log(err);
    }
}


exports.createTravel = async (req, res, next) => {
    const vehicleId = req.params.id;
    res.render("user/create-travel",{
        pageTitle: "Set travel details",
        vehicleId: vehicleId,
        oldInputs: {
            name: '',
            date: '',
            timeForLaunch:'',
        },
        user: req.user,
        errorMessage:'', 
            })
}

exports.postCreateTravel = async (req, res, next) => {
  const vehicleId = req.body.vehicleId;
  const name = req.body.name;
  const date = req.body.date;
    const time = req.body.timeForLaunch;
    if (!name || !date || !time) {
        return res.render("user/create-travel", {
          pageTitle: "Set travel details",
          vehicleId: vehicleId,
          oldInputs: {
            name: name,
            date: date,
            timeForLaunch: time,
          },
          user: req.user,
          errorMessage: "All fields are required!",
        });
    }
  req.session.travelData = {
    name: name, date: date, timeForLaunch: time, vehicleId:vehicleId
  };

  console.log(req.session);
    
    res.redirect('/set-route');
};
exports.SetRoute=(req,res,next)=>{
   res.render("user/set-route", {
        pageTitle: 'Set travel route',
        user: req.user,
    })
}

exports.postSetRoute = async(req, res, next)=> {
  const coordinates = req.body.coordinates;
  const distance = req.body.distance;
  const duration = req.body.duration;
  req.session.travel = { ... req.session.travelData, coordinates:coordinates, distance:distance, duration:duration };
  console.log(req.session);
  req.session.travelData = null;
  res.redirect("/create-travel/:id")

}

exports.getAddVehicle = (req, res, next) => {
  res.render("user/add-vehicle", {
    pageTitle: "Add vehicle",
    oldInputs: {
      name: "",
      serialNumber: "",
      type: "",
    },
    validationErrors: [],
    errorMessage: "",
    user: req.user,
  });
};

exports.postAddVehicle = async (req, res, next) => {
  const name = req.body.name;
  const serialNumber = req.body.serialNumber;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("user/add-vehicle", {
      pageTitle: "Add vehicle",
      oldInputs: {
        name: name,
        serialNumber: serialNumber,
      },
      validationErrors: errors.array(),
      errorMessage: "",
      user: req.user,
    });
    }
    try {
        const sn = await SNCloud.findOneAndDelete({ serialNumber: serialNumber })
        if (!sn) {
            return res.render("user/add-vehicle", {
                pageTitle: "Add vehicle",
                oldInputs: {
                    name: name,
                    serialNumber: serialNumber,
            
                },
                validationErrors: [],
                errorMessage: "Invalid Serial Number!",
                user: req.user,
            });
        }
        const vehicle = new Vehicle({
            name: name,
            serialNumber: serialNumber,
            type: sn.type,
            memorySize: sn.memorySize,
            batteryCapacity: sn.batteryCapacity,
            version: sn.version,
            sensors: sn.sensors,
            userId: req.user._id,
        });
        await vehicle.save();
     
        
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }

};

exports.getEditVehicle = async (req, res, next) => {
    const id = req.params.id;
    try{
    const vehicle = await Vehicle.findById(id);
    res.render("user/edit-vehicle", {
      pageTitle: "Edit vehicle",
      path: "/edit-vehicle",
      oldInputs: {
        name: vehicle.name,
        vehicleId: vehicle._id,
      },
      validationErrors: [],
      user: req.user,
    });
  } catch (err) {
        console.log(err);
    }
};

exports.postEditVehicle = async (req, res, next) => {
  const vehicleId = req.body.vehicleId;
  const name = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("user/edit-vehicle", {
      pageTitle: "Edit vehicle",
      oldInputs: {
          name: name,
          vehicleId:vehicleId
      },
      validationErrors: errors.array(),
      user:req.user, 
    });
    }
    try {
        const vehicle = await Vehicle.findById(vehicleId)
    
        if (vehicle.userId !== req.user._id) {
            res.redirect("/");
        }
        vehicle.name = name;
        await vehicle.save();

             res.redirect("/");
        
    } catch(err){
          console.log(err);
        };

}; 

exports.getProfileInfo = (req, res, next) => {
    res.render("user/profile-info", {
      pageTitle: "profile",
      user: req.user,
      oldInputs: {
        firstName: req.user.firstName,
          lastName: req.user.lastName,
        country:req.user.country,
        },   
      validationErrors:[],
    });
}
exports.postEditProfile = async (req, res, next) => {
    const userId = req.body.userId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const country = req.body.country;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("user/profile-info", {
            pageTitle: "profile",
            user: req.user,
            oldInputs: {
                firstName: firstName,
                lastName: lastName,
                country:country,
            },
            validationErrors:errors.array(),
        })
    }
    try {
        const user = await User.findById(userId)
        
        user.firstName = firstName;
        user.lastName = lastName;
        user.country = country;
        await user.save();
        
        res.redirect('/profile-info');
    
    } catch(err){
        console.log(err);
    };


}

exports.clearData = async (req, res, next) => {
    const userId = req.body.id;
    try {
      await Vehicle.deleteMany( userId );

      await Travel.deleteMany( userId );

      res.status(200).redirect("/");
    } catch (err) {
      console.log(err);
    }
}

exports.deleteAccount = async (req, res, next) => {
    const userId = req.body.userId;
    try {
        await Vehicle.deleteMany({ userId: userId });
        await Travel.deleteMany({ userId: userId });
        await User.deleteOne({ _id: userId });
        res.redirect("/signup");

    } catch (err) {
        console.log(err);
    }
}

exports.deleteVehicle = async (req, res, next) => {
    const vehicleId = req.body.vehicleId;
    try {
        await Vehicle.deleteOne({ _id: vehicleId })
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
}