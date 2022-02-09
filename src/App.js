import { useState, useEffect } from 'react';
import './App.css';
import { calculatePerDiem } from './calculatePerDiem';
import Project from './Project';
import { set1, set2, set3, set4 } from './sets';

const sets = [
  { id: 1, set: set1 },
  { id: 2, set: set2 },
  { id: 3, set: set3 },
  { id: 4, set: set4 },
]

function SetButton({ id, text, setSet }) {
  return (<button className='set-button' onClick={(e) => setSet(id)}>{text}</button>)
}


function App() {
  const [currentSet, setCurrentSet] = useState([])
  const [price, setPrice] = useState(0)

  useEffect(() => {
    setPrice(calculatePerDiem(currentSet))

  }, [currentSet]);


  const setSet = (id) => {
    return setCurrentSet(sets.find(x => x.id === id).set)
  }

  return (
    <div className="App">
      <main>
        <div className='title-bar'>
          <h1 className='set-title'>Per Diem</h1>
          <div className='price-container'><h2 className='price'>{`$${price}`}</h2></div>
        </div>
        {currentSet && currentSet.map(({ title, city, start, end }, index) => <Project title={title} city={city} start={start} end={end} index={index} />)}
      </main>
      <aside className='sidebar'>
        <h2>Sets</h2>
        <div className='line'></div>
        <div className='set-buttons'>
          {sets.map(({ id }) => <SetButton id={id} text={`Set ${id}`} setSet={setSet}></SetButton>)}
        </div>
      </aside>
    </div >
  );
}

export default App;
