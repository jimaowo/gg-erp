<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">采购</block>
		</cu-custom>
		
		<view class="grid bg-white text-center col-1 padding">
			<view class="padding solid-bottom">
				<view class="text-xxl text-gpink">{{stat.all}}</view>
				<view class="text-lg">采购单总数</view>
			</view>
		</view>
		
		<view class="grid bg-white text-center col-3 padding">
			<view class="padding">
				<view class="text-xxl text-gpink">{{stat.one}}</view>
				<view class="text-lg">待确认</view>
			</view>
			<view class="padding solid-left">
				<view class="text-xxl text-gpink">{{stat.two}}</view>
				<view class="text-lg">采购中</view>
			</view>
			<view class="padding solid-left">
				<view class="text-xxl text-gpink">{{stat.three}}</view>
				<view class="text-lg">采购完成</view>
			</view>
		</view>
		
		<view class="grid bg-white text-center col-2 padding margin-top-sm">
			<view class="padding">
				<view class="text-xxl text-gpink">{{stat.four}}</view>
				<view class="text-lg">采购总金额</view>
			</view>
			<view class="padding solid-left">
				<view class="text-xxl text-gpink">{{stat.five}}</view>
				<view class="text-lg">采购总数量</view>
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
					url: 'home/stat/purchase',
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
