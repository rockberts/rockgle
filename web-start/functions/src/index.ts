import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as storage from '@google-cloud/storage'
const gsc = new storage.Storage();
const admin = require('firebase-admin');
admin.initializeApp();
//https://www.youtube.com/watch?v=OKW8x8-qYs0
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';

export const resizeImagesRe = functions.storage
  .object()
  .onFinalize(async object => {
      const bucket = gsc.bucket(object.bucket);
      const filePath = object.name!;
      const fileName = filePath?.split('/').pop();
      const bucketDir = dirname(filePath);

      const workingDir = join(tmpdir(), 'thumbs');
      const now = new Date();
      var myEpoch = now.getTime()/1000.0; 
 
      const tmpFilePath = join(workingDir, myEpoch +'source.png');

      if(fileName?.includes('thumb@') || !object?.contentType?.includes('image')){
          console.log('exiting function');
          return false;
      }
      await fs.ensureDir(workingDir);

      await bucket.file(filePath).download({
          destination: tmpFilePath
      });

      //resize

      const sizesw = [800];
      const sizesh = [500];

      
      const uploadPromises = sizesw.map(async size =>{
          const thumbName = `thumb@${size}_${fileName}`;
          const thumbPath = join(workingDir, thumbName);
          
          await sharp(tmpFilePath)
          .resize(size, sizesh[0], {
              fit:'fill'
          })
          .toFile(thumbPath);

          //Call api vision google services
          const vision = require('@google-cloud/vision');
          const client = new vision.ImageAnnotatorClient();
          const [result] = await client.textDetection(thumbPath);
          const labels = result.textAnnotations
          let textkeys = labels.map((item : any) => item.description.toLowerCase());
          let poskeys = labels.map((item : any) => item.boundingPoly);

          //create url signed 
          const pfxLogin= '?authuser=1';
          const pfxurl  = 'storage.cloud.google.com';
          const urlori = filePath.replace(/\s/g, '%20')+pfxLogin;
          const urlThumb = thumbName.replace(/\s/g, '%20')+pfxLogin;
          const thumbTrim = 'thumb/'+urlThumb;
          const urlimgpath = `https://${pfxurl}/${object.bucket}/${thumbTrim}`;
          const urloriimg = `https://${pfxurl}/${object.bucket}/${urlori}`;

          admin.firestore().collection('images').add(
              {coord: poskeys, 
              content: textkeys, 
              timestamp: Date.now(), 
              urlimg: urlimgpath,
              urlori: urloriimg});

          return bucket.upload(thumbPath, {
              destination: join(bucketDir, 'thumb/'+thumbName)
          });

          
      });
      await Promise.all(uploadPromises);
      
      /*
      async function deleteFile() {
         // Deletes the file from the bucket
         await gsc.bucket(bucket.name).file(filePath).delete();
         console.log(`gs://${bucket.name}/${filePath} deleted.`);
      };

      deleteFile().catch(console.error);
      */
      return fs.remove(workingDir);



  });
