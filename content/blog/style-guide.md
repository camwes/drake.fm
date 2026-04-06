---
title: Building Websites
slug: style-guide
date: '2012-12-04T05:00:00.000Z'
excerpt: >-
  Using progressive HTML5 techniques can not only save you time developing, but also can enrich performance.
canonicalUrl: ''
featureImage: 'https://drake-ghost.s3.amazonaws.com/2017/07/design-grammer.jpg'
draft: true
---
## HTML

Using progressive HTML5 techniques can not only save you time developing, but also can enrich performance. For example, rather than writing a long chunk of code to validate a form input, use the new HTML5 form elements which automatically validate (input="email"). Of the many HTML5 features the most important are:

Related reading: [[js|Learning Javascript]] and [[editors|State of Text Editors (2015)]].

### [Semantics](http://diveintohtml5.info/semantics.html)

### [Better Forms](http://diveintohtml5.info/forms.html)

*   autofocus
*   placeholder text
*   new input types (email, date-picker, etc.)
*   required fields
*   automatic validation (may some day replace client side validation)

### [Canvas element](http://diveintohtml5.info/canvas.html)

### Audio/Video Support

### Related

There are several commonly associated but technically separate/experimental features with individual specifications:

*   [Geolocation API](http://diveintohtml5.info/geolocation.html)
*   Web Sockets
*   SVG
*   Local Storage

### HTML DOM Objects - Methods and Properties

Some commonly used HTML DOM methods:

*   getElementById(id) - get the node (element) with a specified id
*   appendChild(node) - insert a new child node (element)
*   removeChild(node) - remove a child node (element)

Some commonly used HTML DOM properties:

*   innerHTML - the text value of a node (element)
*   parentNode - the parent node of a node (element)
*   childNodes - the child nodes of a node (element)
*   attributes - the attributes nodes of a node (element)

Some commonly used HTML DOM events

*   onclick
*   onresize
*   onload
*   onblur
*   onfocus
*   onscroll

## CSS

#### Pre-processors: SASS v. LESS v. Stylus v. Compass

I personally prefer compass which is built on SASS because it is an excellent tool, with a great community. That being said there are many great options available.

### [Box Model](http://www.w3schools.com/cssref/default.asp#box)

![Box Model](https://drake-ghost.s3.amazonaws.com/2014/Apr/box_model.png)

Precision is the key when aligning content with CSS. A deep understanding of the properties related to the box model and display is crucial for creating responsive designs and finely tuned layouts.

*   overflow
*   clearfix
*   display
    *   inline (default): The element is displayed as an inline-level element (e.g. span)
    *   block: element is displayed as a block-level element with width &height (e.g. div, p)
    *   inline-block

#### flexbox

### object-fill

### [Padding](http://www.w3schools.com/css/css_padding.asp)

```css
padding:25px 50px 75px 100px;
```

*   top padding is 25px
*   right padding is 50px
*   bottom padding is 75px
*   left padding is 100px

### [Background](http://www.w3schools.com/css3/css3_backgrounds.asp)

```css
body {background:#ffffff url('img_tree.png') no-repeat right top;}
```

*   background-color
*   background-image
*   background-repeat
*   background-attachment
*   background-position

Also important:

*   background-size
*   background-origin

### [Borders](http://www.w3schools.com/css3/css3_borders.asp)

*   border-radius
*   box-shadow
*   border-image

![](https://drake-ghost.s3.amazonaws.com/2015/02/Blog_WebTypo_V12.png)

### [Typography](http://www.w3schools.com/css3/css3_fonts.asp)

Typography is quickly becoming the calling card of good web design. No longer limited to a small collection of "web-safe" fonts. With the introduction of the [@font-face](http://www.w3schools.com/cssref/css3_pr_font-face_rule.asp) rule and the text-shadow to CSS3 the possibilities are getting very exciting.

![Font Shorthand](https://drake-ghost.s3.amazonaws.com/2014/Apr/font_shorthand.png) ![Typography](https://drake-ghost.s3.amazonaws.com/2014/Apr/typography.jpg)

### [2D](http://www.w3schools.com/css3/css3_2dtransforms.asp)/[3D](http://www.w3schools.com/css3/css3_3dtransforms.asp) Transformations

### [Animations](http://www.w3schools.com/css3/css3_animations.asp)

### [Transitions](http://www.w3schools.com/css3/css3_transitions.asp)

### [Multiple Column Layout](http://www.w3schools.com/css3/css3_multiple_columns.asp)

### [User Interface](http://www.w3schools.com/css3/css3_user_interface.asp)

### [Selectors](http://www.w3schools.com/cssref/css_selectors.asp)

Understanding CSS selectors is the most critical concept to grasp if you are going to become a guru of front end design. A detailed understanding of every CSS property is useless if you don't understand how to apply them to what you want. Here \[source 6\] is a guide to complex selectors, and most of the recommended books have great chapters on the subject.

*   child selectors:
    *   descendant selector ( div p)
    *   direct child selector (div > p) selects only those directly within the parent
*   sibling selectors (div ~ p) selects the specified elements that shares a parent and follows
*   adjacent sibling selector (div +p)
*   attribute selector (a\[target\], a\[href="[http://drake.fm](http://drake.fm)"\])
*   pseudo classes (a:visited, a:focus, li:first-child, :nth-child)

#### [Selector Specificity](http://css-tricks.com/specifics-on-css-specificity/)

I would suggest following the link for a more detailed explanation of specificity. In a nutshell, different selectors have different specificity values. As a result, those CSS rules with the highest specificity value will override those with lower values. It is calculated as such:

![Specificity](https://drake-ghost.s3.amazonaws.com/2014/Apr/specificity.png)

## Javascript

Javascript is the predicate of the sentence and needs to be discussed in depth. Start with [[js|this overview]].  
![Javascript](https://drake-ghost.s3.amazonaws.com/2014/Apr/JavaScript-Tools-1200.jpg)

## High Performance Websites

Building a high performance website is a remarkably challenging feat, but there are very clear steps to follow to maximize the performance of your site or app. How you build your structure and build your applications matters immensely in regards to performance. A major consideration: running scripts blocks parallel downloads, which can slow down your site download times.

Basic Rule: the most basic technologies (HTML/CSS) should be used in lieu of writing complicated scripts or using javascript plugins whenever possible.

*   Understand the [critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
*   Make fewer HTTP requests
*   Use a CDN
*   Add an Expires header
*   Gzip components
*   Put stylesheets at the top
*   Move scripts to the bottom
*   Caching
*   CSS image sprites
*   Avoid CSS expressions
*   Make JS and CSS external
*   Reduce DNS lookups
*   Minify JS
*   Avoid redirects
*   Remove duplicate scripts
*   Configure ETags
*   Make AJAX cacheable

## Reference

*   High Performance Web Sites - Steve Souders
*   CSS The Definite Guide - Eric A Meyer
*   CSS Pocket Reference - Eric A Meyer
*   Responsive Design - Ethan Marcotte

#### For Absolute Beginners

*   [Don't Fear the Internet](http://www.dontfeartheinternet.com/)
*   [Dive into HTML5](http://diveintohtml5.info/)
*   [Code Academy](http://codeacademy.com/)

#### Standards & Specifications

*   [HTML5 Please](http://html5please.com/)
*   [CSS3 Please](http://css3please.com/)
*   [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate)
*   [W3C HTML Specification](http://www.w3schools.com/html/html5_intro.asp)
*   [W3C CSS Specification](http://www.w3schools.com/css3/css3_intro.asp)

#### Good Links

*   [HTML5 & CSS3 Readiness](http://html5readiness.com/)
*   [Browser Support Stats](http://heygrady.com/blog/2012/07/03/state-of-browsers-july-2012/)
*   [Test your browser](http://beta.html5test.com/)
*   [Yahoo's guide to High Performance Websites](http://developer.yahoo.com/performance/rules.html#num_http)
*   [HTML5 Performance](http://www.html5rocks.com/en/features/performance)
*   [Complex Selectors](http://learn.shayhowe.com/advanced-html-css/complex-selectors)
*   [Detailed CSS positioning](http://learn.shayhowe.com/advanced-html-css/detailed-css-positioning)
*   [Sass Guidelines](http://sass-guidelin.es/)
*   [Using LibSass with Compass](http://stackoverflow.com/questions/26088529/using-libsass-with-compass)
*   [Fun with line Height](http://codepen.io/chriscoyier/pen/YPZLGj?editors=110)

#### [Medium CSS Styleguide](https://gist.github.com/fat/a47b882eb5f84293c4ed)

Very thorough and [described in detail](https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06).

#### [Github CSS Styleguide](https://github.com/styleguide/css)
