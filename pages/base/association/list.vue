<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">外协管理</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="goToAdd">
					<text class="margin-xs text-xl">新增</text>
				</view>
			</block>
		</cu-custom>
		<view class="shadow xg-search-sort bg-white">
			<view class="flex">
				<view class="flex-sub padding-sm text-center text-lg solids-right" @tap="showModal">搜索</view>
				<view class="flex-sub padding-sm text-center text-lg" @click="togglePopup">排序</view>
			</view>
			<uni-popup :show="showPop" position="middle" mode="fixed" @hidePopup="togglePopup">
				<view class="text-center">
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('')">默认</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('type_id asc')">按分类</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('code asc')">按编号</view>
				</view>
			</uni-popup>
		</view>

		<!-- 搜索模态框 -->
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">高级搜索</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="text-left">
					<form>
						<xg-input title="外协编码" v-model="params['code']"></xg-input>
						<xg-input title="外协名称" v-model="params['name']"></xg-input>
						<xg-input title="联系电话" v-model="params['tel']"></xg-input>
						<xg-input title="联系人" v-model="params['contact_name']"></xg-input>
						<xg-input title="地址" v-model="params['address']"></xg-input>
						<view class="cu-form-group" @click="showTypePicker">
							<view class="title">外协类型<text class="text-red">*</text></view>
							<input disabled="true" placeholder="请选择" :value="params['type_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group" @click="showLevelPicker">
							<view class="title">评审等级</view>
							<input disabled="true" placeholder="请选择" :value="params['level_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group" @click="showQualPicker">
							<view class="title">是否合格</view>
							<input disabled="true" placeholder="请选择" :value="params['is_qualified_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
					</form>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action">
						<button class="cu-btn line-gold text-gold" @tap="resetSearch">重置</button>
						<button class="cu-btn bg-gold margin-left" @tap="searchSubmit">确定</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 列表数据 -->
		<view class="margin-top-xxl">
			<view v-for="(item,index) in listData" :key="item.id">
				<view class="padding bg-white margin-top">
					<view class="flex solid-bottom">
						<view class="flex-sub cf padding-sm">
							<view class="fl text-bold text-xl">{{item.name}}</view>
							<view class="fr text-lg">{{item.create_time}}</view>
						</view>
					</view>
					<view class="flex padding-left-sm">
						<view class="flex-sub">编号：{{item.code}}</view>
						<view class="flex-sub">联系人：{{item.contact_name}}</view>
					</view>
					<view class="flex solid-bottom padding-left-sm">
						<view class="flex-sub">电话：{{item.tel}}</view>
						<view class="flex-sub">联系人电话：{{item.contact_tel}}</view>
					</view>
					<view class="flex padding-sm">
						<view class="flex-sub cf">
							<view class="fl text-lg">{{item.address}}</view>
						</view>
						<view class="flex-sub cf">
							<view class="fr">
								<button class="cu-btn bg-gblue sm margin-xs" @tap="goToEdit(item.id)">修改</button>
								<button class="cu-btn bg-gpink sm margin-xs" @tap="ggDelete(item.id)">删除</button>
							</view>
						</view>
					</view>

				</view>
			</view>
			<view class="uni-loadmore bg-gray margin-top-xxl" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
		
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onTypeCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		 
	</view>

</template>

<script>
	import api from '@/common/api.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import xgInput from '@/components/xg-input/xg-input.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'

	export default {
		data() {
			return {
				modalName: null,
				modalTitle: "添加",
				itemID: null,
				listData: [],
				loadMoreText: "暂时没有数据",
				showLoadMore: true,
				page: 1,
				hasMore: true,
				showPop: false,
				sort: '',
				// 搜索相关
				params: {},
				themeColor: '#006633',
				mode: 'selector',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				typeArray: [],
				levelArray: [],
				qualArray: [
					{label: '合格', value: 1},
					{label: '不合格', value: 2}
				],
				pickerType: 0
			}
		},
		components: {
			uniPopup,
			xgInput,
			mpvuePicker
		},
		onLoad() {
			this.getList()
			this.getTypeList()
			this.getLevelList()
		},
		onShow() {
			var needRefresh = uni.getStorageSync('need_refresh')
			if(needRefresh == true) {
				this.params = {}
				this.sort = ''
				this.reloadMyData()
				uni.setStorageSync('need_refresh', false)
			}
			console.log(needRefresh)
		},
		//下拉刷新
		onPullDownRefresh() {
			this.params = {}
			this.sort = ''
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
			/* 所有类型 */
			getTypeList() {
				api.get({
					url: 'base/association/types/all',
					success: res => {
						//console.log(res);
						this.typeArray = res.data
					}
				});
			},
			getLevelList() {
				api.get({
					url: 'base/association/levels',
					success: res => {
						this.levelArray = res.data
					}
				});
			},
			// 类型选择
			showTypePicker() {
				this.pickerValueArray = this.typeArray
				this.pickerType = 1
				this.$refs.mpvuePicker.show()
			},
			// 等级选择
			showLevelPicker() {
				this.pickerValueArray = this.levelArray
				this.pickerType = 2
				this.$refs.mpvuePicker.show()
			},
			// 是否合格选择
			showQualPicker() {
				this.pickerValueArray = this.qualArray
				this.pickerType = 3
				this.$refs.mpvuePicker.show()
			},
			onCancel(e) {
				//console.log(e)
			},
			onConfirm(e) {
				switch (this.pickerType){
					case 1:
						this.params['type_id'] = e.value[0]
						this.$set(this.params, 'type_name', e.label)
						break;
					case 2:
						this.params['level_id'] = e.value[0]
						this.$set(this.params, 'level_name', e.label)
						break;
					case 3:
						this.params['is_qualified'] = e.value[0]
						this.$set(this.params, 'is_qualified_name', e.label)
						break;
					default:
						break;
				}
			},
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
				var baseParams = {
					page: this.page,
					sort: this.sort
				}
				api.get({
					url: 'base/associations',
					data: Object.assign(baseParams, this.params),
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
			togglePopup() {
				this.showPop = !this.showPop;
			},
			changeSort(e) {
				this.sort = e
				this.reloadMyData()
				this.togglePopup()
			},
			showModal(e) {
				this.modalName = "DialogModal1"
			},
			hideModal(e) {
				this.modalName = null
			},
			searchSubmit() {
				console.log(this.params)
				this.reloadMyData()
				this.hideModal()
			},
			resetSearch() {
				this.params = {}
			},
			goToAdd() {
				uni.navigateTo({
					url: 'add'
				});
			},
			goToEdit(id) {
				uni.navigateTo({
					url: 'edit?id=' + id
				});
			},
			//删除资源
			ggDelete(id) {
				var deleteUrl = 'base/associations/' + id
				api.ggDelete(deleteUrl, this.reloadMyData)
			}
		}
	}
</script>


<style>
</style>
