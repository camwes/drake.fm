---
title: SSH
slug: ssh
date: '2017-01-25T23:28:12.000Z'
excerpt: >-
  There are no tricks to this riddle but if you understand ssh keys then the solution should be fairly obvious to you.
canonicalUrl: ''
featureImage: ''
draft: true
---
SSH is critical to all developers connecting to servers and is the safest most common way to access remote servers. Whenever I think of SSH, I am reminded of a wonderful riddle that once stumped me good. The riddle is simple:

Related reading: [Git](__BLOG_URL__/git), [Devops](__BLOG_URL__/devops), and [Dock](__BLOG_URL__/dock).

> There is a man who lives in Moscow, and his girlfriend lives in Siberia. One day he needs to send her an important package, the contents of which are not relevant, but ever more important. Here's the rub, the Russian postal service is corrupt, and the only way to safely send mail is to send it in a locked chest. They will literally pillage, steal or destroy any mail that is not secured with a lock and key. He has his own lock and his own key, as does she. But they don't have the keys to each other's lock. How can they send the package confident that it will safely arrive?

There are no tricks to this riddle but if you understand ssh keys then the solution should be fairly obvious to you.

To connect to a server using ssh you need to have a private key whose corresponding public key is in the servers authorized\_keys file. You could alternatively use a password (which is not recommended for many reasons).

### Generate SSH Keys

```sh
ssh-keygen 
# follow the prompt (passphrase optional)
```

This outputs two files, a private and public key in the destination you specify (defaults to `~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub`). You need to copy the contents of the latter and email to your server admin. They will enable access by following the next steps:

### Adding Users

Suppose you want to grant server access to someone else. This is simple:

#### as server administrator

```sh
ssh admin@101.0.0.0
sudo adduser newuser newuser
nano /home/newuser/.ssh/authorized_keys
```

Then paste `id_rsa.pub` into the authorized\_keys file. The new user can now connect:

```sh
ssh -i ~/.ssh/id_rsa newuser@101.0.0.0 
```

If you can understand what happened there then you have a good handle on how ssh works.

### SSH config file

A great improvement that you can make to your ssh workflow is to use an ssh config file. This basically allows you to create ssh shortcuts that store information such as username and identity file. This files is located at: `~/.ssh/config` Here is an example config entry:

```sh
Host dp
     IdentityFile ~/.ssh/id_rsa
     User ubuntu
     Hostname 11.111.111.111
     ForwardAgent yes
     ServerAliveInterval 30
     ServerAliveCountMax 120
```

It is explained in detail in this [blog post](http://nerderati.com/2011/03/simplify-your-life-with-an-ssh-config-file/).

## Mosh

Finally I would recommend strongly that you use mosh (the mobile shell). Unlike standard ssh mosh can keep you connected and responsive even when your internet suffers. They put it best:

Remote terminal application that allows roaming, supports intermittent connectivity, and provides intelligent local echo and line editing of user keystrokes. Mosh is a replacement for SSH. It's more robust and responsive, especially over Wi-Fi, cellular, and long-distance links.

download it here: [http://mosh.mit.edu/#getting](http://mosh.mit.edu/#getting)
