let answer_container = document.querySelectorAll('.answer');
let radioInput = document.querySelectorAll('input');
let submitBtn = document.querySelector(".submit-btn");
let questionCount = document.querySelector('.count span');
let title = document.querySelector('h2');
let answer_1 = document.querySelector('label[for="answer-1"]');
let answer_2 = document.querySelector('label[for="answer-2"]');
let answer_3 = document.querySelector('label[for="answer-3"]');
let answer_4 = document.querySelector('label[for="answer-4"]');
var radios = document.getElementsByName("questions");
let labels = document.querySelectorAll('label');
let secondsElement = document.querySelector('.seconds span');





fetchData();


async function fetchData() {

   let response = await fetch('js.json');
   let data = await response.json();
   let score = 0;
   let currentIndex = 0;
   let submitBtnDisabled = false;
   let answered = false;

   data.sort(() => Math.random() - 0.5);

   questionCount.innerText = data.length;

   for (let i = 0; i < data.length; i++) {
      let span = document.createElement('span');
      document.querySelector('.spans').append(span);
   }
   let bullets = document.querySelectorAll('.spans span');
   let randomAnswer = [1, 2, 3, 4];
   randomAnswer.sort((a, b) => 0.5 - Math.random());

   let time;
   function timer() {
      secondsElement.innerText = 5;

      clearInterval(time);

      time = setInterval(() => {
         let seconds = parseInt(secondsElement.innerText);
         seconds--;
         secondsElement.innerText = seconds;

         if (seconds === 0) {
            if (!answered) {
               highlightCorrectAnswer();
            }
            if (currentIndex < data.length - 1) {
               currentIndex += 1;
               answered = false;
               timer();
            } else {
               clearInterval(time);
               popup();
            }
            setTimeout(() => {

               changeQuestions();
            }, 700);




         }

      }, 1000);
   }

   timer();


   changeQuestions();


   function changeQuestions() {
      title.innerText = data[currentIndex]['title'];
      answer_1.innerText = data[currentIndex][`answer-${randomAnswer[0]}`];
      answer_2.innerText = data[currentIndex][`answer-${randomAnswer[1]}`];
      answer_3.innerText = data[currentIndex][`answer-${randomAnswer[2]}`];
      answer_4.innerText = data[currentIndex][`answer-${randomAnswer[3]}`];
      bullets[currentIndex].style.backgroundColor = 'var(--main-color)';
   }

   submitBtn.addEventListener('click', handleSubmit);


   function handleSubmit() {
      if (currentIndex < data.length && !submitBtnDisabled) {
         submitBtnDisabled = true;
         answered = true;
         let theAnswer;
         let radioInput;
         for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
               radioInput = radios[i];
               theAnswer = document.querySelector(`#${radioInput.id} + label`).innerText;
               break;
            }
         }

         if (theAnswer === data[currentIndex]['right-answer']) {
            radioInput.parentElement.style.backgroundColor = 'green';
            radioInput.parentElement.style.color = 'white';
            score++;
         } else {

            highlightCorrectAnswer();



            radioInput.parentElement.style.backgroundColor = 'red';
            radioInput.parentElement.style.color = 'white';
         }

         clearInterval(time);
         secondsElement.innerText = 5;
         timer();


         currentIndex++;

         setTimeout(() => {
            submitBtnDisabled = false;
            if (currentIndex < data.length) changeQuestions();
            randomAnswer.sort(() => Math.random() - 0.7);
            radioInput.parentElement.style.backgroundColor = 'transparent';
            radioInput.parentElement.style.color = 'var(--main-color)';
            labels.forEach(label => label.parentElement.style.backgroundColor = 'transparent'
            );
         }, 700);

      }

      if (currentIndex == data.length) {
         popup();
      }
   }


   function popup() {

      swal({
         title: score > data.length / 2 ? "Good job , you succeeded !" : 'you failed',
         text: `you answered ${score} question correctly  from ${data.length}`,
         icon: "success",
         button: "X",
      }).then(clearInterval(time)).then(() => location.reload()
      );
   }





   function highlightCorrectAnswer() {
      labels.forEach((label) => {
         if (label.innerText === data[currentIndex]['right-answer']) {
            label.parentElement.style.backgroundColor = 'green';
            label.parentElement.style.color = 'white';
            setTimeout(() => {
               label.parentElement.style.backgroundColor = 'transparent';

               label.parentElement.style.color = 'var(--main-color)';
            }, 700);
         }
      });
   }






}


answer_container.forEach((element, index) => {
   element.addEventListener('click', function () {
      radioInput[index].checked = true;
   });
});









