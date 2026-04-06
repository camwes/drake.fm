---
title: Documentation
slug: documentation
date: '2022-04-01T12:00:00.000Z'
excerpt: >-
  From the perspective of a user, if a feature is not documented, then it does not exist, and if a feature is documented incorrectly, then it is broken.
canonicalUrl: ''
featureImage: ''
draft: true
---
> [!NOTE] Listen
> Here’s a great [podcast](https://open.spotify.com/episode/1n4cIT5MUz4m4bu5kMedw1?si=LT8Ku7APQyaVun-dtSUaaQ) I found on the importance of writing in engineering

## Introduction
---
The importance of having good documentation can hardly be overstated, yet many companies struggle to incorporate documentation into their process.[^1] In order to build an enduring and efficient organization Burrow needs to adopt the Triple D mindset. No, I’m not talking about Guy Fieri’s Diners, Drive-ins and Dives. I’m talking about Documentation Driven Design. Simply put, **from the perspective of a user, if a feature is not documented, then it doesn't exist, and if a feature is documented incorrectly, then it's broken.**[^2] I’m going to start by breaking down the different types of docs, establish the benefits of having good docs and finally suggest some tips for creating better docs.

A few caveats
* Please understand that we need to find a balance between no documentation and excessive documentation. It should not be burden to build our documentation.
* I come from a history and journalism background so I am very opinionated about the power and importance of writing but I also understand that everyone learns differently. I truly do not intend to offend anyone with any content contained here and apologize if I do.|

## Types of Documentation
---
Technical documentation falls into two major categories:[^3]
- Product docs
- Process docs
### Product Docs
Product documentation is geared towards describing the product that is being developed. Product docs describe **systems** in great detail. These docs might contain a lot of **tables** and **diagrams** and **user stories** or **code snippets**. Truly good product documentation not only captures the current design of a system, but also the choices that have contributed to that design. Geared towards a more technical audience you should not be afraid to get into the details, but be careful to structure your documents so that those who are only interested in the high level can still get something out of it.

### Process Docs
These are documents to describe specific processes that we want to repeat as a business. This documentation ranges from onboarding material to detailed how to guides. These sort of documents are typically aimed at people who are becoming acquainted with our processes or are from a less technical background. Knowing your audience is critical to striking the right balance.
## Benefits of Good Docs
---
### Onboarding
The more things we have documented the quicker and smoother our onboarding process becomes. As our business grows it is going to be necessary to expand our team. Documentation prepares us for that expansion and improve the team's [bus factor](https://en.wikipedia.org/wiki/Bus_factor)

### Collaboration
Documents provide an excellent arena for having asynchronous conversations around topics. While it’s not git there is also versioning of documents in addition to comments. I’m not suggesting that documents can replace the need to have discussions in meetings, quite the contrary. When we circulate documentation in advance of a meeting we have a rich starting point for a more fruitful conversation.

### Automation

Once you have documented something you are really only a stone’s throw away from automating it. As we expand our team and capabilities many of the manual processes that we will describe in these documents will eventually be automated, and these docs will serve as the requirements for the engineers who ultimately automate that process

### Time-Saving

Ultimately, being able to look something up in docs means you don’t have to spend time chasing that information down. Having a single source of truth also eliminates confusion and save time down the road. All of the points above all add up to time saved.

## Tips for Writing Good Docs
---
### Write Like You Talk
> Informal language is the athletic clothing of ideas. - Paul Graham

A lot of the people reading and writing these documents will come from a technical background, but the information contained here is important to everyone, including those with less technical backgrounds. Writing documents with clear informal language is a good way to practice communication of complex ideas in an. In his 2015 piece “[Write Like You Talk](http://paulgraham.com/talk.html)”, Paul Graham describes how spoken language is more effective at promoting the exchange of complex ideas than written language. This is due to the fact that less formal language creates **cognitive ease**, which results in greater comprehension. If you want people to understand something use language that is easy to understand.[^4]

### Keep Docs Up-To-Date
A doc that is out of date can actually be worse than no docs at all. When you are making changes in our application take some time to look up the docs and reflect your changes there. If you don’t find docs to update then guess what? You should probably make one! Which leads me to…

### Create Stubs
Sometimes in exploring our documentation you will notice that there are things that don’t have documentation but should. A great way of dealing with this is to create what Wikipedia refers to as [stubs]([https://en.wikipedia.org/wiki/Wikipedia:Stub](https://en.wikipedia.org/wiki/Wikipedia:Stub)): `an article that, although providing some useful information, lacks the breadth of coverage expected`. It’s better than nothing at all, and when people stumble on these stubs in the future we can gradually add the information in.

### Use Hyperlinks
Do you ever notice that of the many tabs you probably have open at a time that a lot of them are just open because they are things you don’t want to lose? Getting back to links can be tough and may involve a lot of clicking and searching to relocate. Do your teammates (and yourself) a favor: add links all over your documentation, because the minutes saved getting back to these links adds up. **Most important, add cross links between documentation.**

### Visual Hierarchy
This is a term commonly used in UX design but one that applies to any presentation of information.

> Visual Hierarchy is used to rank design elements and influence in the order you want your users to view them. By using principles like **contrast**, **scale**, **balance** and, more, you can help establish each element in its rightful place and help the most important elements **stand out**. 
> 
> - Caleb Kingston (Adobe XD)[^5]

Embedding that quote had a dual purpose of sharing that information while attempting demonstrating the point being made in the quote. Visual Hierarchy and the appropriate use of proper semantic HTML has the added benefit of improving accessibility, which is important to building an inclusive workspace!


> [!NOTE] Tip
> **Tip:** using these panels is a great way to make information stand out to the reader!


### Add Diagrams
Research has found that [65 percent of the general population are visual learners](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=587201), meaning they need to see information in order to retain it.[^6] Many of the stuff that we are trying to describe can be better explained visually. Take the time to get comfortable with a diagraming tool. It can be as simple as PowerPoint or as complex as Photoshop, but what’s most important is that you are comfortable using it.

### Use Macros and Templates
There are many different macros and templates available in Confluence and Jira. Spend time getting to know the features that are available and figure out how you can get the most out of our documentation tool.

## Conclusion
---
> Brevity is the soul of wit - _Hamlet, Act 2 Scene 2_

If you only take one thing away from this document I hope that it is this: **the best way to improve your writing is to just write!** If you are shy about sharing what you’re writing before you’ve had a chance to edit it thats what private pages and personal spaces are for. However, I would point out that allowing others to read and edit your work is critical to improving your writing skills. Ultimately, when it comes to sharing knowledge that is important to the business done is better than perfect so just start putting pen to pad! Not sure where the quote comes from but “_Write Drunk, Edit Sober”._ Personally, I use documents as a way to keep track of the many things that are going on in my day to day and organize my own thoughts. So polishing it up a little and adding it to our knowledge base is very easy.

## Additional Reading
---
- [How to communicate effectively as a developer](https://www.karlsutt.com/articles/communicating-effectively-as-a-developer/): **High resolution writing** is very valuable to the people you work with
- [Writing strategies and visions](https://lethain.com/strategies-visions/?ref=blog.pragmaticengineer.com)  by Will Larson
- [An Elegant Puzzle](https://blog.pragmaticengineer.com/an-elegant-puzzle-book-review/) by Will Larson

## Footnotes
[^1]: [https://www.atlassian.com/work-management/knowledge-sharing/documentation/importance-of-documentation](https://www.atlassian.com/work-management/knowledge-sharing/documentation/importance-of-documentation)
[^2]: https://gist.github.com/zsup/9434452](https://gist.github.com/zsup/9434452
[^3]: I had previously come up with slightly different categories but found an article that convinced me to adopt this classification: [https://www.altexsoft.com/blog/business/technical-documentation-in-software-development-types-best-practices-and-tools/](https://www.altexsoft.com/blog/business/technical-documentation-in-software-development-types-best-practices-and-tools/)
[^4]: I highly recommend [_Thinking Fast and Slow_](https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555/ref=tmm_pap_swatch_0?_encoding=UTF8&qid=&sr=) by Daniel Kahneman if you want to think about how people think
[^5]: https://xd.adobe.com/ideas/process/information-architecture/visual-hierarchy-principles-examples/
[^6]: https://www.atlassian.com/blog/teamwork/how-to-work-4-different-learning-types#:~:text=Research%20has%20found%20that%2065,in%20order%20to%20retain%20it

