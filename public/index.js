const addingValue = 0,
    h2 = document.querySelector("h2"),
    inputValue = document.getElementById("inputValue"),
    result = document.querySelector("correct");


    const LoadQuestion = ()=>{
    const callback = fetch("https://opentdb.com/api.php?amount=50&type=multiple")
    .then(res => res.json())
    .then(datas =>{
        let resulJson  = datas.results;
        resulJson.forEach(data => {
            h2.innerHTML = data.question;
            let answer = data.correct_answer;

            
            if(inputValue === answer){
                result.innerHTML = "Correct ✔";
            }
            else{
                result.innerHTML = "Failed ❌"
            }
        });
    })
}
LoadQuestion();




















