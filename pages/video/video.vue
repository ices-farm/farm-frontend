<template>
	<view class="container">
		<view class="video-container">
			<iframe src="http://192.168.1.109:8081" class="video"></iframe>
		</view>
		<view class="change">
			<view class="changeItem">
				<button type="primary" @click="handleLED">{{LedAction}}补光</button>
			</view>
			<view class="changeItem">
				<button type="primary" @click="handleOx">{{OxAction}}供氧</button>
			</view>
		</view>
		<view>
			<view style="text-align: center;color: #10B078;font-weight: 900;font-size: 20px;margin-bottom: 50rpx;">
				实时环境数据</view>
			<view class="chart-box">
				<canvas id="chartCanvas" class="canvas"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		markRaw
	} from 'vue';
	import * as echarts from 'echarts';
	import {
		getPh
	} from '@/request/enData.js';
	export default {
		data() {
			return {
				chartInstance: null,
				isLed: false,
				LedAction: "开始",
				isOx: false,
				time: '',
				OxAction: "开始",
				option: {
					legend: {
						data: ['pH值', '电导率'],
						textStyle: {
							color: '#999'
						}
					},
					xAxis: {
						data: ['A', 'B', 'C', 'D'],
					},
					yAxis: [{
							type: 'value',
							name: 'pH值',
							min:7.04,
							max:7.16,
							splitLine: {
								show: false
							}
						},
						{
							type: 'value',
							name: '电导率',
							min:260,
							max:282,
							splitLine: {
								show: false
							}
						}
					],
					grid: {
						top: '25%',
						left: '8%',
						bottom: '10%',
						height: '60%',

					},
					tooltip: {
						trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
						triggerOn: "mousemove",
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'line' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					series: [{
							name: 'pH值',
							type: 'line',
							data: [1, 9, 3, 2.2],
							yAxisIndex: 0,

						},
						{
							name: '电导率',
							type: 'line',
							data: [260, 280, 300, 320],
							yAxisIndex: 1,

						}
					]
				}
			}
		},
		methods: {
			async initChart() {
				await this.$nextTick(); // 等待 DOM 更新完成
				const chartDom = echarts.init(document.getElementById('chartCanvas'));
				chartDom.setOption(this.option);

				// 监听窗口 resize 事件以适应图表大小
				window.addEventListener('resize', () => {
					chartDom.resize();
				});
			},
			getData() {
				getPh(this.time)
					.then((res) => {
						console.log(res)
						var pH = [],
							ddl = [],
							date = [];
						let i = 0,
							array = res.data;
						for (i = array.length - 1; i >= 0; i--) {
							pH[array.length - i - 1] = array[i].staValue['酸碱度'];
							ddl[array.length - i - 1] = array[i].staValue['电导率'];
							date[array.length - i - 1] = array[i].staTime.slice(0, 10)
						}
						this.option.series[0].data = pH;
						this.option.series[1].data = ddl;
						this.option.xAxis.data = date;
						console.log("ph", pH)
						this.initChart();
					})
					.catch((err) => {
						console.log(err)
					})
			},
			handleLED() {
				let action = !this.isLed ? 'start' : 'end';
				this.LedAction = this.isLed ? '开始' : '结束';
				this.isLed = !this.isLed;

				uni.request({
					url: `http://192.168.1.109:5000/handleLED?action=${action}`,
					method: 'GET',
					success: (res) => {
						console.log(res);
					}
				});
			},
			handleOx() {
				let action = !this.isOx ? 'start' : 'end';
				this.OxAction = this.isOx ? '开始' : '结束';
				this.isOx = !this.isOx;

				uni.request({
					url: `http://192.168.1.109:5000/handleOX?action=${action}`,
					method: 'GET',
					success: (res) => {
						console.log(res);
					}
				});
			}
		},
		onLoad() {
			const now = new Date();
			const year = now.getFullYear();
			const month = ('0' + (now.getMonth() + 1)).slice(-2);
			const day = ('0' + now.getDate()).slice(-2);
			const hours = ('0' + now.getHours()).slice(-2);
			const minutes = ('0' + now.getMinutes()).slice(-2);
			const seconds = ('0' + now.getSeconds()).slice(-2);
			this.time = year + ':' + month + ':' + day + ':' + hours + ':' + minutes + ':' + seconds;
			this.getData();
		}
	}
</script>

<style>
	.canvas {
		width: 100%;

	}

	.chart-box {
		width: 100%;
		height: 400rpx;
		/* 控制图表的高度 */
	}

	.change {
		display: flex;
		color: #10B078;
		flex-wrap: wrap;
		justify-content: space-around;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
	}

	.video {
		width: 100%;
		height: 240px;
		object-fit: cover;
	}

	.video-container {
		width: 100%;
	}
</style>

<!-- <template>
	<view class="container">
		<view class="video-container">
			<iframe src="http://192.168.1.109:8081" class="video"></iframe>
		</view>
		<view class="change">
			<view class="changeItem">
				<button type="primary" @click="handleLED">{{LedAction}}补光</button>
			</view>
			<view class="changeItem">
				<button type="primary" @click="handleOx">{{OxAction}}供氧</button>
			</view>
		</view>
		<view>
			<view style="text-align: center;color: #10B078;font-weight: 900;font-size: 20px;">实时环境数据</view>

			<view class="chart-box">
				<canvas id="chartCanvas"></canvas>
			</view>

		</view>
	</view>

</template>

<script>
	import * as echarts from 'echarts';
	export default {
		data() {
			return {
				chartInstance: null,
				isLed: false,
				LedAction: "开始",
				isOx: false,
				OxAction: "开始",
				option: {
					title: {
						text: 'pH变化',
					},
					xAxis: {
						type: 'category',
						data: ['A', 'B', 'C','D'],
					},
					yAxis: {
						type: 'value'
					},
					grid: { // 让图表占满容器
						top: "15%",
						right: "15%",
						left: "12%",
						bottom: "15%",
					},
					series: [{
						type: 'line',
						data: [160, 200, 300],
						label: {
							show: true,
							position: 'top'
						}
					}]

				}
			}
		},
		methods: {
			async initChart() {
				// 等待 canvas 元素渲染完成（对于 H5 环境可能需要）
				await this.$nextTick();
				// 获取 canvas 元素
				//const chartDom = this.$refs.chartCanvas;
				const chartDom = document.getElementById('chartCanvas')
				// 初始化 ECharts 实例
				this.chartInstance = echarts.init(chartDom);
				this.chartInstance.clear();

				// 载入图表
				this.chartInstance.setOption(this.option);
				// const autoHeight = this.option.xAxis.data.length * 50 + 50;
				// this.chartInstance.resize({height: autoHeight;width: 100%})
				let that = this

				window.addEventListener('resize', function() {
					that.chartInstance.resize()
				})
			},
			onShow() {
				this.initChart();
			},
			handleLED() {
				let action = ''
				action = !this.isLed ? 'start' : 'end';
				this.LedAction = this.isLed ? '开始' : '结束';
				console.log(action)
				this.isLed = !this.isLed
				uni.request({
					url: `http://192.168.1.109:5000/handleLED?action=${action}`,
					method: 'GET',
					success: (res) => {
						console.log(res)
					}
				})
			},
			handleOx() {
				let action = ''
				action = !this.isOx ? 'start' : 'end';
				this.OxAction = this.isOx ? '开始' : '结束';
				console.log(action)
				this.isOx = !this.isOx
				uni.request({
					url: `http://192.168.1.109:5000/handleOX?action=${action}`,
					method: 'GET',
					success: (res) => {
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style>
	.chart-box{
		width: 100%;
		height: 250px;
	}
	
	.dataShow {
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	.dataItem {
		margin: 25rpx;
		color: #10B078;
		width: 300rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.dataImg {
		width: 100rpx;
		height: 100rpx;
	}

	.change {
		display: flex;
		color: #10B078;
		flex-wrap: wrap;
		justify-content: space-around;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
	}

	button {
		background-color: #10B078;
	}

	.video {
		width: 100%;
		height: 240px;
		object-fit: cover;
		margin-right: 0;
	}

	.video-container {
		width: 100%;

	}
</style> -->