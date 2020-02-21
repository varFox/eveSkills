// import Swagger from 'swagger-client';
import Swagger from 'swagger-client';
import axios from 'axios';

export default class SkillService {

  specUrl = 'https://esi.evetech.net/_latest/swagger.json';

  // var test = new Swagger(specUrl).then( s => {
  //   console.log("s: ", s.apis.Alliance.get_alliances().then(alliances => { console.log("alliances: ", alliances.obj )}))
  // });
  // Swagger.http.withCredentials = true;
  // swaggerClient = new Swagger(this.specUrl).then(function (asd) {
  //     return asd.apis.Alliance.get_alliances(); // chaining promises
  // }, function (reason) {
  //    console.error("failed to load the spec" + reason);
  // }).then(function(addPetResult) {
  //   console.log(addPetResult.obj);
  //   // you may return more promises, if necessary
  // }, function (reason) {
  //    console.error("failed on API call " + reason);
  // });
  // return [swaggerClient];
  getResource = async () => {
    const response = await new Swagger(this.specUrl)
      // .then(asd => asd.apis.Skills.get_characters_95977562())
    console.log(response.obj);
  return response.obj
  }

  getAllAlliances = async () => {
    const res = await this.getResource();    
    return res;
  } 

  
}
