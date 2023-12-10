import "../styles/courseCard.css"
import { Link } from 'react-router-dom'

export default function CourseCard(props) {
  return (
    <div className='card-container'>
        <img src={props.thumbnail?props.thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOFM-v-uki9Ex5wyPterASR8iLHLjI2B8A4g&usqp=CAU"} alt='thumbnail' className='card-course-thumbnail'/>
        <h3 className='card-course-title'>props.title</h3>
        <span className='card-course-teacher'>props.instructor-name</span>
        <span className='card-course-isRefundable'>Refundable</span>
        <span className='card-course-validity'>props.validity <span className='card-course-total-time'>({props.length-props.length%10}++)</span></span>
        
        <span className='card-course-launched-date'>props.upload-date|| new Date.toISOString()</span>
        <p className='card-course-description' >
            { props.description ||" this is xyz course danvsdjv "}
        </p>
        <br/>
        <Link to="#" className="card-course-btn">View Course</Link>
    </div>
  )
}
