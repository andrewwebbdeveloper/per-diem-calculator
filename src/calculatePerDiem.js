// Data structures

/*
Cities
[
    {
        title: low,
        travel: 45,
        full:  75,
    },
    {
        title: high,
        travel: 55,
        full:  85,
    },
]
*/

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

/* 
Format for calculation (parsing input)
[[sDate, city],[betweenDates, city], [eDate, city], [sDate, city],[betweenDates, city], [eDate, city]...]
note: 
- each date should only occur once
- if there is a gap between any dates, use to determine travel vs. full.
*/

/*
Calculate from function
- IF first Date in array && only one entry THEN full day @ city rate ( this would be the entire per diem)
- ELSE IF first Date in array THEN travel day @ city rate
- IF last Date in array && last Date !== first date in array THEN travel day @ city rate
- IF there's a gap between date[i] and date[i + 1] || date[i] and date[i - 1]  THEN travel day @ city rate
- OTHERWISE it's a full day @ city rate1
*/