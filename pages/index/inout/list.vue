<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">出入库查询</block>
		</cu-custom>
		<view class="shadow xg-search-sort bg-white">
			<view class="flex">
				<view class="flex-sub padding-sm text-center text-lg solids-right" @tap="showModal">搜索</view>
				<view class="flex-sub padding-sm text-center text-lg" @click="togglePopup">排序</view>
			</view>
			<uni-popup :show="showPop" position="middle" mode="fixed" @hidePopup="togglePopup">
				<view class="text-center">
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('')">默认</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('supplier_id asc')">按供应商</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('depot_id asc')">按仓库</view>
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
						<xg-input title="单据号" v-model="params['order_code']"></xg-input>
						<view class="cu-form-group" @click="showSinglePicker(88)">
							<view class="title">类型</view>
							<input disabled="true" placeholder="请选择" :value="params['type_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group" @click="showSinglePicker(14)">
							<view class="title">供应商</view>
							<input disabled="true" placeholder="请选择" :value="params['supplier_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="solid-top">
							<picker mode="date" :value="params['start_date']" :start="startDate" :end="endDate" id="start_date" @change="bindDateChange">
								<view class="cu-form-group">
									<view class="title">起始日期</view>
									<view class="picker">
										{{params['start_date']}}
									</view>
								</view>
							</picker>
						</view>
						<view class="solid-top">
							<picker mode="date" :value="params['end_date']" :start="startDate" :end="endDate" id="end_date" @change="bindDateChange">
								<view class="cu-form-group">
									<view class="title">结束日期</view>
									<view class="picker">
										{{params['end_date']}}
									</view>
								</view>
							</picker>
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
			<view v-for="(item,index) in listData" :key="index">
				<view class="padding bg-white margin-top-sm">
					<view @tap="goToDetail(item.id)">
						<view class="flex solid-bottom margin-left-sm">
							<view class="flex-sub">
								<view class="fl text-bold text-xl">供应商:{{item.supplier_name}}</view>
							</view>
							<view class="flex-sub text-lg"></view>
							<view v-if="item.status==1" class="flex-sub text-lg text-right">未确认</view>
							<view v-if="item.status==2" class="flex-sub text-lg text-right">已确认</view>
						</view>
						<view class="flex margin-left-sm">
							<view class="flex-sub text-lg">总价:{{item.total_amount}}</view>
							<view class="flex-sub text-lg">类型:{{item.type==1?'入库':'出库'}}</view>
						</view>
						<view class="flex solid-bottom margin-left-sm">
							<view class="flex-sub text-lg">{{item.create_time}}</view>
							<view class="flex-sub text-lg">操作人:{{item.user_nickname}}</view>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub">
							<view class="fl">{{item.order_code}}</view>
							<view class="fr">
								<button v-if="item.status==1" class="cu-btn sm line-blue margin-xs" @tap="goToConfirm(item.id)">财务确认</button>
								<button class="cu-btn sm line-gpink margin-xs" @tap="ggDelete(item.id)">删除</button>
							</view>
						</view>
					</view>

				</view>
			</view>
			<view class="uni-loadmore bg-gray margin-top-xxl" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onSingleConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>


	</view>

</template>

