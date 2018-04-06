const seed = { 
  employee: 1000,
  department: 200,
  sales: 11000,
  activity: 99000,
  stats: 12000
}

const asGraphQL = type => array => array.map((e, index) => ({...e, __typename: type}))
const random = (array) => array[ Math.floor(Math.random() * array.length) ];
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const _firstnames = ['John', 'Jane', 'Mary', 'Eduard', 'Micheal', 'Phill', 'Mark', 'Linda', 'Rose'];
const _lastnames = ['Doe', 'Smith', 'Johnson', 'Jones', 'Williams'];
const _departments = ['Engineering', 'Marketing', 'Sales'];
const _positions = {
  'Engineering': ['Developer', 'Engineer', 'QA', 'Sales Engineer'],
  'Marketing': ['Advertising', 'Account Executive', 'Media Coordinator'],
  'Sales': ['Sales Representative', 'Sales Engineer', 'Account Executive', 'Region Coordinator']
}
const _products = ['Product A', 'Product B', 'Product C', 'Product D'];
const _messages = [
  'Hello there!', 
  'Hi! How are you?', 
  'Glad you make it.', 
  'Let\'s get a sandwich!',
  'Be right back, I have to run for a while...',
  'What about tomorrow 9am?'
];

const generator = {
  employees (qty = 100) {
    const data = []
    for(let i = 0; i < qty; i++) {
  
      const first = random(_firstnames)
      const last = random(_lastnames)
      const department = random(_departments)
  
      data.push({
        id: seed.employee + i,
        name: `${first} ${last}`,
        email: `${first}.${last}@company.co`.toLowerCase(),
        position: random(_positions[department]),
        department
      })
    }
    return data;
  },
  departments () {
    return _departments.map((dep, idx) => ({
      id: seed.department + idx,
      label: dep,
      value: dep
    }));
  },
  sales () {
    return _products.map( p => {
      return {
        name: p,
        value: Math.floor(Math.random() * 100000)
      }
    })
  },
  activities (user, employees, qty = 100) {
    const data = []

    for(let i = 0; i < qty; i++) {
      const message = random(_messages);
      const to = random([...employees, user]);
      const from = to === user ? random(employees) : user;
      const date = randomDate(new Date(2017, 0, 1), new Date())
      data.push({
        id: seed.activity + i,
        userId: user.id,
        message,
        date,
        to,
        from
      })
    }
    return data;    
  },
  stats () {
    return [
      { label: 'Followers',
        unit: "New Followers",
        value: 6
      },
      { label: 'Mentions',
        unit: "In last hour",
        value: 38
      },
      { label: 'Revenue',
        unit: "USD",
        value: 92380
      }, 
      { label: 'Visitors',
        unit: "New Visitors",
        value: 289
      }
    ].map((e, idx) => {
      console.log(e, idx, seed.stats, seed.stats + idx)
      return {
        id: seed.stats + idx,
        ...e
      }
    })
  }
}

const currentUser = {
  id: 123456,
  name: 'Jane Doe',
  email: 'jane.doe@company.co',
  teams: ['Administrators', 'Support', 'General', 'Specialists']
};
const employees = asGraphQL('Employees')(generator.employees());
const departments = asGraphQL('Departments')(generator.departments());
const sales = asGraphQL('Sales')(generator.sales());
const activities = asGraphQL('Activities')(generator.activities(currentUser, employees, 100));
const stats = asGraphQL('Stats')(generator.stats());

const users = [currentUser]

export {
  users,
  employees,
  departments,
  activities,
  sales,
  stats
}
