<style lang="sass">
*{margin: 0; padding: 0;}
.justify {
    text-align: justify;
    text-align-last: justify;
    width: 300px;

    :after {
        content: "";
        display: inline-block;
    }

    li {
        display: inline-block;
        
    }

}

</style>

<template>
    <div>
        <ul class="justify">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
        </ul>
    </div>
</template>

<script>

export default {
    mounted() {
        let arr = [{
            name: "a"
        }, {
            name: "c"
        }, {
            name: "b"
        }, {
            name: "c"
        }]

        let _arr = arr.sort((a,b) => {
            console.log(a.name.charCodeAt(0),b.name.charCodeAt(0))
            return a.name.charCodeAt(0)-b.name.charCodeAt(0)
        })

        console.log(_arr)
    }
}

</script>

