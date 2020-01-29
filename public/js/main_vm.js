// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";
const socket = io();
// the packet is shatever data we send through with the connect event
// form the server
// this is data destructioring. Go look it up on MND
function setUserId({sID}){
    //debugger
    console.log(sID);
    vm.socketID = sID;
}

function showDisconnectMessage(){
    console.log('a user disconnected');
}

function appendMessage(message){
    vm.messages.push(message);
}

const vm = new Vue({
    data:{

        socketID: "",
        message: "",
        nickname: "",
        messages:[]    
        
    },

    methods:{
        //emit a message event to the server so that is 
        // can in turn sent this to enyone who's connectoed
        dispatchMessage(){
            console.log('handle emit message');
        // the double pipe || is an "or" operator
        //if the first value is set, use it. else use
        // whatver comes after the "or " operator
            socket.emit('chat_message', {
                content: this.message,
                name: this.nickname || 'anonymous'
            })

            this.message="";


        }
    },
    mounted: function(){
        console.log('vue is done mounting');

    },
    components:{
        newmessage:ChatMessage
    }
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('disconnect', showDisconnectMessage);
socket.addEventListener('new_message', appendMessage);