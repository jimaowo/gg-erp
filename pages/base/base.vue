<template>
	<view>
		<cu-custom bgColor="xg-nav" :isDrawer="true"><block slot="content">设置</block></cu-custom>
		
		<view>
			<view class="example">
				<view class="example-title" v-if="gridData[1]!=undefined">供应商信息</view>
				<uni-grid :options="gridData[1]" @click="gridOne" :show-out-border="false" />
				<view class="example-title" v-if="gridData[2]!=undefined">外协信息</view>
				<uni-grid :options="gridData[2]" @click="gridTwo" :show-out-border="false" />
				<view class="example-title" v-if="gridData[3]!=undefined">基础属性</view>
				<uni-grid :options="gridData[3]" @click="gridThree" :show-out-border="false" />
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue'
	import api from '@/common/api.js'

	export default {
		components: {
			uniGrid
		},
		data() {
			return {
				swiperGridHeight: '0px',
				swiperGridWidth: '100%',
				gridData: uni.getStorageSync('menu')[3]
			}
		},
		onLoad() {
			
		},
		onReady() {
			/* uni.createSelectorQuery().select('.grid-view').boundingClientRect().exec((ret) => {
				this.swiperGridHeight = ret[0].height + 1 + 'px'
				// #ifndef H5
				this.swiperGridWidth = ret[0].width + 1 + 'px'
				// #endif
			}) */
		},
		methods: {
			gridOne(e) {
				console.log(e)
				this.goToList(this.gridData[1][e.index]['url'])
			},
			gridTwo(e) {
				this.goToList(this.gridData[2][e.index]['url'])
			},
			gridThree(e) {
				this.goToList(this.gridData[3][e.index]['url'])
			},
			goToList(listUrl) {
				uni.navigateTo({
					url: listUrl
				});
			}
		}
	}
</script>
<style>

	.example-title {
		font-size: 32upx;
		line-height: 32upx;
		color: #777;
		margin: 40upx 25upx;
		position: relative
	}

	.example .example-title {
		margin: 15upx 20upx
	}

	.example-body {
		padding: 0 40upx
	}

	.grid-view {
		/* #ifdef H5 */
		padding: 0 0.5px;
		/* #endif */
		box-sizing: border-box;
	}
	.uni-grid {
		background-color: #FFFFFF;
	}


	page {
		background-image: var(--gradualBlue);
		width: 100vw;
		overflow: hidden;
	}
</style>