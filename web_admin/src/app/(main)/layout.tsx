
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Sidebar />
            
            <main className="pt-16 ">
                <div className="p-8 pt-10 pl-70 pb-30 bg-gray-50">
                    {children}
                    
                </div>
                <Footer />
                
            </main>
            
        </div>
        
    );
}