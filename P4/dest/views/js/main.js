function logAverageFrame(a){for(var b=a.length,c=0,d=b-1;d>b-11;d--)c+=a[d].duration;console.log("Average time to generate last 10 frames: "+c/10+"ms")}function updateBackgroundFloaterPositions(){timer&&window.clearTimeout(timer),timer=window.setTimeout(function(){window.performance.mark("mark_start_frame");for(var a,b,c,d=document.body.scrollTop/1250,e=document.getElementsByClassName("mover"),f=e.length,g=0;f>g;g++)a=e[g],b=Math.sin(d+g%10),c=Math.floor(a.basicLeft+100*b),a.style.left=c+"px";if(window.performance.mark("mark_end_frame"),window.performance.measure("measure_frame_duration","mark_start_frame","mark_end_frame"),++frame%10===0){var h=window.performance.getEntriesByName("measure_frame_duration");logAverageFrame(h)}},10)}function createMorePizzas(){for(var a=document.getElementById("randomPizzas"),b=0;3>b;b++){var c=pizzaElementGenerator(b);a.appendChild(c)}}function createMoreBackgroundFloaters(a){var b=document.createElement("img");b.className="mover",b.src="img/pizza.png",b.style.height="100px",b.style.width="73.333px";for(var c,d=document.getElementById("movingPizzas1"),e=0,f=8,g=3,h=f*g,i=256,j=0;h>j;j++)c=b.cloneNode(!1),c.basicLeft=j%f*i,e=Math.floor(j/f)*i+lastFloaterTop,c.style.top=e+"px",d.appendChild(c),a||j%f!=0||(console.log("UP IT",j),lastFloaterTop+=i)}function infinitePizzas(){updateBackgroundFloaterPositions(),window.innerHeight+window.scrollY>=document.body.offsetHeight&&(createMorePizzas(),createMoreBackgroundFloaters(!1))}var lastFloaterTop=0,currentWidth="33.3%",frame=0,ingredientItemizer=function(a){return"<li>"+a+"</li>"},makeRandomPizza=function(){for(var a="",b=Math.random(),c=Math.floor(4*b),d=Math.floor(3*b),e=Math.floor(2*b),f=0;c>f;f++)a+=ingredientItemizer(selectRandomMeat());for(var g=0;d>g;g++)a+=ingredientItemizer(selectRandomNonMeat());for(var h=0;e>h;h++)a+=ingredientItemizer(selectRandomCheese());return a+=ingredientItemizer(selectRandomSauce()),a+=ingredientItemizer(selectRandomCrust())},pizzaElementGenerator=function(a){var b,c,d,e,f,g;return b=document.createElement("div"),c=document.createElement("div"),d=document.createElement("img"),e=document.createElement("div"),b.classList.add("randomPizzaContainer"),b.style.width=currentWidth,b.style.height="325px",b.id="pizza"+a,c.classList.add("col-md-6"),d.src="img/pizza.png",d.classList.add("img-responsive"),c.appendChild(d),b.appendChild(c),e.classList.add("col-md-6"),f=document.createElement("h4"),f.innerHTML=randomName(),e.appendChild(f),g=document.createElement("ul"),g.innerHTML=makeRandomPizza(),e.appendChild(g),b.appendChild(e),b},resizePizzas=function(a){function b(a){var b=document.getElementById("pizzaSize");switch(a){case"1":return void(b.innerHTML="Small");case"2":return void(b.innerHTML="Medium");case"3":return void(b.innerHTML="Large");default:console.log("bug in changeSliderLabel")}}function c(a,b){function c(a){switch(a){case"1":return.25;case"2":return.3333;case"3":return.5;default:console.log("bug in sizeSwitcher")}}var d=a.offsetWidth,e=document.getElementById("randomPizzas").offsetWidth,f=d/e,g=c(b),h=(g-f)*e;return h}function d(a){for(var b=document.getElementsByClassName("randomPizzaContainer"),d=b[0],e=c(d,a),f=d.offsetWidth+e+"px",g=b.length,h=0;g>h;h++)b[h].style.width=f,currentWidth=f}window.performance.mark("mark_start_resize"),b(a),d(a),window.performance.mark("mark_end_resize"),window.performance.measure("measure_pizza_resize","mark_start_resize","mark_end_resize");var e=window.performance.getEntriesByName("measure_pizza_resize");console.log("Time to resize pizzas: "+e[0].duration+"ms")};window.performance.mark("mark_start_generating"),window.performance.mark("mark_end_generating"),window.performance.measure("measure_pizza_generation","mark_start_generating","mark_end_generating");var timeToGenerate=window.performance.getEntriesByName("measure_pizza_generation");console.log("Time to generate pizzas on load: "+timeToGenerate[0].duration+"ms");var timer;document.addEventListener("DOMContentLoaded",function(){createMoreBackgroundFloaters(!0),updateBackgroundFloaterPositions()}),window.addEventListener("scroll",infinitePizzas);