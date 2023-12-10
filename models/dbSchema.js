const {mongoose}=require('mongoose')

const UserSchema=new mongoose.Schema({
    uname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    contact:{type:Number,required:true},
    password:{type:String,required:true},
    isVerified:{type:Boolean,required:false,default:false},
    isVerifiedContact:{type:Boolean,required:false,default:false},
    profile:{type:Boolean,required:false},//later on add default image name so that if image isn't available then it can use randome image;
},{collection:'user-details'},{strict: true})
const User=mongoose.model('User',UserSchema);

const paidUserSchema=new mongoose.Schema({ 
    purchasedDate:{type:Date,required:true},
    validTill:{type:Date,required:true},
    amount:{type:Number,required:true},
    courseId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
        required:true,unique:true
    }],
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,unique:true},
},{collection:'paid-user-details'},{strict: true});
const PaidUser=mongoose.model('PaidUser',paidUserSchema);

const instructorSchema=new mongoose.Schema({
    iname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    contact:{type:Number,required:true},
    password:{type:String,required:true},
    isVerified:{type:Boolean,required:false,default:false},
    isVerifiedContact:{type:Boolean,required:false,default:false},
    profile:{type:String,required:false},
    bio:{type:String,required:false},
    courseId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses",
        required:false,unique:true
    }],
},{collection:'instructor-details'},{strict: true});
const Instructor=mongoose.model('Instructor',instructorSchema);

const coursesSchema=new mongoose.Schema({
    iid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Instructor",
        required:true
    },
    iname:{type:String,required:true},
    email:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    thumbnail:{type:String,required:false}, 
    lectures:[{
        video:{type:String,required:true},
        title:{type:String,required:true},
        description:{type:String,required:true}
    }],
    uploadDate:{type:Date,required:false,default: Date.now()},
    validtill:{type:Date,required:true}
},{collection:'courses-details'},{strict: true})
const Courses=mongoose.model('Courses',coursesSchema);

module.exports={
    User,
    PaidUser,
    Instructor,
    Courses
}