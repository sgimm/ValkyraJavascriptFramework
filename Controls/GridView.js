class GridView {
    constructor(parent, viewXml) {
        this.Classname = "GridView";
        this.Parent = null;
        this.Children = [];
        this.SelectionChanged = null;
        this.IsAlterColorEnbaled = false;
        this.ItemSource = null;
        this.SelectedRow = null;
        var styleRowNormal = null;
        var styleRowAlter = null;
        var styleRowHover = null;
        var styleRowHeader = null;
        var lastRow = null;
        var actualRow = null;
        var headers = [];
        this.xmlViewObject = null;
        var viewXml = viewXml;

        if (parent)
            this.Parent = parent;
    }

    Initialize() {
        if (window.DOMParser) {
            this.xmlViewObject = (new DOMParser()).parseFromString(this.xmlViewObject, "text/xml");
        }
        else if (window.ActiveXObject) {
            this.xmlViewObject = new ActiveXObject('Microsoft.XMLDOM');
            this.xmlViewObject.async = false;
            if (!xmlViewObject.loadXML(this.xmlViewObject)) {
                throw this.xmlViewObject.parseError.reason + " " + xmlViewObject.parseError.srcText;
            }
        }
        else {
            throw "cannot parse xml string!";
        }
        var _x = this.xmlViewObject.getElementsByTagName("Column");
        for (var i = 0; i < _x.length; i++) {
            headers.push(_x[i].childNodes[1].innerHTML);
        }
    }
    SetItemSource(itemSource) {
        this.ItemSource = itemSource;
        this.AddHeader();
        for (var i = 0; i < this.ItemSource.length; i++) {
            var gr = new GridRow(this.Parent, this);
            if (this.IsAlterColorEnbaled && i % 2 == 0)
                gr.IsAlteredRow = true;
            gr.Index = i;
            gr.OnMouseOver = this.OnHit;
            gr.StyleRowNormal = styleRowNormal;
            gr.StyleRowHover = styleRowHover;
            gr.StyleRowAlter = styleRowAlter;
            gr.Data = this.ItemSource[i];
            gr.Name = "row_" + i;
            gr.Initialize();
            gr.xmlViewObject = this.xmlViewObject;
            gr.AddRow();
        }
    }
    SetRowColor(foreGround, backGround) {
        styleRowNormal = "fontcolor:" + foreGround + "; " + "background:" + backGround + ";";
    };
    SetAlterRowColor(foreGround, backGround) {
        styleRowAlter = "fontcolor:" + foreGround + "; " + "background:" + backGround + ";";
    };
    SetHoverColor(foreGround, backGround) {
        styleRowHover = "fontcolor:" + foreGround + "; " + "background:" + backGround + ";";
    };
    SetHeaderColor (foreGround, backGround) {
        styleRowHeader = "fontcolor:" + foreGround + "; " + "background:" + backGround + ";";
    }
    HitTest(e) {
        for (var i = 0; i < this.Children.length; i++) {
            if (typeof (this.Children[i]["HitTest"]) === "function")
                this.Children[i]["HitTest"](e);
        }
    };
    OnHit(row) {
        lastRow = actualRow;
        actualRow = row;
        if (lastRow != actualRow) {
            if (lastRow)
                lastRow.ToggleHover();
            if (actualRow)
                actualRow.ToggleHover();
        }
    };

    OnDblClick = function () {
        return actualRow;
    };
    AddHeader = function () {
        var gr = new GridRow(this.Parent, this);
        gr.OnMouseOver = this.OnHit;
        gr.IsHeaderRow = true;
        if (styleRowHeader)
            gr.StyleRowHeader = styleRowHeader;
        gr.Data = headers;
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

        if (this.Owner)
            this.Owner.Children.push(this);
    }
    Initialize() {
        this.RowContainer = document.createElement("div");
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

    ToggleHover () {
        if (this.StyleRowHover != null) {
            isHover = !isHover;
            if (isHover)
                this.RowContainer.setAttribute("style", this.StyleRowHover + "display: flex;");
            else if (this.IsAlteredRow)
                this.RowContainer.setAttribute("style", this.StyleRowAlter + "display: flex;");
            else
                this.RowContainer.setAttribute("style", this.StyleRowNormal + "display: flex;");
        }
    };

    HitTest(e) {
        for (var i = 0; i < this.CellArray.length; i++) {
            if (typeof (this.CellArray[i]["HitTest"]) == "function") {
                if (this.CellArray[i]["HitTest"](e) == true) {
                    this.OnHit(this.CellArray[i]);
                }
            }
        }
    };

    OnHit = function (cell) {
        if (this.OnMouseOver)
            this.OnMouseOver(cell.Owner);
    };
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
        this.CellContainer = document.createElement("div");
        this.CellContainer.setAttribute("style", "float:left;Width:" + this.Width + "px;");
    };

    AddCell = function () {
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
