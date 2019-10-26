import * as bcrypt from 'bcryptjs';

(async () => {

  const h1 = await bcrypt.hash('TB04011966', 10);
  const h2 = await bcrypt.hash('TB04011966', 10);

  console.log(await bcrypt.compare('TB04011966', h1));
  console.log(await bcrypt.compare('TB04011966', h2));

})();
