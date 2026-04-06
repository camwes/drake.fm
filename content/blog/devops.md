---
title: Devops
slug: devops
date: '2013-12-28T06:10:00.000Z'
excerpt: >-
  In this post I will very briefly walk through my process for provisioning Ubuntu precise for a Node.js deployment on Amazon AWS.
canonicalUrl: ''
featureImage: 'https://drake-ghost.s3.amazonaws.com/2017/07/aws.png'
draft: true
---
In this post I will very briefly walk through my process for provisioning Ubuntu precise for a Node.js deployment on Amazon AWS. This guide isn't perfect and could be out of date, but you can follow my side project [dock](https://github.com/camwes/dock) I try and provide up-to-date scripts that you can use to provision your own servers.

Related reading: [[git|Git]], [[ssh|SSH]], and [[dock|Dock]].

### Before you get Started

There are a few steps that obviously need to be done that I'm not going to get into for brevity's sake but should be very simple to figure out:

1.  **Purchase a domain**. Where you decide to purchase it from is honestly doesn't matter since you will be using Amazons Route 53 for DNS management.
2.  **Sign up for Amazon Web Services**.
3.  **Generate AWS Access Keys**
4.  **Install AWS CLI**

#### Configure AWS

Once you have Access Keys you will need configure the cli:

```bash
aws configure
```

## 1\. Launch EC2 Instance

The first order of business is to launch a server that you will build your website on. You can launch an EC2 instance with the following options:

*   **image-id**: AWS image to use
*   **key-name**: SSH keypair
*   **security-group**: Security Group
*   **region**: region
*   **output**: Output format
*   **instance-type**: size of instance

```bash
sudo aws ec2 run-instances --image-id ami-3019e558 --count 1 --instance-type t1.micro --key-name MyKey --security-groups quicklaunch-1 --region us-east-1 --output json --color on 
```

If for some reason you don't like the command line, using the console is simple:

> *   From Console, select "**EC2**"
> *   Select "**Launch Instance**"
> *   Select "**Quick Launch Wizard**"

The quick launch screen is fairly simple and asks you to name your instance and create a key pair. You will use this key to SSH to your server securely with root access without the use of a password (you don't want to use a password for many reasons that I won't get into). Give this new key pair a name and and select download. this will save your key (key\_pair.pem) wherever you choose on your machine, but I recommend you move this key pair to a safe place on your machine like ~/.ssh.

#### Configure Ports (security-group)

Next, you need to open up the appropriate ports. The first step is to set up a security group. A security group acts like a configuration file for a firewall. It lets you set which ports are open to the world and which are closed. If you used the quick launch wizard AWS should have created a group for you titled something like "quicklaunch-1". You can use this or create your own security group.

> *   Select the desired security group
> *   At the bottom of the screen, select the "**Inbound**" tab.
> *   Select SSH from the "**create new rule**" drop down and click "**Add Rule**". This will open up port 22, necessary if you want to have SSH access to your instances.
> *   Repeat the process for port **80** (HTTP) and, if desired, port **443** (HTTPS).

#### Connect to Server

Now, if you want to SSH to your instance all you have to type is:

```bash
$ ssh -i ~/.ssh/your_key_pair.pem ec2-user@ec2-00-000-000-00.compute-1.amazonaws.com
```

Using the Public DNS that you find in your EC2 properties panel for that last part. If you don't understand ssh please read [this](http).

## 2\. [[dock|Provision Instance]]

So you're connected to your EC2 instance… What now? In the past the next steps were pretty straightforward and hardly disputable: Install and configure the typical LAMP stack technologies: PHP, MySQL and Apache.

Back in 2011 one of my friends who is an awesome developer suggested to me that I learn Node.js. Node.js is a Javascript engine for the server side. Your eyes might light up at the idea alone, since javascript has certainly become the default scripting language of the web. Most importantly, many beginners have experience with javascript, giving them the opportunity to expand their development to the server side.

