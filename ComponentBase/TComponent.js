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
        else this.Root = this;
        if (parent)
            this.Parent = parent;
    }
    Initialize() {
        for (let i = 0; i < this.Children.length; i++) {
            if (typeof (this.Children[i]["Initialize"]) == "function")
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
    Destroy() {
        for (let i = 0; i < this.Children.length; i++) {
            if (typeof (this.Children[i]["Destroy"]) == "function")
                this.Children[i].Destroy();
            this.Children[i] = null;
            this.ComponentTreeSize--;
        }
    }
}