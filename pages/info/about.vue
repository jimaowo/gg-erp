<template>
	<view class="content">
		<cu-custom bgColor="xg-nav" :isBack="true"><block slot="content">关于我们</block></cu-custom>
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="padding text-center">
			<text class="text-xxl text-bold">{{info.xss_title}}</text>
		</view>
		<view class="padding">
			<text class="text-content">{{info.about_us}}</text>
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	
	export default {
		data() {
			return {
				info: []
			}
		},
		onLoad() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				api.get({
					url: 'home/info/about',
					data: {},
					success: res => {
						this.info = res.data
					}
				});
			}
		}
	}
</script>

<style>
	.content {
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
