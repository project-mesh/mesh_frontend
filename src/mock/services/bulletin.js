import Mock from 'mockjs2'
import * as utils from '../utils'
import { bulletins } from './data'

const getBulletins = (queryParams) => {
  const resBulletins = bulletins.filter((bulletin) => bulletin.projectId === queryParams.projectId)

  return utils.builder({ bulletins: resBulletins })
}

const deleteBulletin = (data) => {
  const index = bulletins.findIndex(
    (bulletin) => bulletin.bulletinId === data.bulletinId && bulletin.projectId === data.projectId
  )

  if (index !== -1) bulletins.splice(index, 1)

  return utils.builder({})
}

const updateBulletin = (data) => {
  const bulletin = bulletins.find(
    (bulletin) => bulletin.bulletinId === data.bulletinId && bulletin.projectId === data.projectId
  )

  Object.keys(data).forEach((key) => {
    if (bulletin[key]) bulletin[key] = data[key]
  })

  return utils.builder({ bulletin })
}

Mock.mock(/\/bulletin/, 'get', utils.functionFactory(getBulletins))
Mock.mock(/\/bulletin/, 'delete', utils.functionFactory(deleteBulletin))
Mock.mock(/\/bulletin/, 'patch', utils.functionFactory(updateBulletin))
