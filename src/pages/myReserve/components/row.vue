<template>
    <div :class="class1">
        {{item.featureName}}:{{item.valueNames || item.values || '--'}}
    </div>
</template>
<script>
    
    export default {

        props:{
            item:Object,
            key:Object
        },

        computed:{
            class1:function(){
                let length = 0
                item.value
                return length>18?'cs-half':'cs-all'
            }
        },
        created(){
            console.log("itemitemitemitem",item)
        }
        
    }
</script>
<style scoped lang="scss" type="text/scss">
   .cs-half{

   }
</style>
