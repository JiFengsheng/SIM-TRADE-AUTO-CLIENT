import request from "../utils/request";

 const statusApi = {
  healthy(){
    return  request.get("/sim-trade/status/healthy")
  },
  shutdown(){
    return request.get("/sim-trade/shutdown")
  }
 }

 export default statusApi;