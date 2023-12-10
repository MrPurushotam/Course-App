const express=require('express');
const Cors=require('cors');
const bcrypt=require('bcryptjs');
const session=require('express-session')
const MongoDBSession=require("connect-mongodb-session")(session)
const {User,Instructor,Courses,PaidUser}=require('../models/dbSchema');
const {mongoose} = require('mongoose');
const multer=require('multer');
const path=require('path');
const fs=require('fs');

require('dotenv').config()
const app=express();
const port=7111;

app.use(Cors())
app.use(express.json())
mongoose.connect(process.env.DATABASE_STRING).then(console.log("Mongodb Connected!"));
const store=new MongoDBSession({
    uri:process.env.DATABASE_STRING,
    collection:'session',
})
store.on('error',(e)=>console.log(e.messsage))

app.use(session({
    name:'csid',
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    store:store,
    cookie:{
        secure:true,
        maxAge:10*24*60*1000,
        sameSite:'none'
    }
}))

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        let storeLocation=(__dirname.split('api')[0]+'data/profiles')
        cb(null,storeLocation)
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+"_"+file.fieldname+"__"+path.extname(file.originalname))
    }
})
const upload=multer({storage:storage})

const videoStorage=multer.diskStorage({
    destination:function(req,file,cb){
        if(!req.folder){
            const folderName= `instructor_${req.params.id}_course_${Date.now()}`;
            const storeLocation=path.join(__dirname.split('api`')[0],'data/courses',folderName)
            req.folder=storeLocation
            console.log(req.folder)
            fs.mkdirSync(storeLocation,{recursive:true});
        }
        cb(null,req.folder)
    },filename:function(req,file,cb){
        const filename=`${Date.now()}_lecture_${path.extname(file.originalname)}`
        console.log(filename)
        cb(null,filename)
    },
})
const uploadVideo=multer({storage:videoStorage})

app.get('/',(req,res)=>{
    res.json({message:'Welcome'})
})

app.post('/user/signup',async(req,res)=>{
    try{
        const user=await User.create({
            email:req.body.email,
            uname:req.body.uname,
            contact:req.body.contact,
            password:await bcrypt.hash(req.body.password,11),
        })
        console.log(user)
        res.json({status:200,message:"success"})
    }catch(e){
        console.log(e.message)
        res.json({status:404 ,error:e.message})
    }
})
app.post('/user/login',async(req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email});
        if(await bcrypt.compare(req.body.password,user.password)){
            let x={email:user.email,name:user.uname,id:user._id}
            req.session.user=x;
            res.json({status:200,message:"success",data:x})
        }else{
            res.json({status:402,message:"Incorrect Email or Password"})
        }
    }catch(e){
        console.log(e.message)
        res.json({status:404 ,error:e.message})
    }
})

app.post('/instructor/signup',async(req,res)=>{
    try{
        const user=await Instructor.create({
            email:req.body.email,
            iname:req.body.iname,
            contact:req.body.contact,
            password:await bcrypt.hash(req.body.password,11),
        })
        console.log(user)
        res.json({status:200,message:"success"})
    }catch(e){
        console.log(e)
        res.json({status:404 ,error:e.message})
    }
})

app.post('/instructor/login',async(req,res)=>{
    try{
        const user=await Instructor.findOne({email:req.body.email});
        if(user===null){
            res.json({status:400,message:"User doesn't exists"})
        }
        else if(await bcrypt.compare(req.body.password,user.password)){
            let x={email:user.email,name:user.iname,id:user._id,bio:user.bio?user.bio:"",profile:user.profile?user.profile:""}
            req.session.instructor=x;
            res.json({status:200,message:"success",data:x})
        }else{
            res.json({status:402,message:"Incorrect Email or Password"})
        }
    }catch(e){
        console.log(e.message)
        res.json({status:404 ,error:e.message})
    }
})

app.post('/instructor/update/profile',upload.single('profile'),async(req,res)=>{
    try{
        let user=await Instructor.findOne({email:req.body.email})
        if(user.profile){
            fs.unlink(`${__dirname.split('api')[0]}/public/data/profile/${user.profile}`,(err)=>{
                if(err) {
                    console.log(err)
                }else{
                    console.log("Previous profile deleted successfully!")
                }
            });
        }
        user=await Instructor.findOneAndUpdate({email:req.body.email},
            { $set:{
            bio:req.body.bio,
            profile:req.file.filename,
            iname:req.body.username
        }},
            {new: true}
        )
        console.log(user)
        console.log({name:user.iname,bio:user.bio,email:user.email,profile:user.profile,id:user._id})
        res.json({status:200,message:"success",data:{name:user.iname,bio:user.bio,email:user.email,profile:user.profile,id:user._id}})
        
    }catch(e){
        console.log(e.message)
        res.json({status:404,message:e.message})
    }
})

app.post('/instructor/addnewcourse/:id',uploadVideo.fields([{name:'thumbnail'},{name:'lecture',maxCount:100}]),async(req,res)=>{
    try{
        console.log(req.files)
        let instructor=await Instructor.findOne({_id:req.body.id})
        if(instructor){
            let body=req.body
            let files=req.files
            let lecturearray=[]
            for(let i=0;i<files.lecture.length;i++){
                let obj={
                    video:files.lecture[i].destination,
                    title:req.body.title[i],
                    description:req.body.description[i]
                }
                lecturearray.push(obj)
            }
            const course=await Courses.create({
                iid:body.id,
                iname:instructor.iname,
                email:instructor.email,
                title:body.coursetitle,
                description:body.bio,
                price:body.price,
                // thumbnail:(req.files[0].fieldname==='thumbnail'?req.files[0].destination:"Error in upload"),
                lectures:lecturearray,
                validtill:Date.now()+body.validity*24*60*60*1000
            })
            instructor=await Instructor.findOneAndUpdate({_id:body.id},{$addToSet:{courseId:course._id}},{new:true})
            console.log(instructor)

            res.json({status:200,message:"Files uploaded!Cheers"})
        }else{
            res.json({status:404,message:"Instructor Id Altered!!"})
        }
    }catch(e){
        console.log(e.message)
        fs.rm(req.folder, { recursive: true }); 
        res.json({status:e.status,message:e.message})
    }
})
app.get('/get/all/courses',async(req,res)=>{
    try{
        let courses=await Courses.find().toArray()
        console.log(courses)
        let data=[];
        courses.foreach((course)=>{
            let obj={
                id:course._id,
                iid:course.iid,
                name:course.iname,
                thumbnail:course.thumbnail?course.thumbnail:"",
                title:course.title,
                uploadDate:course.uploadDate,
                validity:course.validtill,
                length:course.lectures.length
            }
            data.push(obj)
        })
        console.log(data)
        res.json({status:200,data:data})
    }catch(e){
        console.log(e.message)
        res.json({status:e.status,message:e.message})
    }
})
app.listen(port,()=>{
    console.log(`Server up on ${port}`)
})