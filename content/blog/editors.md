---
title: State of Text Editors (2015)
slug: editors
date: '2014-12-16T23:47:21.000Z'
excerpt: >-
  The most important tool in your life should be your text editor. It's the paint-brush, the hammer, the scalpel or the grenade depending on the task.
canonicalUrl: ''
featureImage: 'https://drake-ghost.s3.amazonaws.com/2017/07/textmate.jpg'
---
If I had to fashion a guess, I would say learning to write code is going to be a popular New Year's Resolution. If you are a programmer (or looking to become one) then you should understand that the most important tool in your life should be your text editor. It's the paint-brush, the hammer, the scalpel or the grenade depending on the task, and taking full advantage of it's features will remove a lot of obstacles from your path and allow you to focus on coding. So to assist anyone looking to write code (or anything else) in 2015, I've used a different editor a day for most of December and put together this guide just for you.

* * *

First, You may be wondering, what makes a good editor? Well if I had to come up with a top 10:

1.  Syntax Highlighting
2.  Powerful Find & Replace
3.  Extensibility
4.  Advanced Selection (vertical, multi-line)
5.  Tab Completion
6.  Version Control Support
7.  Split Pane
8.  Text Formatting
9.  Bracket Matching / Code Folding
10.  Documentation Integration (e.g. MDN lookup)

So if you're trying to write code in TextEdit or NotePad you've probably realized that it has just about none of these features. When it comes to editors there are a plethora of options out there that basically come in three flavors: standard, command line, and IDE. I will rank editors in each category, so whether you're a beginner or seasoned hacker looking to switch this should come in handy.

## Command Line Editors

I know most of you are thinking, "woah I'd better skip this command line section that shit looks like the Matrix". I understand your trepidation. However I strongly believe (and most serious programmers probably agree) that if you want to get the most out of your development process, you have to understand how to use the command line, especially its editors. Face it, whether you use a GUI or the command line you're going to have to learn a lot of shortcuts (or be very slow at what you do). So you may as well dive into the deep end in my opinion.

> **Side Note:** If you plan on developing web apps one day you are going to have to SSH into a server and change some files, and when you do your GUI text editor will not be there to save you

