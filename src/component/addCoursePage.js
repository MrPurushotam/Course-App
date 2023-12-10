import React,{useEffect, useState,useRef} from 'react'
import "../styles/addCourse.css"
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';

const AddCourse = () => {
  let data=JSON.parse(window.localStorage.getItem('idetails'))
  const courseCache=useRef(window.localStorage.getItem('courseDet')?JSON.parse(window.localStorage.getItem('courseDet')):{});
  const lectureData=useRef([]);
  const [dataObject,setDataObject]=useState({    
    email:data.email,
    name:data.name,
    id:data.id,
    thumbnail:"",
    title:"",
    bio:"",
    price:"",
    validity:"",
    content:[],
  });
  const [disabled,setDisabled]=useState(false)       
  const [addLecture,setAddLecture]=useState(false); 

  const updateBio=(e)=>{
    e.preventDefault();
    setDataObject({...dataObject,
      title:document.querySelector('.course-bio-title').value,
      bio:document.querySelector('.course-bio-desc').value,
      validity:document.querySelector('.course-bio-validity').value,
      price:document.querySelector('.course-bio-price').value,
    })
    setDisabled(true)
  }

  const uploadData=async (e)=>{
    e.preventDefault()
      lectureData.current.push({
        videoLink:document.querySelector('#video-link').files[0],
        videoTitle:document.querySelector('#video-title').value,
        videoDescription:document.querySelector('#video-description').value,
      })
    document.querySelector('#video-title').value=document.querySelector('#video-description').value=document.querySelector('#video-link').value=""
    console.log(lectureData.current)
    setAddLecture(false)
  }

  const courseUpload=async (e)=>{
    e.preventDefault()
    try {
      let temp=courseCache.current
      temp={...temp,content:lectureData.current}
      console.log(temp)
      const formData=new FormData();
      formData.append('id',temp.id)
      formData.append('email',temp.email)
      formData.append('name',temp.name)
      formData.append('coursetitle',temp.title)
      formData.append('bio',temp.bio)
      formData.append('thumbnail',temp.thumbnail)
      formData.append('price',Number(temp.price))
      formData.append('validity',Number(temp.validity))
      temp.content.forEach((lec,i) => {
        formData.append('lecture',lec.videoLink)
        formData.append(`title`,lec.videoTitle.trim()?lec.videoTitle:" ")
        formData.append(`description`,lec.videoDescription.trim()?lec.videoDescription:" ")
      });
      console.log(formData)
      const response=await axios.post(`http://localhost:7111/instructor/addnewcourse/${temp.id}`,formData,{
        headers:{
          "Content-Type":"multipart/form-data",
        },timeout:30*1000,
      })
      console.log(response)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(()=>{
    if((dataObject.thumbnail ||dataObject.title || dataObject.bio) &&(courseCache.current.thumbnail!==dataObject.thumbnail||courseCache.current.title!==dataObject.title||courseCache.current.bio!==dataObject.bio)){
      window.localStorage.setItem('courseDet',JSON.stringify(dataObject))
      courseCache.current=window.localStorage.getItem('courseDet')?JSON.parse(window.localStorage.getItem('courseDet')):{};
      console.log("updated courseCache",courseCache.current)
    }
  },[dataObject])
  
  return (
  <>
    <div className='course-detail'>
      <div className='course-thumbnail'>
        {!dataObject.thumbnail?
          <input type='file' accept="image/*" name='thumbnail' className='course-thumbnail-addimage' onChange={async e=>{
            setDataObject({...dataObject,thumbnail:e.target.files[0]})
          }}/>
          :
          <>
            <span className="material-symbols-outlined course-thumbnail-image-delete" disabled={disabled}
            onClick={e=>{
              setDataObject({...dataObject,thumbnail:""})
              setDisabled(false)
            }}>delete</span>
            <img src={URL.createObjectURL(dataObject.thumbnail)} alt='Course thumbnail' className='course-thumbnail-image'/>
          </>
        }
      </div>
      <div className='course-bio'>
        <div className='course-bio-container'>
          <label htmlFor='title' className='common-label-bio'>Course Title </label>
          <TextareaAutosize disabled={disabled} className='course-bio-title' name='title'  placeholder="Add Course title"/>
          <label htmlFor='description' className='common-label-bio'>Course Description </label>
          <TextareaAutosize disabled={disabled} className='course-bio-desc' name='description' placeholder="Add Course Description"/>
          <label htmlFor='price' className='common-label-bio'>Course Price? </label>
          <TextareaAutosize disabled={disabled} className='course-bio-price' name='price' placeholder="Decide price of the course.(Rupees)"/>
          <label htmlFor='validity' className='common-label-bio'>Course Valid Till?</label>
          <TextareaAutosize disabled={disabled} className='course-bio-validity' name='validity' placeholder="Decide Course Validity.(x days)"/>
        </div>
        <button className='course-bio-btn' disabled={disabled} onClick={updateBio}>Update Thumbnail & Bio</button>
      </div>
    </div>
    <div className='add-lectures-box'>
        <div className='add-lectures-container'>
          {lectureData.current.length===0?
            <div className='add-lecture-before'>
              <button className='add-lecture-btn' onClick={e=>setAddLecture(true)} > Add Lecture </button>
            </div>
            :
            <div className='add-lecture-after'>
              <ol className='add-lecture-table'>
                <li className='table-head'>
                  <span className='table-index tabel'>Index</span>
                  <span className='table-title'>Title</span>
                  <span className='table-descp'>Description</span>
                  <span className='table-delete'>Delete</span>
                  <span className='table-preview'>Preview</span>
                </li>
                {lectureData.current.map((data,idx)=>(
                  <li key={idx}>
                    <span>{idx+1}</span>
                    <span>{(data.videoTitle)}</span>
                    <span>{data.videoDescription}</span>
                    {/* <span>{URL.createObjectURL(data.videoLink)}</span> */}
                    <span className="material-symbols-outlined">delete_forever</span>
                    <span className="material-symbols-outlined">slideshow</span>
                  </li>
                ))}
              </ol>
              <button className='add-lecture-btn' onClick={e=>setAddLecture(true)}> Add Lecture</button>
            </div>
          }        
        </div>
    </div>
    <div className='upload-div'>
        <button className='final-upload' onClick={courseUpload}> Upload Course</button>
    </div>

    {
      addLecture
      &&
      <>
        <div className='uploadvideo-box'>
          <span className="material-symbols-outlined close-icon" onClick={e=>{setAddLecture(false)}}>close</span>
          <h2>Add Lecture Details </h2>
          <div>
            <div className='uploadvideo-container'>
              <input type='file' accept="video/*" name='video' className='uploadvideo-input' id="video-link" />
            </div>
            <label htmlFor='title' className='uploadvideo-label' >Title</label>
            <TextareaAutosize name='title' className='uploadvideo-title' id="video-title" placeholder='Add Titile for the video'/>
            <label htmlFor='description' className='uploadvideo-label'>Description</label>
            <TextareaAutosize name='descprition' className='uploadvideo-description' id="video-description" placeholder='Add Description'/>

            <button className='uploadvideo-btn' onClick={uploadData}>Upload Content</button>
          </div>
        </div>
      </>

    }
</>
  )
}

export default AddCourse
