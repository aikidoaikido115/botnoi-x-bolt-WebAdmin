'use client';
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Menu, User, Settings, LayoutDashboard, ShoppingBag, Calendar, LogOut, X } from 'lucide-react';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95">
                <div className="flex h-16 items-center px-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="flex items-center space-x-2 z-90">
                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">B</span>
                            </div>
                            <span className="font-bold text-lg">BookingHub</span>
                        </Link>
                    </div>

                    <div className="ml-auto flex items-center space-x-4">
                        <NotificationDropdown 
                            isOpen={isNotificationOpen}
                            onOpenChange={setIsNotificationOpen}
                            fullScreen={true}
                        />
                        
                        {/* Profile dropdown - visible only on medium and larger screens */}
                        <div className="hidden md:block">
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
                                            <Settings className="mr-2 h-4 w-4" />
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

                        {/* Hamburger menu - visible only on small screens */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu - shown only on small screens */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 mt-16 bg-white md:hidden">
                    <div className="relative h-full w-full overflow-y-auto">
                        <MobileNav onItemClick={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

function MobileNav({ onItemClick }: { onItemClick: () => void }) {
    const navItems = [
        { href: '/profile', label: 'Profile', icon: <User className="mr-3 h-5 w-5" /> },
        { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="mr-3 h-5 w-5" />},
        { href: '/appointments', label: 'Appointments', icon: <Calendar className="mr-3 h-5 w-5" /> },
        { href: '/services', label: 'Services', icon: <ShoppingBag className="mr-3 h-5 w-5" /> },
        { href: '/settings', label: 'Settings', icon: <Settings className="mr-3 h-5 w-5" /> },
        { href: '/register', label: 'Log out', icon: <LogOut className="mr-3 h-5 w-5" /> },
    ];
    return (
        <div className="flex flex-col space-y-1 p-6">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={onItemClick}
                >
                    {item.icon}
                    {item.label}
                </Link>
            ))}
        </div>
    );
}