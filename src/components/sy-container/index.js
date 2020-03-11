// 组件
import syContainerFull from './components/sy-container-full.vue'
import syContainerFullBs from './components/sy-container-full-bs.vue'
import syContainerGhost from './components/sy-container-ghost.vue'
import syContainerGhostBs from './components/sy-container-ghost-bs.vue'
import syContainerCard from './components/sy-container-card.vue'
import syContainerCardBs from './components/sy-container-card-bs.vue'

export default {
  name: 'sy-container',
  props: {
    // 容器样式
    type: {
      type: String,
      required: false,
      default: 'full'
    },
    // 滚动优化
    betterScroll: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    // 始终返回渲染组件
    component () {
      if (this.type === 'card' && !this.betterScroll) return syContainerCard
      if (this.type === 'card' && this.betterScroll) return syContainerCardBs
      if (this.type === 'ghost' && !this.betterScroll) return syContainerGhost
      if (this.type === 'ghost' && this.betterScroll) return syContainerGhostBs
      if (this.type === 'full' && !this.betterScroll) return syContainerFull
      if (this.type === 'full' && this.betterScroll) return syContainerFullBs
      else {
        return 'div'
      }
    }
  },
  render (h) {
    const slots = [ this.$slots.default ]
    if (this.$slots.header) slots.push(h('template', { slot: 'header' }, [ this.$slots.header ]))
    if (this.$slots.footer) slots.push(h('template', { slot: 'footer' }, [ this.$slots.footer ]))
    return h('div', {
      ref: 'container',
      class: 'container-component'
    }, [
      h(this.component, {
        ref: 'component',
        props: this.$attrs,
        on: {
          scroll: e => this.$emit('scroll', e)
        }
      }, slots)
    ])
  },
  methods: {
    // 返回顶部
    scrollToTop () {
      this.$refs.component.scrollToTop()
      // 如果开启了 better scroll 还需要手动触发一遍 scroll 事件
      const bs = this.$refs.component.BS
      if (bs) this.$refs.component.scroll()
    },
    // 用法同原生方法 scrollBy
    scrollBy (x = 0, y = 0, time = 300) {
      if (this.betterScroll) {
        const bs = this.$refs.component.BS
        if (bs) {
          bs.scrollBy(-x, -y, time)
          // 手动触发一遍 scroll 事件
          this.$refs.component.scroll()
        }
      } else {
        this.$refs.component.$refs.body.scrollBy(x, y)
      }
    },
    // 用法同原生方法 scrollTo
    scrollTo (x = 0, y = 0, time = 300) {
      if (this.betterScroll) {
        const bs = this.$refs.component.BS
        if (bs) {
          bs.scrollTo(-x, -y, time)
          // 手动触发一遍 scroll 事件
          this.$refs.component.scroll()
        }
      } else {
        this.$refs.component.$refs.body.scrollTo(x, y)
      }
    },
    // 用法同原生方法 scrollTop
    scrollTop (top = 0, time = 300) {
      if (this.betterScroll) {
        const bs = this.$refs.component.BS
        if (bs) {
          bs.scrollTo(bs.x, -top, time)
          // 手动触发一遍 scroll 事件
          this.$refs.component.scroll()
        }
      } else {
        this.$refs.component.$refs.body.scrollTop = top
      }
    }
  }
}
