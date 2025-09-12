import React, { useState } from 'react';
import { DollarSign, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { SponsoredAd } from '../../types';

interface SponsoredContentManagerProps {
  sponsoredAds: SponsoredAd[];
  onUpdateAds: (ads: SponsoredAd[]) => void;
}

export const SponsoredContentManager: React.FC<SponsoredContentManagerProps> = ({
  sponsoredAds,
  onUpdateAds
}) => {
  const [editingAd, setEditingAd] = useState<SponsoredAd | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: ''
    });
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setEditingAd(null);
    resetForm();
  };

  const handleEdit = (ad: SponsoredAd) => {
    setEditingAd(ad);
    setIsAddingNew(false);
    setFormData({
      title: ad.title,
      description: ad.description,
      image: ad.image,
      link: ad.link
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.image) {
      alert('Please fill in all required fields');
      return;
    }

    if (isAddingNew) {
      const newAd: SponsoredAd = {
        id: Date.now().toString(),
        ...formData
      };
      onUpdateAds([...sponsoredAds, newAd]);
    } else if (editingAd) {
      const updatedAds = sponsoredAds.map(ad =>
        ad.id === editingAd.id ? { ...ad, ...formData } : ad
      );
      onUpdateAds(updatedAds);
    }

    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sponsored content?')) {
      const updatedAds = sponsoredAds.filter(ad => ad.id !== id);
      onUpdateAds(updatedAds);
    }
  };

  const handleCancel = () => {
    setEditingAd(null);
    setIsAddingNew(false);
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-slate-900 dark:text-white">
            <DollarSign className="w-5 h-5 mr-2" />
            Sponsored Content Manager
          </CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add New Ad
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add/Edit Form */}
        {(isAddingNew || editingAd) && (
          <Card className="mb-6 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                {isAddingNew ? 'Add New Sponsored Content' : 'Edit Sponsored Content'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter ad title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter ad description"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Image URL *
                  </label>
                  <Input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Enter image URL"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Link URL
                  </label>
                  <Input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="Enter destination URL (optional)"
                  />
                </div>

                {/* Preview */}
                {formData.image && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Preview
                    </label>
                    <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700">
                      <img
                        src={formData.image}
                        alt={formData.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                      <h3 className="font-semibold text-slate-900 dark:text-white">{formData.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{formData.description}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Ads List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Current Sponsored Content ({sponsoredAds.length})
          </h3>
          
          {sponsoredAds.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No sponsored content available. Add your first ad above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsoredAds.map((ad) => (
                <Card key={ad.id} className="hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{ad.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {ad.description}
                    </p>
                    {ad.link && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-3 truncate">
                        Link: {ad.link}
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(ad)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(ad.id)}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};