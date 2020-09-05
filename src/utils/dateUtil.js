export const formatDateByPattern = function (date, fmt) {
  //author: meizz
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S+': date.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      date
        .getFullYear()
        .toString()
        .substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

Date.prototype.format = function (fmt) {
  return formatDateByPattern(this, fmt)
}

export const formatDate = function (fullDate) {
  const year = fullDate.getFullYear().toString()
  const month = (fullDate.getMonth() + 1).toString()
  const date = fullDate.getDate().toString()
  const hours = fullDate.getHours().toString()
  const minutes = fullDate.getMinutes().toString()
  return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes
}

export const formatDateFormString = function (str) {
  const fullDate = new Date(Number(str))
  return formatDate(fullDate)
}
