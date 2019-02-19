# Instagram username
Check Instagram Username Availability

## Getting Started

### Prerequisites

- Install [Firebase CLI](https://www.npmjs.com/package/firebase-tools) globally
```
npm install -g firebase-tools
```
- Create a Firebase Project using the [Firebase Developer Console](https://console.firebase.google.com/)

- Authenticate to your Firebase account
```
firebase login
```

### Installing dependencies

```bash
# In the project root
npm install

# In the /functions dir
cd functions; npm install; cd -
```

Configure this app to use your Firebase project 
```
firebase use --add
```

### Linting

Firebase CLI actually setup eslint for this project with a pre-deploy lint hook.

> Recommended editor: VS Code with Eslint plugin.

## Deployment

Deploy your project using 
```
firebase deploy
```

Check `package.json` scripts for more options. 


## Built With

* [Firebase](https://console.firebase.google.com) - Hosting & Functions
* [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome Node API


## License

This project is licensed under the [MIT License](LICENSE.md)

