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

/*
Set (input)
[
    {
        title: 'Project 1',
        city: 'low',
        start: '02/08/2022',
        end: '02/10/2022'
    },
    {
        title: 'Project 2',
        city: 'high',
        start: '02/10/2022',
        end: '02/13/2022'
    },
]
*/

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
    { title: 'Project 3', city: 'low', start: '9/8/2015', end: '9/8/2015' },
]

const set4 = [
    { title: 'Project 1', city: 'low', start: '9/1/2015', end: '9/1/2015' },
    { title: 'Project 2', city: 'low', start: '9/1/2015', end: '9/1/2015' },
    { title: 'Project 3', city: 'high', start: '9/2/2015', end: '9/2/2015' },
    { title: 'Project 4', city: 'high', start: '9/2/2015', end: '9/3/2015' },
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
        .reduce((acc, project) => {

            // First just count every date from start to end
            return [...acc,
            [project.start, project.city],
            ...getDatesBetweenRange(project.start, project.end, project.city),
            [project.end, project.city]]

        }, [])
        .reduce((acc, day) => {

            // Then, filter for unique dates.
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