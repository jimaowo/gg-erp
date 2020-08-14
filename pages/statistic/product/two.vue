<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">计划单</block>
		</cu-custom>
		
		<view class="grid bg-white text-center col-1 padding">
			<view class="padding solid-bottom">
				<view class="text-xxl text-gpink">{{stat.all}}</view>
				<view class="text-lg">计划单总数</view>
			</view>
		</view>
		
		<view class="grid bg-white text-center col-3 padding">
			<view class="padding">
				<view class="text-xxl text-gpink">{{stat.one}}</view>
				<view class="text-lg">待生产</view>
			</view>
			<view class="padding solid-left">
				<view class="text-xxl text-gpink">{{stat.two}}</view>
				<view class="text-lg">生产中</view>
			</view>
			<view class="padding solid-left">
				<view class="text-xxl text-gpink">{{stat.three}}</view>
				<view class="text-lg">生产完成</view>
			</view>
			<view class="padding">
				<view class="text-xxl text-gpink">{{stat.four}}</view>
				<view class="text-lg">待裁剪</view>
			</view>
			<view class="padding solid-left">
				<view class="text-xxl text-gpink">{{stat.five}}</view>
				<view class="text-lg">裁剪中</view>
			</view>
			<view class="padding solid-left">
				<view class="text-xxl text-gpink">{{stat.six}}</view>
				<view class="text-lg">裁剪完成</view>
			</view>
		</view>
		
	</view>

</template>

<script>
	import api from '@/common/api.js'

	export default {
		data() {
			return {
				stat:[]
			}
		},
		components: {
		},
		onLoad(e) {
			this.getStatData()
		},
		onShow() {
			
		},
		methods: {
			getStatData() {
				api.get({
					url: 'home/stat/plan',
					success: res => {
						this.stat = res.data
					}
				});
			}
		}
	}
</script>


<style>
	
</style>
