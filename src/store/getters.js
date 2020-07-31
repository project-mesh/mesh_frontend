const getters = {
  isMobile: (state) => state.app.isMobile,
  lang: (state) => state.app.lang,
  theme: (state) => state.app.theme,
  color: (state) => state.app.color,
  multiTab: (state) => state.app.multiTab,
  addRouters: (state) => state.permission.addRouters,
  token: (state) => state.user.token,
  username: (state) => state.user.username,
  role: (state) => state.user.role,
  avatar: (state) => state.user.avatar,
  teams: (state) => state.user.teams,
  preference: (state) => state.user.preference,
  teamId: (state) => state.teamInfo.teamId,
  teamName: (state) => state.teamInfo.teamName,
  teamCreateTime: (state) => state.teamInfo.createTime,
  teamAdminName: (state) => state.teamInfo.adminName,
  teamProjects: (state) => state.teamInfo.teamProjects,
  teamMembers: (state) => state.teamInfo.members,
}

export default getters
