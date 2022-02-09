const set1 = [
    { title: 'Project 1', city: 'low', start: '9/1/2015', end: '9/3/2015' },
]

const set2 = [
    { title: 'Project 1', city: 'low', start: '9/1/2015', end: '9/1/2015' },
    { title: 'Project 2', city: 'high', start: '9/2/2015', end: '9/6/2015' },
    { title: 'Project 3', city: 'low', start: '9/6/2015', end: '9/8/2015' },
]

const set3 = [
    { title: 'Project 1', city: 'low', start: '9/1/2015', end: '9/3/2015' },
    { title: 'Project 2', city: 'high', start: '9/5/2015', end: '9/7/2015' },
    { title: 'Project 3', city: 'high', start: '9/8/2015', end: '9/8/2015' },
]

const set4 = [
    { title: 'Project 1', city: 'low', start: '9/1/2015', end: '9/1/2015' },
    { title: 'Project 2', city: 'low', start: '9/1/2015', end: '9/1/2015' },
    { title: 'Project 3', city: 'high', start: '9/2/2015', end: '9/2/2015' },
    { title: 'Project 4', city: 'high', start: '9/2/2015', end: '9/3/2015' },
]

// This set is a case where the first and last days should be full instead of travel because they're adjacent to gaps.
// However, that case goes against the first rule: "First day and last day of a project, or sequence of projects, is a travel day."
const set5 = [
    { title: 'Project 1', city: 'low', start: '12/31/2015', end: '12/31/2015' },
    { title: 'Project 2', city: 'high', start: '1/2/2016', end: '1/6/2016' },
    { title: 'Project 3', city: 'high', start: '1/8/2016', end: '1/8/2016' },
]

export { set1, set2, set3, set4, set5 }