import AppSidebar from '../../../components/appSidebar/AppsideBar';

export default function SellerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      <AppSidebar />
      <main className="flex-1 ml-6 bg-white rounded-2xl shadow-lg p-8">
        {children}
      </main>
    </div>
  );
}