<template>
	<view class="content">
		<view class="head">
			<swiper class="swiper" circular indicator-dots="true" autoplay interval="2500" duration="1000">
				<swiper-item>
					<view>
						<img src="static/logo.png" class="img">
					</view>
				</swiper-item>
				<swiper-item>
					<view>
						<img src="static/detail.jpg" class="img">
					</view>
				</swiper-item>
				<swiper-item>
					<view>
						<img src="static/introduction.jpg" class="img">
					</view>
				</swiper-item>

			</swiper>
		</view>
		<view class="function">
			<view class="item" @click="goVideo">
				<img src="static/video.png" alt="" class="itemImg">
				<view>视频直播</view>
			</view>
			<view class="item" @click="goPlantChat">
				<img src="static/plant.png" alt="" class="itemImg">
				<view>绿语传情</view>
			</view>
			<view class="item" @click="goMovie">
				<img src="static/time.png" alt="" class="itemImg">
				<view>时光剪影</view>
			</view>
		</view>
		<view style="height: 150rpx;"></view>
		<!-- <img src="static/pic.png" style="width: 100%;"> -->
		<!-- <img src="static/mid-chart.jpg" style="width: 100%;"> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			goVideo() {
				uni.navigateTo({
					url: "/pages/video/video"
				})
			},
			goPlantChat() {
				uni.navigateTo({
					url: "/pages/plantChat/plantChat"
				})
			},
			goMovie() {
				uni.navigateTo({
					url: "/pages/clip/clip"
				})
			}
		}
	}
</script>

<style>
	.content {}

	.function {
		display: flex;
		justify-content: space-around;

		padding-bottom: 20rpx;
		padding-top: 50rpx;
		margin-bottom: 20rpx;
	}

	.item {
		color: #10B078;
	}

	.itemImg {
		height: 120rpx;
		width: 120rpx;
	}

	.img {
		text-align: center;
		width: 100%;
		height: 300rpx;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>