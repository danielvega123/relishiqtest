/**
 * Summary (URL Management)
 *
 * Description. (Management of the name of the URL that would be exposed
 *              )
 *
 * @class
 * @author Daniel Vega.
 * @since  1.0.0
 */
const router = require('express').Router() // Se utiliza el objeto Router para realizar la definicion de rutas

//Controllers
const photoController = require("../controllers/photoControllers")
 


//URL
const prefix_url = process.env.PREFIX
router.route(`/${prefix_url}/photos/:photo_id`).get(photoController.getbyID)
router.route(`/${prefix_url}/photos`).get(photoController.getbyFilter)


  // Export API routes
  module.exports = router
 