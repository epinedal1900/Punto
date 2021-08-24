import React from 'react';
import { Page, Document, StyleSheet, Font, Text } from '@react-pdf/renderer';
import { Dayjs } from 'dayjs';
import { DatosTablaPrendas } from '../../../types/types';
// import { colors } from '@material-ui/core';

Font.register({
  family: 'Lato',
  src: 'https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf',
});

Font.register({
  family: 'Lato Bold',
  src: 'https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf',
});

interface NotasProps {
  nombre: string;
  fecha: Dayjs;
  articulos: DatosTablaPrendas[];
}
const Notas = (props: NotasProps): JSX.Element => {
  const { nombre, fecha, articulos } = props;
  const alturaBaseCm = 8.7;
  const incrementoAlturaCm = 0.6;
  const cmApy = (cm: number) => {
    const py = -0.020259 * cm * cm + 29.6836 * cm - 27.3052;
    return `${py}px`;
  };
  const total = articulos.reduce((acc, cur) => {
    const precio = cur.Precio || 0;
    return acc + precio * cur.Cantidad;
  }, 0);

  const stylesObj: any = {
    page: {
      position: 'absolute',
    },
    dia: {
      position: 'absolute',
      left: '206px',
      top: '52px',
      fontSize: 11,
      fontFamily: 'Lato',
      // color: colors.red[600],
    },
    mes: {
      position: 'absolute',
      left: '236px',
      top: '52px',
      fontSize: 11,
      fontFamily: 'Lato',
      // color: colors.red[600],
    },
    año: {
      position: 'absolute',
      left: '266px',
      top: '52px',
      fontSize: 11,
      fontFamily: 'Lato',
      // color: colors.red[600],
    },
    total: {
      position: 'absolute',
      left: '272.73px',
      top: '490px',
      fontSize: 14,
      fontFamily: 'Lato Bold',
      // color: colors.red[600],
    },
    nombre: {
      position: 'absolute',
      left: '42.42px',
      top: '170px',
      fontSize: 18,
      fontFamily: 'Lato Bold',
      // color: colors.red[600],
    },
  };

  articulos.forEach((_articulo, i) => {
    const py = cmApy(alturaBaseCm + incrementoAlturaCm * i);
    stylesObj[`cantidad${i}`] = {
      position: 'absolute',
      left: '39.4px',
      top: py,
      fontSize: 13,
      fontFamily: 'Lato',
      // color: colors.red[600],
    };
    stylesObj[`descripcion${i}`] = {
      position: 'absolute',
      left: '103px',
      top: py,
      fontSize: 13,
      fontFamily: 'Lato',
      // color: colors.red[600],
    };
    stylesObj[`precio${i}`] = {
      position: 'absolute',
      left: '275.75x',
      top: py,
      fontSize: 13,
      fontFamily: 'Lato',
      // color: colors.red[600],
    };
    stylesObj[`importe${i}`] = {
      position: 'absolute',
      left: '340px',
      top: py,
      fontSize: 13,
      fontFamily: 'Lato',
      // color: colors.red[600],
    };
  });

  const styles = StyleSheet.create(stylesObj);

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <Text style={styles.dia}>{fecha.format('DD')}</Text>
        <Text style={styles.mes}>{fecha.format('MM')}</Text>
        <Text style={styles.año}>{fecha.format('YY')}</Text>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.total}>
          {Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(total)}
        </Text>
        {articulos.map((articulo, i) => (
          <>
            {articulo.Precio && (
              <>
                <Text style={styles[`cantidad${i}`]}>
                  {Intl.NumberFormat('en-US', {}).format(articulo.Cantidad)}
                </Text>
                <Text style={styles[`descripcion${i}`]}>{articulo.Nombre}</Text>
                <Text style={styles[`precio${i}`]}>
                  {Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(articulo.Precio)}
                </Text>
                <Text style={styles[`importe${i}`]}>
                  {Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(articulo.Precio * articulo.Cantidad)}
                </Text>
              </>
            )}
          </>
        ))}
      </Page>
    </Document>
  );
};

export default Notas;
