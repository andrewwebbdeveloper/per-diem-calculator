const SetButton = ({ id, text, setSet }) => {
    return (<button key={id} className='set-button' onClick={(e) => setSet(id)}>{text}</button>)
}

export default SetButton;