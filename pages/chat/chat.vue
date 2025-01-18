<template>
	<view>
		<scroll-view :scroll-into-view="scrollToView" scroll-y="true" :style="{height:windowHeight+'rpx'}"
			scroll-with-animation enable-flex='true'>
			<view v-for="(item,index) in chatInfo.chatMessage" class="box" :id="`msg${index}`">
				<view v-if="item.cmFlag&&item.cmContent[0]!='h'" class="plant">
					<img :src="`/static/${plantName}.png`" class="avatar" />
					<view class="content">
						<view style="font-size: 15px;color: #999;">{{plantName}}</view>
						<view class="message">{{item.cmContent}}</view>
					</view>
					<view class="space">
					</view>
				</view>
				<view v-else-if="item.cmFlag&&item.cmContent[0]=='h'" class="plant">
					<img :src="`/static/${plantName}.png`" class="avatar" />
					<view class="content">
						<view style="font-size: 15px;color: #999;">{{plantName}}</view>
						<!-- <view class="message">{{item.cmContent}}</view> -->
						<img :src="item.cmContent" class="img" />
					</view>
					<view class="space">
					</view>
				</view>
				<view v-else class="user">
					<img src="/static/avatar.jpg" class="avatar" />
					<view class="userContent">
						<view style="font-size: 15px;color: #999;">用户</view>
						<view class="message">{{item.cmContent}}</view>
					</view>
					<view class="space">
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="chat-bottom" :style="{height: `${inputHeight}rpx`}">
			<view class="send-msg" :style="{bottom:`${keyboardHeight - 60}rpx`}">
				<view class="uni-textarea">
					<textarea v-model="chatMsg" maxlength="300" confirm-type="send" @confirm="handleSend"
						placeholder="快来聊天吧~" :show-confirm-bar="false" :adjust-position="false" @linechange="sendHeight"
						auto-height></textarea>
				</view>
				<button @click="handleSend" class="send-btn">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		handleOX,
		capture,
		handleLED
	} from '@/request/equip';
	import {
		getChatInfo,
		updateChatMessage
	} from '@/request/chat.js';
	export default {
		data() {
			return {
				chatMsg: "",
				//键盘高度
				keyboardHeight: 0,
				//底部消息发送高度
				bottomHeight: 0,
				chatInfo: [],
				plantName: '',
				plantId: -1,
				scrollToView: '',
				windowHeight: 0,
				userInfo: {}
			}
		},
		computed: {
			inputHeight() {
				return this.bottomHeight + this.keyboardHeight
			}
		},
		methods: {
			Load(e) {
				uni.hideLoading()
				uni.showToast({
					icon: 'success',
					title: e,
					duration: 1000
				})
				setTimeout(() => {
					uni.hideToast()
				}, 1000)
			},
			onLoad(e) {
				this.windowHeight = this.getHeightData()
				console.log(this.windowHeight); // 能够使用的窗口高度，不包含导航栏
				if (e) {
					this.plantName = e.plantName
					this.plantId = e.plantId
					uni.setNavigationBarTitle({
						title: `您的小${e.plantName}`
					});
				} else {
					uni.setNavigationBarTitle({
						title: '网络有误'
					});
				}
				try {
					const userInfo = uni.getStorageSync("userInfo")
					if (userInfo) {
						console.log("success", userInfo)
						this.userInfo = userInfo
					}
				} catch (e) {
					console.log("error", e)
				}
				getChatInfo(this.userInfo.userId, e.plantId)
					.then((res) => {
						console.log(res)
						this.chatInfo = res.data[0]
						this.$nextTick(() => {
							this.scrollToView = `msg${this.chatInfo.chatMessage.length-1}`
						})
					})
			},
			getHeightData() {
				var result = 0;
				uni.getSystemInfo({
					success: function(res) {
						console.log(res.windowHeight); // print 610 // 这里加200或者加100为了看测试效果
						result = res.windowHeight + 570 // 不加200默认 return 292
					}
				});
				return result;
			},
			showImg(e) {
				console.log(e)
			},
			getData(n) {
				console.log("time", n)
				let now = new Date(n),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate();
				return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0,
					8);
			},
			// 监视聊天发送栏高度
			sendHeight() {
				setTimeout(() => {
					let query = uni.createSelectorQuery();
					query.select('.send-msg').boundingClientRect()
					query.exec(res => {
						this.bottomHeight = this.rpxTopx(res[0].height)
					})
				}, 10)
			},
			rpxTopx(px) {
				let deviceWidth = uni.getSystemInfoSync().windowWidth
				let rpx = (750 / deviceWidth) * Number(px)
				return Math.floor(rpx)
			},
			// 发送消息
			handleSend() {
				//如果消息不为空
				//obj.cmTime = this.getData(new Date().getTime()) //'2022-1-18 10:09:06'
				if (this.chatMsg != '') {
					let chat = {
						cmFlag: 0,
						cmContent: this.chatMsg
					}
					this.chatInfo.chatMessage.push(chat)
					this.$nextTick(() => {
						this.scrollToView = `msg${this.chatInfo.chatMessage.length-1}`
					})
					uni.showToast({
						icon: 'success',
						title: '发送成功',
						duration: 1000
					})
					setTimeout(() => {
						uni.hideToast()
						uni.showLoading({
							title: '您的植物正在接收消息'
						})
					}, 1000)
					let obj = {
						plantId: this.plantId,
						userId: this.userInfo.userId,
						chatMessage: [{
							cmFlag: 0,
							cmContent: this.chatMsg
						}]
					}
					updateChatMessage(obj)
						.then((res) => {
							console.log("success", res.data)
							if (res.data) {
								this.Load('接收成功')
								this.chatInfo = res.data[0]
								this.$nextTick(() => {
									this.scrollToView =
										`msg${this.chatInfo.chatMessage.length-1}`
								})
								let flag = this.chatInfo.chatMessage[this.chatInfo.chatMessage.length - 1]
									.cmContent
								if (flag[5] == "你") {
									uni.showLoading({
										title: '图片传输中'
									})
									capture()
										.then((res) => {
											console.log("pictureUrl", res)
											let plantobj = {
												plantId: this.plantId,
												userId: this.userInfo.userId,
												chatMessage: [{
													cmFlag: 1,
													cmContent: res.image_url
												}]
											}
											this.$nextTick(() => {
												this.scrollToView =
													`msg${this.chatInfo.chatMessage.length-1}`
											})
											this.chatInfo.chatMessage.push(plantobj.chatMessage[0])
											updateChatMessage(plantobj)
												.then((res) => {
													this.Load('接收成功')
													this.chatInfo = res.data[0]
													this.$nextTick(() => {
														this.scrollToView =
															`msg${this.chatInfo.chatMessage.length-1}`
													})
												})
										})
								} else if (flag[6] == "通") {
									console.log("ox")
									uni.showLoading({
										title: '正在打开氧气泵'
									})
									handleOX('start').then((res) => {
										this.Load('成功打开')
									})
								} else if (flag[6] == "开") {
									console.log("led")
									uni.showLoading({
										title: '正在打开补光灯'
									})
									handleLED('start').then((res) => {
										this.Load('成功打开')
									})
								} else {
									this.Load('接收成功')
								}
								this.$nextTick(() => {
									this.scrollToView =
										`msg${this.chatInfo.chatMessage.length-1}`
								})
							}
						})
					this.chatMsg = '';
				} else {
					uni.showToast({
						icon: 'error',
						title: "消息不得为空白"
					})
				}
				this.scrollToView = ''
			}
		}
	}
