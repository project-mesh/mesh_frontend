import Mock from 'mockjs2'
import * as utils from '../utils'
import { projectKB, teamKB } from './data'

const getKBs = (isProjectKB) => (queryParams) => {
  const resKBs = (isProjectKB ? projectKB : teamKB).filter((KB) =>
    isProjectKB ? KB.projectId === queryParams.projectId : KB.teamId === queryParams.teamId
  )
  return utils.builder({ knowledgeBase: resKBs })
}

const createKB = (isProjectKB) => (data) => {
  const newKB = {
    knowledgeId: Mock.mock('@id'),
    uploaderName: data.username,
    knowledgeName: data.knowledgeName,
    hyperlink: data.hyperlink,
    createTime: Date.now(),
  }

  if (isProjectKB) {
    newKB.projectId = data.projectId
    projectKB.push(newKB)
  } else {
    newKB.teamId = data.teamId
    teamKB.push(newKB)
  }

  return utils.builder({ knowledge: newKB })
}

const updateKB = (isProjectKB) => (data) => {
  const knowledge = (isProjectKB ? projectKB : teamKB).find(
    (knowledge) => knowledge.knowledgeId === data.knowledgeId
  )

  console.log('mock updateKB ', knowledge)

  Object.keys(data).forEach((key) => {
    if (knowledge[key]) knowledge[key] = data[key]
  })
  console.log('after mock updateKB ', teamKB)
  return utils.builder({ knowledge })
}

const deleteKB = (isProjectKB) => (data) => {
  const knowledgeIndex = (isProjectKB ? projectKB : teamKB).find(
    (knowledge) => knowledge.knowledgeId === data.knowledgeId
  )

  if (knowledgeIndex === -1) return utils.builder({}, 0, false, '沒有此条知识库')

  if (isProjectKB) projectKB.splice(knowledgeIndex, 1)
  else teamKB.splice(knowledgeIndex, 1)

  return utils.builder({})
}

Mock.mock(/\/knowledgebase\/project/, 'get', utils.functionFactory(getKBs(true)))
Mock.mock(/\/knowledgebase\/team/, 'get', utils.functionFactory(getKBs(false)))

// test
Mock.mock(/\/knowledgebase\/team/, 'post', utils.functionFactory(createKB(false)))
Mock.mock(/\/knowledgebase\/project/, 'post', utils.functionFactory(createKB(true)))

Mock.mock(/\/knowledgebase\/project/, 'patch', utils.functionFactory(updateKB(true)))
Mock.mock(/\/knowledgebase\/team/, 'patch', utils.functionFactory(updateKB(false)))

Mock.mock(/\/knowledgebase\/project/, 'delete', utils.functionFactory(deleteKB(true)))
Mock.mock(/\/knowledgebase\/team/, 'delete', utils.functionFactory(deleteKB(false)))
