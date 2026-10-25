(()=>{
const questions=[
{q:'Which planet is closest to the Sun?',options:['Venus','Mercury','Earth','Mars'],answer:1,why:'Mercury travels around the Sun inside the orbits of all the other planets.'},
{q:'Which is the largest planet in our solar system?',options:['Earth','Saturn','Neptune','Jupiter'],answer:3,why:'Jupiter is the largest planet, with a diameter roughly eleven times Earth’s.'},
{q:'Which planet has the hottest surface?',options:['Mercury','Venus','Mars','Jupiter'],answer:1,why:'Venus’s thick atmosphere traps heat through a powerful greenhouse effect.'},
{q:'What holds the planets in orbit around the Sun?',options:['Solar wind','Magnetism alone','Gravity','Earth’s rotation'],answer:2,why:'The Sun’s gravity pulls the moving planets inward, continually bending their paths into orbits.'},
{q:'Which planet is known as the Red Planet?',options:['Mars','Neptune','Venus','Uranus'],answer:0,why:'Iron minerals in Mars’s surface oxidize, giving its dust a rusty red color.'},
{q:'What are Saturn’s rings mostly made of?',options:['Liquid water','Ice particles and rocky debris','Glowing gas','Clouds of steam'],answer:1,why:'Saturn’s rings consist mostly of ice particles, with smaller amounts of rocky material and dust.'},
{q:'Where is the main asteroid belt?',options:['Between Earth and Mars','Beyond Neptune','Inside Mercury’s orbit','Between Mars and Jupiter'],answer:3,why:'Most main-belt asteroids orbit the Sun between Mars and Jupiter.'},
{q:'Which planet rotates almost on its side?',options:['Saturn','Earth','Uranus','Mercury'],answer:2,why:'Uranus has an axial tilt of about 98 degrees, so its rotation looks tipped onto its side.'},
{q:'What powers the Sun?',options:['Nuclear fusion','Burning coal','Electric batteries','Volcanic eruptions'],answer:0,why:'In the Sun’s core, hydrogen nuclei fuse into helium, releasing enormous amounts of energy.'},
{q:'Which planet takes the longest to orbit the Sun?',options:['Jupiter','Neptune','Saturn','Earth'],answer:1,why:'Neptune takes about 165 Earth years to complete one orbit.'}
];
const dialog=document.querySelector('#quiz-dialog'),content=document.querySelector('#quiz-content');
let index=0,score=0,answered=false;
function render(){
 answered=false;const question=questions[index];content.replaceChildren();
 const progress=document.createElement('div');progress.className='quiz-meta';progress.textContent=`QUESTION ${index+1} / ${questions.length} · SCORE ${score}`;
 const bar=document.createElement('progress');bar.max=questions.length;bar.value=index;bar.setAttribute('aria-label','Quiz progress');
 const title=document.createElement('h2');title.id='quiz-title';title.textContent=question.q;
 const options=document.createElement('div');options.className='quiz-options';
 const feedback=document.createElement('p');feedback.className='quiz-feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const next=document.createElement('button');next.className='quiz-next';next.hidden=true;next.textContent=index===questions.length-1?'See my score →':'Next question →';
 question.options.forEach((text,i)=>{const button=document.createElement('button');button.className='quiz-option';button.textContent=`${String.fromCharCode(65+i)}.  ${text}`;button.onclick=()=>{
  if(answered)return;answered=true;const correct=i===question.answer;if(correct)score++;
  [...options.children].forEach((b,j)=>{b.disabled=true;if(j===question.answer)b.classList.add('correct');else if(j===i)b.classList.add('incorrect');});
  progress.textContent=`QUESTION ${index+1} / ${questions.length} · SCORE ${score}`;bar.value=index+1;
  feedback.textContent=(correct?'Correct. ':'The answer is '+question.options[question.answer]+'. ')+question.why;
  next.hidden=false;next.focus();
 };options.appendChild(button);});
 next.onclick=()=>{index++;if(index<questions.length){render();content.querySelector('.quiz-option').focus();}else finish();};
 content.append(progress,bar,title,options,feedback,next);
}
function finish(){
 content.replaceChildren();const label=document.createElement('div');label.className='quiz-meta';label.textContent='MISSION COMPLETE';
 const title=document.createElement('h2');title.id='quiz-title';title.textContent=`${score} / ${questions.length}`;title.className='quiz-score';
 const message=document.createElement('p');message.textContent=score===10?'Perfect score. You know your solar system.':score>=7?'Great exploring. You know a lot about our cosmic neighborhood.':'Keep exploring the planets, then try another mission.';
 const restart=document.createElement('button');restart.className='quiz-next';restart.textContent='Try again';restart.onclick=()=>{index=score=0;render();content.querySelector('.quiz-option').focus();};
 const done=document.createElement('button');done.className='quiz-return';done.textContent='Return to the solar system';done.onclick=()=>dialog.close();content.append(label,title,message,restart,done);restart.focus();
}
document.querySelector('#open-quiz').onclick=()=>{index=score=0;render();dialog.showModal();content.querySelector('.quiz-option').focus();};
document.querySelector('#close-quiz').onclick=()=>dialog.close();
})();
