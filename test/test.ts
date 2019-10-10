import * as path from 'path';
import * as fs from 'fs.promises';

(async () => {
  try {
    const routers = await fs.readdir('src/api/routers');
    routers.forEach(router => {
      router = './src/api/routers/' + path.parse(router).name;
      console.log(router);
      require(router);
    });
  } catch (e) { console.log(e); }
})();
