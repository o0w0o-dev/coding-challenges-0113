# image-search

## Deploy to local

```
# clone the repository
$ git clone git@github.com:o0w0o-dev/coding-challenges-0113.git

# rename folder
$ mv coding-challenges-0113 image-search

# navigate into the directory
$ cd image-search

# set your AWS profile
$ export AWS_PROFILE=pantheonlab

# start the local server
$ ./deploy_local.sh dev

# docs url
# http://localhost:4000/docs

```

## Deploy to AWS EC2

```
1. go to repo
https://github.com/o0w0o-dev/coding-challenges-0113

2. click Actions
3. select Actions "Deploy to Dev EC2"
4. click "Run workflow"
5. select branch "main"
6. click "Run workflow" (Green button)

# docs url
# http://ec2-54-160-205-156.compute-1.amazonaws.com:4000/docs

```

## Explanation of AWS EC2 Deployment

1. You need to set up secrets like the SSH key in the repository settings.
2. You need to prepare a YAML file to tell GitHub how to use secrets and what to do.
3. GitHub first clones the repository to the target server, then runs deploy_local.sh on the target server.
4. The bash script will decrypt the .env with SOPS and AWS KMS.
5. Optional: Then Docker builds the image and pushes it to AWS ECR due to my CPU architecture is different from AWS EC2.
6. The bash script will pull the image from AWS ECR.
7. Finally, Docker runs the image, and the server will be deployed.

## Testing

| Step | Description                                                                  | Expected result |
| :--: | ---------------------------------------------------------------------------- | --------------- |
|  1   | Search image with query string "tree"                                        | No access       |
|  2   | Create user with email <username>@o0w0o.com and password "StrongPassword123" | Success         |
|  3   | set Auth token                                                               |                 |
|  4   | Search image with query string "tree"                                        | Success         |
|  5   | Logout                                                                       | Success         |
|  6   | Search image with query string "tree"                                        | No access       |
|  7   | Login user with email and password in step 2                                 | Success         |
|  8   | set Auth token                                                               |                 |
|  9   | Search image                                                                 | Success         |
|  10  | Create user with email and password in step 2                                | Fail            |
|  11  | Login user with email in step 2, with wrong password "StrongPassword456"     | Fail            |

## Home Assignment

### API Development Tasks

🎉 Create API route for image search<br />
🎉 Integrate Unsplash API in app<br />
🎉 Integrate Pixabay API in app<br />
🎉 Integrate Storyblocks API in app<br />
🎉 Implement asynchronous API calls<br />
🎉 Handle errors from API calls<br />
🎉 Compile results into an object array<br />

### Optional Tasks

🎉 Implement user authentication feature<br />
😐 Use GraphQL instead of REST<br />
🎉 Build application as a Docker image<br />
🎉 Deploy application to cloud services<br />
😐 Optimize application for high request volume<br />
