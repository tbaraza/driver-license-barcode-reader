import React, {
  Component
} from 'react';
import Quagga from 'quagga';
import icon_barcode from '../../assets/icon_barcode.svg';
import styles from './Home.module.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _scannerIsRunning: false,
    };
    this.startScanner = this.startScanner.bind(this);
    this.startStopScanner = this.startStopScanner.bind(this);
  }

  state = {
    _scannerIsRunning: false,
  }

  componentDidMount() {
    this.startScanner()
  }

  startScanner() {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner-container'),
        constraints: {
          width: 480,
          height: 320,
          facingMode: "environment"
        },
      },
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
          "code_39_vin_reader",
          "codabar_reader",
          "upc_reader",
          "upc_e_reader",
          "i2of5_reader"
        ],
        debug: {
          showCanvas: true,
          showPatches: true,
          showFoundPatches: true,
          showSkeleton: true,
          showLabels: true,
          showPatchLabels: true,
          showRemainingPatchLabels: true,
          boxFromPatches: {
            showTransformed: true,
            showTransformedBox: true,
            showBB: true
          }
        }
      },

    }, function (err) {
      if (err) {
        alert(err);
        return
      }

      console.log("Initialization finished. Ready to start");
      Quagga.start();

      // Set flag to is running
      // this.setState({
      //   _scannerIsRunning: true,
      // });
    });

    // Quagga.decodeSingle({
    //   decoder: {
    //     readers: ["code_128_reader"] // List of active readers
    //   },
    //   locate: true, // try to locate the barcode in the image
    //   // You can set the path to the image in your server
    //   // or using it's base64 data URI representation data:image/jpg;base64, + data
    //   src: '../../assets/icon_barcode.svg'
    // }, function (result) {
    //   if (result.codeResult) {
    //     console.log("result", result.codeResult.code);
    //   } else {
    //     console.log("not detected");
    //   }
    // });

    Quagga.onProcessed(function (result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
          result.boxes.filter(function (box) {
            return box !== result.box;
          }).forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, {
              x: 0,
              y: 1
            }, drawingCtx, {
              color: "green",
              lineWidth: 2
            });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, {
            x: 0,
            y: 1
          }, drawingCtx, {
            color: "#00F",
            lineWidth: 2
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, {
            x: 'x',
            y: 'y'
          }, drawingCtx, {
            color: 'red',
            lineWidth: 3
          });
        }
      }
    });


    Quagga.onDetected(function (result) {
      alert("Barcode detected and processed : [" + result.codeResult.code + "]", result);
    });
  }

  startStopScanner() {
    if (this.state._scannerIsRunning) {
      Quagga.stop();
    } else {
      this.startScanner();
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <img src={icon_barcode} className={styles.logo} alt="logo" />
          <h2>
            Driver's License BarCode Reader
          </h2>
            <div id="scanner-container"></div>
            <input type="button" id="btn" value="Start/Stop the scanner" onClick={this.startStopScanner} />
            {/* <input type="button" id="btn" value="Scan image" onClick={this.startImageScanner} /> */}
        </header>
      </div>
    );
  }
}

export default Home;