/**
 * Summary (Handle the request related to the user, album and photos information.
 *          )
 *
 * Description. (Endpoint that allows the management of the user information.)
 *
 * @class
 * @author Daniel Vega.
 * @since  1.0.0
 */

const {request} = require("../utils/requestHandler")
const {getDataById} = require("./userhandler")

/**
 *
 * Description. (Get user information by applying filter by (photo_id) sent as parameter)
 *
 * @since      1.0.0
 * @param {Object} req           HTTP request information.
 * @param {Object} res           HTTP response information.
 *
 */
exports.getbyID = async function (req, res) {
    try {   
      var photo_id = req.params.photo_id
      
      if(!isNumeric(photo_id)) return res.status(400).json({
        status:false,
        message: `only integers allowed, found [${photo_id}] value`
      })

      var nestedInformation = {
        album: {},
        user:{},
        photo:{}
      } // Structure of the final response


      //Get the photo information
      var response = await getDataById("photos",photo_id)      
      if(!response.status) return res.status(400).json({
        status: false,
        result: nestedInformation,
        message: response.message
      })
      nestedInformation.photo = JSON.parse(JSON.stringify(response.result))

      //Get the album information      
      var response = await getDataById("albums",nestedInformation.photo.albumId)
      if(!response.status) return res.status(400).json({
        status: false,
        result: nestedInformation,
        message: response.message
      })
      nestedInformation.album = JSON.parse(JSON.stringify(response.result))

      //Get the user information      
      var response = await getDataById("users",nestedInformation.album.userId)
      if(!response.status) return res.status(400).json({
        status: false,
        result: nestedInformation,
        message: response.message
      })
      nestedInformation.user = JSON.parse(JSON.stringify(response.result))
      
      //format the response
      var jsonFinal = {}      
      delete nestedInformation.photo["albumId"]
      delete nestedInformation.photo["status"]
      delete nestedInformation.album["userId"]
      delete nestedInformation.album["status"]
      delete nestedInformation.user["status"]

      jsonFinal = {...nestedInformation.photo}
      jsonFinal["album"] = nestedInformation.album
      jsonFinal["album"]["user"] = nestedInformation.user
      
      return res.status(200).json(jsonFinal)
     
    } catch (err) {
    console.log("Class: usercontrollers, method: get", [err])
      res.status(500).json({
        status: false,
        message: 'Internal Error'
      })
    }
}

/**
 *
 * Description. (Get user information by applying filter by (photo_id) sent as parameter)
 *
 * @since      1.0.0
 * @param {Object} req           HTTP request information.
 * @param {Object} res           HTTP response information.
 *
 */
exports.getbyFilter = async function (req, res) {
    try {   
      var title = req.query.title
     
     
      var nestedInformation = {
        album: {},
        user:{},
        photo:{}
      } // Structure of the final response


      //Get the photo information
      var response = await getDataById("photos","")      
      if(!response.status) return res.status(400).json({
        status: false,
        result: nestedInformation,
        message: response.message
      })

      var result = response.result
      result = result.filter(e=>e.title.includes(title.toLowerCase()))

      nestedInformation.photo = JSON.parse(JSON.stringify(response.result))
      var results = resp
       return res.status(400).json({
        status: false,
        result: nestedInformation,
        message: response.message
      })
      if(!response.status) return res.status(400).json({
        status: false,
        result: nestedInformation,
        message: response.message
      })
      nestedInformation.photo = JSON.parse(JSON.stringify(response.result))

      //Get the album information      
      var response = await getDataById("albums",nestedInformation.photo.albumId)
      if(!response.status) return res.status(400).json({
        status: false,
        result: nestedInformation,
        message: response.message
      })
      nestedInformation.album = JSON.parse(JSON.stringify(response.result))

      //Get the user information      
      var response = await getDataById("users",nestedInformation.album.userId)
      if(!response.status) return res.status(400).json({
        status: false,
        result: nestedInformation,
        message: response.message
      })
      nestedInformation.user = JSON.parse(JSON.stringify(response.result))
      
      //format the response
      var jsonFinal = {}      
      delete nestedInformation.photo["albumId"]
      delete nestedInformation.photo["status"]
      delete nestedInformation.album["userId"]
      delete nestedInformation.album["status"]
      delete nestedInformation.user["status"]

      jsonFinal = {...nestedInformation.photo}
      jsonFinal["album"] = nestedInformation.album
      jsonFinal["album"]["user"] = nestedInformation.user
      
      return res.status(200).json(jsonFinal)
     
    } catch (err) {
    console.log("Class: usercontrollers, method: get", [err])
      res.status(500).json({
        status: false,
        message: 'Internal Error'
      })
    }
}



function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
