<template>
		<view class="cu-form-group">
			<view class="title">{{title}}<text class="text-red" v-if="required">*</text></view>
			<input :placeholder="pH" v-bind:value="inputValue" v-on:input="$emit('input', $event.target.value)" @input="clearInput"></input>
			<text class="cuIcon-roundclosefill text-gray" v-if="showClearIcon" @click="clearIcon"></text>
		</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				inputValue: this.value,
				showClearIcon: false,
				inputClearValue: ''
			};
		},
		name: 'xg-input',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			value: '',
			required: false,
			title: {
				type: String,
				default: '名称'
			},
			pH: {
				type: String,
				default: '请输入'
			}
		},
		watch: {
			value(val) {
				this.inputValue = val;//新增result的watch，监听变更并同步到myResult上
			}
		 },
		methods: {
			clearInput: function(event) {
				this.inputClearValue = event.target.value;
				if (event.target.value.length > 0) {
					this.showClearIcon = true;
				} else {
					this.showClearIcon = false;
				}
			},
			clearIcon: function() {
				this.inputValue = '';
				this.$emit('input', '');
				this.showClearIcon = false;
			}
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
