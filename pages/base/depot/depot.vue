<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">仓库管理</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="showModal">
					<text class="margin-xs text-xl">添加</text>
				</view>
			</block>
		</cu-custom>
		
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{modalTitle}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="text-left">
					<form>
						<view class="cu-form-group">
							<view class="title">名称：</view>
							<input type="text" placeholder="请输入" v-model="params['name']"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">仓库电话：</view>
							<input type="text" placeholder="请输入" v-model="params['tel']"></input>
						</view>
						<view class="cu-form-group" @click="showCityPicker">
							<view class="title">省/市/区</view>
							<input disabled="true" placeholder="请选择" :value="params['location_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group">
							<view class="title">详细地址：</view>
							<input type="text" placeholder="请输入" v-model="params['detail_address']"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">备注：</view>
							<input type="text" placeholder="请输入" v-model="params['remarks']"></input>
						</view>
					</form>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action">
						<button class="cu-btn line-gold text-gold" @tap="hideModal">取消</button>
						<button class="cu-btn bg-gold margin-left" @tap="ggSubmit">确定</button>
					</view>
				</view>
			</view>
		</view>
		
		<view>
			<view class="bg-white margin-bottom-sm" v-for="(item,index) in listData" :key="item.id">
				<view class="flex">
						<view class="flex-sub padding-sm margin-xs text-xl">{{item.name}} / {{item.tel}}</view>
						<view class="flex-sub padding-sm margin-xs text-lg">{{item.detail_address}}</view>
				</view>
				<view class="flex padding-sm margin-xs justify-end">
					<button class="cu-btn bg-gblue sm margin-xs" @tap="editItem(item)">修改</button>
					<button class="cu-btn bg-gpink sm margin-xs" @tap="ggDelete(item.id)">删除</button>
				</view>
			</view>
			<view class="uni-loadmore bg-gray" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
		
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onConfirm="onConfirm"></mpvue-city-picker>
	</view>

</template>

<script>
	import api from '@/common/api.js'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'

	export default {
		data() {
			return {
				modalName: null,
				modalTitle: "添加",
				itemID: null,
				params:{},
				listData: [],
				loadMoreText: "暂时没有数据",
				showLoadMore: true,
				page: 1,
				hasMore: true,
				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#006633'
			}
		},
		components: {mpvueCityPicker},
		onLoad() {
			this.getList()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.reloadMyData()
			uni.stopPullDownRefresh();
		},
		// 加载更多
		onReachBottom() {
			console.log("onReachBottom");
			this.showLoadMore = true;
			if (this.hasMore == false) {
				return;
			}
			this.loadMoreText = "加载中...";
			this.getList();
		},
		methods: {
			reloadMyData() {
				this.page = 1
				this.hasMore = true
				this.loadMoreText = "重新加载中...";
				this.listData = []
				this.getList()
			},
			/**
			 * 加载数据列表
			 */
			getList: function() {
				api.get({
					url: 'base/depots',
					data: {
						page: this.page
					},
					success: res => {
						console.log(res);
						var newsList = res.data.data;
						this.page++;
						this.listData = this.listData.concat(newsList);
						if (res.data.current_page == res.data.last_page) {
							this.hasMore = false;
							this.loadMoreText = "没有更多数据了"
						}
					}
				});
			},
			// 省市区选择
			showCityPicker() {
				this.$refs.mpvueCityPicker.show()
			},
			showModal(e) {
				this.modalTitle = "添加"
				this.itemID = null
				this.params = {}
				this.modalName = "DialogModal1"
			},
			hideModal(e) {
				this.modalName = null
			},
			onConfirm(e) {
				this.params['province_id'] = e.value[0]
				this.params['city_id'] = e.value[1]
				this.params['area_id'] = e.value[2]
				this.$set(this.params, 'location_name', e.label)
			},
			editItem(e) {
				this.modalTitle = "编辑"
				this.itemID = e.id
				this.params = e
				this.modalName = "DialogModal1"
			},
			ggSubmit() {
				var apiUrl = "base/depots"
				var method = "POST"
				if(this.itemID) {
					apiUrl = "base/depots/"+ this.itemID
					method = "PUT"
				}
				api.request({
					url: apiUrl,
					method : method,
					data: this.params,
					success: data => {
						console.log(data);
						uni.showToast({
							icon: 'none',
							title: data.msg
						});
						if (data.code == 1) {
							this.hideModal()
							this.reloadMyData()
							
						}
						if (data.code == 0) {
							//错误的操作
						}
					}
				});
				
			},
			//删除
			ggDelete(id) {
				var deleteUrl = 'base/depots/' + id
				api.ggDelete(deleteUrl, this.reloadMyData)
			}
		}
	}
</script>


<style>
</style>
