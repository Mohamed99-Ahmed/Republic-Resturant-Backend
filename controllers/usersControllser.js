const { User } = require("../models/usersModel");
const factory = require("./handlerFactory");
const multer = require("multer")
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const sharp = require("sharp");
 /*  */
 const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj; // return the new boj that it have  allowedFields
  };
const multerStorage = multer.memoryStorage() // Store files in memory as Buffer objects
const multerFilter = (req, file, cb) => {
    // if file is image return true so save image 
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('Not an image! Please upload only images.', 400), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  }) 
exports.uploadUserPhoto = upload.single("photo")  // the field name in form request => photo this is function return middleware
exports.resizeUserPhoto = catchAsync(async (req, res,next)=>{
    if(!req.file) return next() // if no file in request so go to next middleware
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 }) // the quality of image that i want
      .toFile(`public/imgs/users/${req.file.filename}`); // the place of imgs of user that i want to save it
    next()
})
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.rePassword) {
      return next(
        new ApiError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
  
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email',"phone", "location"); // (name, email, phone , location) only can updated
    if (req.file) filteredBody.photo = req.file.filename; // if you want update photo add to filterBody 
  
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });
/* */
// Makeing api more good (filter, sort, pagination)
// get All Users
exports.getallUsers = factory.getAll(User);
// get specefic user
exports.getspeceficUser = factory.getOne(User);
// updateMe user   (req.user come from middelware of protect function)

// delete specific User
exports.deleteSpecUser = factory.deleteOne(User);
