import moment from 'moment'
const dateFilter = (timeStamp) => moment(timeStamp).format('YYYY-MM-DD')
export default (Vue) => {
  Vue.filter('dateFilter', dateFilter)
}
