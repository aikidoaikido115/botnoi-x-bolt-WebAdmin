'use client';

import { useState } from 'react';
import { mockPromotions, mockServices } from '../../lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Plus, Edit, Trash2, Gift, Percent } from 'lucide-react';
import { Promotion } from '../../types';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountPercent: '',
    validFrom: '',
    validUntil: '',
    isActive: true,
    applicableServices: [] as string[]
  });

  const handleSubmit = () => {
    if (editingPromotion) {
      // TODO: Update promotion via API
      setPromotions(promotions.map(promotion => 
        promotion.id === editingPromotion.id 
          ? { 
              ...promotion, 
              ...formData, 
              discountPercent: parseInt(formData.discountPercent)
            }
          : promotion
      ));
    } else {
      // TODO: Create new promotion via API
      const newPromotion: Promotion = {
        id: Date.now().toString(),
        ...formData,
        discountPercent: parseInt(formData.discountPercent)
      };
      setPromotions([...promotions, newPromotion]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      discountPercent: '',
      validFrom: '',
      validUntil: '',
      isActive: true,
      applicableServices: []
    });
    setEditingPromotion(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description,
      discountPercent: promotion.discountPercent.toString(),
      validFrom: promotion.validFrom,
      validUntil: promotion.validUntil,
      isActive: promotion.isActive,
      applicableServices: promotion.applicableServices
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (promotionId: string) => {
    // TODO: Delete promotion via API
    setPromotions(promotions.filter(promotion => promotion.id !== promotionId));
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        applicableServices: [...formData.applicableServices, serviceId]
      });
    } else {
      setFormData({
        ...formData,
        applicableServices: formData.applicableServices.filter(id => id !== serviceId)
      });
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const validFrom = new Date(promotion.validFrom);
    const validUntil = new Date(promotion.validUntil);
    return promotion.isActive && now >= validFrom && now <= validUntil;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mt-6 font-bold">Promotions</h1>
          <p className="text-muted-foreground">
            Create and manage promotional offers
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPromotion(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
              </DialogTitle>
              <DialogDescription>
                {editingPromotion 
                  ? 'Update promotion details below.'
                  : 'Create a new promotional offer for your services.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="name">Promotion Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., 20% Off Hair Coloring"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the promotion"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discountPercent">Discount Percentage</Label>
                <div className="relative">
                  <Input
                    id="discountPercent"
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({...formData, discountPercent: e.target.value})}
                    placeholder="20"
                    min="0"
                    max="100"
                  />
                  <Percent className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Applicable Services</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
                  {mockServices.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={formData.applicableServices.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                      />
                      <Label
                        htmlFor={service.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {service.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Active Promotion</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingPromotion ? 'Update' : 'Create'} Promotion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <Card key={promotion.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">{promotion.name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(promotion)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(promotion.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={isPromotionActive(promotion) ? "default" : "secondary"}>
                  {isPromotionActive(promotion) ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline">
                  {promotion.discountPercent}% OFF
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {promotion.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Valid From:</span>
                  <span className="font-medium">
                    {new Date(promotion.validFrom).toLocaleDateString('th-TH')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Valid Until:</span>
                  <span className="font-medium">
                    {new Date(promotion.validUntil).toLocaleDateString('th-TH')}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium mb-1">Applicable Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {promotion.applicableServices.map((serviceId) => (
                      <Badge key={serviceId} variant="outline" className="text-xs">
                        {getServiceName(serviceId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}