class TComponent {
    constructor(owner, parent, engine) {
        this.Classname = null;
        this.Owner = null;
        this.Engine = engine;
        this.Initialized = null;
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
