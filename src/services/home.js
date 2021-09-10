import {request} from './axios'

import store from '@/store'

// 获取资产和审批数据等
function getAssetsApproveData(payload) {
  let token = store.state.token
  let data = {}
  data.codeBlockName = payload.codeBlockName  // 代码块名
  data.params = [{ 
    hbdwbh: payload.hbdwbh, // 合并单位编号
  }]
  return request({
    url: "",
    method: 'post',
    data,
    token
  })
}

// 获取维修统计
function getAsstLsRepairCount(payload) {
  let token = store.state.token
  let data = {}
  data.codeBlockName = 'asst_ls_repairCount'  // 代码块名
  data.params = [{ 
    hbdwbh: payload.hbdwbh, // 合并单位编号
    year_month: payload.year_month // 日期
  }]
  return request({
    url: "",
    method: 'post',
    data,
    token
  })
}

// 获取品名统计
function getAsstLsProductCount(payload) {
  let token = store.state.token
  let data = {}
  data.codeBlockName = 'asst_ls_productCount'  // 代码块名
  data.params = [{ 
    hbdwbh: payload.hbdwbh, // 合并单位编号
  }]
  return request({
    url: "",
    method: 'post',
    data,
    token
  })
}


export {
  getAssetsApproveData, // 资产和审批
  getAsstLsRepairCount, // 维修统计
  getAsstLsProductCount, // 品名统计
}