import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import AllAssets from './pages/Assets/AllAssets'
import AddAsset from './pages/Assets/AddAsset'
import AssignAsset from './pages/Assets/AssignAsset'
import ReturnAsset from './pages/Assets/ReturnAsset'
import AssetHistory from './pages/Assets/AssetHistory'
import InventoryItems from './pages/Inventory/InventoryItems'
import StockOverview from './pages/Inventory/StockOverview'
import LowStockItems from './pages/Inventory/LowStockItems'
import AllEmployees from './pages/Employees/AllEmployees'
import WorkspacePage from './pages/WorkspacePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="assets" element={<AllAssets />} />
              <Route path="assets/add" element={<AddAsset />} />
              <Route path="assets/assign" element={<AssignAsset />} />
              <Route path="assets/return" element={<ReturnAsset />} />
              <Route path="assets/history" element={<AssetHistory />} />
              <Route path="inventory" element={<InventoryItems />} />
              <Route path="inventory/stock" element={<StockOverview />} />
              <Route path="inventory/low-stock" element={<LowStockItems />} />
              <Route path="employees" element={<AllEmployees />} />
              <Route path="employees/departments" element={<WorkspacePage />} />
              <Route path="employees/assets" element={<WorkspacePage />} />
              <Route path="employees/:id" element={<WorkspacePage />} />
              <Route path="*" element={<WorkspacePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
