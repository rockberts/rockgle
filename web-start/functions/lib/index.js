"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeImagesRe = void 0;
const functions = require("firebase-functions");
// // Start writing Firebase Functions,
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const storage = require("@google-cloud/storage");
const gsc = new storage.Storage();
const admin = require('firebase-admin');
admin.initializeApp();
//https://www.youtube.com/watch?v=OKW8x8-qYs0
const os_1 = require("os");
const path_1 = require("path");
const sharp = require("sharp");
const fs = require("fs-extra");
exports.resizeImagesRe = functions.storage
    .object()
    .onFinalize(async (object) => {
    var _a;
    const bucket = gsc.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath === null || filePath === void 0 ? void 0 : filePath.split('/').pop();
    const bucketDir = path_1.dirname(filePath);
    const workingDir = path_1.join(os_1.tmpdir(), 'thumbs');
    const now = new Date();
    var myEpoch = now.getTime() / 1000.0;
    const tmpFilePath = path_1.join(workingDir, myEpoch + 'source.png');
    if ((fileName === null || fileName === void 0 ? void 0 : fileName.includes('thumb@')) || !((_a = object === null || object === void 0 ? void 0 : object.contentType) === null || _a === void 0 ? void 0 : _a.includes('image'))) {
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
    const uploadPromises = sizesw.map(async (size) => {
        const thumbName = `thumb@${size}_${fileName}`;
        const thumbPath = path_1.join(workingDir, thumbName);
        await sharp(tmpFilePath)
            .resize(size, sizesh[0], {
            fit: 'fill'
        })
            .toFile(thumbPath);
        //Call api vision google services
        const vision = require('@google-cloud/vision');
        const client = new vision.ImageAnnotatorClient();
        const [result] = await client.textDetection(thumbPath);
        const labels = result.textAnnotations;
        let textkeys = labels.map((item) => item.description.toLowerCase());
        let poskeys = labels.map((item) => item.boundingPoly);
        //create url signed 
        const pfxLogin = '?authuser=1';
        const pfxurl = 'storage.cloud.google.com';
        const urlori = filePath.replace(/\s/g, '%20') + pfxLogin;
        const urlThumb = thumbName.replace(/\s/g, '%20') + pfxLogin;
        const thumbTrim = 'thumb/' + urlThumb;
        const urlimgpath = `https://${pfxurl}/${object.bucket}/${thumbTrim}`;
        const urloriimg = `https://${pfxurl}/${object.bucket}/${urlori}`;
        admin.firestore().collection('images').add({ coord: poskeys,
            content: textkeys,
            timestamp: Date.now(),
            urlimg: urlimgpath,
            urlori: urloriimg });
        return bucket.upload(thumbPath, {
            destination: path_1.join(bucketDir, 'thumb/' + thumbName)
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
//# sourceMappingURL=index.js.map
