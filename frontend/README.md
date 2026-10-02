<!-- Tinder Frontend  -->
 
## 1 - Create a vite + React application
## 2 - Remove Unnecessary files and code
## 3 - Install tailwind css
## 4 - Install DaisyUi library
## 5 - Add navbar component from DaisyUi in Body.jsx
## 6 - Create a Navbar.jsx file separate component file
## 7 - Install react router-dom
## 8 - Create BrowserRouter > Routes > Route={Body} > RouteChildren
## 9 - Create an outlet in your Body Component <Body />
## 10 - Add footer compnent in Body.jsx below outlet
## 11 - Create a login page
## 12 - install axios
## 13 - install cors - backend  - add middleware to with configuration: origin, credentials:true
## 14 - whenever u are making api calls pass  => {withcredntials: true} along with emailId, password
## 15 - Install redux toolkit react-redux
## 16 - configure redux store and create a slice for user login and register
## 17 - Create a provider in main.jsx and wrap the <App /> component with it
## 18 - create slice => add reducer to store
## 19 - add redux devtools in chrome extension and check if the state is updating or not
## 20 - Login and see if the state is updating or not
## 21 - Navbar should also update the state when user is logged in and logged out like image and name should be displayed in the navbar when user is logged in and when user is logged out it should show login and register button
## 22 - Refactor our code and create a separate component for login and register form and use it in the login page and register page and a constant file for all the api calls and use it in the login and register form component
## 23 - You should not be access to other routes when you are not logged in
## 24 - if token is not present , redirect user to login page
## 25 - Logout feature
## 25 - get the feed and add the feed in the store
## 26 - build the userCard on the feed page and display the user data in the card
## 27 - editPrfoile feature
## 28 - a new page to see all my connection 
## 29 - a new page to see all my connection request
## 30 - feature to accept and reject the connection request
## 31 - Send/Ignore the connection request feature
## 32 - Signup feature
## 33 - E2E testing for all the features



<!-- important points to remember about EC2 instance: -->
SSH exit → sirf connection band hua, data safe ✅
EC2 Stop → server band, data generally safe ✅
EC2 Start → server dobara chala, installed packages/files available ✅
Instance Terminate/Delete → server permanently remove ho sakta hai ❌

<!-- Deployment  -->
- EC2 = AWS ka virtual Linux server.
- EC2 instance create kiya — DevConnect.
- Instance ko Running state mein dekha.
- Connect → In SSH client open kiya.
- SSH key pair: DevConnect-Secret.
- Private key file: DevConnect-Secret.pem.
- .pem file ko Downloads folder mein rakha.
- Downloads folder se Open in Terminal → PowerShell kiya.
- SSH command use ki:
ssh -i "DevConnect-Secret.pem" ubuntu@ec2-3-107-116-151.ap-southeast-2.compute.amazonaws.com
- First connection par yes → host fingerprint accept kiya.
- Error aaya: Bad permissions / private key too open.

- Linux/macOS mein equivalent hota hai:
chmod 400 DevConnect-Secret.pem

- Windows mein permissions ke liye icacls use karenge.
icacls DevConnect-Secret.pem /inheritance:r
icacls DevConnect-Secret.pem /grant:r "%username%":(R)
- SSH command dobara run kiya.

- Install Node.js on EC2 instance:












