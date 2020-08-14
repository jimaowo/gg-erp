<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">任务通知单</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="showModal">
					<text class="margin-xs text-xl">搜索</text>
				</view>
			</block>
		</cu-custom>
		<view class="shadow xg-search-sort bg-white">
			<view class="flex">
				<view class="flex-sub padding-sm text-center text-lg" :class="status==1?'bg-gblue':''" @tap="changeStatus(1)">未处理</view>
				<view class="flex-sub padding-sm text-center text-lg" :class="status==2?'bg-gblue':''" @tap="changeStatus(2)">已处理</view>
			</view>
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
						<xg-input title="设计单号" v-model="params['design_code']"></xg-input>
						<xg-input title="裁床单号" v-model="params['cut_code']"></xg-input>
						<view class="cu-form-group" @click="showSinglePicker(5)">
							<view class="title">季节</view>
							<input disabled="true" placeholder="请选择" :value="params['season_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group" @click="showSinglePicker(2)">
							<view class="title">品牌</view>
							<input disabled="true" placeholder="请选择" :value="params['brand_name']"></input>
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
			<view v-for="(item,index) in listData" :key="index">
				<view class="padding bg-white margin-top">
					<view class="flex" @tap="goToDetail(item.id)">
						<view class="flex-sub">
							<view class="grid col-1 grid-square padding-top">
								<view class="bg-img" v-if="item.design['design_img'].length>0" :style="[{ backgroundImage:'url(' + item.design['design_img'][0]['img_url'] + ')' }]"></view>
							</view>
						</view>
						<view class="flex-treble">
							<view class="flex solid-bottom">
								<view class="flex-sub cf padding-left-sm">
									<view class="fl text-bold text-xl">{{item.style_code}}</view>
								</view>
							</view>
							<view class="flex margin-left-sm padding-top-sm">
								<view class="flex-sub">下发: <text class="text-red">{{item.order_count}}</text></view>
								<view class="flex-sub text-right margin-right-sm">
									<text v-if="item.read_status == 1" class="text-red">未查看</text>
									<text v-if="item.read_status == 2" class="text-blue">已查看</text>
								</view>
							</view>
							<view class="flex solid-bottom margin-left-sm">
								<view class="flex-sub">第{{item.batch}}单</view>
								<view class="flex-sub text-right margin-right-sm">交货:{{item.submit_date}}</view>
							</view>
						</view>
					</view>
					<view class="flex">
						<view class="flex-sub cf">
							<view class="fr">
								<button class="cu-btn sm line-green margin-xs" @tap="goToPlan(item.id)">安排计划</button>
							</view>
						</view>
					</view>

				</view>
			</view>
			<view class="uni-loadmore bg-gray margin-top-xxl" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onSingleConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>

		<!-- 下发生产模态框 -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="text-left">
					<form>
						<view class="cu-form-group">
							<view class="title">交货日期</view>
							<picker mode="date" :value="order['submit_date']" :start="startDate" :end="endDate" id="submit_date" @change="bindOrderDate">
								<view class="picker">
									{{order['submit_date']}}
								</view>
							</picker>
						</view>
						<view class="flex text-center">
							<view class="flex-sub padding-sm margin-xs">颜色</view>
							<view class="flex-sub padding-sm margin-xs">下单数</view>
							<view class="flex-sub padding-sm margin-xs">备注</view>
						</view>
						<view v-for="(item,index) in orderColors" :key="index" class="flex text-center">
							<view class="flex-sub padding-sm margin-xs">{{item.name}}</view>
							<view class="flex-sub padding-sm margin-xs solids radius">
								<input type="number" v-model="item['order_count']" placeholder="0" />
							</view>
							<view class="flex-sub padding-sm margin-xs solids radius">
								<input type="text" v-model="item['remarks']" placeholder="备注" />
							</view>
						</view>
						<view class="flex text-center">
							<view class="flex-sub padding-sm margin-xs">合计</view>
							<view class="flex-sub padding-sm margin-xs"></view>
							<view class="flex-sub padding-sm margin-xs">-</view>
						</view>
					</form>
				</view>

				<view class="cu-bar bg-white tabbar border shop">
					<view class="bg-orange submit" @tap="hideModal">取消</view>
					<view class="bg-green submit" @tap="makeOrder">确认下单</view>
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
					'depots', 'year', 'design_company', 'style_type'
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
					page: this.page,
					sort: this.sort
				}
				api.get({
					url: 'home/tasks',
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
						'key': '11,12,13,5,2,6,1,3,4'
					},
					success: res => {
						console.log(res);
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
				this.params[key + '_id'] = e.value[0]
				this.$set(this.params, key + '_name', e.label)
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
			goToPlan(id) {
				uni.navigateTo({
					url: 'plan?id=' + id
				});
			},
			//下发生产
			makeOrder() {
				console.log(this.orderColors)
				console.log(this.order)
				
				api.post({
					url:'home/design/'+this.itemID+'/task',
					data:Object.assign({order_colors:JSON.stringify(this.orderColors)}, this.order),
					success: res => {
						console.log(res);
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
			}
		}
	}
</script>


<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
