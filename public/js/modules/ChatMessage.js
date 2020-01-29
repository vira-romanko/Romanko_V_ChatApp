// the export statement means that everything inside the curly braces 
// will be made public when you import this file into another via the import statement

export default {
    props: ['msg'],
    template: `
   
    <p  :class="{ 'my-message' : matchedID}" class="new-message" >
    <span>{{ msg.message.name }} says:</span>
    {{ msg.message.content}}
    </p>
   
    `,
    data: function(){
        return {
            message: "hello from the template",
            matchedID: this.$parent.socketID == this.msg.id
        };
    }


}