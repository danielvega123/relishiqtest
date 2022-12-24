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
 * Description. (Returns the information based on the parameters sent)
 *
 * @since      1.0.0
 * @param {String} endpoint     Endpoint name to which the request will be made.
 * @param {String} id           Id to search, this parameter is optional, if a specific document is sent it is searched, otherwise the entire list will be returned.
 *
 * @returns {Object} Response information
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

