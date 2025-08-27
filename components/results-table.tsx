'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ResultItem } from '@/lib/api';
import { toast } from 'sonner';
import { Copy, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ResultsTableProps {
  results: any[];
  count: number;
  targetCount: number;
  isLoading: boolean;
}

export function ResultsTable({ results, count, targetCount, isLoading }: ResultsTableProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const copyRow = (result: ResultItem) => {
    const rowText = `${result['Word (Hindi)']}\t${result['Word (English)']}\t${result['Sentence (Hindi)']}\t${result['Sentence (English)']}`;
    copyToClipboard(rowText);
  };

  const copyAllRows = () => {
    const allRowsText = results
      .map(result => `${result['Word (Hindi)']}\t${result['Word (English)']}\t${result['Sentence (Hindi)']}\t${result['Sentence (English)']}`)
      .join('\n');
    copyToClipboard('Word (Hindi)\tWord (English)\tSentence (Hindi)\tSentence (English)\n' + allRowsText);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'language-learning-results.xlsx');
    toast.success('Excel file downloaded!');
  };

  if (!results.length && !isLoading) {
    return null;
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>Results</span>
            <Badge variant="secondary" className="ml-2">
              {count}/{targetCount}
            </Badge>
            {isLoading && (
              <Badge variant="outline" className="animate-pulse">
                Generating...
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllRows}
              disabled={!results.length}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadExcel}
              disabled={!results.length}
            >
              <Download className="h-4 w-4 mr-1" />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-6 pt-0">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Word (Hindi)</th>
                    <th className="text-left p-3 font-medium">Word (English)</th>
                    <th className="text-left p-3 font-medium">Sentence (Hindi)</th>
                    <th className="text-left p-3 font-medium">Sentence (English)</th>
                    <th className="text-left p-3 font-medium w-20">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr 
                      key={index} 
                      className="border-t hover:bg-muted/50 transition-colors animate-in fade-in duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="p-3 font-medium">{result['Word (Hindi)']}</td>
                      <td className="p-3">{result['Word (English)']}</td>
                      <td className="p-3 text-sm">{result['Sentence (Hindi)']}</td>
                      <td className="p-3 text-sm">{result['Sentence (English)']}</td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyRow(result)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}