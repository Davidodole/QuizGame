// requiring npm packages
const express =require("express");
const ejs = require("ejs");
const pg = require("pg");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy
const bodyParser = require("body-parser");
require("dotenv").config();
const bcrypt = require("bcrypt");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const loginmail = require("./gmailLogin");
const registermail = require("./gmailRegister");
const FacebookStrategy = require("passport-facebook")
const saltRound = 15

// connection to database 
const db = new pg.Client({
    user: "postgres",
    host: 'localhost',
    database: "Quiztable",
    password: "david",
    port: 5432,
});
db.connect().then(()=> console.log("database connected!"));

// require the express to app variable 
const app = express();

// middleware of the website 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret: process.env.MY_SECTRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// handling the post request from the route 
app.post("/",passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/register"
}));
app.post("/register", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    
    // try and catch method 
    try{
        const userRow = await db.query(
            "SELECT * FROM quizstorage WHERE username = $1",
            [username]
        );
        if(userRow.rows.length > 0){
            res.send("User Already exit")
        }else{
        bcrypt.hash(password, saltRound, (err, hash)=>{
            if(err) throw err;
            const userStore = db.query(
                "INSERT INTO quizstorage(username, password) VALUES($1, $2)",
                [username, hash]
            );
            res.redirect("/");
            registermail.signUp(username);
        })
    }
    } catch(error){
        return error;
    }
})



// handling the google router path 
app.get("/auth/google",passport.authenticate("google",{
    scope: ["profile", "email"],
}));
app.get("/auth/google/success", passport.authenticate("google",{
    successRedirect: "/success",
    failureRedirect: "/",
}));

// handling the facebook router path
app.get('/auth/facebook',passport.authenticate('facebook',{
    scope: ['user_friends' ] 
}));

app.get('/auth/facebook/success',passport.authenticate('facebook', {
    successRedirect: "/success",
    failureRedirect: "/",
}));

// handling get route 
app.get("/",(req, res)=>{
    res.render("index")
});
app.get("/register", (req, res)=>{
    res.render("register");
});
app.get("/success",(req, res)=>{
    if(req.isAuthenticated()){
        res.render("success");
    }else{
        res.redirect("/");
    }
});



// local login passport.strategies 
passport.use(
    "local",
    new LocalStrategy( async(username, password, cb)=>{
        try{
            const userRow = await db.query(
                "SELECT * FROM quizstorage WHERE username = $1",
                [username],
            );
            if(userRow.rows.length > 0){
                const userID = userRow.rows[0]
                const hashed = userID.password;
                bcrypt.compare(password, hashed, (err, result)=>{
                    if(err){
                        cb(err)
                    }else{
                        if(result){
                            return cb(null, userID);
                            registermail.signUp(username);
                        }else{
                            return cb("please check your email or password");
                        }
                    }
                });
            }else{
                return cb(null, false);
                loginmail.Login(profile.email)
            }
        }catch (error){
            cb(error)
        }
    })
    );

// google login authentication 
passport.use(
    "google",
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:4000/auth/google/success",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },async (accessToken, refreshToken, profile, cb)=>{
        
        // // try and catch any errors 
        try{
            const checkUser = await db.query(
                "SELECT * FROM quizstorage WHERE username = $1",
                [profile.emails[0].value]
            )
            if(checkUser.rows.length === 0){
                const userSave = db.query(
                    "INSERT INTO quizstorage(username, password) VALUES($1, $2)",
                    [profile.emails[0].value, profile.id],(err, result)=>{
                        if(err){
                            return cb(err)
                        }else{
                            return cb(null, result);
                            registermail.signUp(profile.email)
                        }
                    }
                )
            }else{
                return cb(null, checkUser.rows[0]);
                loginmail.Login(profile.email)
            }
        }catch(err){
            return cb(err);
        }
    }
));


// facebook login passport.strategies 
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:4000/auth/facebook/success",
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, cb)=>{
    
    try{
        const userRow = await db.query(
            "SELECT * FROM quizstorage WHERE username = $1",
            [profile.displayName || profile.email],
        );
        if(userRow.rows.length === 0){
            const UserSaveData = db.query(
                "INSERT INTO quizstorage (username, password) VALUES ($1, $2)",
                [profile.displayName || profile.email, profile.id]
            )
            return cb(null, UserSaveData);
            registermail.signUp(profile.email)
        }
        else{
            return cb(null, userRow.rows[0]);
            loginmail.Login(profile)
        }
    }catch (error){
        console.log(error);
    }
})
)







passport.serializeUser((user, cb)=>{
    return cb(null, user)
});
passport.deserializeUser((user, cb)=>{
    return cb(null, user)
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`http://127.0.0.1:${PORT}`))