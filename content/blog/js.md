---
title: Learning Javascript
slug: js
date: '2012-12-04T04:47:00.000Z'
excerpt: >-
  Rather than bitch and moan about the nature of Javascript I will emulate my homie Crockford and focus on "The Good Parts".
canonicalUrl: ''
featureImage: 'https://drake-ghost.s3.amazonaws.com/2017/07/JavaScript-Tools-1200.jpg'
draft: true
---
[ES6 features](http://adrianmejia.com/blog/2016/10/19/Overview-of-JavaScript-ES6-features-a-k-a-ECMAScript-6-and-ES2015/#.WA4G-3dZebs.hackernews)

Many people complain about the way that Javascript functions because using it effectively depends on a real understanding of some key concepts. Rather than bitch and moan about the nature of Javascript I will emulate my homie Crockford and focus on "The Good Parts".

*   Fundamentals
    *   [Loops & Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)
    *   [Booleans](#booleans)
    *   [Functions](#functions)
    *   Text Processing
        *   [Strings](#strings)
        *   [RegExp](#regexp)
    *   Numbers and Dates
        *   [Numbers](#numbers)
        *   [Dates](#dates)
        *   [Math](#math)
    *   [Arrays](#arrays) (Collections)
    *   [Errors](#errors)
*   [Object Oriented Programming](#object-oriented-programming)
    *   [Closures](#closure)
    *   [Prototypical Inheritance](#prototypical-inheritance)
    *   Synchronous v. Asynchronous
    *   [The Module Pattern](#the-module-pattern)

## Fundamentals

In order to really understand javascript you must understand the very important properties and methods that the language provides.

**Value properties**:  
These global properties return a simple value; they have no properties or methods.

*   Infinity
*   NaN
*   undefined
*   null literal

## Classes

## Expressions and Operators

*   [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
*   [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/async_function)
*   [Spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
*   [Nullish Coalescing Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
*   [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
*   [Logical OR assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment)
*   [Logical AND assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND_assignment)
*   [Logical nullish assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_nullish_assignment)
*   [Template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

## Booleans

#### [Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

## Functions

#### [Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

> JavaScript (like all languages these days) has the ability to modularize logic in functions which can be invoked at any point within the execution. Invoking a function suspends execution of the current function, passing controls and parameters to the invoked function. In addition, a parameter called this is also passed to the function. The invocation operator is a pair of round brackets (), that can contain zero or more expressions separated by a comma. - [from this article](http://doctrina.org/Javascript-Function-Invocation-Patterns.html)

There are four main ways of invoking a function:

*   Method Invocation (e.g `object.someMethod()`
*   Function Invocation (e.g. `add(2,3)`, and described above)
*   Constructor Invocation (e.g. `cheddar = new Cheese("cheddar")`)
*   Call & Apply Invocation (see below)

### Method Invocation

A method is just another word for a function that is a property of an object. If you have a duck object that has an attribute containing a function, quack, then calling `duck.quack()` is method invocation.

### Constructor Invocation

### Call & Apply Invocation

Firstly, one of the most important concepts to grasp in javascript (and very relevant to understanding the difference between the aforementioned invocation methods) is understanding javascript's [this keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). "This" is a keyword in a function that by default refers to the function itself but can be set by the program. The value of "this" is determined by how the function is called, and there are three major ways of affecting the value of "this":

*   `.call()` : using `myFunction.call(this, arg1, arg2)` is a way to call a function while setting "this" and passing along \[comma separated\] arguments
*   `.apply()` : using `myFunction.apply(this, [arg1, arg2])` is a way to call a function while setting "this" and passing along an array of arguments

### .bind()

While `myFunction.bind(this, arg1, arg2)` may look a lot like `.call()`, it is different. It returns a function which will act like the original function but with "this" predefined. Bind is common in asynchronous programming for passing a function as a callback to async operations.

### Immediately-invoked function expression

This is a [design pattern](http://en.wikipedia.org/wiki/Immediately-invoked_function_expression) that is used to take advantage of closure and functional scoping to mimic block scoping. There are may ways to write it but it typically looks like this:

```javascript
(function(a, b) {
  // a == 'hello'
  // b == 'world'
}('hello', 'world'));
```

Using IIFE allows a programmer to set variables without polluting the global scope. This is an important pattern for [modular programming](#module-pattern)

### Function Expressions vs. Declarations

The IIFE example is also an example of what is called a function expression, which contrasts with a function declaration. An example of a function declaration is:

```javascript
function doSomething() {
  console.log("Very ironically doing nothing");
}
```

The difference between the way the two are executed is subtle but important:

> First of all, function declarations are parsed and evaluated before any other expressions are. Even if declaration is positioned last in a source, it will be evaluated foremost any other expressions contained in a scope. The following example demonstrates how fn function is already defined by the time alert is executed, even though it’s being declared right after it \[...\] Another important trait of function declarations is that declaring them conditionally is non-standardized and varies across different environments. You should never rely on functions being declared conditionally and use function expressions instead - [from this article](http://kangax.github.io/nfe/)

##### Function properties

These global functions—functions which are called globally rather than on an object—directly return their results to the caller.

*   eval()
*   uneval()
*   isFinite()
*   isNaN()
*   parseFloat()
*   parseInt()
*   decodeURI()
*   decodeURIComponent()
*   encodeURI()
*   encodeURIComponent()
*   escape()
*   unescape()

## Strings

#### [String Spec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

## RegExp

#### [Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

## Numbers

#### [Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

## Dates

#### [Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

## Math

#### [Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)

## Arrays

#### [Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

## Errors

#### [Specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

#### Types of errors

*   _Explicit exceptions_, those triggered by the throw keyword
*   _Implicit exceptions_, like ReferenceError: foo not defined
*   The _error event_ which may trigger an exception
*   The _error callback argument_ no exceptions

#### Javascript Error Objects

##### TODO: convert to table

*   EvalError
    *   Creates an instance representing an error that occurs regarding the global function eval().
*   InternalError
    *   Creates an instance representing an error that occurs when an internal error in the JavaScript engine is thrown. E.g. "too much recursion".
*   RangeError
    *   Creates an instance representing an error that occurs when a numeric variable or parameter is outside of its valid range.
*   ReferenceError
    *   Creates an instance representing an error that occurs when de-referencing an invalid reference.
*   SyntaxError
    *   Creates an instance representing a syntax error that occurs while parsing code in eval().
*   TypeError
    *   Creates an instance representing an error that occurs when a variable or parameter is not of a valid type.
*   URIError
    *   Creates an instance representing an error that occurs when encodeURI() or decodeURI() are passed invalid parameters.

#### Tips For Error Handling

*   Insure all asynchronous functions take a callback
*   Insure all async functions use return (to avoid being called twice)
*   Insure those callbacks take an error parameter as the first parameter
*   Always use an Error object for errors, and not a string (stacktraces).

#### UncaughtException: Log, Trace, Exit

```javascript
process.on('uncaughtException', function (err) {
  console.error('uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)});
```

Be sure to always exit your program. Some people may think that they don't need to exit for every error, but you generally do not want javascript programs continuing to run after an uncaught exception. **Never bury your errors**.

#### Send an Email

A great advantage of server side javasacript is that you can use nifty modules like [nodemailer](https://github.com/andris9/Nodemailer) to send emails when your application encounters an uncaught exception.

### Miscellaneous

#### `~`

The tilde is a weird character with a weird purpose. It is a unary operator that takes the expression to its right performs this small algorithm on it (where N is the expression to the right of the tilde): -(N+1).

```javascript
console.log(~-2); // 1
console.log(~-1); // 0
console.log(~0);  // -1
console.log(~1);  // -2
console.log(~2);  // -3
```

#### TODO: Mapping Objects

It is easy to map the values in an array, but not native to do so with objects. A solution is simple is provided [here](http://stackoverflow.com/a/14810722):

```javascript
Object.keys(myObject).map(function(key, index) {
   myObject[key] *= 2;
});
```

## Object Oriented Programming

## Closure

Check out [this article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures), It's pretty good. The most basic concept in closure is understanding lexical scoping.

```javascript
function init() {
  var name = "Mozilla"; // name is a local variable created by init
  function displayName() { // displayName() is the inner function, a closure
    alert(name); // use variable declared in the parent function    
  }
  displayName();    
}
init();
```

Returning the function as a closure:

```javascript
function makeFunc() {
  var name = "Mozilla";
  function displayName() {
    alert(name);
  }
  return displayName;
}
var myFunc = makeFunc();
myFunc();
```

You can emulate private methods with closures

```javascript
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype.getName = function() {
  return this.name;
};
MyObject.prototype.getMessage = function() {
  return this.message;
};
```

### Pass-by-refernce vs. Pass-by-value

```javascript
var obj = {
	a: 10,
    b: 3
};
// If you assign a variable to an object and then modify an attribute of that variable it will affect the object that it "references"
var newObj = obj;
newObj.a++;
console.log(obj.a); // 11

// However, you can get around this by creating a copy of the object and assigning that to your variable.
var clonedObj= JSON.parse(JSON.stringify(obj));
clonedObj.a++;
console.log(obj.a) // 10
```

### Duck-Typing

> When I see a bird that walks like a duck and swims like a duck and quacks like a duck, I call that bird a duck - James Whitcomb Riley

This quote is very applicable to javascript because of javascript's type system. In programming a type system is Javascript is often described as a [weakly typed](http://en.wikipedia.org/wiki/Strong_and_weak_typing) language because javascript attempts implicit type conversion (e.g. `"12345" * 1 === 12345`). It is also [dynamically and not statically typed](http://en.wikipedia.org/wiki/Type_system#Static_and_dynamic_type_checking_in_practice) (e.g. `x = 12345; x = "string";`). As a result it is often the case that programmers perform what is commonly referred to as [duck-typing](http://stackoverflow.com/questions/3379529/duck-typing-in-javascript), or using the presence of certain methods and properties to determine if an object is suitable for certain operations.

### Check for Existence

Before you can duck-type check an object in javascript you must insure that the object actually exists, since trying to perform `var a = someObject.someProperty;` will thrown an error if `someObject` doesn't exist. This can be a consistent sources of frustration in Javascript . There are many methods for attempting this, but most programmers agree that the `typeof` operator is a very safe and reliable method of checking for existence.

> Helpful [StackOverflow](http://stackoverflow.com/questions/4186906/check-if-object-exists-in-javascript) answer

## Synchronous vs. Asynchronous Programming

In Node.js callbacks it is even more important to understand your async programs because crashes can bring down the application for the entire network, not just one client.

> [process.nextTick](http://nodejs.org/api/process.html#process_process_nexttick_callback) is an example of a really important Node.js specific concept.

## Debugging Node.js

```bash
DEBUG=* node --debug=5858 app.js
```

### Sessions

Express

*   express-session [options](https://github.com/expressjs/session#options)
*   express [json api](http://expressjs.com/en/api.html#res.json)
*   curl equivalent in [node.js](http://stackoverflow.com/questions/6819143/curl-equivalent-in-nodejs)

React

*   Load initial data via [ajax](https://facebook.github.io/react/tips/initial-ajax.html)
*   POST request [gotcha](http://stackoverflow.com/a/12527349)

## Security

[Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

*   Don’t use deprecated or vulnerable versions of Express
*   Use TLS (Configure w/ [NGINX](https://wiki.mozilla.org/Security/Server_Side_TLS#Recommended_Server_Configurations), [free certs](https://letsencrypt.org/about/) )
*   Use [Helmet](https://www.npmjs.com/package/helmet)
*   Use [express-session](https://www.npmjs.com/package/express-session) or [cookie-session](https://www.npmjs.com/package/cookie-session)
*   Ensure your dependencies are secure (use [nsp](https://www.npmjs.com/package/nsp) or requiresafe)
*   Implement rate-limiting to prevent brute-force attacks against authentication (you can use middleware such as express-limiter)
*   Use csurf middleware to protect against cross-site request forgery (CSRF).
*   Always filter and sanitize user input to protect against cross-site scripting (XSS) and command injection attacks.
*   Defend against SQL injection attacks by using parameterized queries or prepared statements.
*   Use the open-source sqlmap tool to detect SQL injection vulnerabilities in your app.
*   Use the nmap and sslyze tools to test the configuration of your SSL ciphers, keys, and renegotiation as well as the validity of your certificate.
*   Use safe-regex to ensure your regular expressions are not susceptible to regular expression denial of service attacks.

## Writing Better Programs

I am not the best javascripter in the world, probably not even close. That being said I have seen some shit in the jungle of js and I have learned plenty things that it would behoove you to know. To me, the key to writing (javascript) code that will endure is to make sure that it is **clean, clear, modular extensible and transparent**. By the end of this section you will hopefully understood what is meant by the preceding statement.

### Rules

There are many people out there who will gladly share their "rules" of programming with you but the most agreeable rules I've ever heard about programming are **Rob Pike's** [5 rules of programming](http://en.wikipedia.org/wiki/Rob_Pike). While these were invented with Unix in mind, the same principles apply to all languages:

1.  You can't tell where a program is going to spend its time. Bottlenecks occur in surprising places, so don't try to second guess and put in a speed hack until you've proven that's where the bottleneck is.
2.  Measure. Don't tune for speed until you've measured, and even then don't unless one part of the code overwhelms the rest.
3.  Fancy algorithms are slow when n is small, and n is usually small. Fancy algorithms have big constants. Until you know that n is frequently going to be big, don't get fancy. (Even if n does get big, use Rule 2 first.)
4.  Fancy algorithms are buggier than simple ones, and they're much harder to implement. Use simple algorithms as well as simple data structures.
5.  Data dominates. If you've chosen the right data structures and organized things well, the algorithms will almost always be self-evident. Data structures, not algorithms, are central to programming.

To paraphrase rules 1 & 2:

> "Premature optimization is the root of all evil" - [Tony Hoare](http://en.wikipedia.org/wiki/Tony_Hoare)

To paraphrase rules 3 & 4:

> "When in doubt, use brute force" - [Ken Thompson](http://en.wikipedia.org/wiki/Ken_Thompson)

Rule 5 was previously stated by [Fred Brooks](http://en.wikipedia.org/wiki/Fred_Brooks) in _The Mythical Man-Month_ and is often shortened to:

> "Write stupid code that uses smart objects".

Applying these rules to the programs that you write will certainly get you off to a good start, but there are many more principles that one could extrapolate from these five. I recommend reading the first chapter of [Eric S. Raymond's](http://en.wikipedia.org/wiki/Eric_S._Raymond) _The Art of UNIX Programming_. When it comes to solving problems most programmers know that the simplest possible algorithm is usually the best. Those who don't understand this maxim often try and use the fanciest algorithm that they can think of for a situation where something simple will suffice. A recent example was that I was writing a program that required me finding and removing all instances of duplicates from an array. I thought that this [StackOverflow answer](http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array/9229821#9229821) perfectly illustrates rule #3.

### Style

That your program works does not mean that your job as programmer is complete. You want to make sure that you turn in code that follows a consistent style, so that future developers can understand it. Two versus four space indent is more of a preference than anything, but I think every good coder would agree that soft-tabs are always the way to go (and your editor should show invisibles). Regardless of what you decide I highly recommend using [editorconfig](http://editorconfig.org/#overview). Deciding on the particular style decisions that your project will follow is beyond the scope of this article, but you should check out the style-guides in the [references](#references) section for some examples. There are a few style rules that I, however, feel very serious about:

*   Use soft-tabs with a two space indent.
*   **Always** use semicolons [1](http://mislav.uniqpath.com/2010/05/semicolons/)
*   **Always** use camelCase, never underscores [2](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=Naming#Naming)
*   **Always** Declare with Var [3](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=var#var)
*   **No** Function Declarations Within Blocks

> Need Help Choosing an Editor? [Read My Review](__GHOST_URL__/blog/editors)!

### Miscellaneous

#### Always use strict equality operators

I'll try and sum this pretty succinctly:

*   `null == undefined` returns "true"
*   `null === undefined` returns "false"

Do you get it? The strict equality operator also checks that type matches, not performing type conversion before checking equality.

#### Be Vanilla

I have been working for the last few months on becoming less reliant on jQuery. A lot of projects that I am working on use socket.io leaving little need for ajax and draining a lot of the usefulness of jQuery. When I read [this gist](https://gist.github.com/2597326) the other day I couldn't help but believe that there was something to this movement away from "$". With powerful front-end frameworks in use for modern web apps, jQuery is almost unnecessary. I usually opt for a lighter functional framework ([lo-dash](http://lodash.com/) or [underscore](http://underscorejs.org/#)). For another good take on the "vanilla" methodology check out [this](http://playground.deaxon.com/js/vanilla-js/).

#### Code Quality (lint)

Every javascript programmer should use jsHint if only to insure that you are using consistent style. Well written code has many benefits, including being easier to maintain. Check out all the available options in [.jshintrc](https://gist.github.com/haschek/2595796).

#### Code Complexity

Beyond linting your code you should also be concerned with code complexity. I find this tool, [Plato](https://github.com/es-analysis/plato), extremely useful for integrating jsHint feedback and complexity analysis.

#### Other

> Try to prefix all javascript-based selectors with js-.

This is taken from [slightly obtrusive javascript](http://ozmm.org/posts/slightly_obtrusive_javascript.html). The idea is that you should be able to tell a presentational class from a functional class.

> Write new JS in [CoffeeScript.](http://coffeescript.org/)

From the [github style-guide](https://github.com/styleguide/javascript) we learn that they write all of their javascript in CoffeeScript. This has some benefits (e.g. errors are often found in compilation) but I understand CoffeeScript isn't everyone's cup of...

## References

### Recommended Tools

The very amazing graphic seen at the top of this article paints the picture of the many javscript tools available. Obviously your project will not make use of them all, but I recommend using the following:

[](https://embed.stackshare.io/stacks/embed/7fb7d29a85076140adb478f9caa0d5)

### Recommended Reading

*   Javascript: The Good Parts - Douglas Crockford
*   Secrets of the Javascript Ninja - John Resig
*   JQuery Novice to Ninja - Early Castledine and Craig Sharkie

### Links

*   [Google Style-guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
*   [Airbnb Style-guide](https://github.com/airbnb/javascript)
*   [Github Style-guide](https://github.com/styleguide/javascript)
*   [Error Types (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types)
*   [Error Handling (Strong Loop)](http://strongloop.com/strongblog/robust-node-applications-error-handling/)
*   [Production Quality Node.js](http://caines.ca/blog/2014/06/02/production-quality-node-dot-js-web-apps-part-ii/)
*   [Joyent](https://www.joyent.com/developers/node/design)
*   [Frameworks Initial Load Time](http://www.filamentgroup.com/lab/mv-initial-load-times.html)
*   [Top 10 Node.js mistakes](https://www.airpair.com/node.js/posts/top-10-mistakes-node-developers-make)
*   [The Problem with Angular](http://www.quirksmode.org/blog/archives/2015/01/the_problem_wit.html)
*   [Angluarjs Questions](http://www.toptal.com/angular-js/interview-questions)
*   [10 Javascript Interview Questions](https://medium.com/javascript-scene/10-interview-questions-every-javascript-developer-should-know-6fa6bdf5ad95)
