# rockgle

# Firebase Codelab: FriendlyChat

This is the source code for the Firebase FriendlyChat codelab. It includes start and end versions of the
code for Web, Cloud Functions, Performance Monitoring. To get started, open the codelab instructions:

 - [Firebase Web Codelab](https://codelabs.developers.google.com/codelabs/firebase-web/).
 - [Firebase SDK for Cloud Functions Codelab](https://codelabs.developers.google.com/codelabs/firebase-cloud-functions/).
 - [Firebase Performance Monitoring for Web Codelab](https://codelabs.developers.google.com/codelabs/firebase-perf-mon-web/).


## How to make contributions?
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md)


## License
See [LICENSE](LICENSE)

## Comience abriendo el cloud Shell
![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/cloud-shell.png)

git clone https://github.com/rockberts/rockgle.git

cd rockgle

## Prepare el ambiente 

npm i -g firebase-tools

firebase init

![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/cloud-shell.png)
![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/firebase-selecting.png)
![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/add-to-existing.png)

firebase login


Active la Base de Datos por primera vez

https://console.firebase.google.com/



firebase deploy --only firestore
