<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">出入库明细</block>
		</cu-custom>

		<form>
			<view class="padding-sm">基本信息</view>
			<view class="cu-form-group">
				<view class="title">单据号</view>
				<input disabled="true" :value="params['order_code']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">日期</view>
				<input disabled="true" :value="params['action_date']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">供应商</view>
				<input disabled="true" :value="params['supplier_name']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">仓库</view>
				<input disabled="true" :value="params['depot_name']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">款号</view>
				<input disabled="true" :value="params['style_code']"></input>
			</view>
		
			<view class="padding-sm">详情</view>
			<view class="grid bg-white text-center text-bold col-2">
				<view class="grid col-4">
					<view class="solid">编号</view>
					<view class="solid">名称</view>
					<view class="solid">货号</view>
					<view class="solid">色号</view>
				</view>
				<view class="grid col-5">
					<view class="solid">规格</view>
					<view class="solid">数量</view>
					<view class="solid">单位</view>
					<view class="solid">单价</view>
					<view class="solid">总价</view>
				</view>
				
			</view>
			<view v-if="params.length" class="grid bg-white text-center col-2">
				<view class="grid col-4">
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params['material']['code']}}</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.material.name}}</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.material.item_no}}</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.material.color_no}}</view>
				</view>
				<view class="grid col-5">
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.material.specification}}</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.count}}</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.unit_name}}</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.price}}</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.total_amount}}</view>
				</view>
			</view>
			
			<view class="grid margin-bottom bg-white text-center col-2">
				<view class="padding-top-sm padding-bottom-sm">合计</view>
				<view class="grid col-5">
					<view class="solid text-xs padding-top-sm padding-bottom-sm">-</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.count}}</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">-</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">-</view>
					<view class="solid text-xs padding-top-sm padding-bottom-sm">{{params.total_amount}}</view>
				</view>
			</view>
			
		</form>
		
	</view>

</template>

<script>
	import api from '@/common/api.js'
	import xgInput from '@/components/xg-input/xg-input.vue'

	export default {
		data() {
			return {
				modalName: null,
				modalTitle: "请选择",
				params: {}
			}
		},
		components: {
			xgInput
		},
		onLoad(e) {
			// 获取要修改的一条资源
			if(!e.id) {
				uni.redirectTo({
					url:'/pages/index/index'
				})
			}
			this.itemID = e.id
			this.getEditOne()
		},
		methods: {
			getEditOne() {
				api.get({
					url: 'home/inout/' + this.itemID,
					success: res => {
						console.log(res);
						this.params = res.data
					}
				});
			}
		}
	}
</script>


<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.scroll-Y {
		height: 800upx;
	}
</style>
