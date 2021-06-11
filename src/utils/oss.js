import axios from 'axios'
import store from '../store'
const OSS = require('ali-oss')

const region = process.env.VUE_APP_OSS_REGION
const accessKeyId = process.env.VUE_APP_OSS_ID
const accessKeySecret = process.env.VUE_APP_OSS_SECRET
const bucket = process.env.VUE_APP_OSS_BUCKET

const client = new OSS({
  region,
  accessKeyId,
  accessKeySecret,
  bucket,
})
// 支持File对象、Blob数据以及OSS Buffer。
// const data = '<File Object>'
// or const data = new Blob('content');
// or const data = new OSS.Buffer('content'));

export async function putObject(object_key, data) {
  try {
    // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
    let result = await client.put(object_key, data)
    console.log('success in oss', result)
  } catch (e) {
    console.log('error in oss', e)
  }
}

export function blobToDataURI(blob, callback) {
  let reader = new FileReader()
  reader.onload = function (e) {
    callback(e.target.result)
  }
  reader.readAsDataURL(blob)
}

export function dataURItoBlob(dataURI) {
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  let byteString = atob(dataURI.split(',')[1])
  let arrayBuffer = new ArrayBuffer(byteString.length)
  let intArray = new Uint8Array(arrayBuffer)
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i)
  }
  return new Blob([intArray], { type: mimeString })
}

export function testGet(object_key) {
  return `https://${bucket}.${region}.aliyuncs.com/${encodeURIComponent(object_key)}`
}

export function getBase64(url) {
  return axios
    .get(url, {
      responseType: 'arraybuffer',
    })
    .then((response) => new Buffer.from(response.data, 'binary').toString('base64'))
}

export function getMyAvatar() {
  let object_key = 'userAvatar_' + store.getters.username
  let imgUrl = testGet(object_key)
  getBase64(imgUrl).then((ret) => {
    let base64Data = 'data:image/jpg;base64,' + ret.toString()
    store.commit('SET_AVATAR', base64Data)
  })
}

export function getUserAvatar(username) {
  let object_key = 'userAvatar_' + username
  let imgUrl = testGet(object_key)
  return getBase64(imgUrl).then((ret) => {
    let base64Data = 'data:image/jpg;base64,' + ret.toString()
    return Promise.resolve(base64Data)
  })
}

export function putProjectLogo(projectId, data) {
  let object_key = 'projectAvatar_' + projectId.toString()
  putObject(object_key, data)
}

export function getProjectLogo(projectId) {
  let object_key = 'projectAvatar_' + projectId.toString()
  let imgUrl = testGet(object_key)
  return getBase64(imgUrl).then((ret) => {
    let base64Data = 'data:image/jpg;base64,' + ret.toString()
    return Promise.resolve(base64Data)
  })
}

export function getDefaultAvatar() {
  let object_key = 'userDefault'
  let imgUrl = testGet(object_key)
  return getBase64(imgUrl).then((ret) => {
    let base64Data = 'data:image/jpg;base64,' + ret.toString()
    return Promise.resolve(base64Data)
  })
}

export function getDefaultProjectAvatar() {
  let object_key = 'projectDefault'
  let imgUrl = testGet(object_key)
  return getBase64(imgUrl).then((ret) => {
    let base64Data = 'data:image/jpg;base64,' + ret.toString()
    return Promise.resolve(base64Data)
  })
}
