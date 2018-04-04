const seed = {
  'Stats': 100,
  'Sales': 1000
}

const asGraphQL = type => array => array.map((e, index) => ({...e, __typename: type, id: seed[type] + index }))

export const stats = asGraphQL('Stats')([
  {
    label: 'Followers',
    unit: "New Followers",
    value: 6
  },
  {
    label: 'Mentions',
    unit: "In last hour",
    value: 38
  },
  {
    label: 'Revenue',
    unit: "USD",
    value: 92380
  }, 
  {
    label: 'Visitors',
    unit: "New Visitors",
    value: 289
  }
])

export const sales = asGraphQL('Sales')([
  { name: 'Product A', value: 123245 },
  { name: 'Product B', value: 887237 },
  { name: 'Product C', value: 536551 },
  { name: 'Product D', value: 34323 }
])