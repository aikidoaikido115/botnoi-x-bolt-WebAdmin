// src/app/(main)/layout.tsx
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
                <Sidebar />
            <main className="pt-10">
                <div className="p-8 pt-8 pl-70 bg-gray-50">
                    {children}
                </div>
            </main>
        </div>
    );
}