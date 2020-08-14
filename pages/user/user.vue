<template>
	<view>
		<cu-custom bgColor="xg-nav" :isBack="true">
			<block slot="backText">
				<text class="text-xl">返回</text>
			</block>
			<block slot="content">员工管理</block>
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
							<view class="title">帐号</view>
							<input type="text" placeholder="请输入员工手机号" v-model="phone"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">昵称</view>
							<input type="text" placeholder="请输入昵称或姓名" v-model="nickname"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">密码</view>
							<input v-if="itemID == null" type="text" placeholder="请输入密码" v-model="password" password="true"></input>
							<input v-else type="text" placeholder="不输入则不修改" v-model="password" password="true"></input>
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

		<view class="cu-modal" :class="modalName=='DialogModal2'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">设置角色</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-sm text-bold">
					当前所选员工：{{phone}} - {{nickname}}
				</view>
				<view class="padding-sm">
					温馨提示：不设置角色则拥有所有权限
				</view>
				<view class="text-left">
					<checkbox-group class="block" @change="CheckboxChange">
						<view class="grid col-2 bg-white">
							<view class="padding-sm" v-for="(item,index) in checkbox" :key="index">
								<label class="text-lg">
									<checkbox class='round blue' :class="item.checked?'checked':''" :checked="item.checked?true:false" :value="item.id+''"></checkbox>{{item.name}}
								</label>
							</view>
						</view>
					</checkbox-group>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action">
						<button class="cu-btn line-gold text-gold" @tap="hideModal">取消</button>
						<button class="cu-btn bg-gold margin-left" @tap="saveRole">确定</button>
					</view>
				</view>
			</view>
		</view>

		<view class="bg-white">
			<view class="flex align-center solid-bottom" v-for="(item,index) in listData" :key="item.id">
				<view class="flex-sub padding-sm margin-xs">
					<view>{{item.user_login}} - {{item.user_nickname}}</view>
				</view>
				<view class="flex padding-sm margin-xs justify-end">
					<button class="cu-btn bg-green sm margin-xs" @tap="setRole(item)">角色</button>
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
				itemID: 0,
				phone: "",
				nickname: "",
				password: "",
				listData: [],
				checkbox: [],
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
					url: 'home/user',
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
			getRole() {
				api.get({
					url: 'home/user/' + this.itemID + '/role',
					data: {},
					success: res => {
						this.checkbox = res.data
					}
				});
			},
			resetForm() {
				this.itemID = null
				this.password = ""
				this.nickname = ""
				this.phone = ""
			},
			showModal(e) {
				this.modalTitle = "添加"
				this.resetForm()
				this.modalName = "DialogModal1"
			},
			hideModal(e) {
				this.modalName = null
			},
			editItem(e) {
				this.modalTitle = "编辑"
				this.itemID = e.id
				this.phone = e.user_login
				this.nickname = e.user_nickname
				this.modalName = "DialogModal1"
			},
			//设置角色
			setRole(e) {
				this.itemID = e.id
				this.phone = e.user_login
				this.nickname = e.user_nickname
				this.getRole()
				this.modalName = "DialogModal2"
			},
			//选择角色
			CheckboxChange(e) {
				var items = this.checkbox,
					values = e.detail.value;
				for (var j = 0, lenJ = items.length; j < lenJ; ++j) {
					const item = items[j]
					if (values.includes(item.id + '')) {
						this.$set(item, 'checked', true)
					} else {
						this.$set(item, 'checked', false)
					}
				}
			},
			saveRole() {
				api.request({
					url: 'home/user/' + this.itemID + '/role',
					method: 'PUT',
					data: {
						roles:JSON.stringify(this.checkbox)
					},
					success: data => {
						uni.showToast({
							icon: 'none',
							title: data.msg
						});
						if (data.code == 1) {
							this.hideModal()
						}
						if (data.code == 0) {
							//错误的操作
						}
					}
				});
			},

			ggSubmit() {
				var apiUrl = "home/user"
				var method = "POST"
				if (this.itemID) {
					apiUrl = "home/user/" + this.itemID
					method = "PUT"
				}
				api.request({
					url: apiUrl,
					method: method,
					data: {
						phone: this.phone,
						password: this.password,
						nickname: this.nickname
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
				var deleteUrl = 'home/user/' + id
				api.ggDelete(deleteUrl, this.reloadMyData)
			}
		}
	}
</script>


<style>
</style>
