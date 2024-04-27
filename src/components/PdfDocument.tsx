import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DateStates } from '../types/interfaces';

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    padding: 40, // Add padding to create margins on all sides
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center', // Center the table horizontally
    width: '100%', // Ensure the container takes full width of the page
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
    width: 120, // Width adjusted for wider cells
    textAlign: 'center',
  },
});

interface Transaction {
  id: string;
  type?: 'Cash-In' | 'Cash-Out';
  source: string;
  amount: number;
}

interface DateStateEntry {
  cashIn: Transaction[];
  cashOut: Transaction[];
  netCashFlow: number;
  cumulativeCashFlow: number;
}

interface TransactionRow {
  date: string;
  transaction: Transaction;
  index: number;
}

interface PdfDocumentProps {
  dateStates: DateStates;
}

interface TableRow {
  date: string;
  transaction: Transaction | SummaryTransaction; // Transaction or a specific type for the summary
  isFirst: boolean;
}

interface SummaryTransaction {
  type: 'Summary';
  source?: string;  // Assuming source might be optional for summary
  amount: number;
  cumulative: number;
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ dateStates }) => {
  const pages: TableRow[][] = [];
  let currentRows: TableRow[] = [];
  let count = 1;  // Start count at 1 to account for the header row

  Object.entries(dateStates).forEach(([date, entry]) => {
    // Skip dates with no entries
    if (entry.cashIn.length === 0 && entry.cashOut.length === 0) return;

    const transactions = [...entry.cashIn.map(item => ({...item, type: 'Cash-In'} as Transaction)), 
                           ...entry.cashOut.map(item => ({...item, type: 'Cash-Out'} as Transaction))];

    transactions.forEach((transaction, index) => {
      if (count >= 14) {  // Max 14 transaction rows per page to allow one summary row
        pages.push(currentRows);
        currentRows = [];
        count = 1;
      }

      currentRows.push({ date, transaction, isFirst: index === 0 });
      count++;
    });

    // Add a summary row
    if (count >= 14) {
      pages.push(currentRows);
      currentRows = [];
      count = 1;
    }
    const summary: SummaryTransaction = {
      type: 'Summary',  // Not displayed but used for logical differentiation
      amount: entry.netCashFlow,
      cumulative: entry.cumulativeCashFlow
    };
    currentRows.push({ date, transaction: summary, isFirst: false });
    count++;
  });

  if (currentRows.length > 0) {
    pages.push(currentRows);
  }

  return (
    <Document>
      {pages.map((pageRows, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page} orientation="landscape">
          <View style={styles.tableContainer}>
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
              {pageRows.map(({ date, transaction, isFirst }, index) => (
                <View key={`${transaction.type}-${date}-${index}`} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{isFirst ? date : ''}</Text>
                  <Text style={styles.tableCell}>{transaction.type !== 'Summary' ? transaction.type : ''}</Text>
                  <Text style={styles.tableCell}>{transaction.source || ''}</Text>
                  <Text style={[styles.tableCell, styles.tableCellWide]}>
                    {transaction.type === 'Cash-In' ? `$${transaction.amount.toFixed(2)}` : ''}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellWide]}>
                    {transaction.type === 'Cash-Out' ? `($${transaction.amount.toFixed(2)})` : ''}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellWide]}>
                    {transaction.type === 'Summary' ? transaction.amount.toFixed(2) : ''}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellWide]}>
                    {transaction.type === 'Summary' ? transaction.cumulative.toFixed(2) : ''}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PdfDocument;