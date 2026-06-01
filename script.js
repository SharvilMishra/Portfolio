const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);

/* Galaxy Background */
(function(){
const c=document.getElementById('galaxy'),ctx=c.getContext('2d');
let w,h,scrollY=0,stars=[];
const cols=["rgba(255,255,255,","rgba(200,210,255,","rgba(180,190,255,","rgba(160,170,240,","rgba(140,150,220,"];
function resize(){
const hero=document.getElementById('home');
w=c.width=hero.offsetWidth;h=c.height=hero.offsetHeight;init();
}
function init(){
stars=[];
const count=Math.floor((w*h)/1800);
for(let i=0;i<count;i++){
stars.push({
x:Math.random()*w,y:Math.random()*h,
r:Math.random()*1.8+.2,
layer:Math.random()<.5?0:Math.random()<.6?1:2,
op:Math.random()*.7+.3,
tw:Math.random()*6.28,
tws:Math.random()*.015+.005,
c:cols[Math.random()*cols.length|0]
});
}
}
function draw(){
ctx.clearRect(0,0,w,h);
const speeds=[.02,.08,.2];
for(let p of stars){
p.tw+=p.tws;
const tw=Math.sin(p.tw)*.3+.7;
const yOff=scrollY*speeds[p.layer];
let dy=(p.y-yOff)%h;
if(dy<0)dy+=h;
const a=p.op*tw;
ctx.beginPath();ctx.arc(p.x,dy,p.r,0,6.28);
ctx.fillStyle=p.c+a+')';ctx.fill();
if(p.r>1.4){
ctx.beginPath();ctx.arc(p.x,dy,p.r*3,0,6.28);
ctx.fillStyle=p.c+(a*.08)+')';ctx.fill();
}
}
requestAnimationFrame(draw);
}
window.addEventListener('scroll',()=>{scrollY=window.pageYOffset;},{passive:true});
window.addEventListener('resize',resize);
resize();draw();
})();

/* Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyAPoMnl-UEdgHvizAsoBvx4GyR42zYtxsw",
  authDomain: "portfolio-aafd6.firebaseapp.com",
  projectId: "portfolio-aafd6",
  storageBucket: "portfolio-aafd6.firebasestorage.app",
  messagingSenderId: "970948912325",
  appId: "1:970948912325:web:d3e57fb8f2ea237cad3cac"
};


/* Theme */
const themeToggle=$('#themeToggle'),html=document.documentElement;
const savedTheme=localStorage.getItem('theme')||'dark';
html.setAttribute('data-theme',savedTheme);
themeToggle.addEventListener('click',()=>{
const curr=html.getAttribute('data-theme'),next=curr==='dark'?'light':'dark';
html.setAttribute('data-theme',next);localStorage.setItem('theme',next);
});

/* Hamburger */
const hamburger=$('#hamburger'),navLinks=$('#navLinks');
hamburger.addEventListener('click',()=>{
hamburger.classList.toggle('active');navLinks.classList.toggle('open');
hamburger.setAttribute('aria-expanded',navLinks.classList.contains('open'));
});
navLinks.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{
hamburger.classList.remove('active');navLinks.classList.remove('open');
hamburger.setAttribute('aria-expanded','false');
}));

/* Sticky navbar */
const navbar=$('#navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>50));

/* Active section */
const sections=$$('section[id]');
const navObs=new IntersectionObserver(entries=>{
entries.forEach(e=>{if(e.isIntersecting){
 $$('.nav-link').forEach(l=>l.classList.remove('active'));
const a=$(`.nav-link[href="#${e.target.id}"]`);
if(a)a.classList.add('active');
}});
},{rootMargin:'-40% 0px -55% 0px'});
sections.forEach(s=>navObs.observe(s));

/* Reveal animations */
const revealObs=new IntersectionObserver(entries=>{
entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target);}});
},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
 $$('.reveal').forEach(el=>revealObs.observe(el));

/* Safety: force visible if already in viewport */
setTimeout(()=>{$$('.reveal:not(.visible)').forEach(el=>{
const r=el.getBoundingClientRect();
if(r.top<window.innerHeight&&r.bottom>0)el.classList.add('visible');
});},300);

