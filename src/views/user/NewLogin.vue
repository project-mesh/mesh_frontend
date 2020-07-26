<template>
  <div>
    <span>new login</span>
    <button @click="handleClick">login</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'NewLogin',
  methods: {
    ...mapActions(['Login']),
    handleClick() {
      const { Login } = this
      const loginParams = 'wzj'
      Login(loginParams)
        .then((response) => {
          console.log('success,boy')
          console.log(response)
        })
        .catch((err) => {
          console.log('error,boy')
          console.log(err)
        })
    },
  },
}
</script>

<style scoped></style>
