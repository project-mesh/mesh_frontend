import Mock from 'mockjs2'
import * as utils from '../utils'
import { projectKB, teamKB } from './data'

const getKBs = (isProjectKB) => (queryParams) => {
  const resKBs = (isProjectKB ? projectKB : teamKB).filter((KB) =>
    isProjectKB ? KB.projectId === queryParams.projectId : KB.teamId === queryParams.teamId
  )

  return utils.builder({ knowledgeBase: resKBs })
}

Mock.mock(/\/knowledgebase\/project/, 'get', utils.functionFactory(getKBs(true)))
Mock.mock(/\/knowledgebase\/team/, 'get', utils.functionFactory(getKBs(false)))
