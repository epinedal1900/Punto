import dayjs from 'dayjs';

const crearTicketSinPrecioData = (infoPunto, articulos, fechaStr) => {
  let fecha;
  if (fecha) {
    fecha = `${dayjs().format('DD/MM/YYYY-HH:mm')}`;
  } else {
    fecha = `${dayjs(fechaStr).format('DD/MM/YYYY-HH:mm')}`;
  }
  const header = infoPunto + fecha;
  const NoDeArticulos = articulos.reduce((acc, cur) => {
    return acc + cur.cantidad;
  }, 0);
  const tableBody = articulos.map((r) => {
    const obj = [
      {
        type: 'text',
        value: r.cantidad,
        style: 'text-align:left;',
        css: {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },
      {
        type: 'text',
        value: r.articulo,
        style: 'text-align:left;',
        css: {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },
    ];
    return obj;
  });
  tableBody.push([
    {
      type: 'text',
      value: 'No. de prendas:',
      style: 'text-align:right;',
      css: {
        'font-size': '11px',
        'font-family': 'sans-serif',
      },
    },
    {
      type: 'text',
      value: NoDeArticulos,
      style: 'text-align:right;',
      css: {
        'font-size': '11px',
        'font-family': 'sans-serif',
      },
    },
  ]);
  const data = [
    {
      type: 'text',
      value: header,
      css: {
        'font-size': '14px',
        'font-family': 'sans-serif',
        'text-align': 'center',
      },
    },
    {
      type: 'table',
      style: 'border: 2px; text-align: left ',
      tableHeader: ['Cantidad', 'Prenda'],
      tableBody,
      tableHeaderStyle: 'background-color: white ; color: #000;',
      tableBodyStyle: 'border: 2px solid #ddd',
    },
  ];
  return data;
};

export default crearTicketSinPrecioData;
