# Battle ship game using NodeJS websockets

## Installation
1. Clone/download repo
2. cd 'repo_folder_name'
3. `npm install`

## Usage
**Development**

`npm run start:dev`

* App served @ `http://localhost:8181` with nodemon.

**Production**

`npm run start`

* App served @ `http://localhost:8181` without nodemon.

WebSocket client tries to connect to the 3000 port. You can change this by renaming `.env.example` and reassigning PORT values. In console you can see incoming requests and outgoing responses. 

---

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.
