import axios from 'axios';
import React, {  useState } from 'react'
import '../styles/ipDashboard.css'
import { useNavigate } from 'react-router-dom';

const InstructorDashboard =() => {
  const navigate=useNavigate();
  const [updateProfile,setUpdateProfile]=useState(false);
  let data=JSON.parse(window.localStorage.getItem('idetails'))||''
  const [details,setDetails]=useState({
    email:data.email,
    bio:"",
    profile:"", 
    username:"",
  })
  const editProfile=async(e)=>{
      e.preventDefault()  
      const formData=new FormData();
      formData.append('email',details.email)
      formData.append('bio',details.bio)
      formData.append('profile',details.profile)
      formData.append('username',!details.username?data.name:details.username)
      const resp=await axios.post('http://localhost:7111/instructor/update/profile',formData,{
        headers:{   
          'Content-Type':'multipart/form-data',
        },
      })
      console.log(resp)
      const response=resp.data
      if(response.message==='success'){
        console.log(response.data)
        window.localStorage.setItem('idetails',JSON.stringify(response.data))
        setUpdateProfile(false)
      }else{
        console.log("Error occured")
      }
    }
    const closeLogin=(e)=>{
      e.preventDefault()  
      setUpdateProfile(false)
    }
    
  return (
    <div>
        <div className='instructor-profile'>
            <img src={`${!data.profile?"ac.jpg":"/data/profile/"+data.profile}`} alt="profile" className='ip-photo'/>
            <p className='ip-info'><span className='ip-details'>Username:{data.name}</span><span className='ip-details'>Email:{data.email}</span>
            </p>
            <p className='ip-bio'>{data.bio||'Update Bio Below'}</p>
            <button className='ip-editbtn' onClick={()=>setUpdateProfile(true)}>Edit Profile</button>
        </div>
        {updateProfile 
        &&
        <div className='ip-update-profile'>
        <span className="material-symbols-outlined close-icon" onClick={closeLogin}>close</span>
          <div className='ip-container'>
            <form>
              <label className='ip-profile-label'>Update Profile</label>
              <input className='ip-update-profile-picture' type='file' name='profile' required onChange={e=>setDetails({...details,profile:e.target.files[0]})} />
              <label className='ip-profile-label'>Update Username</label>
              <input className='ip-update-name' placeholder='Enter Name(Leave empty to keep it same)' type='text' onChange={e=>setDetails({...details,username:e.target.value})}/>
              <label className='ip-profile-label'>Update Bio</label>
              <input className='ip-update-bio' placeholder='Update Bio' type='text' onChange={e=>setDetails({...details,bio:e.target.value})}/>
              <button onClick={editProfile} className='ip-update-btn'> Save </button>
            </form>
          </div>
        </div>}
        <div className='ip-addCourse-section'>
          {<div className='ip-show-message'>
            <div className='ip-message' onClick={(e)=>{
              e.preventDefault()  
              navigate('/instructor-addcourse')
            }}>
                <span className="material-symbols-outlined add-icon">add</span>
                <br/>
                You don't have any course Published Click on it to add Your Course
            </div>
          </div>}
        </div>
    </div>
  )

}

export default InstructorDashboard
