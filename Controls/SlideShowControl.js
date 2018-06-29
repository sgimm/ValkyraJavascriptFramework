class SlideShowControl {
    constructor(owner, parent) {
        this.Owner = owner;
        this.Parent = parent;
        this.Classname = "SlideShowControl";
        this.SlideShowContainer = null;   
        this.ImageContainer = null;
        this.TitleDiv = null;
        this.Title = "";
        this.SlideShowElements = [];
        this.CircleContainer = null;
        this.ButtonNext = null;
        this.ButtonPrev = null;
        this.LeftArrow = null;
        this.RightArrow = null;
        this.ItemCount = 0;
        this.ImageIndex = 0;
        this.FadeInStyle = null;

        this.Switch = (function (e) {
            switch (e.srcElement.id) {
                case "ImageSlider.NextButton":
                    this.ImageIndex++;
                    if (this.ImageIndex > this.SlideShowElements.length - 1)
                        this.ImageIndex = 0;
                    break;
                case "ImageSlider.PrevButton":
                    this.ImageIndex--;
                    if (this.ImageIndex < 0)
                        this.ImageIndex = this.SlideShowElements.length - 1;
                    break;
            }

            this.SetImageItem(this.ImageIndex); 
        }).bind(this);

    }
    Initialize() {

        this.FadeInStyle = document.createElement("style");
        this.FadeInStyle.innerHTML = ".FadeInClass { animation: fadein 2s; position: absolute; height: 500px; width: 100% } @keyframes fadein { from {opacity: 0;} to {opacity: 1}}";

        document.head.appendChild(this.FadeInStyle);

        this.SlideShowContainer = document.createElement("div");
        this.SlideShowContainer.setAttribute("id", this.Classname + "Container");
        this.SlideShowContainer.setAttribute("style", "width: 100%; height: 500px; background: #AAAA00");
        this.ImageContainer = document.createElement("img")
            ;
        this.Parent.appendChild(this.SlideShowContainer);

        this.ButtonNext = document.createElement("div");
        this.ButtonNext.setAttribute("style", "width: 30px; height:500px; background: #880000; float: right; opacity: 0.5; justify-content: center; flex-direction: column; display: flex;");        
        this.ButtonNext.setAttribute("id", "ImageSlider.NextButton");
        this.ButtonNext.addEventListener("mouseover", this.setMouseOverstyle);
        this.ButtonNext.addEventListener("mousedown", this.Switch);

        this.ButtonPrev = document.createElement("div");
        
        this.ButtonPrev.setAttribute("id", "ImageSlider.PrevButton");
        this.ButtonPrev.addEventListener("mouseover", this.setMouseOverstyle);
        this.ButtonPrev.addEventListener("mousedown", this.Switch);

        this.LeftArrow = document.createElement("div");
        this.LeftArrow.setAttribute("style", "width: 0px; height:0px; border-top: 60px solid transparent; border-bottom: 60px solid transparent; border-left: 30px solid");
        this.ButtonNext.appendChild(this.LeftArrow);

        this.ButtonPrev.setAttribute("style", "width: 30px; height:500px; background: #880000; float: left; opacity: 0.5; justify-content: center; flex-direction: column; display: flex; position: absolute;");
        this.RightArrow = document.createElement("div");
        this.RightArrow.setAttribute("style", "width: 0px; height:0px; border-top: 60px solid transparent; border-bottom: 60px solid transparent; border-right: 30px solid");
        this.ButtonPrev.appendChild(this.RightArrow);

        this.CircleContainer = document.createElement("div");
        this.CircleContainer.setAttribute("style", "position: absolute; background: #FFFF00; width: 100px; height: 10px;");



        
        this.SlideShowContainer.appendChild(this.ImageContainer);
        this.SlideShowContainer.appendChild(this.ButtonNext);
        this.SlideShowContainer.appendChild(this.ButtonPrev);
        this.SlideShowContainer.appendChild(this.CircleContainer);
    }
    AddSlideShowElement(imageurl, Text) {
        this.SlideShowElements.push(new SlideShowElement(this, imageurl, Text, this.ItemCount));
        this.ImageContainer.setAttribute("src", this.SlideShowElements[0].Image)
       // this.ImageContainer.setAttribute("style", "width:100%; height:500px; position:absolute;")        
        this.ImageContainer.setAttribute("class", "FadeInClass");
        this.ItemCount++;
    }

    SetImageItem(index) {
        this.ImageContainer.setAttribute("src", this.SlideShowElements[this.ImageIndex].Image)
        this.ImageContainer.classList.remove("FadeInClass");
        void this.ImageContainer.offsetWidth;
        this.ImageContainer.classList.add("FadeInClass");
        
    }

    setMouseOverstyle() {
    }


}

class SlideShowElement {
    constructor(owner, imageurl, text, index) {
        this.Owner = owner;
        this.Image = imageurl;
        this.Text = text;
        this.Index = 0;
    }
}