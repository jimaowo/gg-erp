<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">外协发货单</block>
		</cu-custom>
		<view class="shadow xg-search-sort bg-white">
			<view class="flex">
				<view class="flex-sub padding-sm text-center text-lg solids-right" @tap="showModal">搜索</view>
				<view class="flex-sub padding-sm text-center text-lg" @click="togglePopup">状态</view>
			</view>
			<uni-popup :show="showPop" position="middle" mode="fixed" @hidePopup="togglePopup">
				<view class="text-center">
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeStatus(0)">全部</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeStatus(1)">待确认</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeStatus(2)">部分收货</view>
					<view class="flex padding-sm solid-bottom text-xl" @tap="changeStatus(3)">已发货</view>
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
						<xg-input title="发货单号" v-model="params['code']"></xg-input>
						<xg-input title="款号" v-model="params['style_code']"></xg-input>
						<xg-input title="外协名称" v-model="params['association_name']"></xg-input>
						<xg-input title="外协电话" v-model="params['association_tel']"></xg-input>
						<view class="cu-form-group" @click="showSinglePicker(17)">
							<view class="title">生产单位</view>
							<input disabled="true" placeholder="请选择" :value="params['produce_company_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group" @click="showSinglePicker(7)">
							<view class="title">生产类型</view>
							<input disabled="true" placeholder="请选择" :value="params['production_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						
						<view class="solid-top">
							<picker mode="date" :value="params['send_start_date']" :start="startDate" :end="endDate" id="send_start_date" @change="bindDateChange">
								<view class="cu-form-group">
									<view class="title">发货日期始</view>
									<view class="picker">
										{{params['send_start_date']}}
									</view>
								</view>
							</picker>
						</view>
						<view class="solid-top">
							<picker mode="date" :value="params['send_end_date']" :start="startDate" :end="endDate" id="send_end_date" @change="bindDateChange">
								<view class="cu-form-group">
									<view class="title">发货日期末</view>
									<view class="picker">
										{{params['send_end_date']}}
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
					<view class="flex" @tap="goToDetail(item.id)">
						<view class="flex-sub">
							<view class="grid col-1 grid-square padding-top">
								<view class="bg-img" v-if="item.design_img.length>0" :style="[{ backgroundImage:'url(' + item.design_img[0]['img_url'] + ')' }]"></view>
							</view>
						</view>
						<view class="flex-treble">
							<view class="flex solid-bottom">
								<view class="flex-sub cf padding-left-sm">
									<view class="fl text-bold text-xl">{{item.style_code}}</view>
									<view class="fr">
										<text v-if="item.status==1" class="text-gblue">待确认</text>
										<text v-if="item.status==2" class="text-gblue">部分收货</text>
										<text v-if="item.status==3" class="text-gblue">已发货</text>
									</view>
								</view>
							</view>
							<view class="flex margin-left-sm padding-top-sm">
								<view class="flex-sub">类型：{{item.production_name}}</view>
								<view class="flex-sub text-right margin-right-sm">外协：{{item.association_name}}</view>
							</view>
							<view class="flex solid-bottom margin-left-sm">
								<view class="flex-sub">
									实发:<text class="text-red">{{item.send_count}}</text>
								</view>
								<view class="flex-sub text-right margin-right-sm">
									实收:<text class="text-red">{{item.receive_count}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub cf">
							<view class="fl">发货：{{item.send_date}}</view>
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
				listType: 1,
				pageTitle: '待裁剪',
				modalName: null,
				modalTitle: "添加",
				itemID: null,
				listData: [],
				loadMoreText: "暂时没有数据",
				showLoadMore: true,
				status: 0,
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
					'depots', 'year', 'design_company', 'style_type', 'supplier', 'style_code', 'buyer', 'produce_company'
				],
				startDate: getDate('start'),
				endDate: getDate('end'),
				order: {
					submit_date: getDate(),
					order_count: 0
				},
				orderColors: []
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
					status: this.status,
					page: this.page
				}
				api.get({
					url: 'home/sends',
					data: Object.assign(baseParams, this.params),
					success: res => {
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
				//1.color 2.brand 3.size 4.process 5.season 6.unit 7.production 8.level 9.material_type 10.depot
				//11.year 12.design_company 13.style_type 14.supplier 15.style_code 16.buyer 17.produce_company
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '7,17'
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
			changeStatus(e) {
				this.status = e
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
				if (k == 77) {
					this.pickerValueArray = [
						{label:'默认', value:'id desc'},
						{label:'按通知日期', value:'create_time asc'},
						{label:'按交货日期', value:'submit_date asc'}
					]
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
				var key = this.xgArray[k]
				if (k == 77) {
					this.params['sort'] = e.value[0]
					this.$set(this.params, 'sort_name', e.label)
				} else {
					this.params[key + '_id'] = e.value[0]
					this.$set(this.params, key + '_name', e.label)
				}
			},
			//日期选择
			bindDateChange(e) {
				this.$set(this.params, e.target.id, e.target.value)
			},
			//下发生产日期
			bindOrderDate(e) {
				this.$set(this.order, e.target.id, e.target.value)
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
			goToCut(id) {
				uni.navigateTo({
					url: 'cut?id=' + id
				});
			},
			goToSend(id) {
				uni.navigateTo({
					url: 'send?id=' + id
				});
			},
			//裁剪完成
			confirmFinish(item) {
				if (parseFloat(item.true_count) <= 0) {
					uni.showToast({
						icon: 'none',
						title: '实裁数量必须大于0'
					})
					return;
				}
				var options = {
					url: 'home/sends/' + item.id,
					method: 'PUT',
					data: {
						cut_status: 3
					},
					content: '您确定要完成裁床登记吗？确认后将不能再修改裁床登记单！',
					msg: '裁剪完成！'
				}
				api.ggConfirm(options, this.reloadMyData)
			},
			//开始裁剪
			confirmCut(id) {
				var options = {
					url: 'home/sends/' + id,
					method: 'PUT',
					data: {
						cut_status: 2
					},
					content: '确认裁剪后，需要填写裁剪数量，请在“裁剪中”查看和更新',
					msg: '开始裁剪成功！'
				}
				api.ggConfirm(options, this.reloadMyData)
			},
			//删除裁剪（退回待裁剪，并清空裁剪数据）
			confirmDel(id) {
				var options = {
					url: 'home/sends/' + id,
					method: 'PUT',
					data: {
						cut_status: 1
					},
					content: '确认删除裁剪单吗？',
					msg: '删除成功！'
				}
				api.ggConfirm(options, this.reloadMyData)
			}
			
		}
	}
</script>


<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
