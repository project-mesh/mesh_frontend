let OSS = require('ali-oss')

let client = new OSS({
  region: 'oss-cn-shanghai.aliyuncs.com',
  accessKeyId: 'LTAI4GH43ciwxxfuugQdZxfc',
  accessKeysecret: '2NbIDggbyq2mQKSXF0BhYY0YKOhY8F',
  bucket: 'meshoss',
})

// 支持File对象、Blob数据以及OSS Buffer。
// const data = '<File Object>'
// or const data = new Blob('content');
// or const data = new OSS.Buffer('content'));

export async function putObject(data) {
  try {
    // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
    let result = await client.put('object-key', data)
    console.log(result)
  } catch (e) {
    console.log(e)
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
