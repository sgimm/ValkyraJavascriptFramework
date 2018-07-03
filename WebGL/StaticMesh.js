class StaticMesh extends Actor {
    constructor() {
        super();
        this.VertexBuffer = [];
        this.TextureBuffer = [];
        this.NormalBuffer = []
        this.ColorBuffer = [];
        this.FileReader = null;
        this.FaceCount = 0;
        this.LoadingComplete = null;
        this.VertexArray = [];
        this.TextureArray = [];
        this.NormalArray = [];
        this.SubMesh = [];
        this._GetVertices = function(source, file) {
            source = source.substr(1);
            var source2 = file.getElementById(source);
            source2 = source2.firstElementChild.getAttribute("source");
            source2 = source2.substr(1);
            var x2 = file.getElementById(source2);
            x2 = x2.getElementsByTagName("float_array")[0].innerHTML.split(" ");
            //alert(x2);
            for (let i = 0; i < x2.length; i += 3) {
                var vtx = new Vector3();
                vtx.X = x2[i];
                vtx.Y = x2[i + 1];
                vtx.Z = x2[i + 2];
                this.VertexArray.push(vtx);
            }
        }
        this._GetTextureCoords = function (source, file) {
            var s = source.substr(1);
            var x = file.getElementById(s);
            var uvs = x.getElementsByTagName("float_array")[0].innerHTML.split(" ");
            for (let i = 0; i < uvs.length; i += 2) {
                var uv = new Vector2();
                uv.X = uvs[i];
                uv.Y = uvs[i + 1];
                this.TextureArray.push(uv);
            }
        }
        this._GetNormals = function (source, file) {
            var s = source.substr(1);
            var x = file.getElementById(s);
            var normals = x.getElementsByTagName("float_array")[0].innerHTML.split(" ");
            for (let i = 0; i < normals.length; i += 3) {
                var nrm = new Vector3();
                nrm.X = normals[i];
                nrm.Y = normals[i + 1];
                nrm.Z = normals[i + 2];
                this.NormalArray.push(nrm);
            }
        }

        this.ReaderComplete = (function (result) {
            var xml = (new DOMParser()).parseFromString(result, "text/xml");
            var geom = xml.getElementsByTagName("geometry");
            for (let i = 0; i < geom.length; i++) {
                var s = new StaticMesh();
                s.AddMeshData(geom[i], xml);
                this.SubMesh.push(s);
            }
            
            var FaceData = xml.getElementsByTagName("p")[0].innerHTML.split(" ");

            for (var i = 0; i < FaceData.length; i += 3) {
                this.VertexBuffer.push(this.VertexArray[FaceData[i]].X);
                this.VertexBuffer.push(this.VertexArray[FaceData[i]].Y);
                this.VertexBuffer.push(this.VertexArray[FaceData[i]].Z);
            }

            this.FaceCount = meshdata.getAttribute("count") / 3;

            if (this.LoadingComplete)
                this.LoadingComplete();
        }).bind(this);
    }
    LoadFromFile(url) {
        this.FileReader = new RestClass(url, "GET");
        this.FileReader.RequestFile("", this.ReaderComplete);
    }
    AddMeshData(xml, originalXml) {
        var faces = xml.getElementsByTagName("triangles");        
        
        if (faces.length == 0)
            faces = xml.getElementsByTagName("polylist");
        var mat = faces[0].getAttribute("material");
        var inputs = faces[0].getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            var semantic = inputs[i].getAttribute("semantic");
            switch (semantic) {
                case "VERTEX":
                    this._GetVertices(inputs[i].getAttribute("source"), originalXml);
                    break;
                case "NORMAL":
                    this._GetNormals(inputs[i].getAttribute("source"), originalXml)
                    break;
                case "TEXCOORD":
                    this._GetTextureCoords(inputs[i].getAttribute("source"), originalXml);
                    break;
            }
        }
    }
}