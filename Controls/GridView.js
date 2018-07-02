class GridView {
    constructor(parent, viewXml) {
        this.Classname = "GridView";
        this.Parent = null;
        this.Children = [];
        this.SelectionChanged = null;
        this.IsAlterColorEnbaled = false;
        this.ItemSource = null;
        this.SelectedRow = null;
        this._styleRowNormal = null;
        this._styleRowAlter = null;
        this._styleRowHover = null;
        this._styleRowHeader = null;
        this._lastRow = null;
        this._actualRow = null;
        this._headers = [];
        this.xmlViewObject = null;
        var viewXml = viewXml;
        this.GridContainer = null;
        this.ItemSelected = (function (sender, eventArgs) {
            if (this.SelectionChanged)
                this.SelectionChanged(sender, EventArgs);
        }).bind(this);

        if (parent)
            this.Parent = parent;

        this.SetItemSource = function (itemSource) {
            this.ItemSource = itemSource;
            this.AddHeader();
            for (var i = 0; i < this.ItemSource.length; i++) {
                var gr = new GridRow(this.GridContainer, this);
                if (this.IsAlterColorEnbaled && i % 2 == 0)
                    gr.IsAlteredRow = true;
                gr.Index = i;
                gr.SelectionChanged = this.SelectionChanged;
                gr.OnMouseOver = this.OnHit;
                gr.StyleRowNormal = this._styleRowNormal;
                gr.StyleRowHover = this._styleRowHover;
                gr.StyleRowAlter = this._styleRowAlter;
                gr.Data = this.ItemSource[i];
                gr.Name = "row_" + i;
                gr.Initialize();
                gr.xmlViewObject = this.xmlViewObject;
                gr.AddRow();
            }
        }

        this.SetRowColor = function (foreGround, backGround) {
            this._styleRowNormal = "fontcolor:" + foreGround + "; " + "background:" + backGround + ";";
        };
        this.SetAlterRowColor = function (foreGround, backGround) {
            this._styleRowAlter = "fontcolor:" + foreGround + "; " + "background:" + backGround + ";";
        };
        this.SetHoverColor = function (foreGround, backGround) {
            this._styleRowHover = "fontcolor:" + foreGround + "; " + "background:" + backGround + ";";
        };
        this.SetHeaderColor = function (foreGround, backGround) {
            this._styleRowHeader = "fontcolor:" + foreGround + "; " + "background:" + backGround + ";";
        }
    }

    Initialize() {
        this.GridContainer = document.createElement("Div");
        this.GridContainer.setAttribute("id", "GridContainer");
        this.Parent.appendChild(this.GridContainer);
        if (this.xmlViewObject) {
            if (window.DOMParser) {
                this.xmlViewObject = (new DOMParser()).parseFromString(this.xmlViewObject, "text/xml");
            }
            else {
                throw "cannot parse xml string!";
            }
            var _x = this.xmlViewObject.getElementsByTagName("Column");
            for (var i = 0; i < _x.length; i++) {
                headers.push(_x[i].childNodes[1].innerHTML);
            }
        }
    }

    AddHeader() {
        if (!this.xmlViewObject) {
            if (this.ItemSource.length > 0) {
                for (var x in this.ItemSource[0]) {
                    this._headers.push(x);
                }
            }
        }
        var gr = new GridRow(this.GridContainer, this);
        //gr.OnMouseOver = this.OnHit;
        gr.IsHeaderRow = true;
        if (this._styleRowHeader)
            gr.StyleRowHeader = this._styleRowHeader;
        gr.Data = this._headers;
        gr.Name = "header";
        gr.Initialize();
        gr.xmlViewObject = this.xmlViewObject;
        gr.AddRow();
    }
}

