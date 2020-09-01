// teamName存储team-selector选择的具体团队
// 该模块存储当前团队下的数据
const teamInfo = {
  state: {
    teamName: '数据库课程团队', // TODO : 应该默认为空，在登录时获取
    adminName: '',
    projects: [],
  },

  mutations: {
    SET_TEAMNAME: (state, teamName) => {
      state.teamName = teamName
    },
    SET_ADMINNAME: (state, adminName) => {
      state.adminName = adminName
    },
    SET_PROJECTS: (state, projects) => {
      state.projects = projects
    },
  },

  actions: {
    GetTeamInfo({ commit }, teamName) {
      // when you login you will get a default teamName
      if (teamName) {
        //TODO : send a request to get new team info
        const adminName = '刘雪迪'
        let projects = [
          {
            projectName: '项目一',
            projectAdmin: 'Tom',
            imgUrl: 'https://pic.qqtn.com/up/2019-9/2019092509041339444.jpg',
          },
          {
            projectName: '项目二',
            projectAdmin: 'Jerry',
            imgUrl:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF_otYR406rysdDfn_qHYY3h-0HmIFX6z8eg&usqp=CAU',
          },
          {
            projectName: '项目二',
            projectAdmin: 'Jerry',
            imgUrl: 'https://inews.gtimg.com/newsapp_match/0/3502863982/0',
          },
          {
            projectName: '项目二',
            projectAdmin: 'Kun',
            imgUrl:
              'https://images.uncyc.org/zh-tw/6/66/%E4%BA%9E%E6%B4%B2%E8%88%9E%E7%8E%8B%E8%94%A1%E5%BE%90%E5%9D%A4.png',
          },
          {
            projectName: '项目二',
            projectAdmin: 'Jerry',
            imgUrl: 'https://p.qqan.com/up/2019-9/2019092509041435004.jpg',
          },
          {
            projectName: '项目二',
            projectAdmin: 'Jerry',
            imgUrl: 'https://p.qqan.com/up/2019-9/2019092509041435004.jpg',
          },
          {
            projectName: '项目二',
            projectAdmin: 'Jerry',
            imgUrl: 'https://p.qqan.com/up/2019-9/2019092509041435004.jpg',
          },
        ]
        commit('SET_ADMINNAME', adminName)
        commit('SET_PROJECTS', projects)
      }
    },
  },
}

export default teamInfo
