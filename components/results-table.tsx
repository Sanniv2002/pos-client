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
  // Extract column headers dynamically from the first result
  const getColumnHeaders = () => {
    if (!results.length) return [];
    return Object.keys(results[0]).filter(key => key !== 'metadata' && key !== '__metadata__');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const copyRow = (result: any) => {
    const headers = getColumnHeaders();
    const rowText = headers.map(header => result[header] || '').join('\t');
    copyToClipboard(rowText);
  };

  const copyAllRows = () => {
    const headers = getColumnHeaders();
    const headerRow = headers.join('\t');
    const dataRows = results.map(result => 
      headers.map(header => result[header] || '').join('\t')
    ).join('\n');
    copyToClipboard(headerRow + '\n' + dataRows);
  };

  const downloadExcel = () => {
    const headers = getColumnHeaders();
    // Clean data by removing metadata and keeping only the language columns
    const cleanData = results.map(result => {
      const cleanRow: any = {};
      headers.forEach(header => {
        // Only include non-metadata columns
        if (header !== 'metadata' && header !== '__metadata__') {
          cleanRow[header] = result[header] || '';
        }
      });
      return cleanRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, `language-learning-results-${Date.now()}.xlsx`);
    toast.success('Excel file downloaded!');
  };

  if (!results.length && !isLoading) {
    return null;
  }

  const headers = getColumnHeaders();

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
        <ScrollArea className="h-full w-full">
          <div className="p-6 pt-0">
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-muted sticky top-0 z-10">
                    <tr>
                      {headers.map((header, index) => (
                        <th 
                          key={header} 
                          className="text-left p-3 font-medium whitespace-nowrap min-w-[200px] max-w-[400px]"
                        >
                          {header}
                        </th>
                      ))}
                      <th className="text-left p-3 font-medium w-20 sticky right-0 bg-muted">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr 
                        key={index} 
                        className="border-t hover:bg-muted/50 transition-colors animate-in fade-in duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {headers.map((header, headerIndex) => (
                          <td 
                            key={header} 
                            className={`p-3 min-w-[200px] max-w-[400px] ${
                              header.includes('Word') ? 'font-medium' : 'text-sm'
                            }`}
                          >
                            <div 
                              className={`${header.includes('Sentence') ? 'line-clamp-2' : 'truncate'}`} 
                              title={result[header] || ''}
                            >
                              {result[header] || ''}
                            </div>
                          </td>
                        ))}
                        <td className="p-3 sticky right-0 bg-background">
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}