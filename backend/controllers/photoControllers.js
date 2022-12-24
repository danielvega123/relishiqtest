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
      var title = req.query["title"]
      var album_title = req.query["album.title"]
      var album_user_email = req.query["album.user.email"]
     
      var nestedInformation = {
        album: {},
        user:{},
        photo:{}
      } // Structure of the final response


      //Get the photo information
      var photos_collection = await getDataById("photos","")      
      var album_collection = await getDataById("albums","")      
      var user_collection = await getDataById("users","")      

      if (!photos_collection || !album_collection || !user_collection)return res.status(400).json({
        status: false,
        result: nestedInformation,
        message: "Unable to retrieved all the infomartion"
      })

      nestedInformation.photo = photos_collection.result // Assign to the response structure the data retrieved
      nestedInformation.album = album_collection.result // Assign to the response structure the data retrieved
      nestedInformation.user = user_collection.result // Assign to the response structure the data retrieved

      //First filter would be the album.user.email because is the root of the relation between the other collections
      if(album_user_email && album_user_email.trim().length > 0) nestedInformation.user = nestedInformation.user.filter(e=>e.email === album_user_email) //Filtering by tittle
      var userIds = [...new Set(nestedInformation.user.map(e=> e.id))] //Unique id's
      nestedInformation.album = nestedInformation.album.filter(e=>{
        return userIds.includes(e.userId)
      })

      //Second filter would be the album.title that is in the 2nd level
      if(album_title && album_title.trim().length > 0)nestedInformation.album = nestedInformation.album.filter(e=>e.title.includes(album_title.toLowerCase())) //Filtering by album.title
      var albumIds = [...new Set(nestedInformation.album.map(e=> e.id))] //Unique id's
      nestedInformation.photo = nestedInformation.photo.filter(e=>{
        return albumIds.includes(e.albumId)
      }) //Filtering by albums id's

      //Last filter would be the title of the photo
      if(title && title.trim().length > 0)nestedInformation.photo = nestedInformation.photo.filter(e=>e.title.includes(title.toLowerCase())) //Filtering by tittle
      
      
      //format the response
      
      return res.status(200).json(nestedInformation)
     
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