</script>

<style>
	textarea {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.user {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}

	.plant {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.avatar {
		height: 88rpx;
		width: 88rpx;
		border-radius: 44px;
	}

	.box {
		margin: 22rpx;

	}

	.content {
		flex: 1;
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		margin-left: 33rpx;
	}

	.img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.userContent {
		display: flex;
		flex-direction: column;
		align-items: end;
		flex: 1;
		margin-right: 33rpx;
	}

	page {
		background-color: #f2f2f2;
	}

	.message {
		background-color: white;
		padding: 15rpx;
		margin-top: 10rpx;
		border-radius: 10px;
		word-break: break-all;
		word-wrap: break-word
	}

	.space {
		width: 120rpx;
	}

	/* 底部聊天发送栏 */
	.chat-bottom {
		width: 100%;
		height: 100rpx;
		transition: all 0.1s ease;

		.send-msg {
			display: flex;
			align-items: flex-end;
			padding: 16rpx 30rpx;
			width: 100%;
			min-height: 177rpx;
			position: fixed;
			bottom: 0;
			background: #fff;
			transition: all 0.1s ease;
		}

		.uni-textarea {
			padding-bottom: 70rpx;

			textarea {
				width: 537rpx;
				min-height: 75rpx;
				max-height: 500rpx;
				background: #f1f1f1;
				border-radius: 40rpx;
				font-size: 32rpx;
				font-family: PingFang SC;
				color: #333333;
				line-height: 74rpx;
				padding: 5rpx 8rpx;
				text-indent: 30rpx;
			}
		}

		.send-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 76rpx;
			margin-left: 25rpx;
			width: 120rpx;
			height: 75rpx;
			background: #10B077;
			border-radius: 50rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 28rpx;
		}
	}
</style>
<!-- <template>
	<view>
		<scroll-view :scroll-into-view="scrollToView" scroll-y="true" :style="{height:windowHeight+'rpx'}"
			scroll-with-animation enable-flex='true'>
			<view v-for="(item,index) in chatInfo.chatMessage" class="box" :id="`msg${index}`">
				<view v-if="item.cmFlag&&item.cmContent[0]!='h'" class="plant">
					<img :src="`/static/${plantName}.png`" class="avatar" />
					<view class="content">
						<view style="font-size: 15px;color: #999;">{{plantName}}</view>
						<view class="message">{{item.cmContent}}</view>
					</view>
					<view class="space">
					</view>
				</view>
				<view v-else-if="item.cmFlag&&item.cmContent[0]=='h'" class="plant">
					<img :src="`/static/${plantName}.png`" class="avatar" />
					<view class="content">
						<view style="font-size: 15px;color: #999;">{{plantName}}</view>
						
						<img :src="item.cmContent" class="img" />
					</view>
					<view class="space">
					</view>
				</view>
				<view v-else class="user">
					<img src="/static/avatar.jpg" class="avatar" />
					<view class="userContent">
						<view style="font-size: 15px;color: #999;">用户</view>
						<view class="message">{{item.cmContent}}</view>
					</view>
					<view class="space">
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="chat-bottom" :style="{height: `${inputHeight}rpx`}">
			<view class="send-msg" :style="{bottom:`${keyboardHeight - 60}rpx`}">
				<view class="uni-textarea">
					<textarea v-model="chatMsg" maxlength="300" confirm-type="send" @confirm="handleSend"
						placeholder="快来聊天吧~" :show-confirm-bar="false" :adjust-position="false" @linechange="sendHeight"
						auto-height></textarea>
				</view>
				<button @click="handleSend" class="send-btn">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {getChatInfo,updateChatMessage} from '@/request/chat.js';
	export default {
		data() {
			return {
				chatMsg: "",
				//键盘高度
				keyboardHeight: 0,
				//底部消息发送高度
				bottomHeight: 0,
				chatInfo: [],
				plantName: '',
				plantId: -1,
				scrollToView: '',
				windowHeight: 0,
				userInfo: {}
			}
		},
		computed: {
			inputHeight() {
				return this.bottomHeight + this.keyboardHeight
			}
		},
		methods: {
			onLoad(e) {
				this.windowHeight = this.getHeightData()
				console.log(this.windowHeight); // 能够使用的窗口高度，不包含导航栏
				if (e) {
					this.plantName = e.plantName
					this.plantId = e.plantId
					uni.setNavigationBarTitle({
						title: `您的小${e.plantName}`
					});
				} else {
					uni.setNavigationBarTitle({
						title: '网络有误'
					});
				}
				try {
					const userInfo = uni.getStorageSync("userInfo")
					if (userInfo) {
						console.log("success", userInfo)
						this.userInfo = userInfo
					}
				} catch (e) {
					console.log("error", e)
				}
				getChatInfo(this.userInfo.userId, e.plantId)
					.then((res) => {
						console.log(res)
						this.chatInfo = res.data.data[0]
						this.$nextTick(() => {
							this.scrollToView = `msg${this.chatInfo.chatMessage.length-1}`
						})
					})
			},
			getHeightData() {
				var result = 0;
				uni.getSystemInfo({
					success: function(res) {
						console.log(res.windowHeight); 
						result = res.windowHeight + 570 
					}
				});
				return result;
			},
			showImg(e) {
				console.log(e)
			},
			getData(n) {
				console.log("time", n)
				let now = new Date(n),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate();
				return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0,
					8);
			},
			// 监视聊天发送栏高度
			sendHeight() {
				setTimeout(() => {
					let query = uni.createSelectorQuery();
					query.select('.send-msg').boundingClientRect()
					query.exec(res => {
						this.bottomHeight = this.rpxTopx(res[0].height)
					})
				}, 10)
			},
			rpxTopx(px) {
				let deviceWidth = uni.getSystemInfoSync().windowWidth
				let rpx = (750 / deviceWidth) * Number(px)
				return Math.floor(rpx)
			},
			// 发送消息
			handleSend() {
				//如果消息不为空
				//obj.cmTime = this.getData(new Date().getTime()) //'2022-1-18 10:09:06'
				if (this.chatMsg != '') {
					let chat = {
						cmFlag: 0,
						cmContent: this.chatMsg
					}
					this.chatInfo.chatMessage.push(chat)
					this.$nextTick(() => {
						this.scrollToView = `msg${this.chatInfo.chatMessage.length-1}`
					})
					uni.showToast({
						icon: 'success',
						title: '发送成功',
						duration: 1000
					})
					setTimeout(() => {
						uni.hideToast()
						uni.showLoading({
							title: '您的植物正在接收消息'
						})
					}, 1000)


					let obj = {
						plantId: this.plantId,
						userId: this.userInfo.userId,
						chatMessage: [{
							cmFlag: 0,
							cmContent: this.chatMsg
						}]
					}
					updateChatMessage(obj)
					.then((res)=>{
						console.log("success", res.data.data)
						if (res.data.data) {
							uni.hideLoading()
							uni.showToast({
								icon: 'success',
								title: '接收成功',
								duration: 1000
							})
							setTimeout(() => {
								uni.hideToast()
							}, 1000)
							this.chatInfo = res.data.data[0]
							this.$nextTick(() => {
								this.scrollToView =
									`msg${this.chatInfo.chatMessage.length-1}`
							})
							let flag = this.chatInfo.chatMessage[this.chatInfo.chatMessage.length - 1]
								.cmContent
							if (flag[5] == "你") {
								console.log("picture")
								uni.showLoading({
									title: '图片传输中'
								})
								uni.request({
									url: "http://192.168.1.109:5000/capture",
									method: 'GET',
									success: (res) => {
										console.log("pictureUrl", res)
										let plantobj = {
											plantId: this.plantId,
											userId: this.userInfo.userId,
											chatMessage: [{
												cmFlag: 1,
												cmContent: res.data.image_url
											}]
										}
										this.$nextTick(() => {
											this.scrollToView =
												`msg${this.chatInfo.chatMessage.length-1}`
										})
										this.chatInfo.chatMessage.push(plantobj.chatMessage[0])
										updateChatMessage(plantobj)
										.then((res)=>{
											console.log(res.data)
											uni.hideLoading()
											uni.showToast({
												icon: 'success',
												title: '接收成功',
												duration: 1000
											})
											setTimeout(() => {
												uni.hideToast()
											}, 1000)
											this.chatInfo = res.data.data[0]
											this.$nextTick(() => {
												this.scrollToView =
													`msg${this.chatInfo.chatMessage.length-1}`
											})
										})
									}
								})
							} else if (flag[6] == "通") {
								console.log("ox")
								uni.showLoading({
									title: '正在打开氧气泵'
								})
								uni.request({
									url: "http://192.168.1.109:5000/handleOX?action=start",
									method: 'GET',
									success: (res) => {
										uni.hideLoading()
										uni.showToast({
											icon: 'success',
											title: '成功打开',
											duration: 1000
										})
										setTimeout(() => {
											uni.hideToast()
										}, 1000)
										setTimeout(() => {
											uni.request({
												url: "http://192.168.1.109:5000/handleOX?action=end",
												method: 'GET',
												success: (res) => {}
											})
										}, 5000)
										console.log(res)
									}
								})
							} else if (flag[6] == "开") {
								console.log("led")
								uni.showLoading({
									title: '正在打开补光灯'
								})
								uni.request({
									url: "http://192.168.1.109:5000/handleLED?action=start",
									method: 'GET',
									success: (res) => {
										uni.hideLoading()
										uni.showToast({
											icon: 'success',
											title: '成功打开',
											duration: 1000
										})
										setTimeout(() => {
											uni.hideToast()
										}, 1000)
										setTimeout(() => {
											uni.request({
												url: "http://192.168.1.109:5000/handleLED?action=end",
												method: 'GET',
												success: (res) => {}
											})
										}, 5000)
										console.log(res)
									}
								})
							} else {
								uni.hideLoading()
								uni.showToast({
									icon: 'success',
									title: '接收成功',
									duration: 1000
								})
								setTimeout(() => {
									uni.hideToast()
								}, 1000)
							}
							this.$nextTick(() => {
								this.scrollToView =
									`msg${this.chatInfo.chatMessage.length-1}`
							})
						}
					})
					this.chatMsg = '';
				} else {
					uni.showToast({
						icon: 'error',
						title: "消息不得为空白"
					})
				}
				this.scrollToView = ''
			}
		}
	}
