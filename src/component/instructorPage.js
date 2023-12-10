import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {TextField} from "@material-ui/core";
import axios from 'axios';

const InstructorPage = () => {
  const navigate=useNavigate();
  const [moveSlider,setMoveSlider]=useState(false)
  const [instructorSingup,setInstructorSignup]=useState({
    iname:"",email:"",contact:"",password:""
  })
  const [instructorLogin,setInstructorLogin]=useState({
    email:"",password:""
  })
  const [temp,setTemp]=useState("")
  const handelSubmitSignup=async(e)=>{
    e.preventDefault();
    const resp=await axios.post('http://localhost:7111/instructor/signup',JSON.stringify(instructorSingup),{
      headers:{
        "Content-Type":"application/json"
      },
    })
    console.log(resp)
    if(resp.data.message==="success"){
      setMoveSlider(false)
    }

  }
  const handelSubmitLogin=async (e)=>{
    e.preventDefault();
    try{
      const resp=await axios.post('http://localhost:7111/instructor/login',JSON.stringify(instructorLogin),{
        headers:{
          "Content-Type":"application/json"
        },
      });
      const response=await resp.data
      if (response.message === 'success') {
        window.localStorage.setItem('idetails', await JSON.stringify(response.data));
        navigate('/instructor-dashboard');
      }
    }catch(e){
      console.log(e.message)
    }
  }
  return (
    <div className="instructor-page-container">
      <div className='switch-container'>
        <div className= {`slider ${moveSlider?"moveslider":""}`}></div>
        <div className="btn">
            <button className="login" onClick={()=>{
              setMoveSlider(false);
            }} >Login</button>
            <button className="signup" onClick={()=>{
              setMoveSlider(true);
              }}>Signup</button>
        </div>
      </div>
        <div className='instructor-page-child' style={{maxWidth:'70%',margin:"0.3vw auto"}}>
          {moveSlider?
              <form>
                  <h2 className='form-title'>Instructor SignUp</h2>
                  <TextField className='common-textfield-navbar' required id='filled-required' label="Username" autoComplete={'true'} variant='filled' onChange={e=>setInstructorSignup({...instructorSingup,iname:e.target.value})}/>

                  <TextField className='common-textfield-navbar' required id='filled-required' label="Email" variant='filled' onChange={e=>setInstructorSignup({...instructorSingup,email:e.target.value})} />

                  <TextField className='common-textfield-navbar' required id='filled-required' label="Contact Number" variant='filled' onChange={e=>setInstructorSignup({...instructorSingup,contact:e.target.value})}/>

                  <TextField className='common-textfield-navbar' required id='filled-required' label="Password" type='Password' variant='filled' onChange={e=>setInstructorSignup({...instructorSingup,password:e.target.value})}/>

                  <TextField className='common-textfield-navbar' required id='filled-required' label="Confirm Password" type='Password' variant='filled'/>
                  
                  <button onClick={handelSubmitSignup} type="submit" className='common-button-navbar'>Submit</button>
              </form>
          :
              <form>
                <h2 className='form-title'>Instructor Login</h2>
                <TextField className='common-textfield-navbar' required id='filled-required' label="Email" variant='filled' onChange={e=>{
                  setInstructorLogin({...instructorLogin,email:e.target.value})
                }}/>

                <TextField className='common-textfield-navbar' required id='filled-required' label="Password" type='Password' variant='filled' onChange={e=>setInstructorLogin({...instructorLogin,password:e.target.value})}/>

                <button onClick={handelSubmitLogin} type="submit" className='common-button-navbar'>Submit</button>
              </form>
}
        </div>
    </div>
  )
}

export default InstructorPage
