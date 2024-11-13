// FRAMEWORK CONFIGURATION
const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const app = express();
const path= require("path")
var hbs = require('hbs');
const User = require("./models/userModel")
const bcrypt= require("bcrypt")
const {generateToken}= require("./middleware/jwtMiddleware")
hbs.registerPartials(__dirname + '/views/partials', function (err) { });
// env file config
const dotenv = require("dotenv");

const multer = require('multer');
const Blog = require("./models/Blog");
// const upload = multer({ dest: 'uploads/' })

//for parsing form data 
app.use(express.urlencoded({extended:false}))


app.use("/uploads",express.static(path.join(__dirname,"uploads")));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage:storage })

app.set('view engine', 'hbs');
dotenv.config();

connectDb();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


// Route for User Registration and Authentication
app.use("/api/user", require("./routes/userRoutes"));

//Route for Newsletter - Newsletter is kind of Blog
app.use("/api/newsletter",require("./routes/newsletterRoutes"))

app.use("/api/doctor", require("./routes/doctorsDetails"));


// Error handling middleware
app.use(errorHandler);


// ROUTES BELOW
app.get('/', (req, res) => {
    res.send("working");
});
app.get("/home", (req, res) => {
    // let user= User.findOne({id:})
    res.render("home")
})

app.get("/register", (req,res)=>{
    res.render("register");
})
app.get("/allusers", (req, res) => {
    res.render("users", {
        users: [{ id: 1, username: "Nitesh", age: 23 }, { id: 1, username: "Akash", age: 24 }]
    })
})

// app.post('/profile', upload.single('avatar'), function (req, res, next) {
//     console.log(req.body);
//     console.log(req.file);
//   })







app.post('/blogs', upload.single('blogimage'), async function (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    let {title} = req.body;
    let {path} = req.file;
    let newBlog= new Blog({
        title:title,
        imageURL:path
    })
    await newBlog.save()
    return res.redirect("/home");
})
app.get("/blogs",async (req,res)=>{
    let allBlogs= await Blog.find();
    res.render("Blog",{
        blogs:allBlogs
    })

})


// APP CONFIG START
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