</script>

<style>
	textarea {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.user {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}

	.plant {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.avatar {
		height: 88rpx;
		width: 88rpx;
		border-radius: 44px;
	}

	.box {
		margin: 22rpx;

	}

	.content {
		flex: 1;
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		margin-left: 33rpx;
	}

	.img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.userContent {
		display: flex;
		flex-direction: column;
		align-items: end;
		flex: 1;
		margin-right: 33rpx;
	}

	page {
		background-color: #f2f2f2;
	}

	.message {
		background-color: white;
		padding: 15rpx;
		margin-top: 10rpx;
		border-radius: 10px;
		word-break: break-all;
		word-wrap: break-word
	}

	.space {
		width: 120rpx;
	}

	
	.chat-bottom {
		width: 100%;
		height: 100rpx;
		transition: all 0.1s ease;

		.send-msg {
			display: flex;
			align-items: flex-end;
			padding: 16rpx 30rpx;
			width: 100%;
			min-height: 177rpx;
			position: fixed;
			bottom: 0;
			background: #fff;
			transition: all 0.1s ease;
		}

		.uni-textarea {
			padding-bottom: 70rpx;

			textarea {
				width: 537rpx;
				min-height: 75rpx;
				max-height: 500rpx;
				background: #f1f1f1;
				border-radius: 40rpx;
				font-size: 32rpx;
				font-family: PingFang SC;
				color: #333333;
				line-height: 74rpx;
				padding: 5rpx 8rpx;
				text-indent: 30rpx;
			}
		}

		.send-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 76rpx;
			margin-left: 25rpx;
			width: 120rpx;
			height: 75rpx;
			background: #10B077;
			border-radius: 50rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 28rpx;
		}
	}
</style> -->