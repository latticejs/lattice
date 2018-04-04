const asGraphQL = type => array => array.map(e => ({...e, __typename: type}))

export const stats = [
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
].map(e => ({...e, __typename: 'Stats'}))

export const sales = [
  { name: 'Product A', value: 123245 },
  { name: 'Product B', value: 887237 },
  { name: 'Product C', value: 536551 },
  { name: 'Product D', value: 34323 }
].map(e => ({...e, __typename: 'Sales'}))