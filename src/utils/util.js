export function setTaskStatus(task) {
  if (task.isFinished) task.status = '已完成'
  else if (new Date(task.deadline + ' 24:00:00').getTime() < Date.now()) task.status = '已逾期'
  else task.status = '开发中'
}

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9
    ? '早上好'
    : hour <= 11
    ? '上午好'
    : hour <= 13
    ? '中午好'
    : hour < 20
    ? '下午好'
    : '晚上好'
}

export function isIE() {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 将(...fnArgs: any[], (err: Error, ...resultValues: any[]) => void) => void
 * 类型函数promise话，如果产生err，调用reject，否则调用resolve(resultValues)
 * @param {(...fnArgs: any[], (err: Error, ...resultValues: any[]) => void) => void} fn 需要promise化的函数
 * @returns {(...args: any[]) => Promise<any[] | undefined>} promise化后的函数
 */
export const promisify = (fn) => {
  return (...fnArgs) => {
    return new Promise((res, rej) => {
      fn(...fnArgs, (err, ...resultValues) => {
        if (err) rej(err)
        res(resultValues)
      })
    })
  }
}
