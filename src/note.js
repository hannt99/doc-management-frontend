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

