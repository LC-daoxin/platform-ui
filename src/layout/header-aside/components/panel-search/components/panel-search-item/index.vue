<template>
  <div class="sy-panel-search-item" :class="hoverMode ? 'can-hover' : ''" flex>
    <div class="sy-panel-search-item__icon" flex-box="0">
      <div class="sy-panel-search-item__icon-box" flex="main:center cross:center">
        <sy-icon v-if="item.icon" :name="item.icon"/>
        <sy-icon-svg v-else-if="item.iconSvg" :name="item.iconSvg"/>
        <sy-icon v-else name="file-o"/>
      </div>
    </div>
    <div class="sy-panel-search-item__info" flex-box="1" flex="dir:top">
      <div class="sy-panel-search-item__info-title" flex-box="1" flex="cross:center">
        <span>{{item.title}}</span>
      </div>
      <div class="sy-panel-search-item__info-fullTitle" flex-box="0">
        <span>{{item.fullTitle}}</span>
      </div>
      <div class="sy-panel-search-item__info-path" flex-box="0">
        <span>{{item.path}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      default: () => ({})
    },
    hoverMode: {
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.sy-panel-search-item {
  height: 64px;
  margin: 0px -20px;
  &.can-hover {
    @extend %unable-select;
    margin: 0px;
    &:hover {
      background-color: #F5F7FA;
      .sy-panel-search-item__icon {
        .sy-panel-search-item__icon-box {
          i {
            font-size: 24px;
            color: $color-primary;
          }
        }
      }
      .sy-panel-search-item__info {
        .sy-panel-search-item__info-title {
          color: $color-text-main;
        }
        .sy-panel-search-item__info-fullTitle {
          color: $color-text-normal;
        }
        .sy-panel-search-item__info-path {
          color: $color-text-normal;
        }
      }
    }
  }
  .sy-panel-search-item__icon {
    width: 64px;
    .sy-panel-search-item__icon-box {
      height: 64px;
      width: 64px;
      border-right: 1px solid $color-border-3;
      i {
        font-size: 20px;
        color: $color-text-sub;
      }
      svg {
        height: 20px;
        width: 20px;
      }
    }
  }
  .sy-panel-search-item__info {
    margin-left: 10px;
    .sy-panel-search-item__info-title {
      font-size: 16px;
      line-height: 16px;
      font-weight: bold;
      color: $color-text-normal;
    }
    .sy-panel-search-item__info-fullTitle {
      font-size: 10px;
      line-height: 14px;
      color: $color-text-placehoder;
    }
    .sy-panel-search-item__info-path {
      margin-bottom: 4px;
      font-size: 10px;
      line-height: 14px;
      color: $color-text-placehoder;
    }
  }
}
</style>
