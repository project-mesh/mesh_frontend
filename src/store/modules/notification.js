import sendRequest from '@/api'

const notification = {
  state: {
    notifications: [],
  },
  mutations: {
    SET_NOTIFICATIONS: (state, notifications) => (state.notifications = notifications),
    SET_NOTIFICATION: (state, notificationInfo) => {
      const notificationItemIndex = state.notifications.findIndex(
        (notification) => notification.notificationId === notificationInfo.notificationId
      )
      const notificationItem = state.notifications[notificationItemIndex]
      Object.keys(notificationInfo).forEach((key) => {
        if (notificationItem[key]) notificationItem[key] = notificationInfo[key]
      })
      state.notifications.splice(notificationItemIndex, 1, notificationItem)
    },
    DELETE_NOTIFICATION: (state, notificationId) => {
      const notificationItemIndex = state.notifications.findIndex(
        (notification) => notification.notificationId === notificationId
      )
      state.notifications.splice(notificationItemIndex, 1)
    },
  },
  actions: {
    queryNotification: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('queryNotification', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) commit('SET_NOTIFICATIONS', data.notifications)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    updateNotification: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('updateNotification', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) commit('SET_NOTIFICATION', data.notification)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    deleteNotification: ({ commit }, requestData) => {
      if (!requestData.notificationId) throw new Error('删除通知需要提供通知Id！')
      return new Promise((resolve, reject) => {
        sendRequest('deleteNotification', requestData)
          .then((response) => {
            if (response.data.isSuccess) commit('SET_NOTIFICATION', requestData.notificationId)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
  },
}

export default notification
