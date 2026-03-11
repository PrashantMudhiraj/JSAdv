# JavaScript & Backend Engineering – Complete Learning Index

> Reference-driven learning (MDN, Node.js docs, Express docs)  
> Focus: Internals, runtime behavior, production practices

---

## PHASE 1 — JavaScript Fundamentals (Execution & Scope)

1. JavaScript execution model
2. Global execution context
3. Call stack
4. Hoisting
    - var
    - function declarations
    - let / const
5. Temporal Dead Zone (TDZ)
6. Lexical scope
7. Scope chain
8. Function scope vs block scope
9. Arrow functions vs normal functions
    - lexical `this`
    - scope differences

---

## PHASE 2 — `this`, Closures & Prototypes

### `this` Binding

10. `this` keyword overview
11. Default binding
12. Implicit binding
13. Explicit binding
    - call
    - apply
    - bind
14. `new` binding
15. Binding priority order

### Closures

16. What is a closure (lexical environment)
17. Closure memory behavior
18. Closure vs scope
19. Real production use-cases of closures
20. Are modules closures?

### Prototypes & Inheritance

21. Prototype chain
22. Delegation model
23. `__proto__` vs `prototype`
24. `Object.create()` vs `new`
25. Constructor functions
26. How `new` works internally

---

## PHASE 3 — Objects & Core Language Mechanics

27. Property lookup mechanism
28. `hasOwnProperty` vs `in`
29. Object delegation chain
30. Property descriptors
31. `Object.freeze`
32. `Object.seal`
33. `Object.preventExtensions`
34. Object immutability rules

---

## PHASE 4 — Async JavaScript & Functional Programming

### Event Loop & Concurrency

35. Event loop fundamentals
36. Browser vs Node.js event loop
37. Call stack vs task queues
38. Microtasks vs macrotasks
39. Promise microtask priority
40. Why Promises run before timers

### Functional Programming

41. Higher-order functions (HOF)
42. Functional programming principles
43. Pure functions
44. Immutability
45. Function composition

### Array Methods

46. map
47. filter
48. reduce
49. find
50. some / every
51. flat / flatMap
52. splice vs slice

### Object Methods

53. Object.keys
54. Object.values
55. Object.entries
56. Object.fromEntries
57. Object.assign vs spread
58. Object.hasOwn

### String Methods

59. slice
60. split
61. replace / replaceAll
62. includes
63. trim
64. padStart / padEnd
65. Template literals

### ES6+ Core Features

66. Spread operator
67. Rest operator
68. Destructuring (array & object)
69. Optional chaining (`?.`)
70. Nullish coalescing (`??`)

### Copying Semantics

71. Shallow copy
72. Deep copy
73. `structuredClone`
74. Why spread is shallow

---

## Promises — Deep Internals

75. What a Promise really is
76. Promise states
77. Promise executor behavior
78. Promise resolution procedure
79. `.then()` chaining
80. Error propagation
81. `.catch()` vs `.finally()`
82. Microtask scheduling
83. Why Promise.resolve doesn’t pause execution
84. Why `new Promise()` itself doesn’t go to libuv

---

## Async / Await — Internals

85. `async` function behavior
86. Why async always returns a Promise
87. `await` desugaring
88. Sequential vs parallel awaits
89. try/catch mapping to Promise chains

---

## Promise Combinators

90. Promise.all
91. Promise.allSettled
92. Promise.race
93. Promise.any
94. Parallelism vs sequencing
95. Why Promise.all doesn’t create parallelism

---

## Node.js Event Loop — Deep Dive

96. libuv overview
97. Event loop phases
98. timers phase
99. poll phase
100.    check phase
101.    setTimeout vs setImmediate
102.    process.nextTick vs Promise microtasks
103.    Why Promises don’t go to libuv
104.    Execution order rules in Node.js

---

## Async Pitfalls & Production Patterns

105. Unhandled promise rejections
106. Swallowed errors
107. Sequential await performance bugs
108. Async inside loops
109. async + forEach bug
110. Blocking the event loop
111. Fake delays with Promise.resolve
112. Memory leaks via async closures
113. Race conditions on shared state
114. Retry & timeout patterns
