<!-- # Tinder Apis  -->


## authRouter -> 
## POST /signup                                => for user registration
## POST /login                                 => for user login
## POST /logout                                => for user logout




## profileRouter ->

## GET /profile/view                           => for viewing user profile
## PATCH /profile/edit                         => for editing user profile
## PATCH /profile/password                     => for changing user password




## connectionRequestRouter ->

## POST /request/send/:status/:userId             => for sending request to a user with status (interested or ignore)
## POST /request/review/:status/:requestId     => for reviewing a request from a user with status (accepted or rejected)




## userRouter ->

## GET /user/connections                       => for viewing all connections of a user
## GET /user/requests                          => for viewing all requests received by a user
## GET /user/feed                              => for viewing all users in the feed


