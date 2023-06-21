const express=require("express");
const userController=require("../controllers/user");
const isAuth=require("../middlewares/is-auth");
const { body } = require("express-validator");

const router=express.Router();

router.get("/",isAuth,userController.getIndex);
router.get("/travels/:id",isAuth,userController.getVehicleTravels);
router.get("/details/:id", isAuth, userController.getVehicleDetails);
router.post("/delete-vehicle", isAuth, userController.deleteVehicle);
router.get("/profile-info", isAuth, userController.getProfileInfo);
router.post("/clear-data", isAuth, userController.clearData);
router.post("/delete-account", isAuth, userController.deleteAccount);
router.post(
  "/edit-profile",
  [
    body("firstName", "first name is required")
      .isAlpha()
      .isLength({ min: 1 })
      .trim(),
    body("lastName", "last name is required")
      .isAlpha()
      .isLength({ min: 1 })
      .trim(),
  ],
  isAuth,
  userController.postEditProfile
);
router.post("/create-travel",isAuth,userController.postCreateTravel);
router.get("/create-travel/:id", isAuth, userController.createTravel);
router.get("/set-route",isAuth,userController.SetRoute);
router.post("/set-route", isAuth, userController.postSetRoute);


router.get("/add-vehicle", isAuth, userController.getAddVehicle);
router.post(
  "/add-vehicle",
  [ 
    body(
      "name",
      "Name must contain at least 3 characters and cannot contain numbers"
    )
      .isAlpha()
      .trim()
      .isLength({ min: 3 }),
    body("serialNumber", "serial number cannot contain characters")
      .isInt()
      .trim(),
  ],
  isAuth,
  userController.postAddVehicle
);

router.get("/edit-vehicle/:id", isAuth, userController.getEditVehicle);
router.post(
  "/edit-vehicle",
  [
    body(
      "name",
      "Name must contain at least 3 characters and cannot contain numbers"
    )
      .isAlpha()
      .trim()
      .isLength({ min: 3 }),
  ],
  isAuth,
  userController.postEditVehicle
);



module.exports=router;