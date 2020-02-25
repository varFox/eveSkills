// import Swagger from 'swagger-client';
import Swagger from 'swagger-client';

export default class SkillService {

  specUrl = 'https://esi.evetech.net/_latest/swagger.json';

  getResource = async () => {
    const response = await new Swagger(this.specUrl)
      .then(asd => asd.apis.Alliance.get_alliances())
  return response.obj
  }

}
