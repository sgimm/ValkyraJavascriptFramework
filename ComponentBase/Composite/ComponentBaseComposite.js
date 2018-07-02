class TComponent {
    constructor(owner, parent, engine) {
        this.ComponentTreeSize = 1;
        this.Classname = null;
        this.Owner = null;
        this.Engine = engine;
        this.Initialized = null;
        this.Children = [];
        this.Parent = null;
        this.Root = null;
        if (owner) {

            this.Owner = owner;
            this.Owner.Children.push(this);
            this.Root = this.Owner.Root;
            this.Root.ComponentTreeSize++;
        }
        else {
            this.Root = this;
        }
        if (parent)
            this.Parent = parent;
    }
    Initialize() {
        for (let i = 0; i < this.Children.length; i++) {
            this.Children[i].Initialize();
        }
        if (this.Initialized)
            this.Initialized();
    }
    SendMessage(msg) {
        if (msg) {
            for (let i = 0; i < this.Children.length; i++) {
                if (typeof (this.Children[i]["SendMessage"]) == "function")
                    this.Children[i].SendMessage(msg);
            }
        }
    }
}
class TEngine {
    constructor() {

    }
    TraceOut(szString) {
        console.log(szString);
    }
}
class TMessageObject {
    constructor() {
        this.Sender = null;
        this.Receiver = null;
        this.MsgContent = null;
        this.MessageType = null;
        this.CallBack = null;
        this.MessageId = null;
    }
}