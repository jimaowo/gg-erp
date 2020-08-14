<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">物料类型</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end">
					<text @tap="backParent" class="sm margin-xs" v-if="level>1">上一层</text>
					<text class="sm margin-xs" @tap="showModal">添加</text>
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
							<input type="text" placeholder="请输入" v-model="code"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">名称</view>
							<input type="text" placeholder="请输入" v-model="name"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">排序</view>
							<input type="text" v-model="sort"></input>
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
			<view class="flex align-center solids-bottom">
				<view class="flex-sub padding-sm">
					0
				</view>
				<view class="flex-sub padding-sm">
					默认分组
				</view>
				<view class="flex-treble">
				</view>
			</view>
			<view class="flex align-center solids-bottom" v-for="(item,index) in listData" :key="item.id">
				<view class="flex-sub padding-sm">
					{{item.code}}
				</view>
				<view class="flex-sub padding-sm">
					{{item.name}}
				</view>
				<view class="flex-treble">
					<button class="cu-btn bg-green sm margin-xs" @tap="toChild(item.id)">子节点</button>
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
				sort: 1,
				name: "",
				parent_id: 0,
				level: 1,
				parentIDArr:{
					1:0
				},
				listData: [],
				loadMoreText: "",
				showLoadMore: false
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
		},
		// 加载更多
		onReachBottom() {

		},
		methods: {
			reloadMyData() {
				this.getList()
			},
			/**
			 * 加载数据列表
			 */
			getList: function() {
				api.get({
					url: 'base/material/types',
					data: {
						parent_id: this.parent_id
					},
					success: res => {
						console.log(res);
						this.listData = res.data;

						if (res.data.length == 0) {
							this.loadMoreText = "暂时没有数据"
							this.showLoadMore = true
						} else {
							this.showLoadMore = false
						}
					}
				});
			},
			showModal(e) {
				this.modalTitle = "添加"
				this.itemID = null
				this.name = ""
				this.code = ""
				this.sort = 1
				this.modalName = "DialogModal1"
			},
			hideModal(e) {
				this.modalName = null
			},
			editItem(e) {
				this.modalTitle = "编辑"
				this.itemID = e.id
				this.parent_id = e.parent_id
				this.name = e.name
				this.code = e.code
				this.sort = e.sort
				this.modalName = "DialogModal1"
			},
			ggSubmit() {
				var apiUrl = "base/material/types"
				var method = "POST"
				if (this.itemID) {
					apiUrl = "base/material/types/" + this.itemID
					method = "PUT"
				}
				api.request({
					url: apiUrl,
					method: method,
					data: {
						sort: this.sort,
						code: this.code,
						name: this.name,
						parent_id: this.parent_id,
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
				var deleteUrl = 'base/material/types/' + id
				api.ggDelete(deleteUrl, this.reloadMyData)
			},
			//子节点
			toChild(id) {
				this.level++
				this.parentIDArr[this.level] = id
				console.log(this.parentIDArr)
				this.parent_id = id
				this.getList()
			},
			backParent() {
				this.level--
				this.parent_id = this.parentIDArr[this.level]
				this.getList()
			}
		}
	}
</script>


<style>
</style>