class GridRow {
    constructor(parent, owner) {
        this.Classname = "GridRow";
        this.Owner = owner;
        this.Parent = parent;
        this.OnMouseOver = null;
        this.Name = null;
        this.Data = null;
        this.RowContainer = null;
        this.CellArray = [];
        this.Index = 0;
        this.StyleRowNormal = null;
        this.StyleRowAlter = null;
        this.StyleRowHover = null;
        this.StyleRowHeader = null;
        this.IsAlteredRow = false;
        this.IsHeaderRow = false;
        this.xmlViewObject = null;
        var isHover = false;
        this.SelectedItem = null;
        this.SelectionChanged = null;
        this.SelectRow = (function () {
            this.SelectedItem = this.Data;
            if (this.SelectionChanged)
                this.SelectionChanged(this, this.SelectedItem);
        }).bind(this);
        this.ToggleHover = (function () {
            if (this.StyleRowHover != null) {
                isHover = !isHover;
                if (isHover)
                    this.RowContainer.setAttribute("style", this.StyleRowHover + "display: flex;");
                else if (this.IsAlteredRow)
                    this.RowContainer.setAttribute("style", this.StyleRowAlter + "display: flex;");
                else {
                    if (!this.StyleRowNormal)
                        this.StyleRowNormal = "";
                    this.RowContainer.setAttribute("style", this.StyleRowNormal + "display: flex;");
                }
            }
        }).bind(this);



        if (this.Owner)
            this.Owner.Children.push(this);
    }
    Initialize() {
        this.RowContainer = document.createElement("div");
        this.RowContainer.addEventListener("click", this.SelectRow);
        this.RowContainer.addEventListener("mouseenter", this.ToggleHover);
        this.RowContainer.addEventListener("mouseleave", this.ToggleHover);
        var _tempStyle = null;
        if (!this.IsHeaderRow) {
            if (this.IsAlteredRow)
                _tempStyle = this.StyleRowAlter + "display:flex;";
            else if (this.StyleRowNormal != null)
                _tempStyle = this.StyleRowNormal + "display:flex;";
            if (_tempStyle == null)
                this.RowContainer.setAttribute("style", "display:flex;");
            else
                this.RowContainer.setAttribute("style", _tempStyle);
        }
        else {
            if (this.StyleRowHeader) {
                this.RowContainer.setAttribute("style", this.StyleRowHeader + "display:flex;");
            }
            else {
                this.RowContainer.setAttribute("style", "display:flex;");
            }
        }
        this.Parent.appendChild(this.RowContainer);
    }

    AddRow() {
        if (!this.xmlViewObject) {
            for (var key in this.Data) {
                var _c = new GridCell(this.RowContainer, this);
                _c.Data = this.Data[key];
                _c.Initialize();
                _c.AddCell();
                this.CellArray.push(_c);
            }
        }
        else {
            var _x = this.xmlViewObject.getElementsByTagName("Columns");
            for (var i = 0; i < _x[0].childElementCount; i++) {

                var _dddd = _x[0].childNodes[i];
                var _c = new GridCell(this.RowContainer, this);
                if (!this.IsHeaderRow) {
                    _c.Data = this.Data[_dddd.childNodes[0].innerHTML];
                }
                else _c.Data = this.Data[i];
                _c.Width = _dddd.childNodes[2].innerHTML
                _c.Initialize();
                _c.AddCell();
                this.CellArray.push(_c);
            }
        }
    }


}
class GridCell {
    constructor(parent, owner, cellData) {
        this.Classname = "GridCell";
        this.Owner = owner;
        this.Parent = parent;
        this.Data = cellData;
        this.CellContainer = null;
        this.Width = 0;
    }
    Initialize() {
        if (this.Width == 0)
            this.Width = 100;
        this.CellContainer = document.createElement("div");
        this.CellContainer.setAttribute("style", "float:left;Width:" + this.Width + "px;");
    };

    AddCell() {
        this.CellContainer.innerHTML = this.Data;
        this.Parent.appendChild(this.CellContainer);
    };

    HitTest(e) {
        var _retval = false;
        var rect = this.CellContainer.getBoundingClientRect();
        if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
            _retval = true
        }
        return _retval;
    };
}
