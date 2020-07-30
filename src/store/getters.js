const getters = {
  isMobile: (state) => state.app.isMobile,
  lang: (state) => state.app.lang,
  theme: (state) => state.app.theme,
  color: (state) => state.app.color,
  token: (state) => state.user.token,
  username: (state) => state.user.username,
  role: (state) => state.user.role,
  showMode: (state) => state.user.showMode,
  profile: (state) => state.user.profile,
  teams: (state) => state.user.teams,
  preference: (state) => state.user.preference,
  addRouters: (state) => state.permission.addRouters,
  multiTab: (state) => state.app.multiTab,
}

export default getters
