class TMessageObject {
    constructor() {
        this.Sender = null;
        this.Receiver = null;
        this.Msg = null;
        this.MessageType = null;
    }
}

class TEngine {
    constructor() {

    }
    TraceOut(szString) {
        console.log(szString);
    }
}

class TComponent {
    constructor(owner, parent, engine) {
        this.Classname = null;
        this.Owner = null;
        this.Engine = engine;
        this.ThisIsPublic = null;
        this.Initialized = null;
        var thisIstPrivate = null;
        this.Children = [];
        this.Parent = null;
        if (owner) {

            this.Owner = owner;
            this.Owner.Children.push(this);
        }
        if (parent)
            this.Parent = parent;
    }
    Initialize() {
        this.Engine.Traceout("Initialize " + this.Classname);
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

class TestComponent extends TComponent {
    constructor(owner, parent, engine) {
        super(owner, parent, engine);
        this.Classname = "TestComponent";
    }
    Initialize() {
        super.Initialize();
    }
}

class Test {
    constructor() {
        var engine = new TEngine();
        var t = new TestComponent(null, null, engine);
        var t2 = new TestComponent(t, null, engine);
        t.Initialized = this.blah();
        t.Initialize();
    }
    blah() {
        alert("Hallo Welt");
    }
}