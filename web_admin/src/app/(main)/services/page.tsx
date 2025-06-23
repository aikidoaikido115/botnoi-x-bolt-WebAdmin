'use client';

import { useState } from 'react';
import { mockServices } from '../../lib/data';
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
import { Plus, Edit, Trash2, Scissors, ShoppingBag } from 'lucide-react';
import { Service } from '../../types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: '',
    isActive: true,
    promotionPrice: ''
  });

  const handleSubmit = () => {
    if (editingService) {
      // TODO: Update service via API
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { 
              ...service, 
              ...formData, 
              duration: parseInt(formData.duration),
              price: parseFloat(formData.price),
              promotionPrice: formData.promotionPrice ? parseFloat(formData.promotionPrice) : undefined
            }
          : service
      ));
    } else {
      // TODO: Create new service via API
      const newService: Service = {
        id: Date.now().toString(),
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        promotionPrice: formData.promotionPrice ? parseFloat(formData.promotionPrice) : undefined
      };
      setServices([...services, newService]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      price: '',
      category: '',
      isActive: true,
      promotionPrice: ''
    });
    setEditingService(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category,
      isActive: service.isActive,
      promotionPrice: service.promotionPrice?.toString() || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    // TODO: Delete service via API
    setServices(services.filter(service => service.id !== serviceId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage your services and pricing
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingService(null)} className='bg-black text-white hover:bg-gray-600 '>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
              <DialogDescription>
                {editingService 
                  ? 'Update service details below.'
                  : 'Create a new service for your business.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 ">
              <div className="grid gap-2" >
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Hair Cut"
                  className='border-1 border-gray-200'
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the service"
                  className='border-1 border-gray-200'
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="30"
                    className='border-1 border-gray-200'
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (฿)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="150"
                    className='border-1 border-gray-200'
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({...formData, category: value})} >
                  <SelectTrigger className='border-1 border-gray-200'>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className='bg-white border-1 border-gray-100'>
                    <SelectItem value="ผู้ชาย" className='hover:bg-gray-100'>ผู้ชาย</SelectItem>
                    <SelectItem value="ผู้หญิง" className='hover:bg-gray-100'>ผู้หญิง</SelectItem>
                    <SelectItem value="สีผม" className='hover:bg-gray-100'>สีผม</SelectItem>
                    <SelectItem value="ทรีทเมนต์" className='hover:bg-gray-100'>ทรีทเมนต์</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="promotionPrice">Promotion Price (฿) - Optional</Label>
                <Input
                  id="promotionPrice"
                  type="number"
                  value={formData.promotionPrice}
                  onChange={(e) => setFormData({...formData, promotionPrice: e.target.value})}
                  placeholder="120"
                  className='border-1 border-gray-200'
                />
              </div>
              <div className="flex items-center space-x-2 bg-white">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked: any) => setFormData({...formData, isActive: checked})}
            />
                <Label htmlFor="isActive">Active Service</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} color='white' className='bg-black text-white'>
                {editingService ? 'Update' : 'Create'} Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {services.map((service) => (
          <Card key={service.id} className="rounded-lg border-none  text-card-foreground shadow-sm relative bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className='bg-gray-200'>{service.category}</Badge>
                <Badge className={service.isActive ? "bg-black text-white" : "bg-gray-100 text-black"} >
                  {service.isActive ? 'Active' : 'Inactive'} 
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                {service.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Duration:</span>
                  <span className="text-sm font-medium">{service.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Price:</span>
                  <div className="text-right">
                    {service.promotionPrice ? (
                      <div>
                        <span className="text-sm font-medium text-green-600">
                          ฿{service.promotionPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground line-through ml-2">
                          ฿{service.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium">
                        ฿{service.price.toLocaleString()}
                      </span>
                    )}
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