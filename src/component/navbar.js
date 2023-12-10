import '../styles/main.css';
import React, { useState } from 'react'
import "../styles/navbar.css"
import { Link, useNavigate } from 'react-router-dom';
import {TextField} from "@material-ui/core"
import axios from 'axios';


export default function Navbar() {
  const navigate=useNavigate()
  const [appear,setAppear]=useState(false);
  const [moveSlider,setMoveSlider]=useState(false);

  const [singupUser,setSignupUser]=useState({
    uname:"",
    contact:"",
    email:"",
    password:"",
  });
  const [loginUser,setLoginUser]=useState({
    email:"",
    password:"",
  });
  const handelSubmitSignup=async (e)=>{
    e.preventDefault();
    try{
      const resp=await axios.post('http://localhost:7111/user/signup',JSON.stringify(singupUser),{
        headers:{
          "Content-Type":"application/json",
        },
      })
      
    }catch(err){
      console.log(err.message)
    }
  }
  const handelSubmitlogin= async(e)=>{
    e.preventDefault()
    const resp=await axios.post('http://localhost:7111/user/login',JSON.stringify(loginUser),{
      headers:{
        "Content-Type":"application/json",
      },
    })
    if(resp.data.message==='success'){
      window.localStorage.setItem('udetails',resp.data.data);
      setAppear(false);
      setMoveSlider(false);
      console.log('User Logged in')
    }
  }
  const closeLogin=()=>{
    setAppear(false)
    setMoveSlider(false)
  }
  function check(){
    if(window.localStorage.getItem('idetails')||window.localStorage.getItem('udetails')){
      return true;
    }
    return false;
  }
  return (
  <>
      <div className='navbar-container'>
        <div className='navbar-one'></div>
        <div className='navbar-two'>
            <Link to='/#home' className='navbar-link'>Home</Link>
            <Link to='/#about'className='navbar-link'>About</Link>
            <Link to='/#courses'className='navbar-link'>Course</Link>
            <Link to='/mycourses'className='navbar-link'>My-Course</Link>
            {!check()?<Link className='navbar-login-btn' onClick={()=>{
              if(moveSlider){
                setAppear(!appear)
                setMoveSlider(!moveSlider)
              }else{
                setAppear(!appear)
              } }}>Login</Link>
            :<Link className='navbar-logout-btn' onClick={e=>{
              e.preventDefault()
              window.localStorage.getItem('idetails')?window.localStorage.removeItem('idetails'):window.localStorage.removeItem('udetails')
              window.localStorage.getItem('courseDet')?window.localStorage.removeItem('courseDet'):''
              window.localStorage.getItem('lectureDet')?window.localStorage.removeItem('lectureDet'):''
              navigate('/instructor-login')
            }}>Logout</Link>}
        </div>
      </div>
      {appear &&           
        <>
          <>
            <div className='login-appear-container'>
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
              {!moveSlider? 
                <div className='login-container'>
                  <form>
                  <span className="material-symbols-outlined close-icon" onClick={closeLogin}>close</span>
                  <h2 className='form-title'>Login</h2>
                  <TextField className='common-textfield-navbar' required id='filled-required' label="Email" variant='filled' onChange={e=>setLoginUser({...loginUser,email:e.target.value})}/>

                  <TextField className='common-textfield-navbar' required id='filled-required' label="Password" type='Password' variant='filled' onChange={e=>setLoginUser({...loginUser,password:e.target.value})}/>

                  <button onClick={handelSubmitlogin} type="submit" className='common-button-navbar'>Submit</button>
                  </form>
                </div>
              :
                <div className='signup-container'>
                <form>
                <span className="material-symbols-outlined close-icon" onClick={closeLogin}>close</span>
                  <h2 className='form-title'>SignUp</h2>
                  <TextField className='common-textfield-navbar' required id='filled-required' label="Username" autoComplete={'true'} variant='filled' onChange={e=>setSignupUser({...singupUser,uname:e.target.value})}/>

                  <TextField className='common-textfield-navbar' required id='filled-required' label="Email" variant='filled' onChange={e=>setSignupUser({...singupUser,email:e.target.value})} />

                  <TextField className='common-textfield-navbar' required id='filled-required' label="Contact Number" variant='filled' onChange={e=>setSignupUser({...singupUser,contact:e.target.value})}/>

                  <TextField className='common-textfield-navbar' required id='filled-required' label="Password" type='Password' variant='filled' onChange={e=>setSignupUser({...singupUser,password:e.target.value})}/>

                  <TextField className='common-textfield-navbar' required id='filled-required' label="Confirm Password" type='Password' variant='filled'/>
                  
                  <button onClick={handelSubmitSignup} type="submit" className='common-button-navbar'>Submit</button>
                </form>
              </div>}
            </div>
          </>
        </>}
    </>
  )
}
