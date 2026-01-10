console.log("hello world".includes("hello"));
console.log("url/api".startsWith("url"));
console.log("file.txt".endsWith("txt"));

let myName = "prashant";
console.log(myName.slice(0, 5));
console.log(myName.split("a"));
console.log(myName.toUpperCase());

console.log(myName.charAt(0));
console.log(myName.charCodeAt(0));

let num = "1";
console.log(num.padStart(3, "0"));
console.log(num.padEnd(3, "0"));
console.log(num.repeat(10));

console.log(myName.replace("a", "A"));
console.log(myName.replaceAll("a", "A"));

console.log("   q1q    ".trim());
