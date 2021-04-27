// /* eslint-disable promise/always-return */
// /* eslint-disable no-var */
// /* eslint-disable vars-on-top */
// const { webContents } = require('electron');
// // console.log(process.versions.electron);

// // const { PosPrinter } = remote.require('electron-pos-printer');
// // const {PosPrinter} = require("electron-pos-printer"); //dont work in production (??)

// const path = require('path');

// // const webContents = remote.getCurrentWebContents();
// const printers = webContents.getPrinters(); // list the printers
// console.log(printers);

// const data = [
//   {
//     type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
//     value: '||---',
//     style: 'text-align:left;',
//     css: { 'font-size': '12px' },
//   },
//   {
//     type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
//     value: 'HEADER',
//     style: 'text-align:center;',
//     css: { 'font-weight': '700', 'font-size': '18px' },
//   },
//   {
//     type: 'image',
//     path: path.join(__dirname, 'assets/img_test.png'), // file path
//     position: 'center', // position of image: 'left' | 'center' | 'right'
//     width: 'auto', // width of image in px; default: auto
//     height: '60px', // width of image in px; default: 50 or '50px'
//   },
//   {
//     type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
//     value:
//       'Lorem ipsum<br><br> . , ; : ( ) - + = ! # % " \' <br><br> ã Ã ç Ç $ & @ ê Ê í Í<br><br> 0 1 2 3 4 5 6 7 8 9 <br>a b c d e f g h i j k l m n o p q r s t u v w x y z<br>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br><br><hr><br>elit, sed do eiusmod tempor <b>incididunt</b> ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation \n ullamco \n laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum<br>',

//     css: {
//       'font-size': '14px',
//       'font-family': 'sans-serif',
//       'text-align': 'center',
//     },
//   },
//   {
//     type: 'qrCode',
//     value:
//       'https://dark-garden-296622.ue.r.appspot.com/pagos/6054d20896a3fe000bc6ccfe',
//     height: 80,
//     width: 80,
//     style: 'margin-left:50px',
//   },
// ];

// function date() {
//   const x = new Date();

//   const y = `0${x.getHours()}`;
//   const z = `0${x.getMinutes()}`;
//   const s = `0${x.getSeconds()}`;
//   const h = `0${x.getDate()}`;
//   const ano = x.getFullYear().toString().substr(-2);
//   const ms = x.getMonth();
//   const meses = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'June',
//     'July',
//     'Aug',
//     'Sept',
//     'Oct',
//     'Nov',
//     'Dec',
//   ];

//   return `${y.substr(-2)}:${z.substr(-2)}:${s.substr(-2)} -  ${h.substr(-2)}/${
//     meses[ms]
//   }`;
// }

// function print() {
//   let printerName;
//   let widthPage;

//   const p = document.getElementsByName('printer');
//   const w = document.getElementsByName('width');

//   for (var i = 0, { length } = p; i < length; i++) {
//     if (p[i].checked) {
//       printerName = p[i].value;

//       break;
//     }
//   }

//   for (var i = 0, { length } = w; i < length; i++) {
//     if (w[i].checked) {
//       widthPage = w[i].value;

//       break;
//     }
//   }

//   console.log(printerName, widthPage);

//   const options = {
//     preview: false, // Preview in window or print
//     width: widthPage, //  width of content body
//     margin: '0 0 0 0', // margin of content body
//     copies: 1, // Number of copies to print
//     printerName, // printerName: string, check it at webContent.getPrinters()
//     timeOutPerLine: 400,
//     silent: true,
//   };

//   const now = {
//     type: 'text',
//     value: `${date()}`,
//     style: 'text-align:center;',
//     css: { 'font-size': '12px', 'font-family': 'sans-serif' },
//   };

//   const d = [...data, now];

//   // if (printerName && widthPage) {
//   //   PosPrinter.print(d, options)
//   //     .then(() => {})
//   //     .catch((error) => {
//   //       console.error(error);
//   //     });
//   // } else {
//   //   alert('Select the printer and the width');
//   // }
// }

// export default printers;
