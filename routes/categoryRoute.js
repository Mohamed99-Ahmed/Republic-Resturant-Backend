const express = require('express');
const router = express.Router(); // router instead of app

const { getAllCategories,getspeceficCategory,updateSpeceficCategory,deleteSpeceficCategory} = require('../controllers/categoryControllers');

router.route('/').get(getAllCategories);
router.route('/:idCategory')
        .get(getspeceficCategory)
        .patch(updateSpeceficCategory)
        .delete(deleteSpeceficCategory)

module.exports = router;