'use client';

import { useEffect, useState } from 'react';
import { mockServices } from '@/app/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/app/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';
import { Plus, Edit, Trash2, Scissors, Loader2 } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

interface Service {
    id: string,
    title: string,
    duration_minutes: number,
    prices: number,
    description: string,
    store_id: string
}

interface Store {
    id: string;
    store_name: string;
    created_at: string;
}



export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        duration_minutes: 0,
        prices: 0,
        description: '',
        store_id: '',
    });
    const API_BASE_URL ='https://mybooking.ngrok.pizza';
    const context = useBooking();
    const { store_id,setStore_id } = context;

    const handleSubmit = async () => {
        setSubmitting(true);
        
        try {
            if (editingService) {
                // Update existing service - use formData, not editingService
                const payload = {
                    service_id: editingService.id,
                    title: formData.title,
                    description: formData.description,
                    duration_minutes: formData.duration_minutes,
                    prices: formData.prices,
                    store_id: store_id,
                };

                const response = await fetch(`${API_BASE_URL}/services/edit`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || 'Failed to update service');
                }

                await fetchStore_Services();
                resetForm();

            } else {
                // Create new service
                const payload = {
                    title: formData.title,
                    duration_minutes: formData.duration_minutes,
                    prices: formData.prices,
                    description: formData.description,
                    store_id: store_id,
                };

                const response = await fetch(`${API_BASE_URL}/services/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || 'Failed to create service');
                }

                await fetchStore_Services();
                resetForm();
            }
        } catch (err) {
            console.error('Operation failed:', err);
            alert(`Failed to ${editingService ? 'update' : 'create'} service: ${err}`);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            id: '',
            title: '',
            duration_minutes: 0,
            prices: 0,
            description: '',
            store_id: '',
        });
        setEditingService(null);
        setIsAddDialogOpen(false);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            id: service.id,
            title: service.title, // Fixed: was using description instead of title
            duration_minutes: service.duration_minutes,
            prices: service.prices,
            description: service.description,
            store_id: service.store_id,
        });
        setIsAddDialogOpen(true);
    };

    const handleDelete = async (serviceId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/services/delete?service_id=${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to delete service');
            }

            // Remove from local state
            setServices(services.filter(service => service.id !== serviceId));
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete service');
        }
    };

    const fetchStore_Services = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/services/all?store_id=${store_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch services');
            }

            const data: Service[] = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching all services:', error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        const savedStoreId = localStorage.getItem('store_id');
        if (savedStoreId) {
            setStore_id(savedStoreId);
        }
    }, []);
    
    useEffect(() => {
        if (store_id) {
            fetchStore_Services();
        }
    }, [store_id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading services...</span>
            </div>
        );
    }

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
                        <Button onClick={() => setEditingService(null)} className='bg-black'>
                            <Plus className="mr-2 h-4 w-4 text-white" />
                            <p className='text-white'>Add Service</p>
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
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Service Name</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Hair Cut"
                                    className='border-gray-400 '
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the service"
                                    className='border-gray-400 '
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="duration">Duration (minutes)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={formData.duration_minutes || ''}
                                        onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) || 0 })}
                                        placeholder="30"
                                        className='border-gray-400 '
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price (฿)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.prices || ''}
                                        onChange={(e) => setFormData({ ...formData, prices: Number(e.target.value) || 0 })}
                                        placeholder="150"
                                        className='border-gray-400 '
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={resetForm} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={submitting} className='bg-black text-white'>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {editingService ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        {editingService ? 'Update' : 'Create'} Service
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <Card key={service.id} className="rounded-lg border-none  text-card-foreground shadow-sm relative bg-white">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                    <Scissors className="h-5 w-5 text-blue-600" />
                                    <CardTitle className="text-lg">{service.title}</CardTitle>
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
                                        <span className="text-sm font-medium">
                                            ฿{service.prices.toLocaleString()}
                                        </span>
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






// 'use client';

// import { useEffect, useState } from 'react';
// import { mockServices } from '@/app/lib/data';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
// import { Button } from '@/app/components/ui/button';
// import { Badge } from '@/app/components/ui/badge';
// import { Input } from '@/app/components/ui/input';
// import { Label } from '@/app/components/ui/label';
// import { Textarea } from '@/app/components/ui/textarea';
// import { Switch } from '@/app/components/ui/switch';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from '@/app/components/ui/dialog';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/app/components/ui/select';
// import { Plus, Edit, Trash2, Scissors } from 'lucide-react';
// import { useBooking } from '@/context/BookingContext';




// interface Service {
//     id: string,
//     title: string,
//     duration_minutes: number,
//     prices: number,
//     description: string,
//     store_id: string
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


// export default function ServicesPage() {
//     const [services, setServices] = useState<Service[]>([]);
//     const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//     const [editingService, setEditingService] = useState<Service | null>(null);
//     const [formData, setFormData] = useState({
//         id: '',
//         title: '',
//         duration_minutes: 0,
//         prices: 0,
//         description: '',
//         store_id: '',
//     });
//     const context = useBooking();
//     const { store_id } = context;

//     const handleSubmit = async () => {

//         if (editingService) {
//             const payload = {
//                 service_id: editingService.id,
//                 title: editingService.title,
//                 description: editingService.description,
//                 duration_minutes: editingService.duration_minutes,
//                 prices: editingService.prices,
//                 store_id: store_id,
//             };

//             try {
//                 const response = await fetch(`${API_BASE_URL}/services/edit`, {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(payload),
//                 });

//                 if (!response.ok) {
//                     const error = await response.json();
//                     throw new Error(error.detail || 'Failed to update service');
//                 }

//                 await fetchStore_Services();
//                 resetForm();

//             } catch (err) {
//                 console.error('Update failed:', err);
//                 alert('Failed to update service');
//             }

//         } else {
//             // if we create a new services we will use /services/create
//             const payload = {
//                 title: formData.title,
//                 duration_minutes: formData.duration_minutes,
//                 prices: formData.prices,
//                 description: formData.description,
//                 store_id: store_id, // comes from context
//             };

//             try {
//                 const response = await fetch(`${API_BASE_URL}/services/create`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(payload),
//                 });

//                 if (!response.ok) {
//                     const error = await response.json();
//                     throw new Error(error.detail || 'Failed to create service');
//                 }

//                 await fetchStore_Services();
//                 resetForm();
//             } catch (err) {
//                 console.error('Creation failed:', err);
//                 alert('Failed to create service');
//             }
//         }
//         resetForm();
//     };

//     const resetForm = () => {
//         setFormData({
//             id: '',
//             title: '',
//             duration_minutes: 0,
//             prices: 0,
//             description: '',
//             store_id: '',
//         });
//         setEditingService(null);
//         setIsAddDialogOpen(false);
//     };

//     const handleEdit = (service: Service) => {
//         setEditingService(service);
//         setFormData({
//             id: service.id,
//             title: service.description,
//             duration_minutes: service.duration_minutes,
//             prices: service.prices,
//             description: service.description,
//             store_id: service.store_id,
//         });
//         setIsAddDialogOpen(true);
//     };

//     const handleDelete = (serviceId: string) => {
//         // TODO: Delete service via API
//         setServices(services.filter(service => service.id !== serviceId));
//     };

//     const fetchStore_Services = async () => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/services/all?store_id=${store_id}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || 'Failed to fetch services');
//             }

//             const data: Service[] = await response.json();
//             setServices(data);
//             return;
//         } catch (error) {
//             console.error('Error fetching all services:', error);
//             throw error;
//         }
//     }


//     useEffect(() => {
//         fetchStore_Services();
//     }, []);

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-3xl font-bold">Services</h1>
//                     <p className="text-muted-foreground">
//                         Manage your services and pricing
//                     </p>
//                 </div>
//                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//                     <DialogTrigger asChild>
//                         <Button onClick={() => setEditingService(null)}>
//                             <Plus className="mr-2 h-4 w-4" />
//                             Add Service
//                         </Button>
//                     </DialogTrigger>
//                     <DialogContent className="sm:max-w-[425px]">
//                         <DialogHeader>
//                             <DialogTitle>
//                                 {editingService ? 'Edit Service' : 'Add New Service'}
//                             </DialogTitle>
//                             <DialogDescription>
//                                 {editingService
//                                     ? 'Update service details below.'
//                                     : 'Create a new service for your business.'
//                                 }
//                             </DialogDescription>
//                         </DialogHeader>
//                         <div className="grid gap-4 py-4">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="name">Service Name</Label>
//                                 <Input
//                                     id="title"
//                                     value={formData.title}
//                                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                                     placeholder="e.g., Hair Cut"
//                                 />
//                             </div>
//                             <div className="grid gap-2">
//                                 <Label htmlFor="description">Description</Label>
//                                 <Textarea
//                                     id="description"
//                                     value={formData.description}
//                                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                                     placeholder="Brief description of the service"
//                                 />
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="grid gap-2">
//                                     <Label htmlFor="duration">Duration (minutes)</Label>
//                                     <Input
//                                         id="duration"
//                                         type="number"
//                                         value={formData.duration_minutes}
//                                         onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
//                                         placeholder="30"
//                                     />
//                                 </div>
//                                 <div className="grid gap-2">
//                                     <Label htmlFor="price">Price (฿)</Label>
//                                     <Input
//                                         id="price"
//                                         type="number"
//                                         value={formData.prices}
//                                         onChange={(e) => setFormData({ ...formData, prices: Number(e.target.value) })}
//                                         placeholder="150"
//                                     />
//                                 </div>
//                             </div>

//                         </div>
//                         <DialogFooter>
//                             <Button variant="outline" onClick={resetForm}>
//                                 Cancel
//                             </Button>
//                             <Button onClick={handleSubmit}>
//                                 {editingService ? 'Update' : 'Create'} Service
//                             </Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {services.map((service) => (
//                     <Card key={service.id} className="relative">
//                         <CardHeader className="pb-3">
//                             <div className="flex items-start justify-between">
//                                 <div className="flex items-center space-x-2">
//                                     <Scissors className="h-5 w-5 text-blue-600" />
//                                     <CardTitle className="text-lg">{service.title}</CardTitle>
//                                 </div>
//                                 <div className="flex space-x-1">
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => handleEdit(service)}
//                                     >
//                                         <Edit className="h-4 w-4" />
//                                     </Button>
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => handleDelete(service.id)}
//                                     >
//                                         <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <p className="text-sm text-muted-foreground mb-4">
//                                 {service.description}
//                             </p>
//                             <div className="space-y-2">
//                                 <div className="flex justify-between">
//                                     <span className="text-sm">Duration:</span>
//                                     <span className="text-sm font-medium">{service.duration_minutes} min</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-sm">Price:</span>
//                                     <div className="text-right">
//                                         <span className="text-sm font-medium">
//                                             ฿{service.prices.toLocaleString()}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
// }