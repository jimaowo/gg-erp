<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">商品{{pageTitle}}</block>
			<block slot="right">
				<view class="flex padding-sm margin-xs justify-end" @tap="goToAdd">
					<text class="margin-xs text-xl">新增</text>
				</view>
			</block>
		</cu-custom>
		<view class="shadow xg-search-sort bg-white">
			<view class="flex">
				<view class="flex-sub padding-sm text-center text-lg solids-right" @tap="showModal">搜索</view>
				<view class="flex-sub padding-sm text-center text-lg">{{pageTitle}}总计：<text class="text-red">{{totalCount}}</text></view>
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
						<view class="cu-form-group" @click="showSinglePicker(10)">
							<view class="title">仓库</view>
							<input disabled="true" placeholder="请选择" :value="params['depot_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group" @click="showSinglePicker(55)">
							<view class="title">状态</view>
							<input disabled="true" placeholder="请选择" :value="params['status_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="solid-top">
							<picker mode="date" :value="params['start_date']" :start="startDate" :end="endDate" id="start_date" @change="bindDateChange">
								<view class="cu-form-group">
									<view class="title">开始日期</view>
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
					<view class="flex" @tap="goToDetail(item.id)">
						<!-- <view class="basis-xs">
							<image v-if="item['design_img'].length>0" :src="item['design_img'][0]['img_url']" mode="aspectFill"></image>
						</view> -->
						<view class="flex-sub">
							<view class="grid col-1 grid-square padding-top">
								<view class="bg-img" v-if="item['image']!=''" :style="[{ backgroundImage:'url(' + item['image'] + ')' }]"></view>
							</view>
						</view>
						<view class="flex-treble">
							<view class="flex solid-bottom">
								<view class="flex-sub cf padding-sm">
									<view class="fl text-bold text-xl">{{item.name}}</view>
								</view>
							</view>
							<view class="flex margin-left-sm">
								<view class="flex-twice text-lg">
									{{pageTitle}}总数:
									<text class="text-red">{{parseFloat(item.sum_count).toFixed()}}</text>
								</view>
								<view class="flex-sub text-lg text-right margin-right-sm">
									<text v-if="item.status==1" class="text-red">待{{pageTitle}}</text>
									<text v-if="item.status==2" class="text-blue">已{{pageTitle}}</text>
								</view>
							</view>
							<view class="flex solid-bottom margin-left-sm">
								<view class="flex-sub text-lg">{{item.date}}</view>
								<view class="flex-sub text-lg text-right margin-right-sm">{{item.depot_name}}</view>
							</view>
						</view>
					</view>
					
				</view>
				<view class="bg-white padding-bottom-sm padding-right-sm solid-top">
					<view class="flex-sub cf">
						<view class="fr">
							<button v-if="item.status==1" class="cu-btn sm line-green margin-xs" @tap="goFinish(item.id)">{{pageTitle}}完成</button>
							<!-- <button class="cu-btn sm line-gblue margin-xs" @tap="goToEdit(item.id)">修改</button> -->
							<button class="cu-btn sm line-gpink margin-xs" @tap="ggDelete(item.id)">删除</button>
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
				list: 1,
				pageTitle: '入库',
				modalName: null,
				modalTitle: "添加",
				itemID: null,
				listData: [],
				totalCount: 0,
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
					'depot', 'year', 'design_company', 'style_type'
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
			this.list = e.list || 1
			if(this.list == 1) {
				this.pageTitle = '入库'
			}
			if(this.list == 2) {
				this.pageTitle = '出库'
			}
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
					url: 'add?type=' + this.list
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
					list: this.list,
					page: this.page,
					sort: this.sort
				}
				api.get({
					url: 'home/goods/inout',
					data: Object.assign(baseParams, this.params),
					success: res => {
						console.log(res);
						this.totalCount = res.data.total_count
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
				//11.year 12.design_company 13.style_type
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '5,2,10'
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
				if(k == 55) {
					this.pickerValueArray = [{label:'待'+this.pageTitle, value: 1},{label:'已'+this.pageTitle, value: 2}]
				} else {
					this.pickerValueArray = this.pickerArray[this.xgArray[k]]
				}
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			onSingleConfirm(e) {
				console.log(e)
				var k = this.pickerKey
				var key = this.xgArray[k]
				if(k == 55) {
					this.params['status'] = e.value[0]
					this.$set(this.params, 'status_name', e.label)
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
					url: 'inoutDetail?id=' + id
				});
			},
			goFinish(id) {
				var options = {
					url: 'home/goods/inout/' + id,
					method: 'PUT',
					data: {
						status: 2
					},
					content: '您确定要完成吗？',
					msg: '操作完成！'
				}
				api.ggConfirm(options, this.reloadMyData)
			},
			goToEdit(id) {
				uni.navigateTo({
					url: 'edit?id=' + id
				});
			},
			//删除资源
			ggDelete(id) {
				var deleteUrl = 'home/goods/' + id
				api.ggDelete(deleteUrl, this.reloadMyData)
			}
		}
	}
</script>


<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
	/* .gg-img {
		width: 50upx;
	} */
</style>
