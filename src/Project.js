const Project = ({ title, city, start, end, index }) => {
    return (
        <div key={index} className='project'>
            <div className='project-info'>
                <h5 className='project-title'>{title}</h5>
                <p><strong>City:</strong> {city}</p>
                <p><strong>Start:</strong> {start}</p>
                <p><strong>End:</strong> {end}</p>
            </div>
        </div>
    )
}

export default Project;