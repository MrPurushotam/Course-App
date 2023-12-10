import '../styles/home.css';
import React, { useEffect, useRef } from 'react';
import CourseCard from './courseCard';
import axios from 'axios';

const Home = () => {
    const courses_list=useRef([])
    useEffect(()=>{
        async function getCourses(){
            const resp=await axios.get('http://localhost:7111/get/all/courses')
            courses_list=resp.data
        }
        getCourses()
    },[])
  return (
    <div>
        <section id='home' className='home'>
            <div className='home-content'>
            <h3>Hi there Here are the Things to keep in mind!</h3>
            <br/>
                <ul>
                <li>Say No to fuckupsss!</li>
                <li>Don't think of betraying!Else I will betray you.</li>
                <li>Try being kind if you are usually not so kind then!</li>
                <li>Always respect everyone. But when things go shitty fuCkk Respect!</li>
                </ul>
            </div>
            <div className='home-image'>
                <div className='home-image-inner'></div>
            </div>
        </section>
        <section id='about'className='about'>
            <div className='about-image-container'>
                <img className='about-image' src='https://media1.giphy.com/media/eemPC4yhITcTm/giphy.gif' alt='about_image'/>
            </div>
            
            <div className='about-content-box'>
                <h2 className='about-title'>Welcome Welcome</h2>
                <p className='about-content'>Hop down straight and choose the carousel-item-prev
                you want to buy and get going with your course!!Happy Learning! Always keep Growing,<br/>Concentrate Like Naruto!<br/> Chase your goal like Naruto <br/> Love Like Naruto!!<br/>Be naruto in rl</p>
            </div>
        </section>
        <section id='courses' className='courses'>
            <div className='courses-container'>
                <h2 className='course-container-title'>Course Market-Place</h2>
                <div className='courses-container-child'>
                    {courses_list.current.length?
                        courses_list.current.map((course,i)=>{
                            <CourseCard thumbnail={course.thumbnail} title={course.title} description={course.description} validity={course.validtill} upload-date={course.uploadDate} instructor-name={course.iname} id={course.id} iid={course.iid} length={course.length} />   //in this length send no of lectuers
                        })
                        :
                        <h2 className='home-alert-message'>No Course uploaded yet!</h2>
                    }
               </div>
            </div>
            <div></div>

        </section>
    </div>
  )
}

export default Home
