// the export statement means that everything inside the curly braces 
// will be made public when you import this file into another via the import statement

export default {
    props: ['msg'],
    template: `
   <div class="chat-box">
   
    <div class="new-message" v-bind:class="{ 'my-message' : matchedID}" >
    <span>{{ msg.message.name }} says:</span>
    <p>{{ msg.message.content}}</p>
    </div>
   </div>
    `,
    data: function(){
        return {
            message: "hello from the template",
            matchedID: this.$parent.socketID == this.msg.id
            

        };
    }


}