class Chatbox {
    constructor() {
        this.args = {

            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
        this.updateChatText(chatbox)
        this.sendToRasa("user", text1);

    }

    // sendToRasa function
    async sendToRasa(name, msg) {
        var textField = document.querySelector('input');
        await fetch('http://localhost:5005/webhooks/rest/webhook', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'charset': 'UTF-8',
                },
                credentials: "same-origin",
                body: JSON.stringify({ "sender": name, "message": msg }),
            })
            .then(response => response.json())
            .then((response) => {
                if (response) {
                    console.log(response);
                    const temp = response[0];
                    const recipient_msg = temp["text"];
                    let msg2 = { name: "Sam", message: recipient_msg };
                    this.messages.push(msg2);
                    this.updateChatText(chatbox)
                    textField.value = ''
                }
            })
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message.replace(/\n/g, "<br>") + '</div>'
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message.replace(/\n/g, "<br>") + '</div>'
            }
        });

        const chatmessage = document.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

}


const chatbox = new Chatbox();
chatbox.display();