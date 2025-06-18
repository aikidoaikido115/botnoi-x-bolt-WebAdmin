// src/app/(main)/layout.tsx
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-200">
            <Navbar />
            <Sidebar />
            <main className="pt-16">
                <div className="p-6 pl-60">
                    {children}
                </div>
            </main>
        </div>
    );
}