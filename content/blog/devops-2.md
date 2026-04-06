---
title: Devops 2
slug: devops-2
date: '2021-10-01T12:00:00.000Z'
excerpt: >-
  Launching a scalable node.js app is something that can literally be done in less than 30 minutes these days with the correct workflow.
canonicalUrl: ''
featureImage: ''
draft: false
---
A few years ago I wrote [[DevOps 1]] detailing my strategy for deploying node.js apps to Amazon EC2 instances. Since then I have gotten far more acquainted with the many services that AWS comprises, and have made great improvements to my development process as a result. Launching a scalable node.js app is something that can literally be done in less than 30 minutes these days with the correct workflow.

# Development
These days my development process has been greatly streamlined by not relying on programs like Grunt and Ruby Gems. I'm not shitting on these things, they are just a pain to support. I have an unofficial rule that if I can't `npm install` it, I ain't using it. I use Babel and Webpack in projects and it is a Godsend for dependency management. In addition to loading every file type that I need to handle, my webpack config does all of the following things:

- hot reloading to watch files
- running jshint and analysis on my javascript
- compressing all of my images
- minifying, concating and cache-busting my code
 them to S3

Assuming that you use webpack or your favorite build tool to do something similar that means that you've basically gotten the static assets part of your app figured out. When it comes to getting your server code in production though you probably get a little nauseous thinking about insuring that all of your dependencies are installed correctly and servers all that crap. This is where Docker makes your life a lot easier. Create a Dockerfile for every repo, even if all it does is npm install and expose the port. Containerizing your app makes it so much easier to deploy. This is especially true if you have several services your app depends on. The majority of my node apps use both Redis and MongoDB, so Docker makes life a lot easier.

The purpose of this guide isn't really to teach you how to use docker, but it is probably still helpful to run through some basics. 
## Docker Basics
**Build & Run Container**
```bash
docker build -t 'application:latest' -f Dockerfile .
docker run application
```

**Listing Running Containers**
```bash
docker ps
```
**Accessing a Container**
There is a `docker attach` command, but that is probably not what you want
```bash
docker exec -it <mycontainer> bash
```
**Listing Images**
```bash
docker images
```
**Tagging and Pushing Images**
```bash
docker tag docker_application:latest user/repo:latest
docker push user/repo:latest
```
#### Cleaning up Space
```bash
# list orphaned
docker volume ls -qf dangling=true
# clean orphaned
docker volume rm $(docker volume ls -qf dangling=true) 
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)
```
#### Docker References
* Docker compose yml [reference](http://54.71.194.30:4017/compose/yml/)
* Efficient Dockerfiles with [build cache](http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/)
* Cleaning up volumes [tutorial](https://lebkowski.name/docker-volumes/)
* remove [untagged containers](http://jimhoskins.com/2013/07/27/remove-untagged-docker-images.html)
* Resources
  * Docker/MongoDB/Express [tutorial](https://medium.com/@sunnykay/docker-development-workflow-node-express-mongo-4bb3b1f7eb1e#.7ntjv9lzb)
  * Docker/Node/Redis [tutorial](https://github.com/msanand/docker-workflow)
  * Docker/MongoDB guide [from Docker](https://docs.docker.com/engine/examples/mongodb/)

## Production
All that remains is getting you server code running. But don't worry... this is the easy part. Amazon Web Services has become a behemoth, and a major reason Amazon's stock has soared in recent years. It is certainly a one stop shop. Simply:

1. Purchase a domain from [Route 53](https://aws.amazon.com/route53/?nc2=h_m1)
- Create an [S3](https://aws.amazon.com/s3/?nc2=h_m1) Bucket for your static assets
- Create a [Cloudfront](https://aws.amazon.com/cloudfront/?nc2=h_m1) distribution and point to that bucket
- Get a TLS certificate issued via [Certificate Manager](https://aws.amazon.com/certificate-manager/?nc2=h_m1)
- Create a new Docker repo in [EC2 Container Registry](https://aws.amazon.com/ecr/)
- Launch a [VPC](https://aws.amazon.com/vpc/)
- Create an [ElastiCache](https://aws.amazon.com/elasticache/?nc2=h_m1) in VPC
- Start an [ElasticBeanstalk Environment](https://aws.amazon.com/elasticbeanstalk/?nc2=h_m1) in VPC
- Create a [CodePipeline](https://aws.amazon.com/codepipeline/?nc2=h_m1)
- Add your github repo as the source.
- Add build and test stages with [CodeBuild](https://aws.amazon.com/codebuild/?nc2=h_m1)
- Add a deploy step for ElasticBeanstalk specifying your production branch
- Point DNS record to ElasticBeanstalk URL

## Security
This [article](https://simplesecurity.sensedeep.com/web-developer-security-checklist-f2e4f43c9c56) is a very great, comprehensive overview of web developer security best practices.
#### [ECS CLI Tutorial](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_tutorial.html#ECS_CLI_tutorial_compose_service)
#### [ECS Compose](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/cmd-ecs-cli-compose.html)


Configure the command line clients
```bash
aws configure
ecs-cli configure --region us-east-1 --access-key ACCESS_KEY --secret-key SECRET_KEY --cluster cluster-name
```
You can start up some instances via the CLI
```bash
ecs-cli up --keypair id_rsa --capability-iam --size 2 --instance-type t2.medium
```
You have the option of creating services based on docker-compose files
```bash
ecs-cli compose --file docker-compose.yml create
```

I set the services that I need up in ECS, and then work out the connections between services by [associating the address](http://docs.aws.amazon.com/cli/latest/reference/ec2/associate-address.html)
```bash
# 1. create an elastic ip
aws ec2 allocate-address --domain vpc
aws ec2 describe-addresses

# 2. Find the instance running a container
aws ec2 describe-instances

# 3. Associate elastic ip with instance
aws ec2 associate-address --allocation-id <AllocationId> --instance-id <InstanceId>

# 4. Add attribute to instance
aws ecs put-attributes --attributes name=elasticip,value=<ElasticIp>,targetId=<arn>
```
Now when creating a service that needs to connect, add a [task placement constraint](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html) for the instance with the elastic ip attribute and you can insure that the specific service is tied to an elastic ip address.
