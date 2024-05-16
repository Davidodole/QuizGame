const addingValue = 0,
    h2 = document.querySelector("h2"),
    inputValue = document.getElementById("inputValue"),
    result = document.querySelector("correct"),
    roundomNumber  = Math.floor(Math.random() * 49) + 1,
    category = document.getElementById("category"),
    next = document.querySelector(".next");

    createElement = ()=>{
        
    };


    // const LoadQuestion = ()=>{
    // const callback = fetch("https://opentdb.com/api.php?amount=50&type=multiple")
    // .then(res => res.json())
    // .then(datas =>{
    //     h2.innerHTML = datas.results[roundomNumber].question;
    //     let answers_present = datas.results[roundomNumber].incorrect_answers + datas.results[roundomNumber].correct_answer;
    //     let mapAnswer = answers_present.map()
    //     console.log(mapAnswer);
    //     next.appendChild(li);
    // })
// }/
LoadQuestion();



















