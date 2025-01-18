// 引入 request 文件
import request from './index.js'

// 分页查询学习列表
export const getChatInfo = (userId,plantId) => {
	return request({
		url: `/getChatInfo?userId=${userId}&plantId=${plantId}`,
		method: 'get',
	})
}
// 获取学习列表详细信息
export const updateChatMessage = (obj) => {
	return request({
		url: `/updateChatMessage`,
		method: 'post',
		data: obj
	})
}