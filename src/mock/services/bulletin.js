import Mock from 'mockjs2'
import * as utils from '../utils'
import { bulletins } from './data'

const getBulletins = (queryParams) => {
  const resBulletins = bulletins.filter((bulletin) => bulletin.projectId === queryParams.projectId)

  return utils.builder({ bulletins: resBulletins })
}

Mock.mock(/\/bulletin/, 'get', utils.functionFactory(getBulletins))
