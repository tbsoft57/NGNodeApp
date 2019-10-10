import { AppServer } from '../_lib/appServer';
import { Person } from '../entities/person';
import * as error from '../errors';

AppServer.setBasePublicRouter('person', Person)
  .get('/test', async (req, res, next) => {
    try {
      // const rep = await Person.update({ "id": 9, "firstName": "BRUNNER", "lastName": "Beatrice", "age": 52 });
      const rep = await Person.getByName('Thierry');
      res.json(rep);
    } catch (err) { next(err); }
  });
