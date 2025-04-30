const factory = require("./handlerFactory");
const { Product } = require("../models/productsModel");
const multer = require("multer");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const httpStataus = require("../utils/httpStatusText");
// const sharp = require("sharp");
const imagekit = require("../utils/imagekit");
const streamifier = require("streamifier"); // لتحويل Buffer إلى Stream

// get All products
exports.getAllProducts = factory.getAll(Product);
// get specefic products
exports.getspeceficProduct = factory.getOne(Product, { path: "category" });

// updateS pecefic products
const multerStorage = multer.memoryStorage(); // Store files in memory as Buffer objects
const multerFilter = (req, file, cb) => {
  // if file is image return true so save image
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadProductImage = upload.single("imageCover"); // field name in form is imageCover
exports.resizeProductPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); // if no file in request so go to next middleware

  const fileBufferStream = streamifier.createReadStream(req.file.buffer);

  let bufferData = [];
  fileBufferStream.on("data", (chunk) => {
    bufferData.push(chunk);
  });

  fileBufferStream.on("end", async () => {
    const finalBuffer = Buffer.concat(bufferData);

    try {
      const response = await imagekit.upload({
        file: finalBuffer.toString("base64"), // لازم يكون base64
        fileName: `product-${req.user.id}-${Date.now()}.jpeg`,
        folder: "/RebublicImgs/uploads/products", // optional, specify the folder name in ImageKit
      });

      req.file.filename = response.url; // نحط رابط الصورة عشان نحفظه مع المنتج
      next();
    } catch (error) {
      console.error(error);
      return next(new ApiError("ImageKit Upload Error", 500));
    }
  });

  // req.file.filename = `product-${req.user.id}-${Date.now()}.jpeg`;
  // await sharp(req.file.buffer)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 }) // the quality of image that i want
  //   .toFile(`public/imgs/products/${req.file.filename}`); // the place of imgs of user that i want to save it
  // next();
});

exports.updateSpeceficProduct = catchAsync(async (req, res, next) => {
  const newObj = { ...req.body };
  console.log(newObj);
  if (req.file) newObj.imageCover = req.file.filename;
  const product = await Product.findByIdAndUpdate(req.params.id, newObj, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new ApiError("product id is not updated", 404));
  }

  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      data: product,
    },
  });
});

// delete specific product
exports.deleteSpeceficProduct = factory.deleteOne(Product);
// create new product
exports.createProduct = factory.createOne(Product);
