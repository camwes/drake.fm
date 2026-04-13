---
title: The Evolution of Dock
slug: dock-evolution
date: '2026-04-06T12:00:00.000Z'
excerpt: >-
  The earliest notes in this vault are textbook raw material — a self-taught engineer writing down everything he was learning in real time.
canonicalUrl: ''
featureImage: ''
draft: true
---

## Chapter 1: Learning the Craft (2012–2014)

The earliest notes in this vault are textbook raw material — a self-taught engineer writing down everything he was learning in real time. The JavaScript notes, the CSS style guide, the Git reference, the SSH deep-dive. These weren't posts anyone was supposed to read. They were the scratchpad of someone trying to close the gap between what they knew and what they needed to know.

Around 2014 that scratchpad became a repo: **Dock**. The premise was simple — writing good code starts with building a rich development environment. At the time that meant getting comfortable on the command line, installing Homebrew, configuring an emacs/zsh/tmux shell, and not being scared of a `.bashrc`. The original `./dock loc` command would take a fresh Mac from zero to something usable in 20-30 minutes. The stack was opinionated: emacs over IDE, CLI over GUI where it counted, Homebrew for everything.

The philosophy was already there, even if it wasn't articulated yet: a good environment multiplies you. The tool isn't the point — the leverage is.

---

## Chapter 2: The Server Years (2013–2016)

**DevOps 1** was the companion post to dock. It walked through manually provisioning an Ubuntu server on AWS EC2: launching an instance, configuring security groups, installing Node.js and Nginx, setting up a bare git repo with post-receive hooks for deployment, and pointing Route 53 at the result. Every step done by hand. Every step documented.

What's striking rereading it now is how much ceremony was involved. Buying a domain, signing up for AWS, generating access keys, configuring the CLI, launching an instance, opening ports, SSHing in, installing Nginx, writing init.d scripts, creating deploy keys, building a bare git server with custom hooks — and that was just to get a Node app live.

**DevOps 2** reflected how much things had simplified by the time Docker arrived. Grunt and Ruby gems were out. Webpack was in. The deployment target shifted from a manually-managed EC2 instance to a containerized app on Elastic Beanstalk with a full CodePipeline/CodeBuild CI/CD chain. The git hooks were gone. The init.d scripts were gone. A `git push` to a branch could trigger a full build, test, and deploy.

The throughline across both chapters: use git as the backbone. Deployment as code. The server as a reproducible environment, not a snowflake.

---

## Chapter 3: Simplifying Down (2017–2022)

At some point the complexity tipped back the other way. Running your own infrastructure teaches you a lot, but it also teaches you when to stop. Personal sites don't need Docker, Elastic Beanstalk, or CodePipeline.

**Drake.fm** emerged as a Next.js app deployed via GitHub Actions to GitHub Pages. Zero servers to manage. The blog is markdown files. The build runs in CI. The whole infrastructure fits in a `.github/workflows/` YAML file. The dock provisioning scripts got simpler too — fewer moving parts, fewer things to break on a new machine.

The **Documentation Driven Design** post from 2022 captures the philosophy shift from the other direction: start by writing the docs. Understand what you're building before you build it. The writing is the thinking.

---

## Chapter 4: The AI Turn (2025–2026)

> keep a strict rule: human writes the vault. agents read it, suggest, execute.
> [...]
> understand this:markdown files are the oxygen of llms.
> - Greg Isenberg ([tweet](https://x.com/gregisenberg/status/2026036464287412412?s=20))


The biggest shift in the history of dock isn't in the scripts — it's in what the engineer's job has become.

The "Good Vibes" note captures the reframe: AI is a lateral escalator. You can use it to go somewhere faster, or you can use it as a substitute for walking. The distinction matters. The job isn't gone; it's changed. You're no longer primarily *developing* — you're *composing*. Composing repeatable skills. Composing agents that can act on your behalf. Composing a system where the environment multiplies you more than any single tool ever did.

That's what dock is now becoming. Not just a provisioner, but a **stage manager** for a three-layer personal OS:

- **Backstage** (Obsidian) — where raw thinking happens, privately
- **Stage** (drake.fm) — where finished thoughts are published
- **Stage Manager** (dock) — the scaffolding that holds it together and grows into an agent harness

The **Agent Blueprint** lays out the architecture: a persistent agent brain in `lib/agent/`, living as markdown files, following a Read-Act-Reflect lifecycle. No database. No infrastructure costs at Phase 1. Just files, updated at the end of every session, keeping the agent informed of the world state.

### The First Agent

The Agent Blueprint describes a pattern. The Chief of Staff is where the pattern becomes a thing that runs.

The idea is straightforward: an agent that wakes at 7am, checks your calendar, tasks, and inbox, and has a brief in your email by 7:20. It tracks which tasks keep getting bumped — not just noting them as overdue, but escalating. First time: "overdue since Tuesday." Third time: "this has been overdue across three briefings. Complete it, delete it, or put it on a someday list." It watches which newsletters you always archive without reading and periodically asks if you want to unsubscribe. Small things, but the kind of small things that compound.

What makes it feel different from a dashboard is the memory. Every run writes to a JOURNAL. Preferences accumulate in RECOLLECTIONS. The tracking files persist. Next week's briefing knows what last week's briefing saw. This is the Read-Act-Reflect loop made concrete: not a stateless API call, but an agent that builds context over time.

The implementation is deliberately unglamorous: a Python script, a few Google API integrations, Chrome's local bookmarks file, and a cron job. No vector database. No hosted infrastructure. The whole thing runs from the same repo that used to just provision a Mac. That's the point — the environment that multiplied you is still the environment, it's just doing more.

---

## The Thread

Looking at it end to end: a scratchpad of notes became a provisioning tool became a deployment framework became a simplified personal site stack became an AI agent harness became an agent that acts. The technology changed completely at every turn. The underlying question never did: *how do you build an environment that multiplies what you can do?*

The answer keeps getting weirder and more interesting.
