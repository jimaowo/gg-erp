<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">采购出入库</block>
		</cu-custom>
		<view class="shadow xg-search-sort bg-white">
			<view class="flex">
				<view class="flex-sub padding-sm text-center text-lg solids-right" @tap="showModal">搜索</view>
				<view class="flex-sub padding-sm text-center text-lg" @click="togglePopup">排序</view>
			</view>
			<uni-popup :show="showPop" position="middle" mode="fixed" @hidePopup="togglePopup">
				<view class="text-center">
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('')">默认</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('name asc')">按名称</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('item_no asc')">按货号</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('purchase_id asc')">按采购单</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeSort('supplier_id asc')">按供应商</view>
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
						<xg-input title="款号" v-model="params['style_code']"></xg-input>
						<xg-input title="采购单号" v-model="params['code']"></xg-input>
						<view class="cu-form-group" @click="showSinglePicker(14)">
							<view class="title">供应商<text class="text-red">*</text></view>
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
				<view class="padding bg-white margin-top">
					<view @tap="goToDetail(item.id)">
						<view class="flex solid-bottom">
							<view class="flex-sub text-lg">{{item.supplier_name}}</view>
							<view class="flex-sub text-lg">{{item.purchase.create_time}}</view>
							<view v-if="item.purchase.status==1" class="flex-sub text-lg">待确认</view>
							<view v-if="item.purchase.status==2" class="flex-sub text-lg">采购中</view>
							<view v-if="item.purchase.status==3" class="flex-sub text-lg">采购中</view>
							<view v-if="item.purchase.status==4" class="flex-sub text-lg">已完成</view>
						</view>
						<view class="flex">
							<view class="flex-sub">款号:{{item.purchase.style_code}}</view>
							<view class="flex-sub">颜色:{{item.color_name}}</view>
							<view class="flex-sub">采购数量:{{item.count}}</view>
						</view>
						<view class="flex">
							<view class="flex-sub">名称:{{item.name}}</view>
							<view class="flex-sub">规格:{{item.specification}}</view>
							<view class="flex-sub">入库数量:{{item.in_count}}</view>
						</view>
						<view class="flex">
							<view class="flex-sub">货号:{{item.item_no}}</view>
							<view class="flex-sub">单价:{{item.price}}</view>
							<view class="flex-sub">出库数量:{{item.out_count}}</view>
						</view>
						<view class="flex">
							<view class="flex-sub">色号:{{item.color_no}}</view>
							<view class="flex-sub">单位:{{item.unit_name}}</view>
							<view class="flex-sub">未收数量:{{item.unreceived_count}}</view>
						</view>
					</view>
					<view class="flex padding-top-sm">
						<view class="flex-sub cf">
							<view class="fl">{{item.code}}</view>
							<view class="fr">
								<button class="cu-btn sm line-purple margin-xs" @tap="goOutDepot(item)">出库</button>
								<button v-if="item.status==1" class="cu-btn sm line-gblue margin-xs" @tap="goInDepot(item)">入库</button>
								<button v-if="item.status==1" class="cu-btn sm line-gpink margin-xs" @tap="goConfirm(item.id)">结单</button>
							</view>
						</view>
					</view>

				</view>
			</view>
			<view class="uni-loadmore bg-gray margin-top-xxl" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onSingleConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>

		<!-- 出入库模态框 -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="text-left">
					<form>
						<view class="cu-form-group">
							<view class="title">物料</view>
							<input disabled="true" :value="material_title"></input>
						</view>
						<xg-input :title="inOutType==1?'入库数量':'出库数量'" v-model="inOut['count']"></xg-input>
						<xg-input v-if="inOutType==1" title="入库单价" v-model="inOut['price']"></xg-input>
						<xg-input v-if="inOutType==1" title="总价" v-model="inOut['total_amount']"></xg-input>
						<xg-input title="备注" v-model="inOut['remarks']"></xg-input>

						<view class="cu-form-group" @click="showSinglePicker(6)">
							<view class="title">单位<text class="text-red">*</text></view>
							<input disabled="true" placeholder="请选择" :value="inOut['unit_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group" @click="showSinglePicker(10)">
							<view class="title">仓库<text class="text-red">*</text></view>
							<input disabled="true" placeholder="请选择" :value="inOut['depot_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group">
							<view class="title">{{inOutType==1?'入库日期':'出库日期'}}</view>
							<picker mode="date" :value="inOut['action_date']" :start="startDate" :end="endDate" id="action_date" @change="bindActionDate">
								<view class="picker">
									{{inOut['action_date']}}
								</view>
							</picker>
						</view>
					</form>
				</view>
		
				<view class="cu-bar bg-white tabbar border shop">
					<view class="bg-orange submit" @tap="hideModal">取消</view>
					<view class="bg-green submit" @tap="inOutSubmit">保存</view>
				</view>
			</view>
		</view>
		
		
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
				pageTitle: '采购中',
				modalName: null,
				modalTitle: "添加",
				itemID: null,
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
				xgArray: ['', 'color', 'brand', 'size', 'process', 'season', 'unit', 'production', 'level', 'material_type',
					'depot', 'year', 'design_company', 'style_type','supplier'
				],
				startDate: getDate('start'),
				endDate: getDate('end'),
				inOut: {
					action_date: getDate()
				},
				inOutType: 1,
				material_title: '',
				materialID: null
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
					url: 'home/purchase/things',
					data: Object.assign(baseParams, this.params),
					success: res => {
						console.log(res);
						var newsList = res.data.data;
						this.page++;
						this.listData = this.listData.concat(newsList);
						if (res.data.current_page == res.data.last_page || res.data.total == 0) {
							this.hasMore = false;
							this.loadMoreText = "没有数据了"
						}
					}
				});
			},
			//获取选择所需数据
			getPickerData() {
				//1.color 2.brand 3.size 4.process 5.season 6.unit 7.production 8.level 9.material_type 10.depots
				//11.year 12.design_company 13.style_type 14.supplier 15.style_code 16.buyer
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '6,10,14'
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
				this.pickerValueArray = this.pickerArray[this.xgArray[k]]
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			onSingleConfirm(e) {
				console.log(e)
				var k = this.pickerKey
				var key = this.xgArray[k]
				if(k == 14) {
					this.params[key + '_id'] = e.value[0]
					this.$set(this.params, key + '_name', e.label)
				} else {
					this.inOut[key + '_id'] = e.value[0]
					this.$set(this.inOut, key + '_name', e.label)
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
				this.reloadMyData()
				this.hideModal()
			},
			resetSearch() {
				this.params = {}
			},

			goToDetail(id) {
				console.log(id)
				/* uni.navigateTo({
					url: 'detail?id=' + id
				}); */
			},
			goConfirm(id) {
				var options = {
					url: 'home/purchase/things/' + id,
					method: 'PUT',
					data: {
						status: 2
					},
					content: '您确定要结单吗？',
					msg: '结单成功！'
				}
				api.ggConfirm(options, this.reloadMyData)
			},
			goToEdit(id) {
				uni.navigateTo({
					url: 'edit?id=' + id
				});
			},
			//入库
			goInDepot(item) {
				this.inOutType = 1
				this.inOrOutDepot(item)
			},
			//出库
			goOutDepot(item) {
				this.inOutType = 2
				this.inOrOutDepot(item)
			},
			inOrOutDepot(item) {
				this.itemID = item.id
				this.materialID = item.material_id
				this.inOut = {
					action_date: getDate()
				}
				if (this.inOutType == 1) {
					this.inOut.count = item.count
					this.inOut.price = item.price
					this.inOut.total_amount = item.total_amount
				}
				api.get({
					url: 'home/materials/' + this.materialID,
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
					url: 'home/materials/' + this.materialID + '/inout',
					data: this.inOut,
					success: res => {
						if (res.code == 1) {
							//出入库成功后对采购物品的出库、入库情况进行更新
							api.put({
								url: 'home/purchase/things/' + this.itemID,
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
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							});
						}
					}
				})
			}
			
			
		}
	}
</script>


<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
