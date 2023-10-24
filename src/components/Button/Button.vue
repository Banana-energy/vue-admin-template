<template>
	<component
		:is="tag"
		ref="_ref"
		:class="[
			ns.b(),
			ns.m(_type),
			ns.m(_size),
			ns.is('disabled', _disabled),
			ns.is('loading', loading),
			ns.is('plain', plain),
			ns.is('round', round),
			ns.is('circle', circle),
			ns.is('text', text),
			ns.is('link', link),
			ns.is('has-bg', bg),
		]"
		:style="buttonStyle"
		v-bind="_props"
		@click="handleClick"
	>
		<template v-if="loading">
			<slot v-if="$slots.loading" name="loading"></slot>
			<el-icon v-else :class="ns.is('loading')">
				<component :is="loadingIcon" />
			</el-icon>
		</template>
		<el-icon v-else-if="icon || $slots.icon">
			<component :is="icon" v-if="icon" />
			<slot v-else name="icon"></slot>
		</el-icon>
		<span
			v-if="$slots.default"
			:class="{ [ns.em('text', 'expand')]: shouldAddSpace }"
		>
			<slot></slot>
		</span>
	</component>
</template>

<script lang="ts" setup>
import { ElIcon } from 'element-plus';
import { useNamespace } from 'element-plus';
import { useButton } from 'element-plus/es/components/button/src/use-button';
import { buttonEmits, buttonProps } from 'element-plus';
import { useButtonCustomStyle } from 'element-plus/es/components/button/src/button-custom';

defineOptions({
  name: 'ElButton',
});

const props = defineProps({
  ...buttonProps,
  tag: {
    type: [ String, Object ],
    default: 'div'
  }
});
const emit = defineEmits(buttonEmits);

const buttonStyle = useButtonCustomStyle(props);
const ns = useNamespace('button');
const { _ref, _size, _type, _disabled, _props, shouldAddSpace, handleClick } =
  useButton(props, emit);

defineExpose({
  /** @description button html element */
  ref: _ref,
  /** @description button size */
  size: _size,
  /** @description button type */
  type: _type,
  /** @description button disabled */
  disabled: _disabled,
  /** @description whether adding space */
  shouldAddSpace,
});
</script>