/* Typing effect */
const titles=['Software Developer','Web Developer','Game Developer'];
let ti=0,ci=0,deleting=false;
const typeEl=$('#typingText');
function typeLoop(){
const current=titles[ti];
typeEl.textContent=deleting?current.substring(0,ci--):current.substring(0,ci++);
if(!deleting&&ci>current.length){setTimeout(()=>{deleting=true;typeLoop();},1800);return;}
if(deleting&&ci<0){deleting=false;ti=(ti+1)%titles.length;setTimeout(typeLoop,400);return;}
setTimeout(typeLoop,deleting?40:80);
}
typeLoop();

/* Counter animation */
let counterDone=false;
const counterObs=new IntersectionObserver(entries=>{
entries.forEach(e=>{if(e.isIntersecting&&!counterDone){
counterDone=true;
 $$('.stat-num').forEach(el=>{
const target=+el.dataset.target;let c=0;
const step=Math.max(1,Math.floor(target/40));
const timer=setInterval(()=>{c+=step;if(c>=target){c=target;clearInterval(timer);}el.textContent=c;},30);
});
}});
},{threshold:0.5});
const aboutSection=$('#about');
if(aboutSection)counterObs.observe(aboutSection);

/* GitHub API */
async function fetchGitHub(){
try{
const[userRes,repoRes]=await Promise.all([
fetch('https://api.github.com/users/SharvilMishra'),
fetch('https://api.github.com/users/SharvilMishra/repos?sort=updated&per_page=6')
]);
const user=await userRes.json(),repos=await repoRes.json();
 $('#ghRepos').textContent=user.public_repos||0;
 $('#ghFollowers').textContent=user.followers||0;
 $('#ghFollowing').textContent=user.following||0;
const langColors={JavaScript:'#f7df1e',HTML:'#e34c26',CSS:'#563d7c','C++':'#f34b7d',Python:'#3572A5'};
const repoContainer=$('#githubRepos');
repoContainer.innerHTML=repos.map(r=>{
const lang=r.language||'Other',color=langColors[lang]||'#999';
return`<div class="repo-card"><h4>${r.name}</h4><p>${r.description||'No description'}</p><div class="repo-card-footer"><span class="repo-lang"><span class="repo-lang-dot" style="background:${color}"></span>${lang}</span><span class="repo-stars"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${r.stargazers_count}</span></div><a href="${r.html_url}" target="_blank" rel="noopener" class="repo-link">View Repo →</a></div>`;
}).join('');
}catch(err){console.warn('GitHub fetch failed:',err);}
}
fetchGitHub();

/* Contact form */
const form=$('#contactForm'),submitBtn=$('#submitBtn'),feedback=$('#formFeedback');
function setError(id,msg){const el=$(`#${id}`);el.textContent=msg;el.previousElementSibling.classList.add('error');}
function clearErrors(){$$('.form-error').forEach(e=>e.textContent='');$$('.form-group input,.form-group textarea').forEach(e=>e.classList.remove('error'));}
function validateEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}

form.addEventListener('submit',async e=>{
e.preventDefault();clearErrors();feedback.className='form-feedback';feedback.style.display='none';
const name=$('#formName').value.trim(),email=$('#formEmail').value.trim(),
subject=$('#formSubject').value.trim(),message=$('#formMessage').value.trim();
let valid=true;
if(!name){setError('nameError','Name is required.');valid=false;}
if(!email){setError('emailError','Email is required.');valid=false;}
else if(!validateEmail(email)){setError('emailError','Enter a valid email.');valid=false;}
if(!subject){setError('subjectError','Subject is required.');valid=false;}
if(!message){setError('messageError','Message is required.');valid=false;}
if(!valid)return;
submitBtn.disabled=true;submitBtn.textContent='Sending...';
try{
await db.collection('contacts').add({
name,email,subject,message,
timestamp:firebase.firestore.FieldValue.serverTimestamp()
});
feedback.textContent='Message sent successfully! I\'ll get back to you soon.';
feedback.className='form-feedback success';form.reset();
}catch(err){
feedback.textContent='Failed to send message. Please try again or email directly.';
feedback.className='form-feedback error';
}
submitBtn.disabled=false;submitBtn.textContent='Send Message';
});



