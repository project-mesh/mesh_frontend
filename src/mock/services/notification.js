import * as utils from '../utils'
import { notifications } from './data'
import Mock from 'mockjs2'

const getNotifications = (queryParams) => {
  const resNotifications = notifications.filter(
    (notification) => notification.principal === queryParams.username
  )

  return utils.builder({ notifications: resNotifications })
}

Mock.mock(/\/notification/, 'get', utils.functionFactory(getNotifications))
