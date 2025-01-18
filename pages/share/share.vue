<template>
	<view>

		<view class="container">
			<view class="box">
				<view class="chat">
					<view class="chat-items">
						<image src="/static/introduction.jpg" class="img"
							style="margin-left: 10rpx;border-radius: 50%;border: 3px solid #FAF490;" />
					</view>
					<view class="chat-items">
						<view class="name">专业客服</view>
						<view class="text">置顶</view>
					</view>
					<view class="chat-items">
						<img src="/static/top.png" style="height: 50rpx;width: 50rpx;">
					</view>
				</view>
			</view>
			<view class="content">
				感谢大家使用我们的产品，如遇问题，可以点击我的头像与我私聊哦！<br>
				愿大家收获满满！
			</view>
		</view>
		<!-- <view class="container">
			<view class="box">
				<view class="chat">
					<view class="chat-items">
						<image src="/static/avatar.jpg" class="img" style="margin-left: 10rpx;border-radius: 50%;" />
					</view>
					<view class="chat-items">
						<view class="name">种植小能手</view>
						<view class="text">41分钟前</view>
					</view>
					<view class="chat-items">

					</view>
				</view>
			</view>
			<view>
				<img src="/static/plant.jpg" style="height: 450rpx;margin-left: 50px;border-radius: 20px;">
			</view>
			<view class="button">
				<view>
					<img src="/static/like.png" class="buttonItem">
				</view>
				<view>
					<img src="/static/discuss.png" class="buttonItem">
				</view>
				<view>
					<img src="/static/share.png" class="buttonItem">
				</view>
			</view>
		</view>
		<view class="container">
			<view class="box">
				<view class="chat">
					<view class="chat-items">
						<image src="/static/farm.jpg" class="img" style="margin-left: 10rpx;border-radius: 50%;" />
					</view>
					<view class="chat-items">
						<view class="name">我是一个农场主</view>
						<view class="text">2小时前</view>
					</view>
				</view>
			</view>
			<view class="content">
				这产品真不错，外观简洁大气，点击一键种植之后就基本不用管了，期待种子快快发芽啊！
			</view>
			<view class="button">
				<view>
					<img src="/static/likered.png" class="buttonItem">
				</view>
				<view>
					<img src="/static/discuss.png" class="buttonItem">
				</view>
				<view>
					<img src="/static/share.png" class="buttonItem">
				</view>
			</view>
		</view> -->


	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	.box {
		margin: 20rpx;

	}

	.container {
		padding-bottom: 20rpx;
		border-bottom: 1px solid #DDE3E9;
	}

	.chat {
		display: flex;
		height: 100rpx;
		width: 100%;
		padding-bottom: 8rpx;
		margin-top: 8rpx;
		justify-content: space-between;
		flex-direction: row;
	}

	.chat-items:nth-child(2) {
		flex: 1;
		align-items: flex-start;
	}

	.img {
		height: 80rpx;
		width: 80rpx;
	}

	.name {
		margin-left: 12rpx;
		font-size: 15px;
		font-weight: 600;
	}

	.text {
		margin-left: 15rpx;
		margin-top: 10rpx;
		font-size: 12px;
		color: #B6B6B6;
	}

	.button {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-around;
	}

	.buttonItem {
		height: 50rpx;
		width: 50rpx;
	}
	.content{
		margin-left: 25rpx;
		margin-right: 25rpx;
	}
</style>