class StaticMesh extends Actor {
    constructor() {
        super.Actor();
        this.VertexBuffer = [];
        this.TextureBuffer = [];
        this.ColorBuffer = [];
        this.FileReader = null;
        this.FaceCount = 0;
        this.LoadingComplete = null;
        this.VertexArray = [];


        function GetVertices(source, file) {
            var source = file.getElementById(source);
        }
        function GetTextureCoords(source, file) {

        }
        function GetNormals(source, file) {

        }

        this.ReaderComplete = (function (result) {
            
            var xml = (new DOMParser()).parseFromString(result, "text/xml");
            var faces = xml.getElementsByTagName("triangles");
            if (faces.length == 0)
                faces = xml.getElementsByTagName("polylist");
            var inputs = faces[0].getElementsByTagName("input");
            for (var i = 0; i < inputs.length; i++) {
                var semantic = inputs[i].getAttribute("semantic");
                switch (semantic) {
                    case "VERTEX":
                        //alert("semantic VERTEX: source = " + inputs[i].getAttribute("source"));
                        GetVertices(inputs[i].getAttribute("source"), xml);
                        break;
                    case "NORMAL":
                        alert("semantic NORMAL")
                        break;
                    case "TEXCOORD":
                        alert("semantic TEXTCOORD")
                        GetTextureCoords(inputs[i], xml);
                        break;
                }
            }














            this.TextureBuffer = xml.getElementById("Cube_002-mesh-map-0-array").innerHTML.split(" ");
            var meshdata = xml.getElementById("Cube_002-mesh-positions-array");
            var v = meshdata.innerHTML.split(" ");
            var FaceData = xml.getElementsByTagName("p")[0].innerHTML.split(" ");
            for (var i = 0; i < v.length; i += 3) {
                var vtx = new Vertex(v[i], v[i + 1], v[i + 2]);
                this.VertexArray.push(vtx);
            }
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

    LoadTest() {
        this.VertexBuffer.push(0.0);
        this.VertexBuffer.push(1.0);
        this.VertexBuffer.push(0.0);

        this.VertexBuffer.push(-1.0);
        this.VertexBuffer.push(-1.0);
        this.VertexBuffer.push(0.0);

        this.VertexBuffer.push(1.0);
        this.VertexBuffer.push(-1.0);
        this.VertexBuffer.push(0.0);

        return this.VertexBuffer;
    }

}