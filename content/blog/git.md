---
title: Git
slug: git
date: '2014-01-21T06:10:00.000Z'
excerpt: |-
  When I first began seriously programming there were many instances in which I
  almost gave up for feelings of inadequacy. One hurdle to being a proficient
  developer that was particularly mind-numbing was grasping version 
canonicalUrl: ''
featureImage: 'https://drake-ghost.s3.amazonaws.com/2017/07/gitflow.png'
draft: true
---
When I first began seriously programming there were many instances in which I almost gave up for feelings of inadequacy. One hurdle to being a proficient developer that was particularly mind-numbing was grasping version control. As a beginner it can feel as if people are speaking Klingon when they start talking about branching and cherry picking. In reality, a developer only need know a few conventions of VCS (version control system) very well in order to use it effectively.

If you are starting out on a serious journey to become a developer, thoroughly understanding VCS is mandatory. When I first started Subversion was dominant, but today it would be foolish to learn anything other than git. Git is a decentralize VCS made popular by [Github](http://github.com). Github has one of the most amazing WebUIs out there, is full of amazing open source projects and is relied on by some of the [biggest names in tech](https://news.ycombinator.com/item?id=7648237).

The purpose of this post is to get you to use Git effectively, and also serve as a personal scratchpad for useful commands. These are the commands that I use often. It is not meant to be complete, and the web has many great resources out there for learning git. Bookmark these:

##### [Interactive Cheat Sheet](http://www.ndpsoftware.com/git-cheatsheet.html)

##### [Github Bootcamp](https://help.github.com/articles/set-up-git)

##### [Git Visualized with D3](http://www.wei-wang.com/ExplainGitWithD3/#)

## Basics

### Install Helpful Apps

[hub](https://hub.github.com) is a command-line wrapper for git that makes you better at GitHub. Check out the site for more details, they do a better job of selling it than I can. You may also want to consider downloading the Github GUI client for [Mac](https://mac.github.com/index.html) or [Windows](https://windows.github.com/) but this guide assumes that you will be using Github from the command line. If you have never opened the terminal app in your life then that probably sounds terrifying, but there are very few basic commands that you need to learn to use the CLI (command line interface) effectively. I would go so far as argue that you will never truly be a programmer if you cannot become comfortable with using CLIs, and once you do you will probably agree. Unfortunately, this is not a guide for [learning linux](http://tldp.org/LDP/intro-linux/html/) but there are many resources out there and I believe that if you put your mind to it you can acheive it!

### Clone or Initiate a Repository

Before you can do anything you will have to configure your account. Eventually you should use a `.gitconfig` file, here's an [example](https://github.com/camwes/dock/blob/master/lib/dotfiles/.gitconfig). Some neat tricks about writing aliases in your .gitconfig can be found [here](http://blogs.atlassian.com/2014/10/advanced-git-aliases/)

```git
git config --global user.name "Your Name Here"
git config --global user.email "your_email@example.com"
```

At the core of github's service is the basic object, the github repository. In version-control software like Git, a repository is simply a collection of files, typically stored on a server that allows users to contribute collaboratively by "committing" work. This may sound fairly obtuse if you have no idea how revision control works, and I would recommend you do what most people do and start at [Wikipedia](http://en.wikipedia.org/wiki/Revision_control).

There are two ways to get started, clone a git repo...

```git
git clone git@github.com:ohmlabs/ohm.git
```

or initiate a new git repository (then push to the server)

### Add, Commit and Push

After you've altered files you will need to commit these changes before pushing them to the server. The process is fairly simple, so here's an abbreviated walk-through:

```git
git status        # should show all changes 
git add .         # add all modified files
git commit -m 'detailed message describing changes'
git push origin master
```

Compare to older versions

```git
git diff dev~1 client/js/app.js
```

Sometimes the location of the file has changed and needs to be specified:

```git
git diff dev~1:client/js/etc/app.js client/js/app.js
```

### Stashing

Suppose you're working on a new feature branch and you want to swich to a different branch to see changes that were just pushed. If you have a lot of unstaged changes that are not ready to be committed, you need to switch branches without losing your working state. You will use the [git stash](http://git-scm.com/book/en/Git-Tools-Stashing) command. Here's how:

![](https://drake-ghost.s3.amazonaws.com/2017/07/Screen-shot-2009-12-24-at-11-32-03.png)

### Branching

The best thing about git is that it truly makes branching easy, and allows multiple developers to work together on a project with stable code and processes. There is a very renowned model that is based on this [blog post](http://nvie.com/posts/a-successful-git-branching-model/) and it very thoroughly describes a very efficent method for git branching.  
Here is an extrememly abbreviated list of important branching commands and this:

##### [Brancing Cheat Sheet](http://danielkummer.github.io/git-flow-cheatsheet/)

## Flight Rules

Flight rules refer to the [guide for astronauts](http://www.jsc.nasa.gov/news/columbia/fr_generic.pdf) (now, programmers using git) about what to do when things go wrong. Applying this concept to git is an idea that came from this [great repository](https://github.com/k88hudson/git-flight-rules). This section will identify some common sticky git scenarios and show you the best way to get yourself out of one.

> _Flight Rules_ are the hard-earned body of knowledge recorded in manuals that list, step-by-step, what to do if X occurs, and why. Essentially, they are extremely detailed, scenario-specific standard operating procedures. \[...\]

> NASA has been capturing our missteps, disasters and solutions since the early 1960s, when Mercury-era ground teams first started gathering "lessons learned" into a compendium that now lists thousands of problematic situations, from engine failure to busted hatch handles to computer glitches, and their solutions.

— Chris Hadfield, _An Astronaut's Guide to Life_.

#### Safer merge technique

You may wind up merging a lot and its important to do so safely. I have found it very useful to know a few tricks in manipulating git history and merging:

```git
git merge --no-commit --squash newfeature
```

This command merges a branch without executing a commit and squashes the commits into one commit. This is important if you have sensitive information being used on a branch.

If you have resolved a conflict in a file but realize that you made a mistake restarting the conflict resolution is simple:

```git
git checkout -m file
```

### Undo things

There are many ways to F things up in git, but if you know what you're doing, just about anything can be fixed. I will break down a few methods below, but [this article](https://github.com/blog/2019-how-to-undo-almost-anything-with-git) is a good read on the subject

#### Rewriting History

```git
git rebase --interactive --preserve-merges HEAD~7 
```

This command is useful if you have done some sort of major fuck up and need to go back and rewrite large amounts of history. Rebasing gives you the option of **rewording, squashing or editing** a commit. Learn all you can about the [interactive rebase](https://help.github.com/articles/interactive-rebase)., you will use it often. Note the `---preserve-merges` or `-p` flag, it allows you to include merge messages in the rebase.

#### [Undo a git push](http://stackoverflow.com/questions/1270514/undoing-a-git-push)

### Resetting the index to a branch

Sometimes things have gotten so messy on a branch that you want to start the branch history over while keeping the changes. You can do so by resetting the index on a branch (but note to push the branch up again after this you will need to force push see [this](https://stackoverflow.com/a/25357146)

```
git reset $(git merge-base main feature-branch)
```

#### Undo a commit and redo:

```git
$ git commit ...              # (1)
$ git reset --soft "HEAD^"    # (2)
$ edit                        # (3)
$ git add ....                # (4)
$ git commit -c ORIG_HEAD     # (5)
```

1.  This is what you want to undo
    
2.  This is most often done when you remembered what you just committed is incomplete, or you misspelled your commit message, or both. Leaves working tree as it was before "reset". (The quotes are required if you use zsh)
    
3.  Make corrections to working tree files.
    
4.  Stage changes for commit.
    
5.  "reset" copies the old head to .git/ORIG\_HEAD; redo the commit by starting with its log message. If you do not need to edit the message further, you can give -C option instead.
    

[Git Reset](http://git-scm.com/docs/git-reset): Taken from a great [StackOverflow answer](http://stackoverflow.com/questions/927358/how-to-undo-the-last-git-commit):

#### Amend a commit message

```git
git commit --amend
```

#### Stop tracking individual files:

```git
git rm --cached <file>
```

#### Reset File Tracking:

```git
git rm -r --cached .

# edit .gitignore

git add .
git commit -m ".gitignore is now working"
```

Inspired by this [Stack Overflow Question](http://stackoverflow.com/questions/1139762/ignore-files-that-have-already-been-committed-to-a-git-repository)

## Advanced Topics

So the preceding sections have hopefully been very useful in getting you from 0-60 with git, but there are many more advanced topics and features of the system that you will eventually be exposed to. This section is aimed at highlighting a few of these advanced topics.

### [Remotes](http://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

When you run git push, you typically push your current revisions to the github.com servers. You implicitly typed:

```git
git push origin master
```

**origin** refers to the **remote** and **master** refers to the **branch**. You can add your own remotes which allows you to do some cool stuff . One example I describe in detail in my [devops](__GHOST_URL__/devops) post: creating a bare git repository on a linux server to deploy a web app. Once the set up is complete you run this command locally:

```git
git remote add prod ssh://git@00.00.00.00/mysite.git  
```

After which you can push branches to your new remote server:

```git
git push prod production
```

Another cool use case for remotes are upstream repositories. I build this blog for example on top of an [open source repository](https://github.com/ohmlabs/ohm) that I've made. Often in the process of improving my site I want to add those improvements to my open source project. I could obviously just create my site on a branch of the open source repository, but I would have to be extremely careful to absolutely never push that branch to _origin_. Remotes are an excellent way to link a private repository to a public one.

#### Upstream remotes

Lets say you want to build an app on top of the ohm repo. These instructions should make sense:

Now whenever improvements are made to that repo you can benefit from those updates by simply merging upstream:

```git
git pull upstream
git merge upstream/master
```

Sometimes you will want to pull updates from the private repository to the open source repo it is built on top of. In your local version of the open source repo execute:

```git
git add remote upstream https://github.com/username/privaterepo.git
git pull upstream
git merge --no-commit --squash upstream/master
```

Be sure to use the safe merge technique described above when doing something like this. There are still some careful merge decisions that you are going to have to be careful about. But one of the best commands to know is the [cherry-pick](https://www.kernel.org/pub/software/scm/git/docs/git-cherry-pick.html) command. If you make good succinct commits it is often very useful to pick a single commit from a different branch. All you need to know is the commit id:

```git
git cherry-pick 3061b93ab50c8743c9be176093043b9c5b45fc4d
```

### [Subtree](http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/)

If you've worked on a git project of significant size you have certainly at some point wanted to include a repository within a repository. In the past I have used git submodules for this, but there are so many issues with submodules that I will not get into for the sake of brevity. All you need to know is that git has a feature that is far better suited to the task: git sub subtree. Additional reading can be found [here](https://medium.com/@v/git-subtrees-a-tutorial-6ff568381844)

> Caveats  
> Contributing back and forth between repos is definitely more complicated. To simplify potential merge conflicts, pulling changes from the libraries should be done in separate pull requests. Also, rebasing after subtree pulls don’t work (on rebases, git loses track of the —prefix, so you will have a big mess in your project’s root).

#### Adding a Subtree

```git
git subtree add --squash --prefix <prefix> <repository> <branch>
# i.e. git subtree add --squash  --prefix styles/base git@github.com:camwes/dock.git master
```

#### Adding the remote

```git
git remote add -f <remote-name> <repository>
# i.e. git remote add -f dock git@github.com:camwes/dock.git
```

#### Contributing "Upstream"

Once you have made changes that have been accepted in a repo you may need to update the sub-tree that it depends on. This can be done easily (assuming you added the remote above)

```git
git subtree push --prefix <prefix> <remote-name> <branch>
```

#### Pulling "Upstream"

The same applies for pulling changes:

```git
git subtree pull --squash --prefix <prefix> <remote-name> <branch>
```

In my .gitconfig under `[alias]` I added this to help:

```git
# Pull changes for the subtree, requires <prefix> <remote> <branch>
su = subtree pull --squash --prefix
# Push changes to the subtree, requires <prefix> <remote> <branch>
sp = subtree push --squash --prefix
```

### [Submodules](http://git-scm.com/docs/git-submodule)

> After much research and debate I believe submodules are only useful in a small set of use cases, and in general the pros outweigh the cons. [Use with caution](http://codingkilledthecat.wordpress.com/2012/04/28/why-your-company-shouldnt-use-git-submodules/)!!

Sometimes you want to include another repository within a repository. For example, you can include this boilerplate in your project and use parts of it to speed up development. How? Here's git [submodules](http://git-scm.com/book/en/Git-Tools-Submodules) in a few easy steps:

#### Commiting changes within a submodule

Perhaps the most annoying part is that when you make changes within a submodule you must commit both the submodule changes and the parent repo changes seperately, e.g.:

#### Update all submodules

Unfortunately git pull doesn't include submodules, so once you have updated your repo to update its submodules use:

```git
git submodule foreach git pull
```
