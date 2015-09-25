function logAverageFrame(a){for(var b=a.length,c=0,d=b-1;d>b-11;d--)c+=a[d].duration;console.log("Average time to generate last 10 frames: "+c/10+"ms")}function createPizzas(){for(var a=document.getElementById("randomPizzas"),b=2;100>b;b++){var c=pizzaElementGenerator(b);a.appendChild(c)}var d=8,e=256,f=document.createElement("img");f.className="mover",f.src="img/pizza.png",f.style.height="100px",f.style.width="73.333px";var g=document.getElementById("movingPizzas1");console.log("--",g);var h,b,i=0,j=200;for(b=0;j>b;b++)h=f.cloneNode(!1),h.basicLeft=b%d*e,i=Math.floor(b/d)*e,h.style.top=i+"px",h.style.visibility="hidden",g.appendChild(h);console.log("Created "+b+" pizzas")}function updatePositions(){timer&&window.clearTimeout(timer),timer=window.setTimeout(function(){var a=document.body.scrollTop/1250;window.performance.mark("mark_start_frame");for(var b,c=window.screen.height,d=document.documentElement.scrollTop||document.body.scrollTop,e=d+c,f=document.getElementsByClassName("mover"),g=0,h=f.length,i=0,j=0;h>j;j++){b=f[j],i=Math.sin(a+j%10);var k=Math.floor(b.basicLeft+100*i);b.style.left=k+"px",g=parseInt(b.style.top),g>=d&&e>=g-100?b.style.visibility="visible":b.style.visibility="hidden"}if(window.performance.mark("mark_end_frame"),window.performance.measure("measure_frame_duration","mark_start_frame","mark_end_frame"),++frame%10===0){var l=window.performance.getEntriesByName("measure_frame_duration");logAverageFrame(l)}},5)}var ingredientItemizer=function(a){return"<li>"+a+"</li>"},makeRandomPizza=function(){for(var a="",b=Math.random(),c=Math.floor(4*b),d=Math.floor(3*b),e=Math.floor(2*b),f=0;c>f;f++)a+=ingredientItemizer(selectRandomMeat());for(var g=0;d>g;g++)a+=ingredientItemizer(selectRandomNonMeat());for(var h=0;e>h;h++)a+=ingredientItemizer(selectRandomCheese());return a+=ingredientItemizer(selectRandomSauce()),a+=ingredientItemizer(selectRandomCrust())},pizzaElementGenerator=function(a){var b,c,d,e,f,g;return b=document.createElement("div"),c=document.createElement("div"),d=document.createElement("img"),e=document.createElement("div"),b.classList.add("randomPizzaContainer"),b.style.width="33.33%",b.style.height="325px",b.id="pizza"+a,c.classList.add("col-md-6"),d.src="img/pizza.png",d.classList.add("img-responsive"),c.appendChild(d),b.appendChild(c),e.classList.add("col-md-6"),f=document.createElement("h4"),f.innerHTML=randomName(),e.appendChild(f),g=document.createElement("ul"),g.innerHTML=makeRandomPizza(),e.appendChild(g),b.appendChild(e),b},resizePizzas=function(a){function b(a){var b=document.getElementById("pizzaSize");switch(a){case"1":return void(b.innerHTML="Small");case"2":return void(b.innerHTML="Medium");case"3":return void(b.innerHTML="Large");default:console.log("bug in changeSliderLabel")}}function c(a,b){function c(a){switch(a){case"1":return.25;case"2":return.3333;case"3":return.5;default:console.log("bug in sizeSwitcher")}}var d=a.offsetWidth,e=document.getElementById("#randomPizzas").offsetWidth,f=d/e,g=c(b),h=(g-f)*e;return h}function d(a){for(var b=document.getElementsByClassName(".randomPizzaContainer"),d=b[0],e=c(d,a),f=d.offsetWidth+e+"px",g=b.length,h=0;g>h;h++)b[h].style.width=f}window.performance.mark("mark_start_resize"),b(a),d(a),window.performance.mark("mark_end_resize"),window.performance.measure("measure_pizza_resize","mark_start_resize","mark_end_resize");var e=window.performance.getEntriesByName("measure_pizza_resize");console.log("Time to resize pizzas: "+e[0].duration+"ms")};window.performance.mark("mark_start_generating"),window.performance.mark("mark_end_generating"),window.performance.measure("measure_pizza_generation","mark_start_generating","mark_end_generating");var timeToGenerate=window.performance.getEntriesByName("measure_pizza_generation");console.log("Time to generate pizzas on load: "+timeToGenerate[0].duration+"ms");var frame=0,timer;document.addEventListener("DOMContentLoaded",function(){createPizzas(),updatePositions()}),window.addEventListener("scroll",updatePositions);