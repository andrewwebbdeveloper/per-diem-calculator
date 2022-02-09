
export function calculatePerDiem(set) {
    return calculateFormattedSet(formatSetForCalculation(set))
}


// Data structures
const cities = [
    {
        title: 'low',
        travel: 45,
        full: 75,
    },
    {
        title: 'high',
        travel: 55,
        full: 85,
    },
]


const set1 = [
    { title: 'Project 1', city: 'low', start: ' 9/1/2015', end: '9/3/2015' },
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

function formatDateString(dateString) {
    return new Date(dateString).toLocaleDateString("en-US")
}

function getDatesBetweenRange(startDate, endDate, city) {
    const dates = []
    const currentDate = new Date(startDate)

    if (currentDate >= new Date(endDate)) {
        console.warn('no dates between');
    }

    while (currentDate < new Date(endDate)) {
        dates.push([formatDateString(currentDate), city]) // match the data structure for calculation
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates;
}

/* 
Format for calculation (parsing input)
[[startDate, city],[betweenDates, city], [endDate, city], [startDate, city],[betweenDates, city], [endDate, city]...]
note: 
- each date should only occur once
- if there is a gap between any dates, use to determine travel vs. full.
*/

function formatSetForCalculation(setOfProjects) {
    return setOfProjects
        .reduce((acc, project) => { // First just count every date from start to end           
            return [...acc,
            [project.start, project.city],
            ...getDatesBetweenRange(project.start, project.end, project.city),
            [project.end, project.city]]

        }, [])
        .reduce((acc, day) => { // Then, filter for unique dates.
            if (acc.some(x => x[0] === day[0])) return acc;
            return [...acc, day]

        }, [])
}

/*
Calculate from function
- IF only one entry THEN full day @ city rate ( this would be the entire per diem )
-----
- IF first Date in array THEN travel day @ city rate
- IF last Date in array THEN travel day @ city rate
- IF there's a gap between date[i] and date[i + 1] || date[i] and date[i - 1]  THEN travel day @ city rate
- OTHERWISE it's a full day @ city rate1
*/

function getPrice(city, rate) {
    return cities.find(x => x.title === city)[rate]
}

function checkIsTomorrowNext(currentDate, nextDate) {
    const tomorrowsYesterday = formatDateString(new Date(nextDate).setDate(new Date(nextDate).getDate() - 1));
    return currentDate !== tomorrowsYesterday;
}

function checkIsYesterdayPrevious(currentDate, lastDate) {
    const yesterdaysTomorrow = formatDateString(new Date(lastDate).setDate(new Date(lastDate).getDate() + 1));
    return currentDate !== yesterdaysTomorrow;
}

function calculateFormattedSet(formatedSetOfProjects) {

    // IF there's only one, then one full day is the total per diem.
    if (formatedSetOfProjects.length === 1) {
        const [_, city] = formatedSetOfProjects[0]
        return getPrice(city, 'full')
    }

    const totalAmounts = formatedSetOfProjects.reduce((acc, [date, city], index, projects) => {
        const isFirstDate = index === 0;
        const isLastDate = index === projects.length - 1
        const isGapAhead = !isLastDate && checkIsTomorrowNext(date, projects[index + 1][0])
        const isGapBehind = !isFirstDate && checkIsYesterdayPrevious(date, projects[index - 1][0])


        // The scenario this corrects go against the first rule: "First day and last day of a project, or sequence of projects, is a travel day."
        // if (isLastDate && isGapBehind) acc.push(getPrice(city, 'full')) 
        // if (isFirstDate && isGapAhead) acc.push(getPrice(city, 'full'))

        if (isFirstDate || isLastDate || isGapAhead || isGapBehind) acc.push(getPrice(city, 'travel'))
        else acc.push(getPrice(city, 'full'))

        return acc;
    }, [])

    // Sum totalAmounts
    return totalAmounts.reduce((acc, dollarAmount) => acc += dollarAmount, 0)
}