<script>
	import api from '@/common/api.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import xgInput from '@/components/xg-input/xg-input.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 5;
		} else if (type === 'end') {
			year = year + 5;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}

	export default {
		data() {
			return {
				pageTitle: '物料管理',
				modalName: null,
				modalTitle: "添加",
				itemID: null,
				itemOne: [],
				material_title: '',
				listData: [],
				loadMoreText: "暂时没有数据",
				showLoadMore: true,
				status: 1,
				page: 1,
				hasMore: true,
				showPop: false,
				sort: '',
				// 搜索相关
				params: {},
				type_label: '',
				themeColor: '#006633',
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray: [],
				pickerSingleArray: [],
				pickerArray: [],
				pickerKey: 1,
				checkbox: [],
				xgArray: [
					'', 'color', 'brand', 'size', 'process', 'season', 'unit', 'production', 'level', 'material_type', 'depot',
					'year', 'design_company', 'style_type', 'supplier', 'style_code'
				],
				startDate: getDate('start'),
				endDate: getDate('end'),
				inOut: {
					action_date: getDate()
				},
				inOutType: 1
			}
		},
		components: {
			uniPopup,
			xgInput,
			mpvuePicker
		},
		onLoad(e) {
			this.getList()
			this.getPickerData()
		},
		onShow() {
			var needRefresh = uni.getStorageSync('need_refresh')
			if (needRefresh == true) {
				this.params = {}
				this.sort = ''
				this.reloadMyData()
				uni.setStorageSync('need_refresh', false)
			}
			//console.log(needRefresh)
		},
		//下拉刷新
		onPullDownRefresh() {
			this.params = {}
			this.sort = ''
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
			goToAdd() {
				uni.navigateTo({
					url: 'add'
				});
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
					url: 'home/inout',
					data: Object.assign(baseParams, this.params),
					success: res => {
						console.log(res);
						var newsList = res.data.data;
						this.page++;
						this.listData = this.listData.concat(newsList);
						if (res.data.current_page == res.data.last_page) {
							this.hasMore = false;
							this.loadMoreText = "没有更多数据了"
						}
						if (this.listData.length == 0) {
							this.loadMoreText = "暂时没有数据";
						}
					}
				});
			},
			//获取选择所需数据
			getPickerData() {
				//1.color 2.brand 3.size 4.process 5.season 6.unit 7.production 8.level 9.material_type 10.depots
				//11.year 12.design_company 13.style_type
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '14'
					},
					success: res => {
						this.pickerArray = res.data
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
			// 单列
			showSinglePicker(k) {
				this.pickerKey = k
				if (k==88) {
					this.pickerValueArray = [{value:1,label:'入库'},{value:2,label:'出库'}]
				} else {
					this.pickerValueArray = this.pickerArray[this.xgArray[k]]
				}
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			onSingleConfirm(e) {
				var k = this.pickerKey
				if (k == 88) {
					this.params['type'] = e.value[0]
					this.$set(this.params, 'type_name', e.label)
				} else {
					var key = this.xgArray[k]
					this.params[key + '_id'] = e.value[0]
					this.$set(this.params, key + '_name', e.label)
				}
			},
			//日期选择
			bindDateChange(e) {
				this.$set(this.params, e.target.id, e.target.value)
			},
			//入库日期
			bindActionDate(e) {
				this.$set(this.inOut, e.target.id, e.target.value)
			},
			searchSubmit() {
				console.log(this.params)
				this.reloadMyData()
				this.hideModal()
			},
			resetSearch() {
				this.params = {}
			},
			goToDetail(id) {
				uni.navigateTo({
					url: 'detail?id=' + id
				});
			},
			goToConfirm(id) {
				var options = {
					url: 'home/inout/' + id,
					method: 'PUT',
					data: {
						status: 2
					},
					content: '财务确认吗？',
					msg: '财务确认成功！'
				}
				api.ggConfirm(options, this.reloadMyData)
			},
			//入库
			goInDepot(id) {
				this.inOutType = 1
				this.inOrOutDepot(id)
			},
			//出库
			goOutDepot(id) {
				this.inOutType = 2
				this.inOrOutDepot(id)
			},
			inOrOutDepot(id) {
				this.inOut = {
					action_date: getDate()
				}
				this.itemID = id
				api.get({
					url: 'home/inout/' + id,
					success: res => {
						var one = res.data
						var a = one.supplier_name || '-'
						var b = one.name || '-'
						var c = one.item_no || '-'
						var d = one.color_no || '-'
						this.material_title = a + '/' + b + '/' + c + '/' + d
					}
				});
				this.modalName = 'bottomModal'
			},
			//出入库提交
			inOutSubmit() {
				this.inOut.type = this.inOutType
				console.log(this.inOut)
				api.post({
					url: 'home/inout/' + this.itemID + '/inout',
					data: this.inOut,
					success: res => {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
						if (res.code == 1) {
							this.reloadMyData()
							this.modalName = null
						}
					}
				})
			},

			goToEdit(id) {
				uni.navigateTo({
					url: 'edit?id=' + id
				});
			},
			//删除资源
			ggDelete(id) {
				var deleteUrl = 'home/inout/' + id
				api.ggDelete(deleteUrl, this.reloadMyData)
			},
			totalCount: function(i) {
				var total = 0;
				this.orderColors.forEach(function(data) {
					if (data.order_count) {
						total += parseFloat(data.order_count);
					}
				});
				this.order.order_count = total
				return total.toFixed(2);
			},

		}
	}
</script>


<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
