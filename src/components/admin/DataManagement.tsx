import React, { useState } from 'react';
import { Trash2, AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface DataManagementProps {
  onClearAllData: () => void;
  totalArticles: number;
  totalAds: number;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  onClearAllData,
  totalArticles,
  totalAds
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [step, setStep] = useState(1);

  const CONFIRMATION_TEXT = 'DELETE ALL CONTENT';

  const handleInitiateClear = () => {
    setIsConfirming(true);
    setStep(1);
    setConfirmText('');
  };

  const handleConfirmStep = () => {
    if (step === 1 && confirmText === CONFIRMATION_TEXT) {
      setStep(2);
      setConfirmText('');
    } else if (step === 2 && confirmText === 'CONFIRM DELETE') {
      // Final confirmation
      if (window.confirm('This action cannot be undone. Are you absolutely sure you want to delete ALL content?')) {
        onClearAllData();
        setIsConfirming(false);
        setStep(1);
        setConfirmText('');
      }
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
    setStep(1);
    setConfirmText('');
  };

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center text-red-800 dark:text-red-200">
          <Shield className="w-5 h-5 mr-2" />
          Danger Zone - Data Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Data Summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Current Data Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">News Articles:</span>
                <span className="font-medium text-slate-900 dark:text-white">{totalArticles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Sponsored Ads:</span>
                <span className="font-medium text-slate-900 dark:text-white">{totalAds}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  ⚠️ CRITICAL WARNING
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• This action will permanently delete ALL news articles</li>
                  <li>• This action will permanently delete ALL sponsored content</li>
                  <li>• This action CANNOT be undone</li>
                  <li>• No backup will be created automatically</li>
                  <li>• The website will be empty after this operation</li>
                </ul>
              </div>
            </div>
          </div>

          {!isConfirming ? (
            <Button
              onClick={handleInitiateClear}
              variant="destructive"
              className="w-full"
              disabled={totalArticles === 0 && totalAds === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Content
            </Button>
          ) : (
            <div className="space-y-4">
              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Step 1: Type "{CONFIRMATION_TEXT}" to continue
                  </label>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={CONFIRMATION_TEXT}
                    className="font-mono"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    This must be typed exactly as shown above
                  </p>
                </div>
              )}

              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Step 2: Type "CONFIRM DELETE" to proceed with deletion
                  </label>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="CONFIRM DELETE"
                    className="font-mono"
                  />
                  <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                      ⚠️ Final Warning: You are about to delete {totalArticles} articles and {totalAds} ads permanently!
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={handleConfirmStep}
                  variant="destructive"
                  disabled={
                    (step === 1 && confirmText !== CONFIRMATION_TEXT) ||
                    (step === 2 && confirmText !== 'CONFIRM DELETE')
                  }
                  className="flex-1"
                >
                  {step === 1 ? 'Continue to Step 2' : 'DELETE ALL CONTENT'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};