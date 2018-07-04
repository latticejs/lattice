const faker = require('faker');
const db = require('./index');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

(async () => {
  const { users, employees, areas, tasks } = await db();

  await users.remove().write();
  await employees.remove().write();
  await areas.remove().write();
  await tasks.remove().write();

  const management = await areas.insert({ name: 'Management', dependsOn: [] }).write();
  const development = await areas.insert({ name: 'Development', dependsOn: [management.id] }).write();
  const production = await areas.insert({ name: 'Production', dependsOn: [management.id] }).write();
  const sales = await areas.insert({ name: 'Sales', dependsOn: [management.id] }).write();
  const hardware = await areas.insert({ name: 'Hardware', dependsOn: [development.id, production.id] }).write();
  const software = await areas.insert({ name: 'Software', dependsOn: [development.id] }).write();
  const series = await areas.insert({ name: 'Series', dependsOn: [production.id] }).write();
  const parts = await areas.insert({ name: 'Parts', dependsOn: [production.id, sales.id] }).write();
  const north = await areas.insert({ name: 'North', dependsOn: [sales.id] }).write();
  const south = await areas.insert({ name: 'South', dependsOn: [sales.id] }).write();

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
    const employee1 = employees.get(getRandomInt(0, 5000)).value().id;
    const employee2 = employees.get(getRandomInt(0, 5000)).value().id;

    await tasks
      .insert({
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
        employees: [employee1, employee2],
        createdAt: faker.date.past().getTime()
      })
      .write();
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
})();
