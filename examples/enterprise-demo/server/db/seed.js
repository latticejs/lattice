const faker = require('faker');
const db = require('./index');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

(async () => {
  const { users, employees, areas, tasks, products, sales } = await db();

  console.log('Starting to generate the database, please wait...\n');

  await users.remove().write();
  await employees.remove().write();
  await areas.remove().write();
  await tasks.remove().write();
  await products.remove().write();
  await sales.remove().write();

  const management = await areas.insert({ name: 'Management', dependsOn: [] }).write();
  const development = await areas.insert({ name: 'Development', dependsOn: [management.id] }).write();
  const production = await areas.insert({ name: 'Production', dependsOn: [management.id] }).write();
  const areaSales = await areas.insert({ name: 'Sales', dependsOn: [management.id] }).write();
  await areas.insert({ name: 'Hardware', dependsOn: [development.id, production.id] }).write();
  await areas.insert({ name: 'Software', dependsOn: [development.id] }).write();
  await areas.insert({ name: 'Series', dependsOn: [production.id] }).write();
  await areas.insert({ name: 'Parts', dependsOn: [production.id, areaSales.id] }).write();
  await areas.insert({ name: 'North', dependsOn: [areaSales.id] }).write();
  await areas.insert({ name: 'South', dependsOn: [areaSales.id] }).write();

  for (let i = 0; i < 5000; i++) {
    const ran = getRandomInt(0, 10);
    const area = areas.get(ran).value();
    await employees
      .insert({
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        areaId: area.id,
        jobTitle: faker.name.jobTitle(),
        createdAt: faker.date.past().getTime()
      })
      .write();
  }

  for (let i = 0; i < 100; i++) {
    const employee1 = employees.sample().value().id;
    const employee2 = employees.sample().value().id;
    const createdAt = faker.date.past();
    await tasks
      .insert({
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
        employees: [employee1, employee2],
        createdAt: createdAt.getTime(),
        completedAt: getRandomInt(0, 2) ? faker.date.between(createdAt, new Date()).getTime() : null
      })
      .write();
  }

  for (let i = 0; i < 100; i++) {
    const product = await products
      .insert({
        name: faker.commerce.productName(),
        department: faker.commerce.department(),
        price: parseFloat(faker.commerce.price())
      })
      .write();

    for (let i = 0; i < getRandomInt(0, 1000); i++) {
      await sales
        .insert({
          productId: product.id,
          employeeId: employees.sample().value().id,
          price: product.price,
          createdAt: faker.date.past().getTime()
        })
        .write();
    }
  }

  await users
    .insert({ email: 'admin@lattice.com', password: '123456', role: 'admin', createdAt: faker.date.past().getTime() })
    .write();
  await users
    .insert({
      email: 'analyst@lattice.com',
      password: '123456',
      role: 'analyst',
      createdAt: faker.date.past().getTime()
    })
    .write();

  console.log('Database generated!\n');
})();
