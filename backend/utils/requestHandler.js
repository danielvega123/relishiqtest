/**
 * Summary (Request management)
 *
 * Description. (Handle different types of requests and act on the method sent)
 *
 * @class
 * @author Daniel Vega.
 * @since  1.0.0
 */

const axios = require("axios");

class request {
  constructor(url, body, type) {
    this.url = url;
    this.body = body;
    this.type = type;
  }

  async handleRequest() {
    switch (this.type.toUpperCase()) {
      case "POST":
        return await this.Post();
      case "GET":
        return await this.Get();
      case "PUT":
        return await this.Put();
    }
  }

  async Get() {
    try {
      var response = "";
      await axios
        .get(`${this.url}`, {})
        .then((res) => {
          if (res.status === 200) {
            response = res.data;
            response.status = 200;
          }
        })
        .catch((error) => {
          console.log(
            console.log("Class: requestHandler, method: axios-get", [error])
          );
          switch (error.response.status) {
            case 404:
              response = "Object not found";
              break;
            case 500:
              response = "Internal Error";
              break;
          }
        });
      return response;
    } catch (error) {
      console.log(console.log("Class: requestHandler, method: Get", [error]));
      return undefined;
    }
  }

  async Post() {
    try {
        var response = "";
        await axios
          .post(`${this.url}`, {})
          .then((res) => {
            if (res.status === 200) {
              response = res.data;
              response.status = 200;
            }
          })
          .catch((error) => {
            console.log(
              console.log("Class: requestHandler, method: axios-post", [error])
            );
            response = undefined;
          });
        return response;
      } catch (error) {
        console.log(console.log("Class: requestHandler, method: Post", [error]));
        return undefined;
      }
  }

  async Put() {
    try {
        var response = "";
        await axios
          .put(`${this.url}`, {})
          .then((res) => {
            if (res.status === 200) {
              response = res.data;
              response.status = 200;
            }
          })
          .catch((error) => {
            console.log(
              console.log("Class: requestHandler, method: axios-put", [error])
            );
            response = undefined;
          });
        return response;
      } catch (error) {
        console.log(console.log("Class: requestHandler, method: Put", [error]));
        return undefined;
      }
  }
}

module.exports = {
  request,
};
