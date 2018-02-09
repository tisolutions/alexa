'use strict';
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

const s3 = new AWS.S3();

const params = {
  Bucket: 'tatiana-arias'
};

let getAudioName = new Promise((resolve, reject) => {
  s3.listObjectsV2(params).promise()
    .then((response) => {
      let list = []
      response.Contents.forEach(value => {
        list.push(value.Key)
      })
      resolve(list)
    }).catch(reject)
});

let getAudioURL = new Promise((resolve, reject) => {
  const bucketParams = params
  bucketParams.EncodingType = 'url'
  s3.listObjectsV2(bucketParams).promise()
    .then((response) => {
      let list = []
      response.Contents.forEach(value => {
        const s3Address = "https://s3.amazonaws.com/"
        const link = s3Address + bucketParams.Bucket + "/" + value.Key
        list.push(link)
      })
      resolve(list)
    }).catch(reject)
});

let getAudioData = new Promise((resolve, reject) => {
  let audioData = []
  Promise.all([getAudioName, getAudioURL]).then(function (values) {
    for (let index = 0; index < values[0].length; index++) {
      let item = { 'title': values[0][index], 'url': values[1][index] }
      audioData.push(item)
    }
    resolve(audioData);
  }).catch(reject)
})

console.log('el querido de anderson');

getAudioData.then((data) => {
  console.log(data)
}).catch(err => console.log(err))
console.log('es OutSystem');

module.exports = getAudioData;

// Audio Source - AWS Podcast : https://aws.amazon.com/podcasts/aws-podcast/
// var audioData = [
//   {
//     'title': ' Community Union Intention',
//     'url': 'https://s3.amazonaws.com/example-testing/Intencio%CC%81n+++Unio%CC%81n+++Comunidad.mp3'
//   },
//   {
//     'title': 'Mentoring',
//     'url': 'https://s3.amazonaws.com/example-testing/Certificaci%C3%B3n+en+Mentoring+desde+la+Esencia.mp3'
//   },
//   {
//     'title': 'Intencion',
//     'url': 'https://s3.amazonaws.com/example-testing/M+intenci%C3%B3n+hoy+es+estar+presente.m4a'
//   }
// ];
