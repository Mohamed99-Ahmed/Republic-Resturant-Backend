const express = require('express');
const router = express.Router(); // router instead of app

const { getAllStores,getspeceficStore,updateSpeceficStore,createStore,deleteSpeceficStore} = require('../controllers/storesControllser');

router.route('/')
        .get(getAllStores)
        .post(createStore);
router.route('/:idStore')
        .get(getspeceficStore)
        .patch(updateSpeceficStore)
        .delete(deleteSpeceficStore)

module.exports = router;