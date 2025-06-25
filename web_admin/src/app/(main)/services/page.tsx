
'use client';

import { useState, useEffect } from 'react';

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

import { Plus, Edit, Trash2, Scissors } from 'lucide-react';
import { Service } from '../../types';

import {
  createService,
  getAllServices,
  updateService,
  deleteService,
} from '../../lib/api/services';

import { getLatestStore } from '../../lib/api/stores';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: '',
    prices: '',
    category: '',
    isActive: true,
    promotionPrice: ''
  });

  useEffect(() => {
    const fetchStoreIdAndServices = async () => {
      setErrorMessage(null);
      try {
        const store = await getLatestStore(); 
        if (store) {
          setStoreId(store.id);
          const data = await getAllServices(store.id);
          const validServices = data.filter(service => service !== null && service !== undefined);
          setServices(validServices);
        } else {
          setErrorMessage('Store not found');
        }
      } catch (error: any) {
        console.error('Error fetching services:', error);
        setErrorMessage(`Failed to load services: ${error.message || 'Unknown error occurred'}`);
      }
    };

    fetchStoreIdAndServices();
  }, []);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!storeId) {
      setErrorMessage('Store ID is not loaded');
      return;
    }

    try {
      if (editingService) {
        const updatedService = await updateService({
          service_id: editingService.id,
          title: formData.title,
          description: formData.description,
          duration_minutes: parseInt(formData.duration_minutes),
          prices: parseFloat(formData.prices),
        });

        setServices(services.map(service =>
          service && service.id === updatedService.id ? updatedService : service
        ).filter(service => service !== null) as Service[]);
      } else {
        const newService = await createService({
          title: formData.title,
          description: formData.description,
          duration_minutes: parseInt(formData.duration_minutes),
          prices: parseFloat(formData.prices),
          store_id: storeId,
        });

        setServices([...services, newService].filter(service => service !== null) as Service[]);
      }

      resetForm();
    } catch (error: any) {
      console.error('Error submitting service:', error);
      setErrorMessage(`Failed to save service: ${error.message || 'Unknown error occurred'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration_minutes: '',
      prices: '',
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
      title: service.title,
      description: service.description,
      duration_minutes: service.duration_minutes?.toString() || '',
      prices: service.prices?.toString() || '',
      category: service.category || '',
      isActive: service.isActive || true,
      promotionPrice: service.promotionPrice?.toString() || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    setErrorMessage(null);
    try {
      await deleteService(serviceId);
      setServices(services.filter(service => service && service.id !== serviceId).filter(service => service !== null) as Service[]);
    } catch (error: any) {
      console.error('Error deleting service:', error);
      setErrorMessage(`Failed to delete service: ${error.message || 'Unknown error occurred'}`);
    }
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
                <Label htmlFor="title">Service Name</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Hair Cut"
                  className='border-1 border-gray-200'
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the service"
                  className='border-1 border-gray-200'
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    placeholder="30"
                    className='border-1 border-gray-200'
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prices">Price (฿)</Label>
                  <Input
                    id="prices"
                    type="number"
                    value={formData.prices}
                    onChange={(e) => setFormData({ ...formData, prices: e.target.value })}
                    placeholder="150"
                    className='border-1 border-gray-200'
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })} >
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
                  onChange={(e) => setFormData({ ...formData, promotionPrice: e.target.value })}
                  placeholder="120"
                  className='border-1 border-gray-200'
                />
              </div>
              <div className="flex items-center space-x-2 bg-white">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked: any) => setFormData({ ...formData, isActive: checked })}
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

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
        </div>
      )}

      {services.length === 0 && !errorMessage ? (
        <div className="text-center text-muted-foreground py-10">
          <p>No services found. Please add a new service.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {services.map((service) => (
            // Add a check to ensure service is not null or undefined
            service && (
              <Card key={service.id} className="rounded-lg border-none  text-card-foreground shadow-sm relative bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Scissors className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg font-semibold">{service.title}</CardTitle>
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
                    {service.category && <Badge variant="secondary" className='bg-gray-200'>{service.category}</Badge>}
                    {service.isActive !== undefined && ( // Check if isActive has a value
                      <Badge className={service.isActive ? "bg-black text-white" : "bg-gray-100 text-black"} >
                        {service.isActive ? 'Active' : 'Inactive'} {/* Reverted to English text */}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Duration:</span>
                      <span className="text-sm font-medium">{service.duration_minutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Price:</span>
                      <div className="text-right">
                        {/* Add null-conditional checks for prices and promotionPrice */}
                        {service.promotionPrice ? (
                          <div>
                            <span className="text-sm font-medium text-green-600">
                              ฿{service.promotionPrice?.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground line-through ml-2">
                              ฿{service.prices?.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium">
                            ฿{service.prices?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}
    </div>
  );
}
