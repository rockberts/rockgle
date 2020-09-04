# rockgle search engine

## License
See [LICENSE](LICENSE)

## Mediante este proyecto puedes crear un buscador de imagenes personalizado utilizando la nube de google cloud
![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/como-funciona.png)
## Pre-requisitos
1) Cuenta de Google cloud

http://console.cloud.google.com/

Una vez creada la cuenta debe crear un nuevo proyecto allí
![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/select-project.png)
![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/new-project.png)
## Comience abriendo el cloud Shell
![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/cloud-shell.png)

Una vez en la consola interactiva clone este proyecto
git clone https://github.com/rockberts/rockgle.git

cd rockgle

## Siga los pasos del siguiente code lab (únicamente los que se indican)
=>>PASO 3, 4, 12 y 13 (siempre ubicandose en la carpeta web-start)
https://codelabs.developers.google.com/codelabs/firebase-web

## Active el plan Blaze de pago por uso y la API de google Vision
![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/active-link.png)
![alt text](https://github.com/rockberts/rockgle/blob/master/readme/imgs/activar-plan-pago-por-uso.png)

## Vuelva al cloud Shell para instalar las dependencias de la cloud function
(siempre ubicandose en la carpeta web-start)

npm install firebase-functions

nvm install 10.16

npm install sharp

npm i fs-extra

firebase deploy --only functions
