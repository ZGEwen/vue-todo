// jsx中无法直接书写样式，需要引用
import '../assets/styles/footer.styl'
export default {
    data() {
      return {
        author: 'zgw'
      }
    },
    render() {
      return (
        //   可以在这里进行一系列的JavaScript运算
        <div id="footer">
          <span>Written by {this.author}</span>
        </div>
      )
    }
  }