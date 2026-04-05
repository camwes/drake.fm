---
title: Debugging Dating
slug: debugging-dating
date: '2014-09-23T18:52:23.000Z'
excerpt: |-
  As a web developer, a lot of my time is spent debugging. While most people may
  say that with disdain I personally enjoy the debugging process. Firstly, it
  means that you have something to test. More importantly, I believ
canonicalUrl: ''
featureImage: 'https://drake-ghost.s3.amazonaws.com/2017/07/404_kisscom.jpg'
---
As a web developer, a lot of my time is spent debugging. While most people may say that with disdain I personally enjoy the debugging process. Firstly, it means that you have something to test. More importantly, I believe the more bugs I encounter and overcome, the less painful the process will be in the future. Recently single and out-of-practice at dating I've come to realize that I could apply the same theory to dating. What is it other than debugging people in the real world?

## Dating with [HTTP Status Codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

So for all the coders out there with no idea how to talk to the object of affection I am here to put some things in a language that you can understand. For our purposes, think of yourself making **requests** seeking **response** from the person you're interested in.

### 200 OK

This is what you want, right? Far more common in web browsers than in the real world.

### 301 Moved Permanently

In the case of a 301 the response informs you that what you're requesting has relocated (possibly for school, new job, etc.) and optionally provides the new location. While you can follow this link to its destination, be warned that long-distance requests have a very high fail rate.

### 304 Not Modified

This means that nothing has changed since the last sime you sent a request. That significant other is still in the picture or they still think you suck.

### 400 Bad Request

The most straightforward of error codes, this means that you have sent a request with bad syntax. These unwanted and/or undecipherable requests are typically ignored. Some servers are also sticklers for grammar so "your to cute" is probably not gonna fly.

### 402 Payment Required

That's too easy.

### 403 Forbidden

Again, pretty self-explanatory, but there are many reasons you could be seeing this error. Possible reasons include:

*   subject is married
*   subject is ex-girlfriend of best friend
*   subject is family... eww

### 404 Not Found

![404](https://drake-ghost.s3.amazonaws.com/2014/Sep/404_kisscom.jpg)  
This error occurs when you've been provided with a phone number or email address that does not exist. This could have been accidental, or you could have made a typo. More than likely this was intentional and you should move on.

### 407 Proxy Authentication Required

This generally means that before the server will accept your request it must come through an approved proxy. Basically they need to know their friends and family don't think you suck.

### 426 Upgrade Required

<iframe width="100%" height="400" src="//www.youtube.com/embed/FrLequ6dUdM" frameborder="0" allowfullscreen=""></iframe>

### 429 Too Many Requests

Exactly what it sounds like. Step your game up.

### 408 Request Timeout

In this scenario too much time passes between the initial connection and any response. This happens on Tinder a LOT.

### 450 Blocked by Windows Parental Controls

Seriously? That's F'd up on so many levels.

### 500 Internal Server Error

This error code means that something has gone wrong on the server but the server could not be more specific on what the exact problem is. Most of the time this is because the server is wasted and replies incoherently.

### 502 Bad Gateway

With this error you are trying to make a connection through a gateway or proxy and get an invalid response. In some cases the proxy is prioritizing other requests. In bad cases the proxy blocks your requests itself (often known as "cock-blocking").

![502](https://drake-ghost.s3.amazonaws.com/2014/Sep/FiG81.jpg)

### 503 Service Unavailable

This error code means that the server is too busy to respond. This is often temporary, and you should hold off requests for a little while. If the server is overloaded with with requests and you continue to add to the traffic it is unlikely to improve the situation.

![503](https://drake-ghost.s3.amazonaws.com/2014/Sep/keep-calm-back-in-5-minutes.jpg)  
That's all for now. If demand is high enough I will continue this series. Would love some ideas around these:

*   [Javascript Errors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
*   [Pyton Errors](https://docs.python.org/2/library/exceptions.html#bltin-exceptions)
*   [Compiler Errors](http://www.digitalmars.com/ctg/ctgCompilerErrors.html)
