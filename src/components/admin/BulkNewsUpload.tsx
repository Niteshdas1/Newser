import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { NewsArticle } from '../../types';

interface BulkNewsUploadProps {
  onUploadNews: (articles: NewsArticle[]) => void;
}

export const BulkNewsUpload: React.FC<BulkNewsUploadProps> = ({ onUploadNews }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  const downloadTemplate = () => {
    const template = `title,excerpt,content,category,image,author,readTime,featured
"Breaking News: Technology Advancement","Short description of the news","Full content of the news article goes here. This should be detailed and informative.","technology_ai","https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg","John Doe","5 min read","true"
"Market Update: Crypto Trends","Brief overview of market changes","Detailed analysis of cryptocurrency market trends and predictions for the future.","finance_crypto","https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg","Jane Smith","7 min read","false"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'news_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n');
    const result: string[][] = [];
    
    for (let line of lines) {
      if (line.trim() === '') continue;
      
      const row: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      row.push(current.trim());
      result.push(row);
    }
    
    return result;
  };

  const validateRow = (row: string[], headers: string[]): string[] => {
    const errors: string[] = [];
    const requiredFields = ['title', 'excerpt', 'content', 'category', 'image', 'author', 'readTime'];
    
    requiredFields.forEach(field => {
      const index = headers.indexOf(field);
      if (index === -1) {
        errors.push(`Missing required column: ${field}`);
      } else if (!row[index] || row[index].trim() === '') {
        errors.push(`Missing value for ${field}`);
      }
    });

    // Validate category
    const categoryIndex = headers.indexOf('category');
    if (categoryIndex !== -1 && row[categoryIndex]) {
      const validCategories = ['finance_crypto', 'technology_ai', 'health_wellness', 'green_tech', 'regional'];
      if (!validCategories.includes(row[categoryIndex])) {
        errors.push(`Invalid category: ${row[categoryIndex]}. Must be one of: ${validCategories.join(', ')}`);
      }
    }

    // Validate image URL
    const imageIndex = headers.indexOf('image');
    if (imageIndex !== -1 && row[imageIndex]) {
      try {
        new URL(row[imageIndex]);
      } catch {
        errors.push(`Invalid image URL: ${row[imageIndex]}`);
      }
    }

    // Validate featured field
    const featuredIndex = headers.indexOf('featured');
    if (featuredIndex !== -1 && row[featuredIndex]) {
      const featured = row[featuredIndex].toLowerCase();
      if (featured !== 'true' && featured !== 'false') {
        errors.push(`Featured field must be 'true' or 'false', got: ${row[featuredIndex]}`);
      }
    }

    return errors;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'csv') {
      alert('Please upload a CSV file. Excel files (.xlsx) should be saved as CSV first.');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error('File must contain at least a header row and one data row');
      }

      const headers = rows[0].map(h => h.replace(/"/g, '').trim());
      const dataRows = rows.slice(1);
      
      const articles: NewsArticle[] = [];
      const errors: string[] = [];

      dataRows.forEach((row, index) => {
        const cleanRow = row.map(cell => cell.replace(/"/g, '').trim());
        const rowErrors = validateRow(cleanRow, headers);
        
        if (rowErrors.length > 0) {
          errors.push(`Row ${index + 2}: ${rowErrors.join(', ')}`);
        } else {
          const article: NewsArticle = {
            id: Date.now().toString() + index,
            title: cleanRow[headers.indexOf('title')],
            excerpt: cleanRow[headers.indexOf('excerpt')],
            content: cleanRow[headers.indexOf('content')],
            category: cleanRow[headers.indexOf('category')],
            image: cleanRow[headers.indexOf('image')],
            author: cleanRow[headers.indexOf('author')],
            readTime: cleanRow[headers.indexOf('readTime')],
            featured: cleanRow[headers.indexOf('featured')]?.toLowerCase() === 'true',
            publishedDate: new Date().toISOString().split('T')[0]
          };
          articles.push(article);
        }
      });

      if (articles.length > 0) {
        onUploadNews(articles);
      }

      setUploadResult({
        success: articles.length,
        errors
      });

    } catch (error) {
      setUploadResult({
        success: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900 dark:text-white">
          <Upload className="w-5 h-5 mr-2" />
          Bulk News Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            CSV Upload Instructions
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p><strong>Required Columns:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code>title</code> - Article headline</li>
              <li><code>excerpt</code> - Short description/summary</li>
              <li><code>content</code> - Full article content</li>
              <li><code>category</code> - Must be one of: finance_crypto, technology_ai, health_wellness, green_tech, regional</li>
              <li><code>image</code> - Valid image URL (https://...)</li>
              <li><code>author</code> - Author name</li>
              <li><code>readTime</code> - Reading time (e.g., "5 min read")</li>
              <li><code>featured</code> - true or false (optional, defaults to false)</li>
            </ul>
            <p className="mt-3"><strong>Important Notes:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Use CSV format only (save Excel files as CSV)</li>
              <li>Wrap text containing commas in double quotes</li>
              <li>First row must contain column headers</li>
              <li>All URLs must be valid and accessible</li>
            </ul>
          </div>
        </div>

        {/* Template Download */}
        <div className="mb-6">
          <Button onClick={downloadTemplate} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download CSV Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Upload CSV File
          </label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
            <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Processing...' : 'Choose CSV File'}
            </label>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Select a CSV file containing news articles
            </p>
          </div>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <div className="space-y-4">
            {uploadResult.success > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Successfully uploaded {uploadResult.success} articles
                  </span>
                </div>
              </div>
            )}

            {uploadResult.errors.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      Upload Errors ({uploadResult.errors.length})
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      {uploadResult.errors.map((error, index) => (
                        <li key={index} className="list-disc list-inside">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};