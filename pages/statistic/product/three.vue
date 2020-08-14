<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">外协收发</block>
		</cu-custom>
		
		<view class="grid bg-white text-center col-2 padding">
			<view class="padding">
				<view class="text-xxl text-gpink">{{stat.one}}</view>
				<view class="text-lg">发货单总数</view>
			</view>
			<view class="padding solid-left">
				<view class="text-xxl text-gpink">{{stat.two}}</view>
				<view class="text-lg">发货数量</view>
			</view>
			<view class="padding">
				<view class="text-xxl text-gpink">{{stat.three}}</view>
				<view class="text-lg">收货单总数</view>
			</view>
			<view class="padding solid-left">
				<view class="text-xxl text-gpink">{{stat.four}}</view>
				<view class="text-lg">收货数量</view>
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
					url: 'home/stat/sg',
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
