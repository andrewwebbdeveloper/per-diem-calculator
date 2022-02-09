import log from "./sytledLogger"

export function calculatePerDiem(set) {
    return calculateFormattedSet(formatSetForCalculation(set))
}


// Data structures
// Could add  this to be configurable via app ( and add more cities via UI)
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

function formatDateString(dateString) {
    return new Date(dateString).toLocaleDateString("en-US")
}

function getDatesBetweenRange(startDate, endDate, city) {
    const dates = []
    const currentDate = new Date(startDate)

    if (currentDate >= new Date(endDate)) {
        // console.warn('no dates between');
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

    log(`project dates:`, formatedSetOfProjects.map(x => x[0]))

    // IF there's only one, then one full day is the total per diem.
    if (formatedSetOfProjects.length === 1) {
        const [, city] = formatedSetOfProjects[0]
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

    log(`total amounts:`, totalAmounts)

    // Sum totalAmounts
    return totalAmounts.reduce((acc, dollarAmount) => acc += dollarAmount, 0)
}