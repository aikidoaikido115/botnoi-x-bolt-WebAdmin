'use client';
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Menu, User, Settings as SettingsIcon, X, LogOut } from 'lucide-react';
import { NotificationDropdown } from '@/app/components/ui/notifications-dropdown'
// Types
interface ButtonProps {
    children: ReactNode;
    variant?: 'ghost' | 'default';
    size?: 'icon' | 'default';
    className?: string;
    onClick?: () => void;
    asChild?: boolean;
}

interface DropdownProps {
    children: ReactNode;
    className?: string;
    align?: 'start' | 'end';
}

// Custom Components
const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, asChild }: ButtonProps) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'hover:bg-gray-100 hover:text-gray-900'
    };

    const sizes = {
        default: 'h-10 py-2 px-4',
        icon: 'h-10 w-10'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    if (asChild) {
        return <div className={classes} onClick={onClick}>{children}</div>;
    }

    return (
        <button className={classes} onClick={onClick}>
            {children}
        </button>
    );
};

const Sheet = ({ children, open, onOpenChange }: { children: ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) => {
    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/50"
                    onClick={() => onOpenChange(false)}
                />
            )}
            {children}
        </>
    );
};

const SheetTrigger = ({ children, asChild }: { children: ReactNode; asChild?: boolean }) => {
    return <>{children}</>;
};

const SheetContent = ({ children, side = 'left', className = '' }: { children: ReactNode; side?: 'left' | 'right'; className?: string }) => {
    return (
        <div className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} z-50 h-full bg-white shadow-lg transform transition-transform ${className}`}>
            {children}
        </div>
    );
};

const DropdownMenu = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    if (child.type === DropdownMenuTrigger) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            onClick: () => setIsOpen(!isOpen)
                        });
                    }
                    if (child.type === DropdownMenuContent) {
                        return isOpen ? child : null;
                    }
                }
                return child;
            })}
        </div>
    );
};

const DropdownMenuTrigger = ({ children, asChild, onClick }: { children: ReactNode; asChild?: boolean; onClick?: () => void }) => {
    return <div onClick={onClick}>{children}</div>;
};

const DropdownMenuContent = ({ children, className = '', align = 'start' }: DropdownProps) => {
    const alignmentClasses = align === 'end' ? 'right-0' : 'left-0';
    return (
        <div className={`absolute top-full mt-1 ${alignmentClasses} bg-white rounded-md border shadow-lg py-1 z-50 ${className}`}>
            {children}
        </div>
    );
};

const DropdownMenuLabel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`px-3 py-2 text-sm font-semibold ${className}`}>
        {children}
    </div>
);

const DropdownMenuItem = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center ${className}`}>
        {children}
    </div>
);

const DropdownMenuSeparator = () => (
    <div className="h-px bg-gray-200 my-1" />
);

const Avatar = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
        {children}
    </div>
);

const AvatarFallback = ({ children }: { children: ReactNode }) => (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
        {children}
    </div>
);

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-16 items-center px-4">
                <div className="flex items-center space-x-4">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        {isOpen && (
                            <SheetContent side="left" className="w-64">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <span className="font-semibold">Menu</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                                <MobileNav />
                            </SheetContent>
                        )}
                    </Sheet>

                    <Link href="/dashboard" className="flex items-center space-x-2 z-90">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">B</span>
                        </div>
                        <span className="font-bold text-lg">BookingHub</span>
                    </Link>
                </div>

                <div className="ml-auto flex items-center space-x-4">
                    <NotificationDropdown />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Admin</p>
                                    <p className="text-xs leading-none text-gray-500">
                                        admin@bookingHub.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/profile" className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/settings" className="flex items-center">
                                    <SettingsIcon className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/register" className="flex items-center">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}

function MobileNav() {
    const navItems = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/appointments', label: 'Appointments' },
        { href: '/services', label: 'Services' },
        { href: '/customers', label: 'Customers' },
        { href: '/promotions', label: 'Promotions' },
        { href: '/schedule', label: 'Schedule' },
        { href: '/line-preview', label: 'LINE Preview' },
        { href: '/settings', label: 'Settings' },
    ];

    return (
        <div className="flex flex-col space-y-2 p-4">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium hover:text-blue-600 transition-colors py-2 px-2 rounded hover:bg-gray-50"
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}