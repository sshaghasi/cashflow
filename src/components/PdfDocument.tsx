import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DateStates } from '../types/interfaces';

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    padding: 10,
  },
  table: {
    width: 700,
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 1,
    borderRightWidth: 0,
    borderStyle: 'solid',
  },
  tableCellHeader: {
    width: 100,
    fontSize: 12,
    fontWeight: 500,
    color: '#2a2a2a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRightColor: '#bfbfbf',
    borderRightWidth: 1,
    textAlign: 'center',
  },
  tableCell: {
    width: 100,
    fontSize: 10,
    color: '#2a2a2a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRightColor: '#bfbfbf',
    borderRightWidth: 1,
    textAlign: 'center',
  },
  tableCellWide: {
    width: 100,
    textAlign: 'right',
  },
});


const PdfDocument: React.FC<{ dateStates: DateStates }> = ({ dateStates }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Date</Text>
            <Text style={styles.tableCellHeader}>Type</Text>
            <Text style={styles.tableCellHeader}>Source</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellWide]}>(+) Amount</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellWide]}>(-) Amount</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellWide]}>Net Cash Flow</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellWide]}>Cum. Cash Flow</Text>
          </View>
          {Object.entries(dateStates).map(([date, entry]) => {
            const transactions = [...entry.cashIn.map(item => ({...item, type: 'Cash-In'})), 
                                   ...entry.cashOut.map(item => ({...item, type: 'Cash-Out'}))];
            return transactions.map((transaction, index) => (
              <View key={`${transaction.type}-${date}-${index}`} style={styles.tableRow}>
                <Text style={styles.tableCell}>{index === 0 ? date : ''}</Text>
                <Text style={styles.tableCell}>{transaction.type}</Text>
                <Text style={styles.tableCell}>{transaction.source}</Text>
                <Text style={[styles.tableCell, styles.tableCellWide]}>
                  {transaction.type === 'Cash-In' ? `$${transaction.amount.toFixed(2)}` : ''}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellWide]}>
                  {transaction.type === 'Cash-Out' ? `($${transaction.amount.toFixed(2)})` : ''}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellWide]}></Text>
                <Text style={[styles.tableCell, styles.tableCellWide]}></Text>
              </View>
            )).concat(
              <View key={`summary-${date}`} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: 500 }]}></Text>  // Adjust this width if necessary
                <Text style={[styles.tableCell, styles.tableCellWide]}>{entry.netCashFlow.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.tableCellWide]}>{entry.cumulativeCashFlow.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;
