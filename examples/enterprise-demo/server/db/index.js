const low = require('lowdb');
const path = require('path');
const lodashId = require('lodash-id');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync(path.join(__dirname, 'data.json'));

module.exports = async () => {
  const db = await low(adapter);

  db._.mixin(lodashId);

  await db.defaults({ users: [], employees: [], tasks: [], areas: [] }).write();

  const users = db.get('users');
  const employees = db.get('employees');
  const tasks = db.get('tasks');
  const areas = db.get('areas');

  return {
    users,
    employees,
    tasks,
    areas
  };
};
