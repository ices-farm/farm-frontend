<template>
	<view>
		<view class="header" v-if="!getUserInfo">
			<img class="userinfo_avatar" src="static/用户.png"></img>
			<view class="header_right">
				<view class="userinfo_userNick" @click="handleLogin">点击登录</view>
			</view>
		</view>
		<view v-else>
			<view class="header">
				<img class="userinfo_avatar" src="static/用户.png"></img>
				<view class="flex-items">
					<view>
						<view class="userinfo_userNick" >{{userInfo[0].userNick}}</view>
					</view>
					<view @click="handleExit">
						<text style="color: #ABB2A8;font-size: 14px;">退出登录</text>
					</view>
				</view>

			</view>
		</view>
		<view class='my_item' @click="goUserInfo" v-if="getUserInfo">
			<text>个人资料</text>
			<view class='right_arrow' />
		</view>
		<view class='my_item' @click="goProductInfo" v-if="isProductShow">
			<text>产品资料</text>
			<view class='right_arrow' />
		</view>,
		<!-- <button type="primary" @click="handleSearch">查询用户列表</button> -->
		<!-- <button type="primary" @click="handleSelfSearch">查询本用户</button> -->
	</view>

</template>

<script>
	export default {
		data() {
			return {
				getUserInfo: 0,
				userInfo: [],
				isProductShow:0,
			}
		},
		methods: {
			onShow() {
				try {
					const userInfo = uni.getStorageSync("userInfo")
					if (userInfo) {
						console.log("success", userInfo)
						this.userInfo[0] = userInfo
						this.isProductShow = 1;
						this.getUserInfo = 1;
					}

				} catch (e) {
					console.log("error", e)
				}
				console.log(this.userInfo[0])
			},
			handleSelfSearch(){
				console.log(this.userInfo[0])
				this.userInfo[0].userAc="11111";
				uni.request({
					url:`http://124.221.52.73:8080/system/getSelfInfo?userAc=${this.userInfo[0].userAc}`,
					method:"GET",
					success: (res) => {
						console.log("success",res)
					}
				})
			},
			handleSearch(){
				console.log("111")
				uni.request({
					url: `https://burninghotdebiao.xyz/iotp/hit/iot/v1/datastatistic/listServices`,
					method: 'GET',
					data: {
					  ctlId:"1",
					  pageSize: 100,
					  pageNum: 1,
					},
					success: (res) => {
						console.log("success",res)
					}
				})
			},
			handleExit() {
				this.isProductShow = 0;
				this.getUserInfo = 0;
				//uni.setStorageSync("userInfo","")
			},
			handleLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			goUserInfo() {
				console.log(this.userInfo[0])
				uni.navigateTo({
					url: `/pages/userInfo/userInfo?userInfo=${JSON.stringify(this.userInfo)}`
				})
			},
			goProductInfo(){
				uni.navigateTo({
					url: `/pages/productInfo/productInfo?userAc=${this.userInfo[0].userAc}`
				})
			}
		}
	}
</script>

<style>
	.header {
		width: 100%;
		display: flex;
		padding: 30rpx 55rpx;
		align-items: center;
		background: #10B076;
	}

	.userinfo_avatar {
		border-radius: 128rpx;
		width: 128rpx;
		height: 128rpx;
		margin-right: 30rpx;
	}

	.userinfo_userNick {
		font-size: 36rpx;
		margin-bottom: 5rpx;
	}

	.my_item {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20rpx;
		background: white;
		border-bottom: 1px solid gainsboro;
	}

	.right_arrow {
		border: solid black;
		border-width: 0 1.5px 1.5px 0;
		padding: 3px;
		position: absolute;
		right: 15px;
		/* margin-left: 66%; */
		transform: rotate(-45deg);
		-webkit-transform: rotate(-45deg);
	}

	.flex-items {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>