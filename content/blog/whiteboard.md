---
title: Whiteboard
slug: whiteboard
date: '2016-10-12T23:47:41.000Z'
excerpt: |-
  Coding interviews are stressful. I have been on both sides of many interviews
  and have seen the process go many different ways. Being self taught I had just
  as much to learn for the interview process as I did for actuall
canonicalUrl: ''
featureImage: 'https://drake-ghost.s3.amazonaws.com/2017/07/einsteinshow-1.jpg'
draft: true
---
Coding interviews are stressful. I have been on both sides of many interviews and have seen the process go many different ways. Being self taught I had just as much to learn for the interview process as I did for actually doing my job.

![tweet](https://drake-ghost.s3.amazonaws.com/2016/10/1-tsHwsy-_jG4acGFOSYJRVA.jpeg)

## Preparation

Google has a notoriously difficult hiring process. So if you are looking for a golden standard to prepare for its not a bad place to look (not that Facebook, Apple and a lot of other companies aren't just as hard. In my opinion, Google has the most advanced process, which even includes a coaching call. I don't know if this applies to everyone or those like myself who may be self taught or non-traditional developers, but participating was very helpful. My coach was an awesome guy who has written about his experience getting hired at Google[\[1\]](#fn1). The call started with him explaining his basic tips to success:

1.  **Repeat the Question Aloud** (in your own words)

*   **State and clarify your assumptions**
    *   scalability? you should ask.
    *   clarify the function signature (input, output)
    *   disambiguate the results
*   **Use an Example**
    *   visualize your data structure on the whiteboard
    *   gives you something visual to work with
    *   if they provide one, use it
*   **Brainstorm**
    *   think of multiple solutions and their time and space complexity. That way, if you have a solution of O(n) vs O(log n), you know you should go for the latter. Getting to this point in the process should take **~5 mins**
*   **Write Code**
    *   no pseudocode, it looks like weakness
    *   write small, and leave space
*   **Test Code**
    *   seriously, always do it. If the interviewer has to point it out they will be disappointed
    *   go line by line, on the whiteboard and act as compiler
*   **Practice a Lot**

The last point is obviously the most important. You'll want to study algorithms[\[2\]](#fn2) as much as you can, and dynamic programming. Brush up on your [discrete math](https://en.wikipedia.org/wiki/Discrete_mathematics). Be familiar with as many data structures as possible.[\[3\]](#fn3) It may be helpful to memorize a few algorithms and data structures and their space/[time](https://en.wikipedia.org/wiki/Time_complexity) complexity[\[4\]](#fn4).

But mostly just find a good set of coding interview questions and just tackle them on a whiteboard.[\[5\]](#fn5) A lot of the problems that you are given are underspecified. Part of the process is to ask the correct questions to fully understand the question. Show your work, it is as important as the "correct answer", arguably more so for the purposes of an interview. Keep in mind that generally, no one expects you to know every API exactly[\[6\]](#fn6), so be honest when you don't know something as long as it isn't something you should know.

## Simple Questions:

Every interview will start with some basic conversational questions that can generally be answered simply, like:

*   What is the DOM?
*   How does the [browser work](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/)?
*   What is a closure?
*   How does this work?
*   Describe a few ways to communicate between a server and a client. Describe how a few network protocols work at a high level (IP, TCP, HTTP/S/2, UDP, RTC, DNS, etc.)
*   What is the node.js [event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
*   difference between `==` & `===`
*   `.apply` vs `.bind` vs `.call`
*   pass-by-value vs pass-by-reference
*   what is duck typing?
*   what is IIFE? Why do it?

**Javascript Scope:**  
If we execute this Javascript, what will the browser's console show?

```javascript
var text = 'outside';
function logIt(){
    console.log(text);
    var text = 'inside';
};
logIt();
```

**Answer:** The console will log undefined. To understand this, we need to explain a few things about Javascript.

*   Function-level scope. Functions create new scopes in Javascript
*   Declaration vs. assignment. A variable declaration simply tells the interpreter that a variable exists. By default it initializes the variable to undefined.
*   Hoisting. In Javascript, variable declarations are "hoisted" to the top of the current scope. Variable assignments, however, are not.

There's not much of a way to prepare for this part besides just knowing your shit TBH.[\[7\]](#fn7)

# Whiteboard Questions

I've decided to include here a running log of interesting challenges that I stumble on in the hiring process and my responses to them at the time. I won't bore you with every dumb [fizz buzz](http://en.wikipedia.org/wiki/Fizz_buzz) question I see.

#### Palindrome

Given **two strings**, write a function that will determine **whether or not** the strings are **palindromes**.

#### Jack & Jill

Given an **array of names**, write a program that will **sort the array** such that Jack always comes first and Jill always comes second. **Jill should come first if there are not Jacks**.

#### Object Equality

given **two inputs of any type**, determine if the inputs **are equal**. i.e. if they are strings or numbers they should be equal, if they are objects all of their **attributes should be equal**.

#### Simple Recursion

Given a **JSON object** that you know little about, how can you **return data of a specific type**? e.g. write a function that can return and array of all of the numbers/strings/etc in an object:

#### Stock Price Challenge

Suppose we could access yesterday's **stock prices as a list**, where:

The **indices are the time in minutes past trade opening time**, which was 9:30am local time. The **values are the price in dollars** of Apple stock at that time. So if the stock cost $500 at 10:30am, `stock_prices_yesterday[60]`returns 500.

Write an efficient function that takes `stock_prices_yesterday` and **returns the best profit** I could have made from 1 purchase and 1 sale of 1 Apple stock yesterday.

First I made sure that I understood the structure of the data:

```javascript
var stock_prices_yesterday = [24, 2, 11, 4, 6, 3];
```

I asked some clarifying questions to get a better understanding of the problem and implemented a really terrible solution because I did not properly understand the problem. Once I fully understood the problem I described a brute force approach which I was encouraged to implement:

```javascript
function maximumProfit(prices) {
  var lowest = prices[0];
  var maximumProfit = 0;

  for (var i = 0; i < prices.length; i++) {      
    for (var j = i; j < prices.length; j++) {
      var profit = prices[j] - prices[i];
      if (profit > maximumProfit) {
        maximumProfit = profit;
      }
    }
  }
  console.log(maximumProfit);
}
maximumProfit(stock_prices_yesterday);  // Correctly returns 9
```

This solution works but I quickly pointed out that it was an **O(n2)** and we could surely do better. So I thought for a few minutes for a a better solution. Eventually, the interviewer just asked me to simply think about what I would have to do at each step to determine the maximum. Soon I came up with a much better solution:

What I came up here was a dynamic programming solution that I developed simply by thinking about what had to occur at each step in order to return the correct answer. What I came up satisfied my goal of a solution that could run in **O(n)** time **O(1)** space[\[8\]](#fn8)

#### Some Arithmetic

Given an **array of integers**, determine **whether or not** there exist two elements in the array **(at different positions)** whose sum is equal to some target value. Examples: `[5, 4, 2, 4], 8 --> true` `[5, 1, 2, 4], 8 --> false`

Make sure you know what you need to return, it can save you a lot of work. Boolean returns are the best because once true you can bail. With this problem you should be able to brainstorm to a few solutions:

*   two loops: **O(n)** solution
*   sort and add: **O(log n) solution**
*   mystery solution: **On** solution

> **Tip: Use space to optimize time**[\[9\]](#fn9):  
> "Biological usage of time–memory tradeoffs can be seen in the earlier stages of animal behavior. Using stored knowledge or encoding stimuli reactions as "instincts" in the DNA avoids the need for "calculation" in time-critical situations. More specific to computers, look-up tables have been implemented since the very earliest operating systems."

My Answer:

#### Set Data Structure/Random Number Generator

Implement a set data structure[\[10\]](#fn10) that supports Insert, Remove, and GetRandomElement efficiently. Example: If you insert the elements 1, 3, 6, 8 and remove 6, the structure should contain \[1, 3, 8\]. Now, GetRandom should return one of 1, 3 or 8 with equal probability.

> Who needs a getRandom on a data structure? That should tell you what this question is about.

*   Get: **O(1)**
*   Set: **O(1)**
*   Random **O(1)**

They can all be done in constant time, which is about the best you can do.[\[11\]](#fn11)

> Tip use multiple data structures

### [In-Place Shuffle of Array](https://www.interviewcake.com/question/java/shuffle)

The challenge of shuffling is a great example of when one might take a [naive approach](https://blog.codinghorror.com/the-danger-of-naivete/) where a more elegant solution is required. Usually, a naïve algorithm is just oversimplified and inefficient, but in this case it is wrong. The most well-known approach to shuffle is the [Fisher-Yates](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) AKA [Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) shuffle. I would read Mike Bostok's [beautiful explainer](https://bost.ocks.org/mike/shuffle/).

### [Merge Sorted Arrays](https://www.interviewcake.com/question/java/merge-sorted-arrays)

### [Kth to Last Node in a Singly Linked List](https://www.interviewcake.com/question/javascript/kth-to-last-node-in-singly-linked-list?utm_source=weekly_email&utm_source=drip&utm_campaign=weekly_email&utm_campaign=Interview%20Cake%20Weekly%20Problem%20%23249:%20Kth%20to%20Last%20Node%20in%20a%20Singly-Linked%20List&utm_medium=email&utm_medium=email&__s=jksqj7avviyhkzszgkrj)

### [Bracket Validator](https://www.interviewcake.com/question/java/bracket-validator)

### Find Contraindications

#### Naive solution

The brute force solution in this instance is very straightforward:

```javascript
function getContraindicationNaive(medications, contraindications) {
  let contraindication = false;
  contraindications.forEach(([a,b]) => {
    if (medications.includes(a) && medications.includes(b)) {
      contraindication = true;
    }
  })
  return contraindication;
}
```

Using the `includes` method makes this code look very succinct but it is important to remember that the worst case for the method is **O(n)**, making the complexity here quadratic, we can certainly do better. The solution to these types of questions almost always includes using a hashmap.

## Reading Library

What follows is a list of books that I have/am/plan reading. These books typically came recommended to me and I think they represent a good subset of the large amount of literature out there.

#### Software Engineering

*   Code - Charles Petzold | [amazon](https://www.amazon.com/Code-Language-Computer-Developer-Practices-ebook/dp/B00JDMPOK2/ref=sr_1_1?s=books&ie=UTF8&qid=1504997158&sr=1-1&keywords=code+charles+petzold)
*   The Pragmatic Programmer - Andrew Hunt and David Thomas | [amazon](https://www.amazon.com/Pragmatic-Programmer-Journeyman-Master/dp/020161622X)
*   The Art of Comuter Programming - Donald Knuth | [wiki](https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming) | [amazon](https://www.amazon.com/Computer-Programming-Volumes-1-4A-Boxed/dp/0321751043)
*   Introduction to Algorithms 3rd Edition by Thomas H. Cormen | [amazon](https://www.amazon.com/Introduction-Algorithms-3rd-MIT-Press/dp/0262033844/ref=sr_1_1?s=books&ie=UTF8&qid=1504997205&sr=1-1&keywords=algorithms+third+edition)
*   The Algorithm Design Manual - Steven S. Skiena | [amazon](https://www.amazon.com/Algorithm-Design-Manual-Steven-Skiena-ebook/dp/B00B8139Z8/ref=mt_kindle?_encoding=UTF8&me=)
*   Algorithms - Jeff Erickson
*   Software Architecture Patterns - Mark Richards
*   Cracking the Coding Interview - Gayle Laakmann McDowell | [amazon](https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850/ref=pd_lpo_sbs_14_img_0?_encoding=UTF8&psc=1&refRID=EF6RYXKKWEMRM2TNG242)
*   Programming Pearls - Jon Bentley | [amazon](https://www.amazon.com/Programming-Pearls-2nd-Jon-Bentley/dp/0201657880/ref=pd_sim_14_2?_encoding=UTF8&psc=1&refRID=EF6RYXKKWEMRM2TNG242)

#### Web Development

*   High Performance Websites - Steve Souders | [amazon](https://www.amazon.com/dp/B0028N4WHY/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1)
*   Javascript: The Good Parts - Douglas Crockford | [amazon](https://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742)
*   Secrets of the Javascript Ninja - John Resig | [amazon](https://www.amazon.com/Secrets-JavaScript-Ninja-John-Resig/dp/193398869X)
*   CSS The Definitive Guide | [amazon](https://www.amazon.com/CSS-Definitive-Guide-Visual-Presentation/dp/1449393195/ref=sr_1_1?s=books&ie=UTF8&qid=1505006427&sr=1-1&keywords=css+the+definitive+guide)
*   CSS Pocket Reference | [amazon](https://www.amazon.com/CSS-Pocket-Reference-Visual-Presentation/dp/1449399037/ref=sr_1_1?s=books&ie=UTF8&qid=1505006627&sr=1-1&keywords=css+pocket+reference)
*   CSS Cookbook 3rd Edition | [amazon](https://www.amazon.com/CSS-Cookbook-3rd-Animal-Guide/dp/059615593X)
*   CSS3 for Web Developers

## Footnotes

* * *

1.  [Google Would Never Hire a Person Like Me](http://www.huffingtonpost.com/anthony-mays/google-would-never-hire-a-person-like-me_b_7538164.html) by Anthony Mays [↩︎](#fnref1)
    
2.  A popular recommendation is [_Introduction to Algorithms_](https://www.amazon.com/Introduction-Algorithms-3rd-MIT-Press/dp/0262033844) by Thomas Cormen et al. [↩︎](#fnref2)
    
3.  You can find plenty of great implementations of data structures [here](http://blog.benoitvallon.com/category/data-structures-in-javascript/) [↩︎](#fnref3)
    
4.  Big O Notation can be tricky to understand at first but is actually [pretty simple](https://justin.abrah.ms/computer-science/how-to-calculate-big-o.html). When calculating space time complexity they really only care about the curve, so don't give something like "On + 8". This [cheatsheet](http://bigocheatsheet.com/) is useful [↩︎](#fnref4)
    
5.  There are many great sources for interview questions. My coach recommended [_Cracking the Coding interview_](https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/098478280X/ref=sr_1_3?s=books&ie=UTF8&qid=1481065319&sr=1-3&keywords=cracking+the+coding+interview) and I have found the email list of [Interview Cake](https://www.interviewcake.com/) provides some excellent questions for practice [↩︎](#fnref5)
    
6.  A lot of this advice comes directly from [Google employees](https://www.youtube.com/watch?v=oWbUtlUhwa8). I also recommend this [blog post](http://steve-yegge.blogspot.com/2008/03/get-that-job-at-google.html) [↩︎](#fnref6)
    
7.  This article is really good for basic [frontend interview questions](https://performancejs.com/post/hde6d32/The-Best-List-of-Frontend-JavaScript-Interview-Questions-\(written-by-a-Frontend-Engineer\)) [↩︎](#fnref7)
    
8.  It's explained pretty clearly in this [stack overflow question](http://stackoverflow.com/a/7086577) [↩︎](#fnref8)
    
9.  from the time-memory tradeoff [wikipedia article](https://en.wikipedia.org/wiki/Space%E2%80%93time_tradeoff) [↩︎](#fnref9)
    
10.  From the above link on [data structures](http://blog.benoitvallon.com/data-structures-in-javascript/the-set-data-structure/) [↩︎](#fnref10)
     
11.  We say about because you can actually do better than O(1) by using a [bitmap](https://en.wikipedia.org/wiki/Bit_array). In general, [bit manipulation](https://en.wikipedia.org/wiki/Bit_manipulation) is an important concept to understand for optimizing space and time of algorithms when applicable. [↩︎](#fnref11)
