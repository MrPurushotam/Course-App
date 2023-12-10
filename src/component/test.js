import TextareaAutosize from 'react-textarea-autosize';
import React, { useRef, useState } from 'react'
import axios from 'axios';

const Test = () => {
    const [videoLinkArray,setVideoLinkArray]=useState([])
    const lectureData=useRef([])
    const videoArray=useRef([])

    const uploadCurrent=(e)=>{ 
        e.preventDefault()
        console.log(document.querySelector('.video-tag').files)
        let tempObj={
            videoLink:document.querySelector('.video-tag').files[0],
            videoTitle:document.querySelector('.titleadd').value?document.querySelector('.titleadd').value:"",
            videoDesc:document.querySelector('.descriptionadd').value?document.querySelector('.descriptionadd').value:""
        }
        lectureData.current.push(tempObj)
        console.log(lectureData.current)
        document.querySelector('.titleadd').value=document.querySelector('.descriptionadd').value=""
    }

    const uploadAll=async (e)=>{
        e.preventDefault()
        console.log(lectureData.current)
        lectureData.current.map(x=>(
            videoArray.current.push({
                videoLink:URL.createObjectURL(x.videoLink),
                videoTitle:x.videoTitle,
                videoDesc:x.videoDesc
            })
        ))
        console.log(videoArray.current)
        alert("All Data logged in console")
    }
  return (
    <>
    {lectureData.current.length!==0?
        <ul className='list' style={{width:"50vw",height:"30vh",overflow:"auto",border:"0.5vh dashed red",margin:"1vh auto", padding:"1vh"}} > 
            {lectureData.current.map((data)=>(
                <li className='list-ul'>
                    <span className='videoLink'>{JSON.stringify(data.videoLink)}</span>
                    <span className='videoTitle'>{data.videoTitle}</span>
                    <span className='videoDesc'>{data.videoDesc}</span>
                </li>
            ))}
        </ul>
    :
    <>
    <h2 className='message' style={{width:"90vw",textAlign:"center",background:"#c1121f",color:"#f2e9e4",margin:"1vh auto",padding:"1vh", fontSize:"4vh",borderRadius:"1vh"}}>No Lecture is Added!</h2>
    </>}
      <div className='box-center' style={{height:"30vh",width:"50vw", margin:"1vh auto",padding:"2vh" ,border:"0.6vh double purple"}}>
        <input type='file' accept="video/*" className='video-tag' required />
        <TextareaAutosize className='titleadd' placeholder="sample title" required style={{display:"block"}} />
        <TextareaAutosize className='descriptionadd' placeholder="sample description" required style={{display:"block"}} />
        <button className='upload-one-btn' onClick={uploadCurrent} style={{display:"block",color:"black",background:"#ffd60a",textAlign:"center",width:"100%",margin:"1vh"}}>Upload Current Data</button>

        <button className='upload-all-btn' onClick={uploadAll} style={{display:"block",color:"black",background:"#ffd60a",textAlign:"center",width:"100%",margin:"1vh"}}>Upload All Data</button>

      </div>
      {
        videoArray.current.length!==0?
        <div style={{border:"0.5vh solid black",width:"90vw",height:"30vh",padding:"1vh",overflow:"auto", margin:"1vh auto"}}>
            {videoArray.current.map(data=>(
                <div style={{width:"29vw",height:"29vh",padding:"0.5vh",display:"inline",wordBreak:'break-word',overflow:"auto",border:"0.3vh solid black"}}>
                    <video style={{width:"95%",height:"40%",margin:"0.5vh auto"}} src={data.videoLink} controls disablePictureInPicture controlsList='nodownload' />
                    <span style={{display:"block",textAlign:"left",margin:"0.8vh"}}>{data.videoTitle}</span>
                    <span style={{display:"block",textAlign:"left",margin:"0.8vh"}}>{data.videoDesc}</span>
                </div>
            ))}

        </div>
        :
        <h2 className='message' style={{width:"90vw",textAlign:"center",background:"#c1121f",color:"#f2e9e4",margin:"1vh auto",padding:"1vh", fontSize:"4vh",borderRadius:"1vh"}}>No Video Submited!</h2>
      }
    </>
  )
}

export default Test;
