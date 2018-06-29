//namespace = Valkyra || {}

class WebGLCrontrol {
    constructor(owner, parent) {
        this.Owner = owner;
        this.Parent = parent;
        this.CanvasElement = null;
        this.GLContext = null;
        this.Initialited = null;
        this.VertexBuffer = null;
        this.VertexPositionBuffer = null;
        this.VertexShader = null;
        this.FragShader = null;
        this.ShaderProg;
        this.mvMatrix = null;
        this.pMatrix = null;
    }

    Initialize() {
        this.mvMatrix = mat4.create();
        this.pMatrix = mat4.create();
        this.CanvasElement = document.createElement("canvas");        
        this.CanvasElement.setAttribute("style", "width: 1800px; height: 800px;")
        this.VertexShader = document.createElement("script");
        this.VertexShader.setAttribute("type", "x-shader/x-vertex");
        this.VertexShader.innerHTML = "attribute vec3 Position;" +
            "uniform mat4 u_ModelView;" +
            "uniform mat4 u_Persp;" +
            "void main(void){gl_Position = u_Persp * u_ModelView * vec4(Position, 1.0);}";
        document.head.appendChild(this.VertexShader);

        this.FragShader = document.createElement("script");
        this.FragShader.setAttribute("type", "x-shader/x-fragment");
        this.FragShader.innerHTML = "precision mediump float; void main(void){ gl_FragColor = vec4(0.9, 0.3, 0.6, 1.0);}";
        document.head.appendChild(this.FragShader);


        this.GLContext = this.CanvasElement.getContext("experimental-webgl");
        this.GLContext.clearColor(1.0, 1.0, 0.0, 1.0);
        this.GLContext.enable(this.GLContext.DEPTH_TEST)
        this.CanvasElement.width = 1800;
        this.CanvasElement.height = 800;
        this.GLContext.viewportWidth = 1800; //this.CanvasElement.width;
        this.GLContext.viewportHeight = 800; // this.CanvasElement.height;
        //this.GLContext.viewport(0, 0, 1920, 500);
        if (!this.GLContext)
            alert("WebGl not available");
        this.Parent.appendChild(this.CanvasElement);
    }

    SetVertexBuffer(vBuffer) {
        this.VertexBuffer = vBuffer;
    }

    InitBuffers() {
        this.VertexPositionBuffer = this.GLContext.createBuffer();
        this.GLContext.bindBuffer(this.GLContext.ARRAY_BUFFER, this.VertexPositionBuffer);

        this.GLContext.bufferData(this.GLContext.ARRAY_BUFFER, new Float32Array(this.VertexBuffer), this.GLContext.STATIC_DRAW);
        this.VertexPositionBuffer.itemSize = 3;
        this.VertexPositionBuffer.numItems = 36;
    }

    InitShaders() {
        var shader = this.GLContext.createShader(this.GLContext.VERTEX_SHADER);
        var vs = this.GLContext.shaderSource(shader, this.VertexShader.innerHTML);

        var shaderFrag = this.GLContext.createShader(this.GLContext.FRAGMENT_SHADER);
        var fg = this.GLContext.shaderSource(shaderFrag, this.FragShader.innerHTML);



        this.GLContext.compileShader(shader);
        this.GLContext.compileShader(shaderFrag);
        if(!this.GLContext.getShaderParameter(shader, this.GLContext.COMPILE_STATUS))
            alert(this.GLContext.getShaderInfoLog(shader));
        //var vs = this.GLContext.getShader(this.GLContext, "shader-vs");
        //this.GLContext.attachShader(this.ShaderProg, frag);

        this.ShaderProg = this.GLContext.createProgram();
        this.GLContext.attachShader(this.ShaderProg, shader);
        this.GLContext.attachShader(this.ShaderProg, shaderFrag);
        this.GLContext.linkProgram(this.ShaderProg);        
        if (!this.GLContext.getProgramParameter(this.ShaderProg, this.GLContext.LINK_STATUS))
            alert("no shaders");
        
        this.GLContext.useProgram(this.ShaderProg);

        this.ShaderProg.positionLocation = this.GLContext.getAttribLocation(this.ShaderProg, "Position");
        this.GLContext.enableVertexAttribArray(this.ShaderProg.positionLocation);

        this.ShaderProg.u_PerspLocation = this.GLContext.getUniformLocation(this.ShaderProg, "u_Persp");
        this.ShaderProg.u_ModelViewLocation = this.GLContext.getUniformLocation(this.ShaderProg, "u_ModelView");
    }

    Render() {

        this.GLContext.viewport(0, 0, this.GLContext.viewportWidth, this.GLContext.viewportHeight);
        this.GLContext.clear(this.GLContext.COLOR_BUFFER_BIT | this.GLContext.DEPTH_BUFFER_BIT);

        mat4.perspective(45, this.GLContext.viewportWidth / this.GLContext.viewportHeight, 0.1, 100.0, this.pMatrix);

        mat4.identity(this.mvMatrix);

        mat4.translate(this.mvMatrix, [0.0, 0.0, -7.0]);
        

        this.GLContext.bindBuffer(this.GLContext.ARRAY_BUFFER, this.VertexPositionBuffer);
        this.GLContext.vertexAttribPointer(this.ShaderProg.PositionLocation, this.VertexPositionBuffer.itemSize, this.GLContext.FLOAT, false, 0, 0);

        this.GLContext.uniformMatrix4fv(this.ShaderProg.u_PerspLocation, false, this.pMatrix);
        this.GLContext.uniformMatrix4fv(this.ShaderProg.u_ModelViewLocation, false, this.mvMatrix);
        
        this.GLContext.drawArrays(this.GLContext.TRIANGLES, 0, this.VertexPositionBuffer.numItems);
    }
}