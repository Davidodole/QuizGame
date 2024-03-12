// craeting a DOM variables 
const form = document.querySelector("form");
const text = document.getElementById("text");

form.addEventListener("submit", (e)=>{
    console.log(e);
    if(e.target[0,1].value.length === 0){
        e.preventDefault();
        if(e.target[0].value.length === 0){
            text.innerHTML = "please type in username or email";
        }
        else if(e.target[1].value.length === 0){
            text.innerHTML = "please input your password";
        }else{
            if(e.target[1].value.length > 0){
                console.log("correct!");
            }
        }
    }else if(e.target[2].id === "confirmPassword"){
        if(e.target[2].value.length === 0){
            e.preventDefault()
            text.innerHTML = "please confirm your Password";
        }else{
            if(e.target[1].value === e.target[2].value){
                text.innerHTML = "All Good 👍";
            }
            else{
                e.preventDefault()
                text.innerHTML = "There was a password mismatch!";
            }
        }
    }else{
        
    }
})
