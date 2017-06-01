




<script>

export default {
    bind(el, binding, vNode) {
        
        document.addEventListener("click", (e) => {
            
            if (el.contains(e.target)) return
            if (binding.expression) {
                vNode.context[binding.expression]()
            }
            
        }, false)
    },
    update() {
        
    },
    unbind() {
        
    }
        
}

</script>