![emacs](https://drake-ghost.s3.amazonaws.com/2014/12/emacs.jpg)

> Emacs Workspace with HackerNews and a shell running in split panes

### 1\. [Emacs](http://www.gnu.org/software/emacs/)

**My personal favorite editor is Emacs**. It has an amazing collection of packages available via [MELPA](http://melpa.org) and [Marmalade](https://marmalade-repo.org/) and has key bindings that I don't hate. That being said there is a substantial learning curve to emacs, and it will likely take weeks before you're truly comfortable. However, once you learn emacs, you have possibly one of the most powerful computer programs in the world at your disposal, pardon me for being so hyperbolic.

**Price**: Free

**Strengths**: Maximum Extensibility, Open Source, Cross-Platform, Package Managers (MELPA, Marmalade)

**Weaknesses**: Steep Learning Curve

**Best Suits**: A Seasoned Hacker

![Vim](https://drake-ghost.s3.amazonaws.com/2014/12/vim.jpg)

### 2\. [Vim](http://www.vim.org/)

There are some really hardcore Web 1.0 vets out there who upon learning that you don't use vim to program will immediately exit the conversation. I think those people are just as stupid as vim keybindings, not for using it but for being so smug. I'm not saying there are no advantages to vim (actually vi, on top of which vim is built): it's already installed on almost all machines and it has a lot of the same powerful features that emacs has. However, it can be verbose with an even steeper learning curve than emacs, not to mention the fact that it is less extensible (no equivalent to emacs package managers).

**Price**: Free

**Strengths**: Comes Pre-Installed, Cross-Platform, Open Source

**Weaknesses**: Steep Learning Curve, Not Easily Extensible

**Best Suits**: A Seasoned Hacker

## Standard Text Editors

Let's be real though, most of you are actually interested in these, and for good reason. The text editor space is a crowded one but there are a few that have set themselves apart. While I rank these editors based on my overall opinion it should be noted that some are better at certain tasks than others (e.g. for editing Markdown I always use Atom, when I'm using a new language I like Sublime for its better tab completion). So while you may have a main squeeze in one editor, you should probably have a few other boos on the side.

![TextMate](https://drake-ghost.s3.amazonaws.com/2014/12/textmate.jpg)

### 1\. [TextMate](http://macromates.com/)

TextMate has just about all of the features that you would want to see in your everyday text editor. It also has a very active community of bundles developers. It leaves a bit to be desired, but is a strong editor. The beta version of TextMate 2 is being developed open source and is available right now for free, but will eventually cost.

**Price**: Free - €39

**Strengths**: Vertical/Multiple Selection, VCS Integration, Auto-Formatting, Documentation Integration, Robust Plugin Community, Open Source

**Weaknesses**: No Split-Pane support, OS X Only, Auto-Complete is not great (and has an odd key-binding `<esc>`)

**Best Suits**: Professional Web Developers Seeking Maximum Extensibility

![Sublime](https://drake-ghost.s3.amazonaws.com/2014/12/sublime.jpg)

### 2\. [Sublime Text](http://www.sublimetext.com/)

Sublime Text is very similar to TextMate, with a less active contributor base for plugins and a vastly improved autocomplete feature which can save a lot of time. Honesty, on the strength of this feature alone I strongly recommend this editor. At such a high price I assume most people will lean towards TextMate.

**Price**: $70

**Strengths**: Vertical/Multiple Selection, Split Panes, Auto-Completion, Cross-Platform

**Weaknesses**: Less Robust Plugin Community, No Builtin VCS Support

**Best Suits**: Professional Web Developers looking to save time or beginner who could use good autocompletion hints.

![Brackets](https://drake-ghost.s3.amazonaws.com/2014/12/brackets.jpg)

### 3\. [Brackets](http://brackets.io/)

Brackets plugins environment is great to be so young. It will soon be integrated with Creative Cloud which will probably be a very meaningful improvement. It is also the only editor that offers **[Extract](http://blog.brackets.io/2014/11/04/brackets-1-0-and-extract-for-brackets-preview-now-available/)** which gives you code hints from PSDs. Subsequently, I'm very high on this browser's future.

**Price**: Free (for now)

**Strengths**: PSD extraction, (Inevitable) Creative Cloud integration, Robust extensions (Grunt, Git, Jshint), Open Source

**Weaknesses**: Immature, OS X Only

**Best Suits**: Designers/Engineers needing PSD-Code conversion

![Atom](https://drake-ghost.s3.amazonaws.com/2014/12/atom.jpg)

### 4\. [Atom](https://atom.io/)

Open Source "Hackable" Editor made by Github. Better still, it appears that Atom wants to take advantage of the active community of TextMate bundles by making it easy to convert. With obviously strong Github integration and a solid base of introductory features, Atom could quickly make up ground on other editors.

**Price**: Free

**Strengths**: VCS Integration, Markdown Editing/Previewing, Open Source

**Weaknesses**: Immature

**Best Suits**: Coders looking to experiment or new to Git

### 5\. [BBEdit](http://www.barebones.com/products/bbedit/)/[TextWrangler](http://textwrangler.onfreedownload.com/)

TextWrangler is a lightweight version of BBEdit,which has been around for over 20 years. If you are looking something a lot less modern (and only a hair better than TextEdit or Notepad) this may be for you.

**Price**: $49 (BBEdit) Free (TextWrangler)

**Strengths**: Mature, Scriptable, Simple

**Weaknesses**: Very Feature Light

**Best Suits**: Someone Looking for the Simplest Possible Improvement on Status Quo

## Integrated Development Environment

If you've ever built an app you probably know that writing code is about more than just writing: What you really need is an environment to develop in. This environment should watch for changes and compile code, install and manage dependencies, and the many other tasks that are necessary for your application to work. If you haven't noticed from earlier sections my preferred dev environment is linux, with some emacs, tmux and grunt. IDEs typically package together a text editor, automation tools, debugger and more to make programming easy. I am not very fond of IDEs only because they tend to be rigid. In addition, its usually not the case that an IDE can excel in every function that it does. Therefore, if your needs outgrow the IDE capability in a particular aspect of development and you have to integrate an additional tool you just nullified the entire benefits of using an IDE.

### 1\. [WebStorm IDE](https://www.jetbrains.com/webstorm/)

Calling itself a "javascript IDE", WebStorm is incredible for debugging javascript code (i.e. adding breakpoint directly from the editor).

### 2\. [Dreamweaver](http://www.adobe.com/products/dreamweaver.html)

Old School but still powerful WYSIWYG editor from Adobe. This was the first editor I ever used but I am very glad that I outgrew it.

### 3\. [Eclipse IDE](https://eclipse.org/)

The "OG" of dev environments, Eclipse is mandatory for Java development, but can be used for any code. It has plenty of functionality, but is not one of the user unfriendliest IDEs out there. I apologize for the bias, but I won't get as detailed in my description of these applications.

### 4\. [Coda](https://panic.com/coda/)

Normally I would include Coda in the "standard" section, but unlike the other editors there Coda seems focus on features more common to IDES (live preview and uploading/publishing, MySQL Editor). Unfortunately I believe that these features comes at the cost of it failing to provide the same basic code editing features of many of other editors I prefer on this list.

### 5\. [Google Web Designer](http://www.google.com/webdesigner/)

WYSIWYG editor from Google... Not for professional development

* * *

## Conclusion

I just hope that this helps someone out there. If you are looking to further improve your development process be sure to check out my pet project (and personal dotfile repo) [dock](__GHOST_URL__/dock). Happy Coding!
