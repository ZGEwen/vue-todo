<template>
    <div id="app">
        <div id="cover"></div>
        <Header></Header>
        <todo></todo>
        <Footer></Footer>
    </div>
</template>
<script>
import Header from './todo/header.vue'
import Footer from './todo/footer.jsx'
import Todo from './todo/todo.vue'
export default {
    components:{
        Header,
        Footer,
        Todo,
    },
    data(){
        return {
           
        }
    }
}
</script>
// scoped 只应用于这个组件内，样式才生效
<style lang="stylus" scoped>//指定style的预处理器 使用对应的load进行处理，否则无法识别
#app{
    position absolute
    left 0
    right 0
    top 0
    bottom 0
}
#cover{
    position absolute
    left 0
    right 0
    top 0
    bottom 0   
    background-color #999 
    opacity .9
    z-index -1
}
</style>