The best thing about Node.js is its [single threaded, event-driven, non-blocking I/O](http://nodejs.org/); It is meant for building communications that depend on a lot of asynchronous connections; Because there is only one thread and an event-loop, you can use callbacks and avoid blocking requests. If used improperly, callback hell ensues. Generally speaking whenever javascript is used improperly, chaos ensues (read "Javascript: The Good Parts").

There are many advantages to Node.js, but one has to keep in mind that it is not a very mature technology like PHP. Regardless, Node is a reliable enough technology that is used by companies of the likes of Yahoo, Linkedin and [many more](https://github.com/joyent/node/wiki/Projects,-Applications,-and-Companies-Using-Node).

#### Install Node

Installing and running node is a fairly straightforward process. Depending on what you're building you may require a specific version of Node.js, but this tutorial assumes you're fine with using the latest version.

Using Ubuntu makes this much easier. For detailed guides to using package managers to install node [check this out](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

Finally, add to sudo's path:

```bash
sudo su
vi /etc/sudoers
# find this line: "Defaults    secure_path = /sbin:/bin..."
# add ":/usr/local/bin" to the end of the line
```

#### Install Nginx

> "Apache is like Microsoft Word, it has a million options but you only need six. Nginx does those six things, and it does five of them 50 times faster than Apache.”

> –Chris Lea.

I Couldn’t have said this better. Apache is by a long shot the most popular web server in existence (It is the A in LAMP after all) but many sites are moving on to Nginx. I use Nginx as a load balancer for my Node.js instances. Nginx is wicked fast at serving static files and can easily proxy node instances via the upstream module. Nginx has clean docs and a very active contributor base. Simply put Apache is dead. Installing Nginx is a breeze and its' configuration is simple:

```bash
# update config
emacs /opt/nginx/conf/nginx.conf 

# start Nginx
sudo service start nginx
```

Nginx has great documentation for their servers and I would suggest spending some time reading as much as necessary, being sure to use [best practices](http://wiki.nginx.org/Pitfalls). Check out [this article](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/) on nginx configuration.

#### Install Varnish

Varnish is a HTTP cache/accelerator, Combining Nginx static file processing and Node's fast IO with Varnish's enhanced caching is a great recipe for speed. First install Varnish:

#### Install Ruby

Another piece of software that will be required is Ruby. While it comes preinstalled on Mac, you will need to install it on your Ubuntu server. This can be done easily using the Ruby version manager [RVM](https://rvm.io/rvm/install)

```bash
\curl -L https://get.rvm.io | bash -s stable --ruby
```

Afterwards you can install the gems that you will need:

```bash
gem install sass compass
```

## 3\. Create Remote Git Repository

Github is obviously a wonderful tool for developers, but its benefits stretch much further than code collaboration. I use git at the core of my entire development cycle, including using git to deploy my app to production servers. This guide will show you how to take advantage of git's rich features and take all of the stress out of your deployment cycle.

First things first, how do you get your git repo built on a server? Since the dawn of the internet most developers have used FTP or SSH for these purposes, resulting in manual and strenuous deploy processes. You may have had the idea of simply logging onto the server and pulling from Github via HTTPS, which is a step in the right direction. However, this is a security concern that we can use git to mitigate.

#### Deploy Keys

Obviously generating an SSH keypair on the server and adding the publickey to Github is an option, but if your server is compromised so too is your entire Github account. This is where [deploy keys](https://help.github.com/articles/managing-deploy-keys#deploy-keys) come in. A deploy key is an SSH key that grants access to a single repository on GitHub rather than a user account. This can be added on the repository’s settings page.

You could easily stop here and you've got a secure, version controlled way to push your application to the server. But this workflow still requires you to access the server when you want to change things, not to mention whatever additional steps your build process may require (compiling assets, restarting servers, etc.) Luckily, git provides you with a mechanism for accomplishing all this and via [git hooks](http://git-scm.com/book/ch7-3.html). For full details on how git server's work I recommend [Git on a Server](http://git-scm.com/book/ch4-2.html).

#### Initialize Bare Repo

Let's pretend you're logged into a new server (as user 'git') and you want to create a bare git repository for deploying your site:

```bash
cd /home/git
mkdir mysite.git && cd mysite.git
git —-bare init
```

You've already got a Github repository (and branch) in mind that you want to deply, so you'll need to add a reference to that repo.

```bash
git --bare fetch git@github.com:username/mysite.git prod:prod
```

One thing that may be a little tough to grapple conceptually is that this is not a traditional git repository. It doesn't hold any of your repos code itself nor act like a standard repo. Server repos are there to manage your refs and objects, and actually checks out the files themselves to a "work tree" (which contains the repo contents, but is not a git repo either).

```bash
??? mysite.git          # Production Git Repo
?   ??? hooks
?   ?   ??? post-receive
?   ?   ??? pre-receive
??? public
    ??? prod          # Working Directory (branch prod)
```

The server that you just created contains a few files in `.git/hooks` directory that are sample git hooks. You need to add your own git hooks which will be executed when you push to the server.

*   **pre-recieve**: 1st script to run when handling a client push
*   **post-receive**: last script to run

#### Pre-Receive Hook:

The first hook is the pre-receive hook. Just as it sounds, this script is executed once the user pushes to the remote, but before it receives the objects. This is a good place to stop any processes that you don't want running while you update or clearing out dirs and files:

#### Post-Receive Hook

You may have guessed that this script executes once the remote has receieved the entire push. This is where you will need to checkout the updates to a working tree. After the objects are unpacked and the work tree built, you can start your app.

finally change the permissions on these

```bash
chmod +x /git/boilerplate.git/hooks/pre-receive
chmod +x /git/boilerplate.git/hooks/post-receive
```

#### Startup and Shutdown

As you can see I did not write a lot for my hooks to do, so how will I accomplish all of the stuff that needs to be done to restart my app? In case you missed it about I actually called a Ubuntu Upstart script. These are scripts that are executed in as "predicatable an environment as possible". You call them very simply with the "sudo service boilerplate stop" and if you've been programming Linux for any period of time you are probably very familiar with it. To add a service, you will want to create a script in `/etc/init.d/`.

> Note: Linux is officially moving away from [Upstart to systemd](http://www.zdnet.com/after-linux-civil-war-ubuntu-to-adopt-systemd-7000026373/). I still use Upstart here because I still use Ubuntu precise for production, but I plan to update this guide after I move my production sites to CoreOS/Docker/systemd

#### example init.d/script

## 4\. Update Local Repository

Now that you've got a git server set up in the cloud you need to add a reference of this remote to your local repository. Simply edit `.git/config`, or:

```bash
git remote add prod ssh://git@00.00.00.00/mysite.git
```

Finally, you can also make use of hooks on the client side. I use the post-commit hook to take a picture after every commit. You could obviously do some more meaningful things as well such as running a test suite or something.

#### post-commit hook

finally change the permissions on these

```bash
chmod +x /git/boilerplate.git/hooks/post-commit
```

#### Push to Remote

Congratulations! You have successfully done the following:

*   Launched an EC2 Instance
*   Built a Git Server
*   Created deploy hooks and scripts
*   Added the remote to local repository

Now all that you need to do to push your app to the remote server that you built is execute the following command.

```bash
git push prod
```

#### Pre-Push Hook

Finally I've found the pre-push hook very useful in my deployment process because there are things that need to be done when you are pushing to certain remotes. For example, before I push an update to a production site I like to sync the static files to S3, so that I can then serve them via CDN. I've found this is a very scalable, cost-effective way to serve static files with maximum performance (especially when compared to pointing the Cloudfront dist. to an EC2 load balancer).

## 5\. Storage Options

One of the best features of Amazon AWS is that it has several storage solutions of varying levels of price, avaialability and durability. The correct usage of Amazon Web Services will probably use all three of the major storage solutions:

*   **Elastic Block Storage**: A large-capacity persistent disk to attach to your server
*   **Simple Storage Service**: For storing large quantities of file with very high availability and durability.
*   **Glacier**: Very low cost, low availability storage for archives

#### EBS

Attaching EBS to a server is very simple and is done in the AWS EC2 console. Once you select a disk of an appropriate size and attach it, you will still have to mount this disk on the server:

#### S3

A great primary solution for cloud storage and backup is Amazon s3. It is very affordably priced for most user's needs and can give you maximum durability and availability. I have found that s3fs, an s3 FUSE based file system is a great way to  
mount a bucket on my server and even local machine for transferring large amounts of files to s3.

#### Glacier

You can save yourself a lot of money by using Amazon's other low cost storage options. Reduced Redundancy storage is a good first option which is exactly what it sounds like, and is just a slightly less secure option for less important data. Glacier is the ultimately cheap storage option, but only good for archiving.

## 6\. Update DNS Records

Now you have successfully configured your instance you need to be able to point your domain towards the server that you created. For convenience sake you will want to use what Amazon calls Elastic IP. This allows you to assign a unique IP address to your instance which makes managing DNS records easier.

#### Elastic IP Address

You can easily switch which instance your Elastic IP is associated with, which can be helpful if you have several servers for development and may need to switch which server your domain points to. Adding an Elastic IP is simple:

> *   From the EC2 console select "**Elastic IPs**"
> *   Select "**Allocate New Address**"
> *   Choose "**Associate Address**" then select your instance.

#### Route 53

Finally in order for your www.domain.com to point to the server that you just started you need to update the DNS records for the domain. I would recommend using Amazon's Route 53 simply because it consolidates the services that you have to use to make changes. You'll first want to go to the Route 53 page and create a new Hosted Zone. Next, add all of the record sets that you may need (MX, CNAME, A, www, etc.). Finally return to your domain provider and change the name servers to those listed on your zone file at AWS.
