import dayjs from 'dayjs';

const crearTicketData = (
  infoPunto,
  articulos,
  cliente,
  cantidadPagada,
  cambio,
  fechaStr
) => {
  let fecha;
  if (fecha) {
    fecha = `${dayjs().format('DD/MM/YYYY-HH:mm')}`;
  } else {
    fecha = `${dayjs(fechaStr).format('DD/MM/YYYY-HH:mm')}`;
  }
  let header = infoPunto + fecha;
  if (cliente) {
    header += `<br> ${cliente}`;
  }
  const total = articulos.reduce((acc, cur) => {
    return acc + cur.precio * cur.cantidad;
  }, 0);
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
      {
        type: 'text',
        value: Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(r.precio),
        style: 'text-align:left;',
        css: {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },

      {
        type: 'text',
        value: Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(r.precio * r.cantidad),
        style: 'text-align:left;',
        css: {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },
    ];
    return obj;
  });
  tableBody.push(
    [
      {
        type: 'text',
        value: '',
        style: 'text-align:left;',
        css: {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },
      {
        type: 'text',
        value: '',
        style: 'text-align:left;',
        css: {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },
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
    ],
    [
      {
        type: 'text',
        value: '',
        style: 'text-align:left;',
        css: {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },
      {
        type: 'text',
        value: '',
        style: 'text-align:left;',
        css: {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },
      {
        type: 'text',
        value: 'Total:',
        style: 'text-align:right;',
        css: {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },
      {
        type: 'text',
        value: Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(total),
        style: 'text-align:right;',
        css: {
          'font-weight': '800',
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
      },
    ]
  );
  if (cantidadPagada && !cliente) {
    tableBody.push(
      [
        {
          type: 'text',
          value: '',
          style: 'text-align:left;',
          css: {
            'font-size': '11px',
            'font-family': 'sans-serif',
          },
        },
        {
          type: 'text',
          value: '',
          style: 'text-align:left;',
          css: {
            'font-size': '11px',
            'font-family': 'sans-serif',
          },
        },
        {
          type: 'text',
          value: 'Pago:',
          style: 'text-align:right;',
          css: {
            'font-size': '11px',
            'font-family': 'sans-serif',
          },
        },
        {
          type: 'text',
          value: Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(cantidadPagada),
          style: 'text-align:right;',
          css: {
            'font-size': '11px',
            'font-family': 'sans-serif',
          },
        },
      ],
      [
        {
          type: 'text',
          value: '',
          style: 'text-align:left;',
          css: {
            'font-size': '11px',
            'font-family': 'sans-serif',
          },
        },
        {
          type: 'text',
          value: '',
          style: 'text-align:left;',
          css: {
            'font-size': '11px',
            'font-family': 'sans-serif',
          },
        },
        {
          type: 'text',
          value: 'Cambio:',
          style: 'text-align:right;',
          css: {
            'font-size': '11px',
            'font-family': 'sans-serif',
          },
        },
        {
          type: 'text',
          value: cambio,
          style: 'text-align:right;',
          css: {
            'font-size': '11px',
            'font-family': 'sans-serif',
          },
        },
      ]
    );
  }
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
      style: 'border: 1px; text-align: left ',
      tableHeader: ['Cant.', 'Prenda', 'Precio', 'Importe'],
      tableBody,
      tableHeaderStyle: 'background-color: white ; color: #000;',
      tableBodyStyle: 'border: 2px solid #ddd',
    },
    {
      type: 'text',
      value: 'Gracias por su compra!<br><br>',
      css: {
        'font-size': '14px',
        'font-family': 'sans-serif',
        'text-align': 'center',
      },
    },
  ];
  return data;
};

export default crearTicketData;
