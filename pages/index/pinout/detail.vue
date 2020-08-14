<template>
	<view>
		<cu-custom v-if="showTop" bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">采购单详情</block>
		</cu-custom>

		<form>
			<view class="cu-form-group">
				<view class="title">款号</view>
				<input disabled="true" :value="order['style_code']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">批次</view>
				<input disabled="true" :value="order['batch']"></input>
			</view>

			<view class="cu-form-group">
				<view class="title">尺码</view>
				<input disabled="true" :value="order['size_names']"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">颜色</view>
				<input disabled="true" :value="order['color_names']"></input>
			</view>
		</form>

		<!-- 当前添加的采购信息 -->
		<view class="margin-top bg-white" v-for="(item,index) in mainPurchase" :key="index">
			<scroll-view scroll-x="true">
				<view class="gg-scroll-view text-black padding-sm">
					<view class="action text-lg text-bold">供应商:{{item.supplier_name}}</view>
				</view>
				<!-- 表头 -->
				<view class="gg-scroll-view text-white">
					<view class="gg-scroll-th td-a">名称</view>
					<view class="gg-scroll-th td-b">货号/色号/颜色/规格/单位</view>
					<view class="gg-scroll-th">单价</view>
					<view class="gg-scroll-th">数量</view>
					<view class="gg-scroll-th">合计</view>
				</view>

				<view class="gg-scroll-view text-black" v-for="(th,ix) in item.supplier_things" :key="ix">
					<view class="gg-scroll-td td-a">{{th.name||'-'}}</view>
					<view class="gg-scroll-td td-b">
						{{th.item_no||'-'}}/{{th.color_no||'-'}}/{{th.color_name||'-'}}/{{th.specification||'-'}}/{{th.unit_name||'-'}}
					</view>
					<view class="gg-scroll-td">{{th.price||'0'}}</view>
					<view class="gg-scroll-td">{{th.count||'0'}}</view>
					<view class="gg-scroll-td">{{th.total_amount||'0'}}</view>
				</view>
				<view class="gg-scroll-view text-black">
					<view class="gg-scroll-td td-a">操作：</view>
					<view class="gg-scroll-td td-b">
						----
					</view>
					<view class="gg-scroll-td">合计：</view>
					<view class="gg-scroll-td">{{item.sum_count}}</view>
					<view class="gg-scroll-td">{{item.sum_amount}}</view>
				</view>

			</scroll-view>
		</view>

		<!-- <view class="padding-xl">
			<button class="text-green bg-white" @tap="showPurchaseInfo">添加采购</button>
		</view> -->

		<!-- 采购信息模态框 -->
		<view class="cu-modal bottom-modal" :class="purchaseInfoModal">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action cuIcon-close" @tap="hideModal(1)"></view>
					<view class="action text-gold" @tap="addPurchase">确定</view>
				</view>
				<scroll-view scroll-y="true" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">

					<view v-for="(item,index) in purchaseDetail" :key="index">
						<view class="text-left margin-top-sm">
							<form>
								<view class="cu-form-group" @click="showSearchChoose(1)">
									<view class="title">供应商<text class="text-red">*</text></view>
									<input disabled="true" placeholder="请选择" :value="item['supplier_name']"></input>
									<text class="cuIcon-right"></text>
								</view>
							</form>
						</view>
						<view class="text-left margin-top-sm" v-for="(thing,ix) in item['supplier_things']" :key="ix">
							<form>
								<view class="grid col-2">
									<!-- <xg-input title="名称" required="true" v-model="thing['name']"></xg-input> -->
									<view class="cu-form-group">
										<view class="title">名称<text class="text-red">*</text></view>
										<input placeholder="请输入" v-model="thing['name']"></input>
									</view>
									<view class="cu-form-group" @tap="showSearchChoose(3,index,ix)">
										<view class="title"></view>
										<text class="text-blue">选择</text>
										<text class="cuIcon-right"></text>
									</view>
									<view class="cu-form-group">
										<view class="title">货号</view>
										<input placeholder="请输入" v-model="thing['item_no']"></input>
									</view>
									<view class="cu-form-group" @click="showSinglePicker(99,index,ix)">
										<view class="title">是否主料</view>
										<input disabled="true" placeholder="请选择" :value="thing['is_main']==2?'否':'是'"></input>
										<text class="cuIcon-right"></text>
									</view>
									<view class="cu-form-group">
										<view class="title">色号</view>
										<input placeholder="请输入" v-model="thing['color_no']"></input>
									</view>
									<view class="cu-form-group" @click="showSinglePicker(1,index,ix)">
										<view class="title">颜色</view>
										<input disabled="true" placeholder="请选择" v-model="thing['color_name']"></input>
										<text class="cuIcon-right"></text>
									</view>
									<view class="cu-form-group">
										<view class="title">规格</view>
										<input placeholder="请输入" v-model="thing['specification']"></input>
									</view>
									<view class="cu-form-group" @click="showSinglePicker(6,index,ix)">
										<view class="title">单位<text class="text-red">*</text></view>
										<input disabled="true" placeholder="请选择" v-model="thing['unit_name']"></input>
										<text class="cuIcon-right"></text>
									</view>
									<view class="cu-form-group">
										<view class="title">单价<text class="text-red">*</text></view>
										<input type="digit" id="price" placeholder="请输入" v-model="thing['price']"></input>
									</view>
									<view class="cu-form-group">
										<view class="title">数量<text class="text-red">*</text></view>
										<input type="digit" id="count" placeholder="请输入" v-model="thing['count']"></input>
									</view>
								</view>
								<view class="flex bg-white padding-sm solids-top">
									<view class="flex-sub">
										<!-- <view class="fl text-xl text-red">总额：{{thing['total_amount']||0}}元</view> -->
										<view class="fl text-xl text-red">总额：{{(thing['count']*thing['price']||0).toFixed(2)}}元</view>
										<view class="fr text-lg text-green" @tap="delThing(index,ix)">删除</view>
									</view>
								</view>
							</form>
						</view>
						<view class="padding-xl">
							<button class="text-green bg-white" @tap="addThing(index)">添加物品</button>
						</view>
					</view>
				</scroll-view>

			</view>
		</view>

		<!-- 搜索选择模态框 -->
		<view class="cu-modal bottom-modal" :class="searchChooseModal">
			<view class="cu-dialog">
				<view class="cu-bar search bg-white">
					<view class="action" @tap="hideModal(2)">
						<text class="cuIcon-back text-gray"></text>
					</view>
					<view class="search-form round">
						<text class="cuIcon-search"></text>
						<input @input="setKeyword" :adjust-position="false" type="text" :placeholder="searchPlaceholder" confirm-type="search"></input>
					</view>
				</view>
				<scroll-view scroll-y="true" @scrolltolower="getMoreList" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
					<view v-if="searchType==1" class="text-left margin-top-sm">
						<view v-for="(item,index) in supplierList" :key="index" @tap="chooseSupplier(item.id,item.short_name)">
							<view class="padding bg-white margin-top">
								<view class="flex solid-bottom">
									<view class="flex-sub cf padding-sm">
										<view class="fl text-bold text-xl">{{item.short_name}}</view>
										<view class="fr text-lg">联系人：{{item.contact_name}}</view>
									</view>
								</view>
								<view class="flex padding-sm">
									<view class="flex-sub cf">
										<view class="fl text-lg">地址:{{item.detail_address}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="uni-loadmore margin-top-xl" v-if="showLoadMore">{{loadMoreText}}</view>
					</view>
					<!-- 款号列表 -->
					<view v-if="searchType==2" class="text-left margin-top-sm">
						<view v-for="(it,index) in designList" :key="index" @tap="chooseDesign(it.style_code,it.size_ids,it.size_names,it.color_ids,it.color_names)">
							<view class="padding bg-white margin-top">
								<view class="flex">
									<view class="flex-sub cf padding-sm">
										<view class="fl text-bold text-xl">款号:{{it.style_code}}</view>
										<view class="fr text-lg">款名：{{it.style_name}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="uni-loadmore margin-top-xl" v-if="showLoadMore">{{loadMoreText}}</view>
					</view>
					<!-- 物料列表 -->
					<view v-if="searchType==3" class="text-center margin-top-sm">
						<view class="grid col-2 bg-white">
							<view class="grid col-3">
								<view class="solid">选择</view>
								<view class="solid">供应商</view>
								<view class="solid">名称</view>
							</view>
							<view class="grid col-4">
								<view class="solid">货号</view>
								<view class="solid">色号</view>
								<view class="solid">颜色</view>
								<view class="solid">规格</view>
							</view>
						</view>
						<view v-for="(it,index) in materialList" :key="index">
							<view class="grid col-2 bg-white">
								<view class="grid col-3">
									<view class="solid" @tap="chooseMaterial(it)">
										<!-- <view class="cu-tag bg-blue radius">选</view> -->
										<radio :value="it.id+''" />
									</view>
									<view class="solid">{{it.supplier_name}}</view>
									<view class="solid">{{it.name}}</view>
								</view>
								<view class="grid col-4">
									<view class="solid">{{it.item_no}}</view>
									<view class="solid">{{it.color_no}}</view>
									<view class="solid">{{it.color_name}}</view>
									<view class="solid">{{it.specification}}</view>
								</view>
							</view>
						</view>
						<view class="uni-loadmore margin-top-xl" v-if="showLoadMore">{{loadMoreText}}</view>
					</view>

				</scroll-view>
			</view>
		</view>

		<!-- 保存采购单模态框 -->
		<view class="cu-modal bottom-modal" :class="savePurchaseModal">
			<view class="cu-dialog">
				<view class="text-left">
					<form>
						<view class="cu-form-group">
							<view class="title">采购数量</view>
							<input disabled="true" :value="order['sum_count']"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">应付金额</view>
							<input disabled="true" :value="order['sum_amount']"></input>
						</view>

						<view class="cu-form-group" @click="showSinglePicker(16,-1,-1)">
							<view class="title">采购员</view>
							<input disabled="true" placeholder="请选择" :value="order['buyer_name']"></input>
							<text class="cuIcon-right"></text>
						</view>
						<view class="cu-form-group">
							<view class="title">采购日期</view>
							<picker mode="date" :value="order['purchase_date']" :start="startDate" :end="endDate" id="purchase_date" @change="bindDateChange">
								<view class="picker">
									{{order['purchase_date']}}
								</view>
							</picker>
						</view>
						<xg-input title="备注" v-model="order['remarks']"></xg-input>
					</form>
				</view>

				<view class="cu-bar bg-white tabbar border shop">
					<view class="bg-orange submit" @tap="hideModal(3)">取消</view>
					<view class="bg-green submit" @tap="savePurchaseSubmit">保存</view>
				</view>
			</view>
		</view>

		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onSingleConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>

</template>

<script>
	import api from '@/common/api.js'
	import xgInput from '@/components/xg-input/xg-input.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}

	export default {
		data() {
			return {
				itemID: null,
				CustomBar: this.CustomBar,
				showTop: true,
				purchaseInfoModal: '',
				searchChooseModal: '',
				savePurchaseModal: '',
				params: {},
				cityPickerValueDefault: [0, 0, 0],
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
					'depots', 'year', 'design_company', 'style_type', 'supplier', 'tyle_code', 'buyer'
				],
				date: getDate({
					format: true
				}),
				startDate: getDate('start'),
				endDate: getDate('end'),
				searchType: null, //搜索模态框类型
				searchPlaceholder: '',
				supplierList: [],
				designList: [],
				materialList: [],
				loadMoreText: "暂时没有数据",
				showLoadMore: true,
				hasMore: true,
				page: 1,
				keyword: '',
				mainPurchase: [],
				mainSupplierID: [],
				editIndex: -1,
				purchaseDetail: [],
				supplierIDArr: [],
				pickerIndex: -1,
				pickerIx: -1,
				order: {
					purchase_date: getDate(),
					sum_count: 0,
					sum_amount: 0
				}
			}
		},
		components: {
			xgInput,
			mpvuePicker
		},
		onLoad(e) {
			console.log(e)
			this.itemID = e.id
			this.getEditOne()
			this.getPickerData()
		},
		methods: {
			getEditOne() {
				api.get({
					url: 'home/purchases/' + this.itemID,
					success: res => {
						//console.log(res);
						this.order = res.data
						//this.mainPurchase = res.data.purchase_things
						for (let x in res.data.purchase_things) {
							this.mainPurchase.push(res.data.purchase_things[x]);
						}
						for (let i in res.data.supplier_ids) {
							this.mainSupplierID.push(res.data.supplier_ids[i]);
						}
					}
				});
			},
			getPickerData() {
				//1.color 2.brand 3.size 4.process 5.season 6.unit 7.production 8.level 9.material_type 10.depots
				//11.year 12.design_company 13.style_type 14.supplier 15.style_code
				api.get({
					url: 'home/picker/all',
					data: {
						'key': '1,6,16'
					},
					success: res => {
						this.pickerArray = res.data
					}
				});
			},
			//获取供应商列表
			getSupplierList() {
				var params = {
					page: this.page,
					keyword: this.keyword
				}
				api.get({
					url: 'base/suppliers',
					data: params,
					success: res => {
						var newsList = res.data.data;
						this.page++;
						this.supplierList = this.supplierList.concat(newsList);
						if (res.data.current_page == res.data.last_page || res.data.total == 0) {
							this.hasMore = false;
							this.loadMoreText = "没有数据了"
						}
					}
				});
			},
			//获取款号列表
			getDesignList() {
				var params = {
					page: this.page,
					keyword: this.keyword
				}
				api.get({
					url: 'home/designs',
					data: params,
					success: res => {
						var newsList = res.data.data;
						this.page++;
						this.designList = this.designList.concat(newsList);
						if (res.data.current_page == res.data.last_page || res.data.total == 0) {
							this.hasMore = false;
							this.loadMoreText = "没有数据了"
						}
					}
				});
			},
			//获取物料列表
			getMaterialList() {
				var params = {
					page: this.page,
					keyword: this.keyword
				}
				api.get({
					url: 'home/materials',
					data: params,
					success: res => {
						var newsList = res.data.data;
						this.page++;
						this.materialList = this.materialList.concat(newsList);
						if (res.data.current_page == res.data.last_page || res.data.total == 0) {
							this.hasMore = false;
							this.loadMoreText = "没有数据了"
						}
					}
				});
			},
			//添加采购
			showPurchaseInfo() {
				this.purchaseDetail = [{
					supplier_name: '',
					supplier_id: 0,
					supplier_things: []
				}]
				this.editIndex = -1
				this.supplierIDArr = []
				this.purchaseInfoModal = 'show'
				this.showTop = false
			},
			//搜索选择
			showSearchChoose(i, index, ix) {
				this.searchType = i
				this.page = 1
				this.hasMore = true
				if (i == 1) {
					this.searchPlaceholder = '请输入供应商名称'
					this.supplierList = []
					this.getSupplierList()
				}
				if (i == 2) {
					this.searchPlaceholder = '请输入款号'
					this.designList = []
					this.getDesignList()
				}
				if (i == 3) {
					this.pickerIndex = index
					this.pickerIx = ix
					this.searchPlaceholder = '请输入物料名称'
					this.materialList = []
					this.getMaterialList()
				}
				this.searchChooseModal = 'show'
				this.showTop = false
			},
			//搜索框内加载更多数据
			getMoreList() {
				var type = this.searchType
				if (type == 1) {
					this.getSupplierList()
				}
				if (type == 2) {
					this.getDesignList()
				}
				if (type == 3) {
					this.getMaterialList()
				}
			},
			//隐藏模态框
			hideModal(i) {
				if (i == 1) {
					this.purchaseInfoModal = ''
					this.showTop = true
				}
				if (i == 2) {
					if (this.searchType == 2) {
						this.showTop = true
					}
					this.searchChooseModal = ''
				}
				if (i == 3) {
					this.savePurchaseModal = ''
				}
			},
			//获取搜索框关键字
			setKeyword(e) {
				this.keyword = e.detail.value
				this.page = 1
				this.hasMore = true
				this.loadMoreText = "重新加载中...";
				if (this.searchType == 1) {
					this.supplierList = []
					this.getSupplierList()
				}
				if (this.searchType == 2) {
					this.designList = []
					this.getDesignList()
				}

				if (this.searchType == 3) {
					this.materialList = []
					this.getMaterialList()
				}
			},
			//选择供应商
			chooseSupplier(id, name) {
				if (this.supplierIDArr.indexOf(id) > -1 || this.mainSupplierID.indexOf(id) > -1) {
					uni.showToast({
						icon: 'none',
						title: '该供应商已选择，请返回添加物品'
					});
					return;
				}
				var sup = {
					supplier_name: name,
					supplier_id: id,
					supplier_things: [{}]
				}
				if (this.purchaseDetail[0].supplier_id == 0) {
					this.purchaseDetail = []
				}
				this.purchaseDetail.unshift(sup)
				this.supplierIDArr.unshift(id)
				this.searchChooseModal = ''
			},
			//选择款号
			chooseDesign(code, sid, sname, cid, cname) {
				this.order.style_code = code
				this.order.batch = 1
				this.order.size_ids = sid
				this.order.size_names = sname
				this.order.color_ids = cid
				this.order.color_names = cname
				this.hideModal(2)
			},
			//选择物料
			chooseMaterial(it) {
				var obj = {
					name: it.name,
					item_no: it.item_no,
					color_no: it.color_no,
					specification: it.specification,
					is_main: it.is_main,
					is_main_name: it.is_main == 1 ? '是' : '否',
					color_id: it.color_id,
					color_name: it.color_name,
					unit_id: it.unit_id,
					unit_name: it.unit_name
				}
				this.purchaseDetail[this.pickerIndex].supplier_things.splice(this.pickerIx, 1, obj)
				// this.purchaseDetail[this.pickerIndex].supplier_things[this.pickerIx] = obj
				this.hideModal(2)
			},

			//添加物品
			addThing(index) {
				if (this.purchaseDetail[index].supplier_id == 0) {
					uni.showToast({
						icon: 'none',
						title: '请先选择供应商'
					});
					return;
				}
				this.purchaseDetail[index].supplier_things.push({})
			},
			//删除物品
			delThing(index, ix) {
				this.purchaseDetail[index].supplier_things.splice(ix, 1)
			},
			//计算物品总额
			/* getThingTotal(e,index, ix) {
				var thing = this.purchaseDetail[index].supplier_things[ix]
				var v = e.detail.value
				var total = 0
				if (e.currentTarget.id == 'price') {
					total = parseFloat(v)*parseFloat(thing.count||0)
				}
				if (e.currentTarget.id == 'count') {
					total = parseFloat(v)*parseFloat(thing.price||0)
				}
				console.log(total)
				this.purchaseDetail[index].supplier_things[ix].total_amount = total.toFixed(2)
				console.log(this.purchaseDetail[index].supplier_things[ix])
			}, */

			// 单列
			showSinglePicker(k, index, ix) {
				//用于记录当前选择的输入框
				this.pickerIndex = index
				this.pickerIx = ix

				this.pickerKey = k
				if (k == 99) {
					this.pickerValueArray = [{
						label: '是',
						value: 1
					}, {
						label: '否',
						value: 2
					}]
				} else {
					this.pickerValueArray = this.pickerArray[this.xgArray[k]]
				}
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			onCancel(e) {
				//console.log(e)
			},
			onSingleConfirm(e) {
				var k = this.pickerKey
				var key = this.xgArray[k]
				var index = this.pickerIndex
				var ix = this.pickerIx
				if (index != -1 && ix != -1) {
					if (k == 99) {
						this.purchaseDetail[index].supplier_things[ix]['is_main'] = e.value[0]
						this.$set(this.purchaseDetail[index].supplier_things[ix], 'is_main_name', e.label)
					} else {
						this.purchaseDetail[index].supplier_things[ix][key + '_id'] = e.value[0]
						this.$set(this.purchaseDetail[index].supplier_things[ix], key + '_name', e.label)
					}
				} else {
					this.order[key + '_id'] = e.value[0]
					this.$set(this.order, key + '_name', e.label)
				}

			},

			//日期选择
			bindDateChange(e) {
				this.$set(this.order, e.target.id, e.target.value)
			},
			//完善采购数据 -- 计算合计、判断所需字段是否设置
			perfectData() {
				for (var m = 0, len = this.purchaseDetail.length; m < len; m++) {
					const things = this.purchaseDetail[m].supplier_things
					if (things.length == 0) {
						uni.showToast({
							icon: 'none',
							title: '请添加采购物品'
						});
						return false;
					}
					var sum_count = 0
					var sum_amount = 0
					for (var n = 0, tlen = things.length; n < tlen; n++) {
						const th = things[n]
						if (th.name == undefined || th.price == undefined || th.count == undefined || th.unit_id == undefined) {
							uni.showToast({
								icon: 'none',
								title: '名称/价格/数量/单位不能为空'
							});
							return false;
						}
						things[n].total_amount = (things[n].count * things[n].price || 0).toFixed(2)
						sum_count += parseFloat(things[n].count)
						sum_amount += parseFloat(things[n].total_amount)
					}
					this.purchaseDetail[m].sum_count = sum_count
					this.purchaseDetail[m].sum_amount = sum_amount
				}
				console.log(this.purchaseDetail)
				return true;
			},
			//计算采购总数、总额
			getOrderSum() {
				var sum_count = 0
				var sum_amount = 0
				for (var m = 0, len = this.mainPurchase.length; m < len; m++) {
					const item = this.mainPurchase[m]
					sum_count += item.sum_count
					sum_amount += item.sum_amount
				}
				this.order.sum_count = sum_count
				this.order.sum_amount = sum_amount
			},

			//添加 一次采购信息，加到主页面
			addPurchase() {
				//如果是修改，先把原来的去掉
				var i = this.editIndex
				if (i != -1) {
					this.mainPurchase.splice(i, 1)
					this.mainSupplierID.splice(i, 1)
				}
				//完善各项采购信息
				if (this.perfectData() == false) {
					return;
				}
				this.mainPurchase = this.mainPurchase.concat(this.purchaseDetail)
				this.mainSupplierID = this.mainSupplierID.concat(this.supplierIDArr)
				this.getOrderSum()
				this.purchaseInfoModal = ''
				this.showTop = true
				console.log(this.mainPurchase)
				console.log(this.mainSupplierID)
			},
			//修改 主页面采购信息
			editOne(index) {
				this.purchaseDetail = []
				this.purchaseDetail[0] = this.mainPurchase[index]
				this.supplierIDArr = []
				this.supplierIDArr[0] = this.mainSupplierID[index]
				this.editIndex = index
				this.purchaseInfoModal = 'show'
				this.showTop = false
			},
			//删除 主页面采购信息
			delOne(index) {
				var that = this
				uni.showModal({
					title: '提示',
					content: '确定要删除该采购信息吗？',
					success: function(res) {
						if (res.confirm) {
							that.mainPurchase.splice(index, 1)
							that.mainSupplierID.splice(index, 1)
							console.log(that.mainSupplierID)
						}
					}
				})
			},

			//准备生成采购单
			showSavePurchase() {
				if (this.mainSupplierID.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请先添加采购'
					});
					return;
				}
				this.savePurchaseModal = 'show'
			},

			savePurchaseSubmit() {
				console.log(this.order)
				console.log(this.mainPurchase)

				api.put({
					url: 'home/purchases/' + this.itemID,
					data: {
						order: JSON.stringify(this.order),
						purchase: JSON.stringify(this.mainPurchase)
					},
					success: res => {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
						if (res.code == 1) {
							uni.setStorageSync('need_refresh', true)
							setTimeout(function() {
								uni.navigateBack()
							}, 1500)
						}
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
		height: 100%;
	}

	.gg-scroll-view {
		white-space: nowrap;
		width: 100%;
	}

	.gg-scroll-th {
		display: inline-block;
		width: 120upx;
		text-align: center;
		font-size: 36upx;
		background-color: #1cbbb4;
		color: #ffffff;
		border: 1upx solid rgba(0, 0, 0, 0.1);
		padding: 10upx;
	}

	.gg-scroll-td {
		display: inline-block;
		width: 120upx;
		text-align: center;
		font-size: 20upx;
		background-color: #ffffff;
		color: #666666;
		border: 1upx solid rgba(0, 0, 0, 0.1);
		padding: 10upx;
	}

	.td-a {
		width: 160upx;
	}

	.td-b {
		width: 450upx;
	}
</style>
