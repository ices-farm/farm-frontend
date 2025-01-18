// 引入 request 文件
import request from './index.js'

// 分页查询学习列表
export const getPh = (time) => {
	return request({
		url: `/getPhAndConductivityList?currentTime=${time}`,
		method: 'get',
	})
}
// 获取学习列表详细信息
export const studyInfoById = (id) => {
	return request({
		url: `/study/studyInfo/${id}`,
		method: 'get',
	})
}