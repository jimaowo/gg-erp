<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">供应商类型</block>
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
							<view class="title">编号</view>
							<input type="text" v-model="code"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">名称</view>
							<input type="text" v-model="name"></input>
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
		
		<view class="bg-white">
			<view class="flex align-center solid-bottom" v-for="(item,index) in listData" :key="item.id">
				<view class="flex-sub padding-sm margin-xs">
					<text class="text-lg">{{item.code}}</text>
				</view>
				<view class="flex-sub padding-sm margin-xs">
					<text class="text-lg">{{item.name}}</text>
				</view>
				<view class="flex padding-sm margin-xs justify-end">
					<button class="cu-btn bg-gblue sm margin-xs" @tap="editItem(item)">修改</button>
					<button class="cu-btn bg-gpink sm margin-xs" @tap="ggDelete(item.id)">删除</button>
				</view>
			</view>
			<view class="uni-loadmore bg-gray" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
	</view>

</template>

<script>
	import api from '@/common/api.js'

	export default {
		data() {
			return {
				modalName: null,
				modalTitle: "添加",
				itemID: null,
				code: "",
				name: "",
				listData: [],
				loadMoreText: "暂时没有数据",
				showLoadMore: true,
				page: 1,
				hasMore: true
			}
		},
		components: {},
		onLoad() {
			this.getList()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.reloadMyData()
			uni.stopPullDownRefresh();
			/* if(this.listData.length == 0) {
				this.loadMoreText = "别刷新了，没有数据了...";
			} */
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
					url: 'base/supplier/types',
					data: {
						page: this.page
					},
					success: res => {
						//console.log(res);
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
			showModal(e) {
				this.modalTitle = "添加"
				this.itemID = null
				this.name = ""
				this.code = ""
				this.modalName = "DialogModal1"
			},
			hideModal(e) {
				this.modalName = null
			},
			editItem(e) {
				this.modalTitle = "编辑"
				this.itemID = e.id
				this.name = e.name
				this.code = e.code
				this.modalName = "DialogModal1"
			},
			ggSubmit() {
				var apiUrl = "base/supplier/types"
				var method = "POST"
				if(this.itemID) {
					apiUrl = "base/supplier/types/"+ this.itemID
					method = "PUT"
				}
				api.request({
					url: apiUrl,
					method : method,
					data: {
						code: this.code,
						name: this.name,
						device_type: api.DeviceType
					},
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
				var deleteUrl = 'base/supplier/types/' + id
				api.ggDelete(deleteUrl, this.reloadMyData)
			}
		}
	}
</script>


<style>
</style>
