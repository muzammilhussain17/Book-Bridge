import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Guards
import { ProtectedRoute, RoleRoute } from './routes/RouteGuards';

// Global specific UI
import { Chatbot } from './components/ui/Chatbot';

// PUBLIC PAGES
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { HelpPage } from './pages/public/HelpPage';
import { ContactPage } from './pages/public/ContactPage';
import { FAQPage } from './pages/public/FAQPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// USER PAGES
import { UserDashboardPage } from './pages/user/UserDashboardPage';

// ADMIN PAGES
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Simplified page creator for mock pages to satisfy the route table
const mockPage = (title) => {
  const Component = () => (
    <div className="p-8 w-full flex-1">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
        <p className="text-slate-500">This is the {title} view. The layout, routing, and guards are working correctly.</p>
      </div>
    </div>
  );
  Component.displayName = title.replace(/\s+/g, '') + 'Page';
  return Component;
};

import { BrowseBooksPage } from './pages/user/BrowseBooksPage';
import { BookDetailsPage } from './pages/user/BookDetailsPage';
import { CreateBookPage } from './pages/user/CreateBookPage';
import { EditBookPage } from './pages/user/EditBookPage';
import { MyListingsPage } from './pages/user/MyListingsPage';
import { MyPurchasesPage } from './pages/user/MyPurchasesPage';
import { MySalesPage } from './pages/user/MySalesPage';
import { TransactionDetailsPage } from './pages/user/TransactionDetailsPage';
import { ExchangeListPage } from './pages/user/ExchangeListPage';
import { ExchangeDetailsPage } from './pages/user/ExchangeDetailsPage';
import { RatingsPage } from './pages/user/RatingsPage';
import { MessagesPage } from './pages/user/MessagesPage';
import { NotificationsPage } from './pages/user/NotificationsPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { SecurityPage } from './pages/user/SecurityPage';

import { BookApprovalPage } from './pages/admin/BookApprovalPage';
import { AdminBooksPage } from './pages/admin/AdminBooksPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminUserDetailsPage } from './pages/admin/AdminUserDetailsPage';
import { ViolationLogsPage } from './pages/admin/ViolationLogsPage';
import { SystemStatsPage } from './pages/admin/SystemStatsPage';
import { useAuth } from './context/AuthContext';

const DynamicLayout = () => {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') return <AdminLayout />;
  if (user?.role === 'USER') return <UserLayout />;
  return <PublicLayout />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FAQPage />} />
        </Route>

        {/* SHARED PUBLIC/USER ROUTES */}
        <Route element={<DynamicLayout />}>
          <Route path="/books" element={<BrowseBooksPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DynamicLayout />}>
            <Route path="/books/:id" element={<BookDetailsPage />} />
          </Route>
        </Route>

        {/* USER ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute requiredRole="USER" />}>
            <Route element={<UserLayout />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<UserDashboardPage />} />

              {/* Books */}
              <Route path="/books/create" element={<CreateBookPage />} />
              <Route path="/books/edit/:id" element={<EditBookPage />} />
              <Route path="/my-listings" element={<MyListingsPage />} />

              {/* Transactions */}
              <Route path="/purchases" element={<MyPurchasesPage />} />
              <Route path="/sales" element={<MySalesPage />} />
              <Route path="/transactions/:id" element={<TransactionDetailsPage />} />

              {/* Exchanges */}
              <Route path="/exchanges" element={<ExchangeListPage />} />
              <Route path="/exchanges/:id" element={<ExchangeDetailsPage />} />

              {/* Social */}
              <Route path="/ratings" element={<RatingsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* Settings */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/security" element={<SecurityPage />} />
            </Route>
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute requiredRole="ADMIN" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />

              {/* Books Management */}
              <Route path="/admin/books/approval" element={<BookApprovalPage />} />
              <Route path="/admin/books" element={<AdminBooksPage />} />

              {/* Users Management */}
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/users/:id" element={<AdminUserDetailsPage />} />

              {/* Security & Stats */}
              <Route path="/admin/violations" element={<ViolationLogsPage />} />
              <Route path="/admin/stats" element={<SystemStatsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
