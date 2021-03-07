import dayjs from 'dayjs';

// columns for react table

const makeColumns = (headers) => {
  return headers.map((column, i) => {
    const obj = {
      Header: column,
      accessor: column,
    };
    if (i === 0) {
      obj.width = 20;
    }
    if (['Cantidad', 'cantidad', 'Prendas'].includes(column)) {
      obj.Cell = ({ value }) =>
        value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (['Total', 'Precio', 'Balance', 'Monto', 'precio'].includes(column)) {
      obj.Cell = ({ value }) =>
        Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
    }
    if (['Registro', 'Fecha	', 'Fecha'].includes(column)) {
      obj.Cell = ({ value }) => dayjs(value).format('DD/MM/YYYY-HH:mm');
      obj.sortMethod = (a, b) => {
        const a1 = new Date(a).getTime();
        const b1 = new Date(b).getTime();
        if (a1 < b1) return 1;
        if (a1 > b1) return -1;
        return 0;
      };
    }
    if (column === 'Entrega') {
      obj.Cell = ({ value }) => dayjs(value).format('DD/MM/YYYY');
      obj.sortMethod = (a, b) => {
        const a1 = new Date(a).getTime();
        const b1 = new Date(b).getTime();
        if (a1 < b1) return 1;
        if (a1 > b1) return -1;
        return 0;
      };
    }
    return obj;
  });
};

export default makeColumns;
