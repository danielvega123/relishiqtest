/**
 * Summary (Handle the request related to the user.
 *          )
 *
 * Description. (Endpoint that allows the management of the user information.)
 *
 * @class
 * @author Daniel Vega.
 * @since  1.0.0
 */

const {request} = require("../utils/requestHandler")


/**
 *
 * Description. (Get user information by applying filter by (photo_id) sent as parameter)
 *
 * @since      1.0.0
 * @param {Object} req           HTTP request information.
 * @param {Object} res           HTTP response information.
 *
 */
exports.getDataById = async function (endpoint,id) {
    try {   
      var _request = new request(`https://jsonplaceholder.typicode.com/${endpoint}${!id ?  "" : `/${id}` }`,{},"get")      
      var result = await _request.handleRequest()
      if (typeof result === 'string' || result instanceof String){
        return {
          status: false,
          result: [],
          message: result,
          statusCode: 400
        }     
      }
      return {
        status: true,
        result,
        message: "",
        statusCode: 200
      }     
    } catch (err) {
      console.log("Class: userHandler, method: getDataById", [err])
      return {
        status: false,
        message: "Internal Error",
        statusCode: 500
      } 
    }
}

