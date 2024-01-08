// // name export
// // uppercase.js
// // CommonJS
// exports.a = () => {};
// exports.b = () => {};
// exports.c = () => {};

// const { a, b, c } = require('./utils/uppercase.js');
// console.log(a());
// console.log(b());
// console.log(c());

// // ES6
// export const a = () => {};
// export const b = () => {};
// export const c = () => {};

// import { a, b, c } from './utils/uppercase.js';
// console.log(a());
// console.log(b());
// console.log(c());

// // default export
// // uppercase.js
// // CommonJS
// const uppercase = (str) => str.toUpperCase();

// module.exports = uppercase;

// const __uppercase = require('./uppercase.js'); // Importing the module
// const result = __uppercase('test'); // Using the function from the imported module
// console.log(result); // Output: TEST

// // ES6
// export default uppercase;

// import __uppercase from './uppercase.js';
// __uppercase('test');

// *** type (TypeScript) vs typedef (C/C++) ***
// type MyNumber = number; // Creating an alias MyNumber for the number type
// type Point = { 
//     x: number; 
//     y: number 
// }; // Creating an alias Point for an object type

// // Usage:
// let num: MyNumber = 10;
// let point: Point = { 
//     x: 5, 
//     y: 7 
// };


// typedef int MyInt; // Creating an alias MyInt for the int type
// typedef struct {
//     int x;
//     int y;
// } Point; // Creating an alias Point for a struct type

// // Usage:
// MyInt number = 10;
// Point p;
// p.x = 5;
// p.y = 7;

// nguyengiahuykt91@gmail.com