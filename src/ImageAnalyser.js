import React from 'react';

export default class ImageAnalyser extends React.Component {

  constructor(props) {
    super(props);
    this.listOfColors = {
      red: [],
      orange:[],
      yellow: [],
      lime: [],
      green: [],
      mint: [],
      cyan: [],
      navy: [],
      blue: [],
      purple: [],
      magenta: [],
      pink: [],
      white: [],
      black: []
    }

    this.iterateThroughData = this.iterateThroughData.bind(this);
    this.rgbToHsl = this.rgbToHsl.bind(this);
  }

  componentDidUpdate(){
    console.log("componentDidUpdate " , this.props);
    this.iterateThroughData(this.props.fileData)
  }

  iterateThroughData(data) {
    var listOfHSLValues = [];

    for (var i = 0; i < data.length; i += 4) {
      var red = data[i];
      var green = data[i + 1];
      var blue = data[i + 2];
      var alpha = data[i + 3];

      var hsvValue = this.rgbToHsl([red, green, blue]);
      listOfHSLValues.push(hsvValue);
    }

    this.iterateListOfHSLValues(listOfHSLValues);
  }
  /*
  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1
      ? "0" + hex
      : hex;
  }

  mapRGBToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
  */

  rgbToHsl(c) {
    var r = c[0]/255
    var g = c[1]/255
    var b = c[2]/255;

    var max = Math.max(r, g, b)
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return new Array(h * 360, s * 100, l * 100);
  }

  iterateListOfHSLValues(listOfHSLValues){
    for (var i = 0; i < listOfHSLValues.length; i++) {
      var hue = listOfHSLValues[i][0];
      var saturation = listOfHSLValues[i][1];
      var lightness = listOfHSLValues[i][2];
      //console.log("hsl("+hue+","+saturation+"%,"+lightness+"%)");

      /*Start separating pixels into color spectrum by evaluating HSL(Hue, Saturation, Lightness)*/

      /*1.  rid of light and dark pixels*/
      if(lightness < 15 || lightness > 90 && saturation<20){
        /*Push white and black pixels they might be needed*/
        if(lightness<15){
          this.smartPush("white" , listOfHSLValues[i])
        }else if(lightness>90){
          this.smartPush("black" , listOfHSLValues[i])
        }
      }else{
        /*2. Map colors to spectrum based on their Hue value.*/
        this.handleHueSorting(hue, listOfHSLValues[i])
      }
    }
    /*3. Map colors in their spectrum based on their saturation and brightness.
     * For example dark orange color could be mapped to Brown and dark cyan to Teal
     *  */

    this.props.onImageAnalysed(this.listOfColors);
  }

  /*Push color to it's category */
  smartPush(whichColor, pixel){
    this.listOfColors[whichColor].push(pixel);
  }


  handleHueSorting(hue, currentPixel){
    /*Primary hues: Red, Green, and Blue.
     *Primary range: 360° / 3 = 120°/hue

     *Secondary Hues: Magenta, Yellow and  Cyan
     *Secondary range: 360° / 6 = 60°/hue
     *
     *Tertiary colors: Orange, Lime, Mint, Navy, Purple and Pink,
     *Tertiary range: 360° / 12 = 30°/hue
     *
     * Total range
     * 0<hue<30 = Red
     * 30<hue<60 = Orange
     * 60<hue<90 = Yellow
     * 90<hue<120 = Lime
     * 120<hue<150 = Green
     * 150<hue<180 = Mint
     * 180<hue<210 = Cyan
     * 210<hue<240 = Navy
     * 240<hue<270 = Blue
     * 270<hue<300 = Purple
     * 300<hue<330 = Magenta
     * 330<hue<360 = Pink
     *
     */

     if(0<hue&&hue<15){
       this.smartPush("red" , currentPixel)
     }
     else if(15<hue && hue<45){
       this.smartPush("orange" , currentPixel)
     }
     else if(45<hue&&hue<75){
       this.smartPush("yellow" , currentPixel)
     }
     else if(75<hue&&hue<105){
       this.smartPush("lime" , currentPixel)
     }
     else if(105<hue&&hue<135){   //120
       this.smartPush("green" , currentPixel)
     }
     else if(135<hue&&hue<165){
       this.smartPush("mint" , currentPixel)
     }
     else if(165<hue&&hue<195){
       this.smartPush("cyan" , currentPixel)
     }
     else if(195<hue&&hue<225){
       this.smartPush("navy" , currentPixel)
     }
     else if(225<hue&&hue<255){
       this.smartPush("blue" , currentPixel)
     }
     else if(255<hue&&hue<285){
       this.smartPush("purple" , currentPixel)
     }
     else if(285<hue&&hue<315){
       this.smartPush("magenta" , currentPixel)
     }
     else if(315<hue&&hue<345){
       this.smartPush("pink" , currentPixel)
     }
     else if(345<hue&&hue<360){
       this.smartPush("red" , currentPixel)
     }
  }

  render() {
    return (
      <div>
      <p>ImageAnalyser</p>
      </div>
    );
  }

}