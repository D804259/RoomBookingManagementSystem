let name = "Dinesh";
let age = 20;
let isStudent = true;
let marks;
let result = null;

console.log(typeof name);
console.log(typeof age);
console.log(typeof isStudent);
console.log(typeof marks);
console.log(typeof result);
const num = 354323;
let temp = num;
let count = 0;
while (temp > 0) {
    temp = Math.floor(temp / 10);
    count++;
}
console.log("Digits in " + num + ": " + count);
for(let i = 1; i <= 5; i++) {
    console.log("Iteration: " + i);
}
(function(){
    let private ="sdvnc"
    console.log("IIFE: function" , private);
})()
'use strict'
p=10;
console.log(p);

function sum(a, a) {
    console.log(a+ a)
}
sum(33 ,44);