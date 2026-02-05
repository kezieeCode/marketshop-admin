import { useState, useEffect, useRef } from 'react'
import './App.css'
import logo from './assets/images/logo.png'
import LoginPage from './views/pages/LoginPage.jsx'
import AddProductPage from './views/pages/AddProductPage.jsx'
import ProductReviewsPage from './views/pages/ProductReviewsPage.jsx'
import { API_CONFIG } from './config/api.js'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [orderTab, setOrderTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [customerPage, setCustomerPage] = useState(1)
  const [customerChartPeriod, setCustomerChartPeriod] = useState('this-week')
  const [categoryProductTab, setCategoryProductTab] = useState('all')
  const [categoryPage, setCategoryPage] = useState(1)
  const [editingProductId, setEditingProductId] = useState(null)

  // Dashboard API state
  const [dashboardStats, setDashboardStats] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState(null)
  
  // Transactions API state
  const [transactions, setTransactions] = useState([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [transactionsError, setTransactionsError] = useState(null)
  const [transactionPage, setTransactionPage] = useState(1)
  const [transactionTotalPages, setTransactionTotalPages] = useState(1)
  const [transactionTotalCount, setTransactionTotalCount] = useState(0)
  const [transactionSearch, setTransactionSearch] = useState('')
  const [transactionStatusFilter, setTransactionStatusFilter] = useState('all')

  // Orders API state
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)
  const [ordersStats, setOrdersStats] = useState(null)

  // Products API state
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState(null)
  const [categories, setCategories] = useState([])

  // Categories page API state
  const [categoryProducts, setCategoryProducts] = useState([])
  const [categoryProductsLoading, setCategoryProductsLoading] = useState(false)
  const [categoryProductsError, setCategoryProductsError] = useState(null)
  const [categoryProductCounts, setCategoryProductCounts] = useState({
    all: 0,
    featured: 0,
    onSale: 0,
    outOfStock: 0
  })
  const [discoverCategories, setDiscoverCategories] = useState([])
  const [discoverCategoriesLoading, setDiscoverCategoriesLoading] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')
  const [categoryLimit] = useState(50)
  const [categoryOffset, setCategoryOffset] = useState(0)
  const [categoryTotalCount, setCategoryTotalCount] = useState(0)

  // Best selling products API state
  const [bestSellingProducts, setBestSellingProducts] = useState([])
  const [bestSellingLoading, setBestSellingLoading] = useState(false)
  const [bestSellingError, setBestSellingError] = useState(null)

  // Customer API state
  const [customerMetrics, setCustomerMetrics] = useState(null)
  const [customerMetricsLoading, setCustomerMetricsLoading] = useState(false)
  const [customerMetricsError, setCustomerMetricsError] = useState(null)
  const [customerOverview, setCustomerOverview] = useState(null)
  const [customerOverviewLoading, setCustomerOverviewLoading] = useState(false)
  const [customerOverviewError, setCustomerOverviewError] = useState(null)
  const [customers, setCustomers] = useState([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [customersError, setCustomersError] = useState(null)
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all')
  const [customerSortBy, setCustomerSortBy] = useState('order_count')
  const [customerSortOrder, setCustomerSortOrder] = useState('desc')
  const [customerTotalPages, setCustomerTotalPages] = useState(1)
  const [customerTotalCount, setCustomerTotalCount] = useState(0)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  
  // Order status update modal state
  const [isOrderStatusModalOpen, setIsOrderStatusModalOpen] = useState(false)
  const [orderStatusUpdate, setOrderStatusUpdate] = useState({
    orderId: null,
    currentStatus: '',
    newStatus: '',
    trackingNumber: '',
    notes: ''
  })

  // Coupon state
  const [coupons, setCoupons] = useState([])
  const [couponsLoading, setCouponsLoading] = useState(false)
  const [couponsError, setCouponsError] = useState(null)
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage', // 'percentage' or 'fixed'
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    userLimit: '',
    expiryDate: '',
    status: 'active'
  })
  const [couponSubmitting, setCouponSubmitting] = useState(false)

  // Promotional Banners state
  const [promotionalBanners, setPromotionalBanners] = useState([])
  const [promotionalBannersLoading, setPromotionalBannersLoading] = useState(false)
  const [promotionalBannersError, setPromotionalBannersError] = useState(null)
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    subtitle: '',
    headerText: '',
    mainTitle: '',
    countdownDays: '',
    countdownHours: '',
    countdownMinutes: '',
    countdownSeconds: '',
    countdownEndDate: '',
    buttonText: 'SHOP NOW',
    buttonLink: '/products',
    backgroundColor: '#FEF3C7',
    productImage: '',
    backgroundImage: '',
    isActive: true
  })
  const [bannerSubmitting, setBannerSubmitting] = useState(false)
  const [productMediaTab, setProductMediaTab] = useState('media') // 'media' or 'banners'

  // Messages/Chat state
  const [chatUsers, setChatUsers] = useState([])
  const [chatUsersLoading, setChatUsersLoading] = useState(false)
  const [chatUsersError, setChatUsersError] = useState(null)
  const [selectedChatUser, setSelectedChatUser] = useState(null)
  const [messages, setMessages] = useState({}) // { userId: [messages] }
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageSearch, setMessageSearch] = useState('')
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Helper function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('admin_token')
  }

  // Helper function to make authenticated API calls
  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid
      handleLogout()
      throw new Error('Authentication failed. Please log in again.')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        endpoint: endpoint
      })
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  // Fetch dashboard stats when authenticated and on dashboard menu
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'dashboard') {
      fetchDashboardStats()
      fetchTransactions()
      fetchProducts()
      fetchBestSellingProducts()
    }
  }, [isAuthenticated, activeMenu])

  // Fetch orders when on orders menu
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'orders') {
      fetchOrders()
      fetchOrdersStats()
    }
  }, [isAuthenticated, activeMenu, orderTab, currentPage])

  // Fetch products when on product-list menu
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'product-list') {
      fetchProducts()
    }
  }, [isAuthenticated, activeMenu])

  // Fetch customer data when on customers menu
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'customers') {
      fetchCustomerMetrics()
      fetchCustomerOverview(customerChartPeriod)
    }
  }, [isAuthenticated, activeMenu, customerChartPeriod])

  // Debounce search input
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'customers') {
      const timeoutId = setTimeout(() => {
        setCustomerPage(1) // Reset to page 1 when search changes
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [customerSearch, isAuthenticated, activeMenu])

  // Fetch customers list when dependencies change
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'customers') {
      fetchCustomers()
    }
  }, [isAuthenticated, activeMenu, customerPage, customerStatusFilter, customerSortBy, customerSortOrder, customerSearch])

  // Debounce transaction search input
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'transaction') {
      const timeoutId = setTimeout(() => {
        setTransactionPage(1) // Reset to page 1 when search changes
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [transactionSearch, isAuthenticated, activeMenu])

  // Fetch transactions when on transaction menu
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'transaction') {
      fetchTransactionsPage()
    }
  }, [isAuthenticated, activeMenu, transactionPage, transactionStatusFilter, transactionSearch])

  // Fetch categories page data when on categories menu
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'categories') {
      fetchCategoryProductCounts()
      fetchDiscoverCategories()
    }
  }, [isAuthenticated, activeMenu])

  // Debounce category search input
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'categories') {
      const timeoutId = setTimeout(() => {
        setCategoryOffset(0) // Reset to first page when search changes
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [categorySearch, isAuthenticated, activeMenu])

  // Fetch category products when dependencies change
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'categories') {
      const offset = (categoryPage - 1) * categoryLimit
      setCategoryOffset(offset)
      fetchCategoryProducts(categoryProductTab, categorySearch, categoryLimit, offset)
    }
  }, [isAuthenticated, activeMenu, categoryPage, categoryProductTab, categorySearch, categoryLimit])

  // Fetch coupons when on coupon menu
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'coupon') {
      fetchCoupons()
    }
  }, [isAuthenticated, activeMenu])

  // Fetch promotional banners when on product-media menu and banners tab is active
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'product-media' && productMediaTab === 'banners') {
      fetchPromotionalBanners()
    }
  }, [isAuthenticated, activeMenu, productMediaTab])

  // Fetch chat users when on messages menu
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'messages') {
      fetchChatUsers()
    }
  }, [isAuthenticated, activeMenu])

  // Fetch messages when a user is selected
  useEffect(() => {
    if (isAuthenticated && activeMenu === 'messages' && selectedChatUser) {
      fetchMessages(selectedChatUser.id)
    }
  }, [isAuthenticated, activeMenu, selectedChatUser?.id])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (selectedChatUser && messages[selectedChatUser.id]) {
      scrollToBottom()
    }
  }, [messages, selectedChatUser?.id])

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    setDashboardLoading(true)
    setDashboardError(null)
    try {
      const data = await apiCall('/api/admin/dashboard/stats?period=7days')
      setDashboardStats(data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setDashboardError(error.message)
    } finally {
      setDashboardLoading(false)
    }
  }

  // Fetch transactions (for dashboard - limited to 5)
  const fetchTransactions = async () => {
    setTransactionsLoading(true)
    setTransactionsError(null)
    try {
      const data = await apiCall('/api/admin/transactions?limit=5')
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactionsError(error.message)
    } finally {
      setTransactionsLoading(false)
    }
  }

  // Fetch transactions for transaction page (with pagination and filters)
  const fetchTransactionsPage = async () => {
    setTransactionsLoading(true)
    setTransactionsError(null)
    try {
      const limit = 20
      const offset = (transactionPage - 1) * limit
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      })

      if (transactionSearch.trim()) {
        params.append('search', transactionSearch.trim())
      }
      if (transactionStatusFilter !== 'all') {
        params.append('status', transactionStatusFilter)
      }

      const data = await apiCall(`/api/admin/transactions?${params.toString()}`)
      console.log('Transactions Page API Response:', data)
      
      setTransactions(data.transactions || data || [])
      
      // Handle pagination metadata
      if (data.total !== undefined) {
        setTransactionTotalCount(data.total)
        setTransactionTotalPages(Math.ceil(data.total / limit))
      } else if (data.totalPages !== undefined) {
        setTransactionTotalPages(data.totalPages)
        setTransactionTotalCount(data.totalCount || data.total || 0)
      } else if (data.pagination) {
        setTransactionTotalCount(data.pagination.total || 0)
        setTransactionTotalPages(data.pagination.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactionsError(error.message)
    } finally {
      setTransactionsLoading(false)
    }
  }

  // Fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true)
    setOrdersError(null)
    try {
      const status = orderTab === 'all' ? '' : orderTab
      const offset = (currentPage - 1) * 10
      const endpoint = `/api/admin/dashboard/orders?limit=10&offset=${offset}${status ? `&status=${status}` : ''}`
      const data = await apiCall(endpoint)
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrdersError(error.message)
    } finally {
      setOrdersLoading(false)
    }
  }

  // Fetch orders statistics
  const fetchOrdersStats = async () => {
    try {
      const data = await apiCall('/api/admin/dashboard/stats?period=7days')
      setOrdersStats(data)
    } catch (error) {
      console.error('Error fetching orders stats:', error)
    }
  }

  // Open order status update modal
  const openOrderStatusModal = (orderId, currentStatus, newStatus) => {
    setOrderStatusUpdate({
      orderId,
      currentStatus,
      newStatus,
      trackingNumber: '',
      notes: ''
    })
    setIsOrderStatusModalOpen(true)
  }

  // Update order status
  const updateOrderStatus = async (orderId, newStatus, trackingNumber = null, notes = null) => {
    try {
      const requestBody = { status: newStatus }
      
      // Add tracking number for shipped status
      if (newStatus === 'shipped' && trackingNumber) {
        requestBody.trackingNumber = trackingNumber.trim()
      }
      
      // Add notes for canceled status
      if (newStatus === 'canceled' && notes) {
        requestBody.notes = notes.trim()
      }

      await apiCall(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      })
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === orderId) {
            const updatedOrder = { ...order, status: newStatus }
            // Update tracking number if provided
            if (newStatus === 'shipped' && trackingNumber) {
              updatedOrder.tracking_number = trackingNumber.trim()
              updatedOrder.trackingNumber = trackingNumber.trim()
            }
            return updatedOrder
          }
          return order
        })
      )
      
      // Close modal and reset state
      setIsOrderStatusModalOpen(false)
      setOrderStatusUpdate({
        orderId: null,
        currentStatus: '',
        newStatus: '',
        trackingNumber: '',
        notes: ''
      })
      
      // Show success notification
      console.log(`Order ${orderId} status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert(`Failed to update order status: ${error.message}`)
    }
  }

  // Handle order status change with modal
  const handleOrderStatusChange = (orderId, currentStatus, newStatus) => {
    // If status is shipped or canceled, open modal for additional info
    if (newStatus === 'shipped' || newStatus === 'canceled') {
      openOrderStatusModal(orderId, currentStatus, newStatus)
    } else {
      // For other statuses, update directly
      if (window.confirm(`Change order status to "${newStatus}"?`)) {
        updateOrderStatus(orderId, newStatus)
      }
    }
  }

  // Delete order
  const deleteOrder = async (orderUuid) => {
    try {
      await apiCall(`/api/admin/orders/${orderUuid}`, {
        method: 'DELETE'
      })
      
      // Remove order from local state (match by UUID or ID)
      setOrders(prevOrders => prevOrders.filter(order => {
        const orderUuidValue = order.uuid || order.id
        return orderUuidValue !== orderUuid
      }))
      
      // Refresh orders list
      await fetchOrders()
      
      // Show success notification
      console.log(`Order ${orderUuid} deleted successfully`)
    } catch (error) {
      console.error('Error deleting order:', error)
      alert(`Failed to delete order: ${error.message}`)
    }
  }

  // Fetch products for Add New Product section
  const fetchProducts = async () => {
    setProductsLoading(true)
    setProductsError(null)
    try {
      // Use regular products endpoint (no admin auth needed for reading)
      const token = getAuthToken()
      const response = await fetch(`${API_CONFIG.baseURL}/api/products`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      // Handle both array and object responses
      const productsList = Array.isArray(data) ? data : (data.products || [])
      setProducts(productsList.slice(0, 3)) // Show only 3 products
      
      // Extract unique categories from products
      const uniqueCategories = [...new Set(productsList
        .map(p => p.category)
        .filter(c => c && c.trim() !== '')
      )].slice(0, 3) // Show only 3 categories
      
      // Set categories from products (only if found)
      if (uniqueCategories.length > 0) {
        setCategories(uniqueCategories.map(cat => ({
          name: cat,
          image: productsList.find(p => p.category === cat)?.image_url || 
                 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=80&h=80&fit=crop'
        })))
      } else {
        // Clear categories if none found
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProductsError(error.message)
      // Don't set default categories - let UI show "No categories available"
      setCategories([])
    } finally {
      setProductsLoading(false)
    }
  }

  // Fetch category products with filters
  const fetchCategoryProducts = async (filter = 'all', search = '', limit = 50, offset = 0) => {
    setCategoryProductsLoading(true)
    setCategoryProductsError(null)
    try {
      const params = new URLSearchParams()
      
      if (filter !== 'all') {
        if (filter === 'featured') {
          params.append('filter', 'featured')
        } else if (filter === 'sale') {
          params.append('filter', 'onSale')
        } else if (filter === 'out-of-stock') {
          params.append('filter', 'outOfStock')
        }
      } else {
        params.append('filter', 'all')
      }
      
      if (search && search.trim()) {
        params.append('search', search.trim())
      }
      
      params.append('limit', limit.toString())
      params.append('offset', offset.toString())
      
      const data = await apiCall(`/api/admin/products?${params.toString()}`)
      
      // Handle response structure
      const productsList = Array.isArray(data) ? data : (data.products || [])
      setCategoryProducts(productsList)
      setCategoryTotalCount(data.total || productsList.length)
    } catch (error) {
      console.error('Error fetching category products:', error)
      setCategoryProductsError(error.message)
      setCategoryProducts([])
    } finally {
      setCategoryProductsLoading(false)
    }
  }

  // Fetch product counts for filter tabs
  const fetchCategoryProductCounts = async () => {
    try {
      const data = await apiCall('/api/admin/products/counts')
      setCategoryProductCounts({
        all: data.all || 0,
        featured: data.featured || 0,
        onSale: data.onSale || 0,
        outOfStock: data.outOfStock || 0
      })
    } catch (error) {
      console.error('Error fetching product counts:', error)
      // Set defaults on error
      setCategoryProductCounts({
        all: 0,
        featured: 0,
        onSale: 0,
        outOfStock: 0
      })
    }
  }

  // Fetch categories for Discover section
  const fetchDiscoverCategories = async () => {
    setDiscoverCategoriesLoading(true)
    try {
      const data = await apiCall('/api/admin/categories')
      const categoriesList = Array.isArray(data) ? data : (data.categories || [])
      setDiscoverCategories(categoriesList)
    } catch (error) {
      console.error('Error fetching discover categories:', error)
      setDiscoverCategories([])
    } finally {
      setDiscoverCategoriesLoading(false)
    }
  }

  // Navigate to Add Product page
  const handleAddNewProduct = () => {
    setActiveMenu('add-products')
  }

  // Fetch best selling products
  const fetchBestSellingProducts = async () => {
    setBestSellingLoading(true)
    setBestSellingError(null)
    try {
      // First, get all orders with their items to calculate product sales
      const ordersResponse = await apiCall('/api/admin/dashboard/orders?limit=1000')
      const orders = ordersResponse.orders || []
      
      // Count product sales from order items
      const productSalesMap = new Map()
      
      // Process each order
      for (const order of orders) {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const productId = item.product_id || item.id
            const productName = item.name || item.product_name || 'Unknown Product'
            const quantity = parseInt(item.quantity || 1)
            
            if (productSalesMap.has(productId)) {
              const existing = productSalesMap.get(productId)
              existing.totalOrders += quantity
            } else {
              productSalesMap.set(productId, {
                id: productId,
                name: productName,
                image_url: item.image_url || item.image || 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=48&h=48&fit=crop',
                price: parseFloat(item.price || item.current_price || 0),
                totalOrders: quantity,
                stockStatus: item.stock_status || 'In Stock'
              })
            }
          })
        }
      }
      
      // Convert map to array and sort by total orders (descending)
      const bestSelling = Array.from(productSalesMap.values())
        .sort((a, b) => b.totalOrders - a.totalOrders)
        .slice(0, 4) // Get top 4 products
      
      setBestSellingProducts(bestSelling)
    } catch (error) {
      console.error('Error fetching best selling products:', error)
      setBestSellingError(error.message)
      // Fallback: try to get products and use a default order count
      try {
        const token = getAuthToken()
        const response = await fetch(`${API_CONFIG.baseURL}/api/products`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          const productsList = Array.isArray(data) ? data : (data.products || [])
          // Use first 4 products with mock order counts
          setBestSellingProducts(productsList.slice(0, 4).map((p, index) => ({
            id: p.id,
            name: p.name || 'Unknown Product',
            image_url: p.image_url || 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=48&h=48&fit=crop',
            price: parseFloat(p.price || 0),
            totalOrders: Math.floor(Math.random() * 500) + 50, // Mock data
            stockStatus: p.stock_status || 'In Stock'
          })))
        }
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError)
      }
    } finally {
      setBestSellingLoading(false)
    }
  }

  // Fetch customer metrics
  const fetchCustomerMetrics = async () => {
    setCustomerMetricsLoading(true)
    setCustomerMetricsError(null)
    try {
      const data = await apiCall('/api/admin/customers/metrics')
      console.log('Customer Metrics API Response:', data)
      setCustomerMetrics(data)
    } catch (error) {
      console.error('Error fetching customer metrics:', error)
      setCustomerMetricsError(error.message)
    } finally {
      setCustomerMetricsLoading(false)
    }
  }

  // Fetch customer overview
  const fetchCustomerOverview = async (period) => {
    setCustomerOverviewLoading(true)
    setCustomerOverviewError(null)
    try {
      const periodParam = period === 'this-week' ? 'thisWeek' : 'lastWeek'
      const data = await apiCall(`/api/admin/customers/overview?period=${periodParam}`)
      console.log('Customer Overview API Response:', data)
      setCustomerOverview(data)
    } catch (error) {
      console.error('Error fetching customer overview:', error)
      setCustomerOverviewError(error.message)
    } finally {
      setCustomerOverviewLoading(false)
    }
  }

  // Fetch customers list
  const fetchCustomers = async () => {
    setCustomersLoading(true)
    setCustomersError(null)
    try {
      const limit = 20
      const offset = (customerPage - 1) * limit
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      })

      if (customerSearch.trim()) {
        params.append('search', customerSearch.trim())
      }
      if (customerStatusFilter !== 'all') {
        params.append('status', customerStatusFilter)
      }
      if (customerSortBy) {
        params.append('sortBy', customerSortBy)
      }
      if (customerSortOrder) {
        params.append('sortOrder', customerSortOrder)
      }

      const data = await apiCall(`/api/admin/customers?${params.toString()}`)
      console.log('Customers List API Response:', data)
      
      // Use exact structure from API: {customers: Array, total: number, limit: number, offset: number, hasMore: boolean}
      setCustomers(data.customers || [])
      
      // Handle pagination metadata
      if (data.total !== undefined) {
        setCustomerTotalCount(data.total)
        setCustomerTotalPages(Math.ceil(data.total / limit))
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomersError(error.message)
    } finally {
      setCustomersLoading(false)
    }
  }

  // Fetch coupons list
  const fetchCoupons = async () => {
    setCouponsLoading(true)
    setCouponsError(null)
    try {
      const data = await apiCall('/api/admin/coupons')
      // Handle both array and object responses
      const couponsList = Array.isArray(data) ? data : (data.coupons || [])
      setCoupons(couponsList)
    } catch (error) {
      console.error('Error fetching coupons:', error)
      setCouponsError(error.message)
      setCoupons([])
    } finally {
      setCouponsLoading(false)
    }
  }

  // Fetch promotional banners
  const fetchPromotionalBanners = async () => {
    setPromotionalBannersLoading(true)
    setPromotionalBannersError(null)
    try {
      const data = await apiCall('/api/admin/promotions')
      // Handle both array and object responses
      const bannersList = Array.isArray(data) ? data : (data.promotions || data.banners || [])
      setPromotionalBanners(bannersList)
    } catch (error) {
      console.error('Error fetching promotional banners:', error)
      setPromotionalBannersError(error.message)
      setPromotionalBanners([])
    } finally {
      setPromotionalBannersLoading(false)
    }
  }

  // Fetch chat users (customers that can be messaged)
  const fetchChatUsers = async () => {
    setChatUsersLoading(true)
    setChatUsersError(null)
    try {
      // Fetch customers for messaging
      const data = await apiCall('/api/admin/customers?limit=100')
      const usersList = data.customers || data || []
      setChatUsers(usersList)
    } catch (error) {
      console.error('Error fetching chat users:', error)
      setChatUsersError(error.message)
      setChatUsers([])
    } finally {
      setChatUsersLoading(false)
    }
  }

  // Fetch messages for a specific user
  const fetchMessages = async (userId) => {
    try {
      // If messages already exist for this user, don't refetch
      if (messages[userId] && messages[userId].length > 0) {
        return
      }
      
      // Try to fetch messages from API, or use empty array if endpoint doesn't exist
      try {
        const data = await apiCall(`/api/admin/messages/${userId}`)
        const messagesList = Array.isArray(data) ? data : (data.messages || [])
        setMessages(prev => ({
          ...prev,
          [userId]: messagesList
        }))
      } catch (apiError) {
        // If API endpoint doesn't exist, initialize with empty array
        console.log('Messages API not available, initializing empty messages')
        setMessages(prev => ({
          ...prev,
          [userId]: []
        }))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      // Initialize with empty array on error
      setMessages(prev => ({
        ...prev,
        [userId]: []
      }))
    }
  }

  // Send a message to a user
  const sendMessage = async () => {
    if (!selectedChatUser || !newMessage.trim()) {
      return
    }

    setSendingMessage(true)
    try {
      const messageData = {
        userId: selectedChatUser.id,
        message: newMessage.trim(),
        timestamp: new Date().toISOString()
      }

      // Try to send via API, or just add locally if endpoint doesn't exist
      try {
        await apiCall('/api/admin/messages', {
          method: 'POST',
          body: JSON.stringify(messageData)
        })
      } catch (apiError) {
        console.log('Send message API not available, storing locally')
      }

      // Add message to local state
      const newMsg = {
        id: Date.now(),
        message: newMessage.trim(),
        sender: 'admin',
        receiver: selectedChatUser.id,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }

      setMessages(prev => ({
        ...prev,
        [selectedChatUser.id]: [...(prev[selectedChatUser.id] || []), newMsg]
      }))

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  // Create or update promotional banner
  const handleBannerSubmit = async () => {
    setBannerSubmitting(true)
    try {
      // Validate required fields
      if (!bannerFormData.mainTitle || !bannerFormData.mainTitle.trim()) {
        alert('Please enter a main title')
        setBannerSubmitting(false)
        return
      }

      // Format countdown end date
      let countdownEndDate = null
      if (bannerFormData.countdownEndDate && bannerFormData.countdownEndDate.trim()) {
        try {
          const date = new Date(bannerFormData.countdownEndDate)
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format')
          }
          countdownEndDate = date.toISOString()
        } catch (dateError) {
          console.error('Date parsing error:', dateError)
          alert('Invalid countdown end date format.')
          setBannerSubmitting(false)
          return
        }
      }

      // Handle image URLs - trim whitespace and validate
      let productImageUrl = ''
      let backgroundImageUrl = ''
      
      if (bannerFormData.productImage && typeof bannerFormData.productImage === 'string') {
        productImageUrl = bannerFormData.productImage.trim()
      }
      
      if (bannerFormData.backgroundImage && typeof bannerFormData.backgroundImage === 'string') {
        backgroundImageUrl = bannerFormData.backgroundImage.trim()
      }

      // Prepare the request body according to API structure
      const requestBody = {
        headerText: bannerFormData.headerText || '',
        subtitle: bannerFormData.subtitle || '',
        mainTitle: bannerFormData.mainTitle.trim(),
        buttonText: bannerFormData.buttonText || 'SHOP NOW',
        buttonLink: bannerFormData.buttonLink || '/products',
        backgroundColor: bannerFormData.backgroundColor || '#FEF3C7',
        isActive: bannerFormData.isActive !== false,
        displayOrder: selectedBanner?.displayOrder || 0
      }

      // Add countdownEndDate only if provided
      if (countdownEndDate) {
        requestBody.countdownEndDate = countdownEndDate
      }

      // Add image URLs only if provided
      if (productImageUrl) {
        requestBody.productImage = productImageUrl
      }
      if (backgroundImageUrl) {
        requestBody.backgroundImage = backgroundImageUrl
      }

      console.log('Sending promotion request:', requestBody)

      if (selectedBanner) {
        // Update existing promotion
        await apiCall(`/api/admin/promotions/${selectedBanner.id}`, {
          method: 'PUT',
          body: JSON.stringify(requestBody)
        })
        console.log('Promotion updated successfully')
      } else {
        // Create new promotion
        const data = await apiCall('/api/admin/promotions', {
          method: 'POST',
          body: JSON.stringify(requestBody)
        })
        console.log('Promotion created successfully:', data)
      }

      // Close modal and refresh banners list
      setIsBannerModalOpen(false)
      setSelectedBanner(null)
      
      // Reset form
      setBannerFormData({
        title: '',
        subtitle: '',
        headerText: '',
        mainTitle: '',
        countdownDays: '',
        countdownHours: '',
        countdownMinutes: '',
        countdownSeconds: '',
        countdownEndDate: '',
        buttonText: 'SHOP NOW',
        buttonLink: '',
        backgroundColor: '#FEF3C7',
        productImage: null,
        backgroundImage: null,
        isActive: true
      })

      // Refresh banners list
      fetchPromotionalBanners()
    } catch (error) {
      console.error('Error saving promotion:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      const errorMessage = error.message || 'Unknown error occurred'
      alert(`Failed to ${selectedBanner ? 'update' : 'create'} promotion: ${errorMessage}`)
    } finally {
      setBannerSubmitting(false)
    }
  }

  // Create or update coupon
  const handleCouponSubmit = async () => {
    setCouponSubmitting(true)
    try {
      // Validate required fields
      if (!couponFormData.code || !couponFormData.code.trim()) {
        alert('Please enter a coupon code')
        setCouponSubmitting(false)
        return
      }

      // Sanitize coupon code - remove spaces and special characters, keep only alphanumeric and hyphens
      const sanitizedCode = couponFormData.code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '')
      if (sanitizedCode.length < 3) {
        alert('Coupon code must be at least 3 characters long')
        setCouponSubmitting(false)
        return
      }

      if (!couponFormData.discountValue || parseFloat(couponFormData.discountValue) <= 0) {
        alert('Please enter a valid discount value')
        setCouponSubmitting(false)
        return
      }

      // Validate percentage discount doesn't exceed 100%
      if (couponFormData.discountType === 'percentage' && parseFloat(couponFormData.discountValue) > 100) {
        alert('Percentage discount cannot exceed 100%')
        setCouponSubmitting(false)
        return
      }

      // Format expiry date properly
      let validUntil = null
      if (couponFormData.expiryDate && couponFormData.expiryDate.trim()) {
        try {
          // Ensure the date is in YYYY-MM-DD format
          const dateStr = couponFormData.expiryDate.trim()
          const date = new Date(dateStr + 'T23:59:59Z')
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format')
          }
          validUntil = date.toISOString()
        } catch (dateError) {
          console.error('Date parsing error:', dateError)
          alert('Invalid expiry date format. Please use YYYY-MM-DD format.')
          setCouponSubmitting(false)
          return
        }
      }

      // Prepare the request body according to API structure
      const requestBody = {
        code: sanitizedCode,
        description: couponFormData.description || `${couponFormData.discountValue}${couponFormData.discountType === 'percentage' ? '%' : ' NGN'} off`,
        discountType: couponFormData.discountType,
        discountValue: parseFloat(couponFormData.discountValue),
        minOrderAmount: couponFormData.minPurchase ? parseFloat(couponFormData.minPurchase) : 0,
        maxDiscountAmount: couponFormData.maxDiscount ? parseFloat(couponFormData.maxDiscount) : null,
        usageLimit: couponFormData.usageLimit ? parseInt(couponFormData.usageLimit) : null,
        userLimit: couponFormData.userLimit ? parseInt(couponFormData.userLimit) : 1,
        validFrom: new Date().toISOString(), // Start from now
        validUntil: validUntil,
        isActive: couponFormData.status === 'active'
      }

      console.log('Sending coupon request:', requestBody)

      if (selectedCoupon) {
        // Update existing coupon
        await apiCall(`/api/admin/coupons/${selectedCoupon.id}`, {
          method: 'PUT',
          body: JSON.stringify(requestBody)
        })
        console.log('Coupon updated successfully')
      } else {
        // Create new coupon
        const data = await apiCall('/api/admin/coupons', {
          method: 'POST',
          body: JSON.stringify(requestBody)
        })
        console.log('Coupon created successfully:', data)
      }

      // Close modal and refresh coupons list
      setIsCouponModalOpen(false)
      setSelectedCoupon(null)
      
      // Reset form
      setCouponFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchase: '',
        maxDiscount: '',
        usageLimit: '',
        userLimit: '',
        expiryDate: '',
        status: 'active'
      })

      // Refresh coupons list
      fetchCoupons()
    } catch (error) {
      console.error('Error saving coupon:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      const errorMessage = error.message || 'Unknown error occurred'
      alert(`Failed to ${selectedCoupon ? 'update' : 'create'} coupon: ${errorMessage}`)
    } finally {
      setCouponSubmitting(false)
    }
  }

  // Delete customer
  const deleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return
    }

    try {
      await apiCall(`/api/admin/customers/${customerId}`, {
        method: 'DELETE'
      })
      
      // Remove customer from local state
      setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== customerId))
      
      // Show success message (you can add a toast notification here)
      console.log('Customer deleted successfully')
      
      // Optionally refresh the customers list
      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert(`Failed to delete customer: ${error.message}`)
    }
  }

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_refresh_token')
    localStorage.removeItem('admin_user')
    setIsAuthenticated(false)
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.125rem',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="MarketGreen Logo" />
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-market">Market</span>
            <span className="sidebar-logo-green">Green</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <div className="menu-section">
            <div className="menu-section-title">Main menu</div>
            <a 
              href="#dashboard" 
              className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('dashboard'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10L10 3L17 10V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 19V10H13V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Dashboard
            </a>
            <a 
              href="#orders" 
              className={`menu-item ${activeMenu === 'orders' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('orders'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H15L19 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H15M15 13V17M13 19H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Order Management
            </a>
            <a 
              href="#customers" 
              className={`menu-item ${activeMenu === 'customers' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('customers'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M13 5C13 6.65685 11.6569 8 10 8C8.34315 8 7 6.65685 7 5C7 3.34315 8.34315 2 10 2C11.6569 2 13 3.34315 13 5ZM19 19V17C18.9993 16.1137 18.7044 15.2528 18.1614 14.5523C17.6184 13.8519 16.8581 13.3516 16 13.13M14 5C14 6.65685 12.6569 8 11 8C9.34315 8 8 6.65685 8 5C8 3.34315 9.34315 2 11 2C12.6569 2 14 3.34315 14 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Customers
            </a>
            <a 
              href="#coupon" 
              className={`menu-item ${activeMenu === 'coupon' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('coupon'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 5H16C17.1046 5 18 5.89543 18 7V13C18 14.1046 17.1046 15 16 15H4C2.89543 15 2 14.1046 2 13V7C2 5.89543 2.89543 5 4 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 8H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Coupon Code
            </a>
            <a 
              href="#categories" 
              className={`menu-item ${activeMenu === 'categories' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('categories'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L10 2L17 9M10 2V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Categories
            </a>
            <a 
              href="#transaction" 
              className={`menu-item ${activeMenu === 'transaction' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('transaction'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.89543 2 4 2.89543 4 4V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V4C16 2.89543 15.1046 2 14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 2V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 2V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Transaction
            </a>
            <a 
              href="#messages" 
              className={`menu-item ${activeMenu === 'messages' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('messages'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 5V13C18 14.1046 17.1046 15 16 15H6L2 19V5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Messages
            </a>
          </div>

          <div className="menu-section">
            <div className="menu-section-title">Product</div>
            <a 
              href="#add-products" 
              className={`menu-item ${activeMenu === 'add-products' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('add-products'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Add Products
            </a>
            <a 
              href="#product-media" 
              className={`menu-item ${activeMenu === 'product-media' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('product-media'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L12 8L16 12L20 8V16C20 17.1046 19.1046 18 18 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              Product Media
            </a>
            <a 
              href="#product-list" 
              className={`menu-item ${activeMenu === 'product-list' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('product-list'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H16M4 10H16M4 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Product List
            </a>
            <a 
              href="#product-reviews" 
              className={`menu-item ${activeMenu === 'product-reviews' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('product-reviews'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927C9.349 2.005 10.651 2.005 10.951 2.927L12.47 7.6C12.6111 8.018 13.0022 8.30063 13.442 8.30063H18.31C19.275 8.30063 19.676 9.53143 18.887 10.1L14.946 12.938C14.5836 13.203 14.4225 13.6667 14.563 14.0846L16.082 18.7576C16.382 19.68 15.33 20.4386 14.541 19.8686L10.6 17.0306C10.2376 16.7656 9.76238 16.7656 9.4 17.0306L5.459 19.8686C4.67 20.4386 3.618 19.68 3.918 18.7576L5.437 14.0846C5.57755 13.6667 5.41638 13.203 5.054 12.938L1.113 10.1C0.323998 9.53143 0.724998 8.30063 1.69 8.30063H6.558C6.99777 8.30063 7.38889 8.018 7.53 7.6L9.049 2.927Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Product Reviews
            </a>
          </div>

          <div className="menu-section">
            <div className="menu-section-title">Admin</div>
            <a 
              href="#admin-role" 
              className={`menu-item ${activeMenu === 'admin-role' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('admin-role'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12C12.2091 12 14 10.2091 14 8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 17C3 14.7909 5.79086 13 10 13C14.2091 13 17 14.7909 17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Admin role
            </a>
            <a 
              href="#control-authority" 
              className={`menu-item ${activeMenu === 'control-authority' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveMenu('control-authority'); }}
            >
              <div className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12C12.2091 12 14 10.2091 14 8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12V16M10 16L8 18M10 16L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 17C3 14.7909 5.79086 13 10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Control Authority
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-search">
            <svg className="header-search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Search data, users, or reports" />
          </div>

          <div className="header-actions">
            <button className="header-action-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2C10 2 4 4 4 10C4 16 10 18 10 18C10 18 16 16 16 10C16 4 10 2 10 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="notification-badge"></span>
            </button>
            <button className="header-action-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3V1M10 3C7.23858 3 5 5.23858 5 8C5 10.7614 7.23858 13 10 13M10 3C12.7614 3 15 5.23858 15 8C15 10.7614 12.7614 13 10 13M10 13V19M3 10H1M19 10H17M4.31412 4.31412L2.8999 2.8999M17.1001 17.1001L15.6859 15.6859M4.31412 15.6859L2.8999 17.1001M17.1001 2.8999L15.6859 4.31412" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="header-action-btn" onClick={handleLogout} title="Logout">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 17.5H4.16667C3.24619 17.5 2.5 16.7538 2.5 15.8333V4.16667C2.5 3.24619 3.24619 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="user-avatar">MG</div>
          </div>
        </header>

        {/* Main Content */}
        {activeMenu === 'dashboard' && (
        <div className="dashboard-content">
          <h1 className="dashboard-title">Dashboard</h1>

          {/* Loading State */}
          {dashboardLoading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Loading dashboard data...
            </div>
          )}

          {/* Error State */}
          {dashboardError && (
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              color: '#991b1b', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              Error loading dashboard: {dashboardError}
            </div>
          )}

          {/* KPI Cards */}
          {dashboardStats && (
          <div className="dashboard-grid">
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div>
                  <div className="kpi-card-title">Total Sales</div>
                  <div className="kpi-card-value">{dashboardStats.totalSales.formatted}</div>
                </div>
                <div className={`kpi-card-trend ${dashboardStats.totalSales.changeType === 'increase' ? 'up' : 'down'}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {dashboardStats.totalSales.changeType === 'increase' ? (
                      <path d="M8 3V13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M8 13V3M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                  {Math.abs(dashboardStats.totalSales.change)}%
                </div>
              </div>
              <div className="kpi-card-footer">
                <span className="kpi-card-footer-text">{dashboardStats.period.current}</span>
                <button className="kpi-card-button">Details</button>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                {dashboardStats.period.previous} ({dashboardStats.totalSales.previousFormatted})
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-header">
                <div>
                  <div className="kpi-card-title">Total Orders</div>
                  <div className="kpi-card-value">{dashboardStats.totalOrders.formatted}</div>
                </div>
                <div className={`kpi-card-trend ${dashboardStats.totalOrders.changeType === 'increase' ? 'up' : 'down'}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {dashboardStats.totalOrders.changeType === 'increase' ? (
                      <path d="M8 3V13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M8 13V3M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                  {Math.abs(dashboardStats.totalOrders.change)}%
                </div>
              </div>
              <div className="kpi-card-footer">
                <span className="kpi-card-footer-text">{dashboardStats.period.current}</span>
                <button className="kpi-card-button">Details</button>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                {dashboardStats.period.previous} ({dashboardStats.totalOrders.previousFormatted})
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-header">
                <div>
                  <div className="kpi-card-title">Pending & Canceled</div>
                  <div className="kpi-card-value">
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>{dashboardStats.pendingCanceled.total}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{dashboardStats.pendingCanceled.pending} Pending</div>
                  </div>
                </div>
                <div className={`kpi-card-trend ${dashboardStats.pendingCanceled.changeType === 'decrease' ? 'down' : 'up'}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {dashboardStats.pendingCanceled.changeType === 'decrease' ? (
                      <path d="M8 13V3M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M8 3V13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                  {Math.abs(dashboardStats.pendingCanceled.change)}%
                </div>
              </div>
              <div className="kpi-card-footer">
                <span className="kpi-card-footer-text">{dashboardStats.period.current} • {dashboardStats.pendingCanceled.canceled} Canceled</span>
                <button className="kpi-card-button">Details</button>
              </div>
            </div>
          </div>
          )}

          {/* Charts Row */}
          <div className="dashboard-charts-grid">
            {/* Transaction Table */}
            <div className="transaction-card">
              <div className="transaction-header">
                <h2 className="transaction-title">Transaction</h2>
                <button className="filter-btn">
                  Filter
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '0.5rem' }}>
                    <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              {transactionsLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  Loading transactions...
                </div>
              ) : transactionsError ? (
                <div style={{ padding: '1rem', color: '#991b1b', background: '#fef2f2', borderRadius: '8px', margin: '1rem' }}>
                  Error: {transactionsError}
                </div>
              ) : (
                <div className="transaction-table-container">
                  <table className="transaction-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Id Customer</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{transaction.no}.</td>
                            <td>{transaction.customerId}</td>
                            <td>{transaction.orderDate}</td>
                            <td>
                              <span className={`status-badge status-${transaction.statusColor === 'green' ? 'paid' : transaction.statusColor === 'orange' ? 'pending' : 'paid'}`}>
                                <span className="status-dot"></span>
                                {transaction.status}
                              </span>
                            </td>
                            <td>{transaction.amountFormatted}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="transaction-footer">
                <button className="details-btn">Details</button>
              </div>
            </div>

            {/* Add New Product Card */}
            <div className="add-product-card">
              <div className="add-product-header">
                <h2 className="add-product-title">Add New Product</h2>
                <button className="add-new-btn" onClick={handleAddNewProduct}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2C4.5 2 1.73 4.11 1 7C1.73 9.89 4.5 12 8 12C11.5 12 14.27 9.89 15 7C14.27 4.11 11.5 2 8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 9.5C9.38071 9.5 10.5 8.38071 10.5 7C10.5 5.61929 9.38071 4.5 8 4.5C6.61929 4.5 5.5 5.61929 5.5 7C5.5 8.38071 6.61929 9.5 8 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View
                </button>
              </div>

              {/* Categories Section */}
              <div className="add-product-section">
                <h3 className="section-title">Categories</h3>
                {productsLoading ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                    Loading categories...
                  </div>
                ) : categories.length > 0 ? (
                  <>
                    <div className="category-list">
                      {categories.map((category, index) => (
                        <div key={index} className="category-item">
                          <div className="category-icon">
                            <img 
                              src={category.image} 
                              alt={category.name}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=80&h=80&fit=crop'
                              }}
                            />
                          </div>
                          <span className="category-name">{category.name}</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                    <div className="see-more-link">See more</div>
                  </>
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                    No categories available
                  </div>
                )}
              </div>

              {/* Product Section */}
              <div className="add-product-section">
                <h3 className="section-title">Product</h3>
                {productsLoading ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                    Loading products...
                  </div>
                ) : productsError ? (
                  <div style={{ padding: '1rem', color: '#991b1b', fontSize: '0.875rem' }}>
                    Error loading products
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div className="product-list">
                      {products.map((product) => {
                        const price = new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 2
                        }).format(parseFloat(product.price || 0))
                        
                        return (
                          <div key={product.id} className="product-item">
                            <div className="product-icon">
                              <img 
                                src={product.image_url || 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=96&h=96&fit=crop'} 
                                alt={product.name}
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=96&h=96&fit=crop'
                                }}
                              />
                            </div>
                            <div className="product-info">
                              <div className="product-name">{product.name || 'Unnamed Product'}</div>
                              <div className="product-price">{price}</div>
                            </div>
                            <button className="add-product-btn" onClick={() => handleAddNewProduct()}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7C9.5 5.61929 8.38071 4.5 7 4.5C5.61929 4.5 4.5 5.61929 4.5 7C4.5 8.38071 5.61929 9.5 7 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              View
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <div className="see-more-link">See more</div>
                  </>
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                    No products available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Best Selling Product */}
          <div className="best-selling-card">
            <div className="best-selling-header">
              <h2 className="best-selling-title">Best selling product</h2>
              <button className="filter-btn">
                Filter
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '0.5rem' }}>
                  <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {bestSellingLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                Loading best selling products...
              </div>
            ) : bestSellingError ? (
              <div style={{ 
                background: '#fef2f2', 
                border: '1px solid #fecaca', 
                color: '#991b1b', 
                padding: '1rem', 
                borderRadius: '8px',
                margin: '1rem'
              }}>
                Error loading best selling products: {bestSellingError}
              </div>
            ) : (
              <div className="best-selling-table-container">
                <table className="best-selling-table">
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>TOTAL ORDER</th>
                      <th>STATUS</th>
                      <th>PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestSellingProducts.length > 0 ? (
                      bestSellingProducts.map((product) => {
                        const price = new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 2
                        }).format(product.price)
                        
                        // Determine stock status
                        const stockStatus = product.stockStatus?.toLowerCase() || 'in stock'
                        const statusClass = stockStatus.includes('out') ? 'status-stock-out' : 
                                          stockStatus.includes('low') ? 'status-stock-low' : 
                                          'status-stock'
                        const statusLabel = stockStatus.includes('out') ? 'Stock out' :
                                          stockStatus.includes('low') ? 'Low Stock' :
                                          'Stock'
                        
                        return (
                          <tr key={product.id}>
                            <td>
                              <div className="product-cell">
                                <img 
                                  src={product.image_url} 
                                  alt={product.name}
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=48&h=48&fit=crop'
                                  }}
                                />
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td>{product.totalOrders}</td>
                            <td>
                              <span className={`status-badge ${statusClass}`}>
                                <span className="status-dot"></span>
                                {statusLabel}
                              </span>
                            </td>
                            <td>{price}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                          No best selling products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="best-selling-footer">
              <button className="details-btn">Details</button>
            </div>
          </div>
        </div>
        )}

        {activeMenu === 'orders' && (
        <div className="dashboard-content">
          <div className="order-management-header">
            <div>
              <h1 className="dashboard-title">Order Management</h1>
              <p className="order-list-subtitle">Order List</p>
            </div>
            <div className="order-action-buttons">
              <button className="add-order-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Order
              </button>
              <button className="more-action-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {ordersLoading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Loading orders...
            </div>
          )}

          {/* Error State */}
          {ordersError && (
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              color: '#991b1b', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              Error loading orders: {ordersError}
            </div>
          )}

          {/* Summary Cards */}
          {ordersStats && (
          <div className="order-summary-grid">
            <div className="order-summary-card">
              <div className="order-summary-header">
                <div className="order-summary-title">Total Orders</div>
                <button className="order-card-menu-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className="order-summary-value">{ordersStats.totalOrders.formatted}</div>
              <div className="order-summary-footer">
                <span className="order-summary-period">{ordersStats.period.current}</span>
                <span className={`order-summary-trend ${ordersStats.totalOrders.changeType === 'increase' ? 'up' : 'down'}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {ordersStats.totalOrders.changeType === 'increase' ? (
                      <path d="M6 2V10M6 2L3 5M6 2L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M6 10V2M6 10L3 7M6 10L9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                  {Math.abs(ordersStats.totalOrders.change)}%
                </span>
              </div>
            </div>

            <div className="order-summary-card">
              <div className="order-summary-header">
                <div className="order-summary-title">New Orders</div>
                <button className="order-card-menu-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className="order-summary-value">{ordersStats.totalOrders.value}</div>
              <div className="order-summary-footer">
                <span className="order-summary-period">{ordersStats.period.current}</span>
                <span className={`order-summary-trend ${ordersStats.totalOrders.changeType === 'increase' ? 'up' : 'down'}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {ordersStats.totalOrders.changeType === 'increase' ? (
                      <path d="M6 2V10M6 2L3 5M6 2L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M6 10V2M6 10L3 7M6 10L9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                  {Math.abs(ordersStats.totalOrders.change)}%
                </span>
              </div>
            </div>

            <div className="order-summary-card">
              <div className="order-summary-header">
                <div className="order-summary-title">Completed Orders</div>
                <button className="order-card-menu-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className="order-summary-value">{ordersStats.totalOrders.value - ordersStats.pendingCanceled.total}</div>
              <div className="order-summary-footer">
                <span className="order-summary-period">{ordersStats.period.current}</span>
                <span className="order-summary-trend">
                  {ordersStats.totalOrders.value > 0 
                    ? Math.round(((ordersStats.totalOrders.value - ordersStats.pendingCanceled.total) / ordersStats.totalOrders.value) * 100)
                    : 0}%
                </span>
              </div>
            </div>

            <div className="order-summary-card">
              <div className="order-summary-header">
                <div className="order-summary-title">Canceled Orders</div>
                <button className="order-card-menu-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className="order-summary-value">{ordersStats.pendingCanceled.canceled}</div>
              <div className="order-summary-footer">
                <span className="order-summary-period">{ordersStats.period.current}</span>
                <span className={`order-summary-trend ${ordersStats.pendingCanceled.changeType === 'decrease' ? 'down' : 'up'}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {ordersStats.pendingCanceled.changeType === 'decrease' ? (
                      <path d="M6 10V2M6 10L3 7M6 10L9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M6 2V10M6 2L3 5M6 2L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                  {Math.abs(ordersStats.pendingCanceled.change)}%
                </span>
              </div>
            </div>
          </div>
          )}

          {/* Order Table Controls */}
          <div className="order-table-controls">
            <div className="order-tabs">
                  <button 
                className={`order-tab ${orderTab === 'all' ? 'active' : ''}`}
                onClick={() => setOrderTab('all')}
                  >
                All order {ordersStats ? `(${ordersStats.totalOrders.value})` : ''}
                  </button>
                  <button 
                className={`order-tab ${orderTab === 'completed' ? 'active' : ''}`}
                onClick={() => setOrderTab('completed')}
              >
                Completed
              </button>
              <button 
                className={`order-tab ${orderTab === 'pending' ? 'active' : ''}`}
                onClick={() => setOrderTab('pending')}
              >
                Pending
              </button>
              <button 
                className={`order-tab ${orderTab === 'canceled' ? 'active' : ''}`}
                onClick={() => setOrderTab('canceled')}
                  >
                Canceled
                  </button>
                </div>
            <div className="order-search-controls">
              <div className="order-search-bar">
                <svg className="order-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 15L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="text" placeholder="Search order report" />
              </div>
              <button className="order-control-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="order-control-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 6L8 3L11 6M5 10L8 13L11 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="order-control-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </button>
                </div>
                </div>

          {/* Order Table */}
          <div className="order-table-card">
            <table className="order-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>No.</th>
                  <th>Tracking Number</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersLoading ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      Loading orders...
                    </td>
                  </tr>
                ) : ordersError ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#991b1b' }}>
                      Error: {ordersError}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => {
                    // Format date
                    const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                    
                    // Format amount
                    const amount = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 2
                    }).format(parseFloat(order.total_amount || 0))

                    // Get tracking number
                    const trackingNumber = order.tracking_number || order.trackingNumber || order.tracking_code || order.trackingCode || 'N/A'

                    // Get first product name from items if available
                    let productName = 'Multiple Products'
                    let productImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=40&h=40&fit=crop'
                    
                    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
                      productName = order.items[0].name || order.items[0].product_name || 'Product'
                      productImage = order.items[0].image_url || productImage
                    }

                    // Status mapping
                    const statusConfig = {
                      'delivered': { label: 'Delivered', icon: 'check', className: 'delivered' },
                      'shipped': { label: 'Shipped', icon: 'shipped', className: 'shipped' },
                      'processing': { label: 'Processing', icon: 'processing', className: 'processing' },
                      'confirmed': { label: 'Confirmed', icon: 'check', className: 'confirmed' },
                      'pending': { label: 'Pending', icon: 'pending', className: 'pending' },
                      'canceled': { label: 'Cancelled', icon: 'cancel', className: 'cancelled' },
                      'cancelled': { label: 'Cancelled', icon: 'cancel', className: 'cancelled' }
                    }
                    
                    const currentStatus = order.status?.toLowerCase() || 'pending'
                    const status = statusConfig[currentStatus] || statusConfig['pending']
                    
                    // Get next available status in progression
                    const getNextStatus = (current) => {
                      const statusProgression = ['confirmed', 'processing', 'shipped', 'delivered']
                      const currentIndex = statusProgression.indexOf(current)
                      if (currentIndex === -1 || currentIndex === statusProgression.length - 1) {
                        return null // No next status available
                      }
                      return statusProgression[currentIndex + 1]
                    }
                    
                    const nextStatus = getNextStatus(currentStatus)
                    
                    // Payment status
                    const paymentStatus = order.payment_status || 'pending'
                    const isPaid = paymentStatus === 'paid'

                    return (
                      <tr key={order.id}>
                        <td><input type="checkbox" /></td>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>{trackingNumber}</td>
                        <td>
                          <div className="order-product-cell">
                            <img src={productImage} alt={productName} />
                            <span>{productName}</span>
                          </div>
                        </td>
                        <td>{orderDate}</td>
                        <td>{amount}</td>
                        <td>
                          <span className={`payment-badge ${isPaid ? 'paid' : 'unpaid'}`}>
                            <span className="payment-dot"></span>
                            {isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td>
                          <div className="order-status-container">
                            <span className={`order-status ${status.className}`}>
                              {status.icon === 'check' && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.6667 3.5L5.25 9.91667L2.33334 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                              {status.icon === 'shipped' && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 5L7 1L13 5V11C13 11.5304 12.7893 12.0391 12.4142 12.4142C12.0391 12.7893 11.5304 13 11 13H3C2.46957 13 1.96086 12.7893 1.58579 12.4142C1.21071 12.0391 1 11.5304 1 11V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M5 13V7H9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                              {status.icon === 'processing' && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7 1V3M7 11V13M3 7H1M13 7H11M3.343 3.343L4.757 4.757M9.243 9.243L10.657 10.657M3.343 10.657L4.757 9.243M9.243 4.757L10.657 3.343" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              )}
                              {status.icon === 'pending' && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2"/>
                                  <path d="M7 4V7L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              )}
                              {status.icon === 'cancel' && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              )}
                              {status.label}
                            </span>
                            {currentStatus !== 'cancelled' && currentStatus !== 'canceled' && (
                              <select
                                className="order-status-select"
                                value={currentStatus}
                                onChange={(e) => {
                                  const newStatus = e.target.value
                                  if (newStatus !== currentStatus) {
                                    handleOrderStatusChange(order.id, currentStatus, newStatus)
                                    // Reset select value if user cancels
                                    setTimeout(() => {
                                      e.target.value = currentStatus
                                    }, 0)
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Show current status and all forward progression statuses */}
                                {['confirmed', 'processing', 'shipped', 'delivered'].map(s => {
                                  const statusProgression = ['confirmed', 'processing', 'shipped', 'delivered']
                                  const currentIndex = statusProgression.indexOf(currentStatus)
                                  const optionIndex = statusProgression.indexOf(s)
                                  
                                  // Only show current status and statuses after it (forward progression)
                                  if (optionIndex >= currentIndex && optionIndex !== -1) {
                                    return (
                                      <option key={s} value={s}>{statusConfig[s]?.label}</option>
                                    )
                                  }
                                  return null
                                })}
                                {/* Add cancel option */}
                                <option value="canceled">Cancel Order</option>
                              </select>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="order-actions">
                            <button
                              className="order-action-btn delete-btn"
                              onClick={() => {
                                const trackingNum = order.tracking_number || order.trackingNumber || order.tracking_code || order.trackingCode || 'N/A'
                                const orderUuid = order.uuid || order.id
                                if (window.confirm(`Are you sure you want to delete order with tracking number "${trackingNum}"? This action cannot be undone.`)) {
                                  deleteOrder(orderUuid)
                                }
                              }}
                              title="Delete Order"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M13 4V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V4M6 7V11M10 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
            </div>

          {/* Order Status Update Modal */}
          {isOrderStatusModalOpen && (
            <div className="modal-overlay" onClick={() => setIsOrderStatusModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">
                    {orderStatusUpdate.newStatus === 'shipped' ? 'Mark as Shipped' : 'Cancel Order'}
                  </h2>
                  <button 
                    className="modal-close-btn"
                    onClick={() => setIsOrderStatusModalOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <div className="modal-body">
                  {orderStatusUpdate.newStatus === 'shipped' ? (
                    <div className="form-group">
                      <label className="form-label">
                        Tracking Number <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter tracking number (e.g., TRK-2024-123456)"
                        value={orderStatusUpdate.trackingNumber}
                        onChange={(e) => setOrderStatusUpdate(prev => ({ ...prev, trackingNumber: e.target.value }))}
                        autoFocus
                      />
                      <p className="form-help-text">
                        This tracking number will be sent to the customer.
                      </p>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">
                        Cancellation Notes (Optional)
                      </label>
                      <textarea
                        className="form-textarea"
                        placeholder="Enter reason for cancellation (e.g., Customer requested cancellation)"
                        value={orderStatusUpdate.notes}
                        onChange={(e) => setOrderStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                        rows="4"
                        autoFocus
                      />
                      <p className="form-help-text">
                        Optional notes about why this order is being canceled.
                      </p>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="modal-btn cancel-btn"
                    onClick={() => setIsOrderStatusModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal-btn submit-btn"
                    onClick={() => {
                      if (orderStatusUpdate.newStatus === 'shipped' && !orderStatusUpdate.trackingNumber.trim()) {
                        alert('Please enter a tracking number')
                        return
                      }
                      updateOrderStatus(
                        orderStatusUpdate.orderId,
                        orderStatusUpdate.newStatus,
                        orderStatusUpdate.trackingNumber || null,
                        orderStatusUpdate.notes || null
                      )
                    }}
                    disabled={orderStatusUpdate.newStatus === 'shipped' && !orderStatusUpdate.trackingNumber.trim()}
                  >
                    {orderStatusUpdate.newStatus === 'shipped' ? 'Mark as Shipped' : 'Cancel Order'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="order-pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <div className="pagination-numbers">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className={`pagination-number ${currentPage === num ? 'active' : ''}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
              <span className="pagination-ellipsis">...</span>
              <button
                className={`pagination-number ${currentPage === 24 ? 'active' : ''}`}
                onClick={() => setCurrentPage(24)}
              >
                24
              </button>
              </div>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.min(24, currentPage + 1))}
              disabled={currentPage === 24}
            >
              Next →
            </button>
              </div>
            </div>
        )}

        {activeMenu === 'customers' && (
        <div className="dashboard-content">
          <h1 className="dashboard-title">Customers</h1>

          {/* Summary Cards */}
          <div className="customer-summary-grid">
            <div className="customer-summary-card">
              <div className="customer-summary-header">
                <div className="customer-summary-title">Total Customers</div>
                <button className="order-card-menu-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
            </div>
              <div className="customer-summary-value">
                {customerMetricsLoading ? 'Loading...' : 
                 customerMetricsError ? 'Error' : 
                 customerMetrics?.totalCustomers?.formatted || customerMetrics?.totalCustomers?.value || '0'}
              </div>
              <div className="customer-summary-footer">
                <span className="customer-summary-period">{customerMetrics?.period?.current || 'Last 7 days'}</span>
                {customerMetrics?.totalCustomers?.changeType && (
                  <span className={`customer-summary-trend ${customerMetrics.totalCustomers.changeType === 'increase' ? 'up' : 'down'}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2V10M6 2L3 5M6 2L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                    {Math.abs(customerMetrics.totalCustomers.change || 0).toFixed(1)}%
                </span>
                )}
                  </div>
            </div>

            <div className="customer-summary-card">
              <div className="customer-summary-header">
                <div className="customer-summary-title">New Customers</div>
                <button className="order-card-menu-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                    </svg>
                </button>
                  </div>
              <div className="customer-summary-value">
                {customerMetricsLoading ? 'Loading...' : 
                 customerMetricsError ? 'Error' :
                 customerMetrics?.newCustomers?.formatted || customerMetrics?.newCustomers?.value || '0'}
              </div>
              <div className="customer-summary-footer">
                <span className="customer-summary-period">{customerMetrics?.period?.current || 'Last 7 days'}</span>
                {customerMetrics?.newCustomers?.changeType && (
                  <span className={`customer-summary-trend ${customerMetrics.newCustomers.changeType === 'increase' ? 'up' : 'down'}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2V10M6 2L3 5M6 2L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                    {Math.abs(customerMetrics.newCustomers.change || 0).toFixed(1)}%
                </span>
                )}
                </div>
                  </div>

            <div className="customer-summary-card">
              <div className="customer-summary-header">
                <div className="customer-summary-title">Visitor</div>
                <button className="order-card-menu-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                    </svg>
                </button>
                  </div>
              <div className="customer-summary-value">
                {customerMetricsLoading ? 'Loading...' : 
                 customerMetricsError ? 'Error' :
                 customerMetrics?.visitors?.formatted || customerMetrics?.visitors?.value || '0'}
              </div>
              <div className="customer-summary-footer">
                <span className="customer-summary-period">{customerMetrics?.period?.current || 'Last 7 days'}</span>
                {customerMetrics?.visitors?.changeType && (
                  <span className={`customer-summary-trend ${customerMetrics.visitors.changeType === 'increase' ? 'up' : 'down'}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2V10M6 2L3 5M6 2L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                    {Math.abs(customerMetrics.visitors.change || 0).toFixed(1)}%
                </span>
                )}
                </div>
                  </div>
          </div>

          {/* Customer Overview Chart */}
          <div className="customer-overview-card">
            <div className="customer-overview-header">
              <h2 className="customer-overview-title">Customer Overview</h2>
              <div className="customer-chart-toggle">
                <button 
                  className={`customer-toggle-btn ${customerChartPeriod === 'this-week' ? 'active' : ''}`}
                  onClick={() => setCustomerChartPeriod('this-week')}
                >
                  This week
                </button>
                <button 
                  className={`customer-toggle-btn ${customerChartPeriod === 'last-week' ? 'active' : ''}`}
                  onClick={() => setCustomerChartPeriod('last-week')}
                >
                  Last week
                </button>
              </div>
            </div>
            {customerOverviewLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Loading overview data...
              </div>
            ) : customerOverviewError ? (
              <div style={{ padding: '1rem', color: '#991b1b', background: '#fef2f2', borderRadius: '8px', margin: '1rem' }}>
                Error: {customerOverviewError}
              </div>
            ) : (
              <>
            <div className="customer-metrics">
              <div className="customer-metric">
                <div className="customer-metric-label">Active Customers</div>
                    <div className="customer-metric-value active">
                      {customerOverview?.summary?.activeCustomersFormatted || customerOverview?.summary?.activeCustomers || '0'}
                    </div>
              </div>
              <div className="customer-metric">
                <div className="customer-metric-label">Repeat Customers</div>
                    <div className="customer-metric-value">
                      {customerOverview?.summary?.repeatCustomersFormatted || customerOverview?.summary?.repeatCustomers || '0'}
                    </div>
              </div>
              <div className="customer-metric">
                <div className="customer-metric-label">Shop Visitor</div>
                    <div className="customer-metric-value">
                      {customerOverview?.summary?.shopVisitorFormatted || customerOverview?.summary?.shopVisitor || '0'}
                    </div>
              </div>
              <div className="customer-metric">
                <div className="customer-metric-label">Conversion Rate</div>
                    <div className="customer-metric-value">
                      {customerOverview?.summary?.conversionRate ? `${customerOverview.summary.conversionRate}%` : '0%'}
                    </div>
              </div>
            </div>
            <div className="customer-chart-placeholder">
              <div className="chart-axis">
                <div className="chart-y-axis">
                      {(() => {
                        const trends = customerOverview?.trends || []
                        const maxValue = trends.length > 0 ? Math.max(...trends.map(t => t.count || 0), 1) : 1
                        const steps = 5
                        return Array.from({ length: steps + 1 }, (_, i) => {
                          const value = maxValue * (1 - i / steps)
                          return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : Math.ceil(value).toString()
                        }).map((label, i) => <span key={i}>{label}</span>)
                      })()}
                </div>
                <div className="chart-area">
                      {(() => {
                        const trends = customerOverview?.trends || []
                        const hasData = trends.length > 0
                        const dataPoints = hasData ? trends.map(t => t.count || 0) : [0, 0, 0, 0, 0, 0, 0]
                        const maxValue = hasData ? Math.max(...dataPoints, 1) : 1
                        const minValue = 0
                        const range = maxValue - minValue || 1
                        const width = 600
                        const height = 200
                        const padding = 50
                        const chartWidth = width - padding * 2
                        const chartHeight = height - padding * 2
                        const points = dataPoints.map((value, index) => {
                          const x = padding + (index / (dataPoints.length - 1 || 1)) * chartWidth
                          const y = padding + chartHeight - ((value - minValue) / range) * chartHeight
                          return `${x},${y}`
                        }).join(' ')
                        const pathD = `M ${points.split(' ').map((p, i) => i === 0 ? p : `L ${p}`).join(' ')}`
                        const fillPathD = `${pathD} L ${padding + chartWidth},${padding + chartHeight} L ${padding},${padding + chartHeight} Z`
                        return (
                  <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="customerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.05"/>
                      </linearGradient>
                    </defs>
                            <path d={pathD} 
                          stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d={fillPathD} 
                          fill="url(#customerGradient)"/>
                            {dataPoints.map((value, index) => {
                              const x = padding + (index / (dataPoints.length - 1 || 1)) * chartWidth
                              const y = padding + chartHeight - ((value - minValue) / range) * chartHeight
                              return (
                                <circle key={index} cx={x} cy={y} r="6" fill="#4CAF50" stroke="#ffffff" strokeWidth="2"/>
                              )
                            })}
                  </svg>
                        )
                      })()}
                  <div className="chart-x-axis">
                        {customerOverview?.trends?.map((trend, i) => (
                          <span key={i}>{trend.day}</span>
                        )) || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => <span key={i}>{day}</span>)}
                  </div>
                </div>
              </div>
            </div>
              </>
            )}
          </div>

          {/* Customer List Table */}
          <div className="customer-table-card">
            {/* Search and Filter Controls */}
            <div className="order-search-controls" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="order-search-bar" style={{ flex: '1', minWidth: '200px' }}>
                <svg className="order-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search customers..." 
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>
              <select 
                value={customerStatusFilter}
                onChange={(e) => {
                  setCustomerStatusFilter(e.target.value)
                  setCustomerPage(1)
                }}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="vip">VIP</option>
              </select>
              <select 
                value={customerSortBy}
                onChange={(e) => {
                  setCustomerSortBy(e.target.value)
                  setCustomerPage(1)
                }}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="order_count">Order Count</option>
                <option value="total_spend">Total Spend</option>
                <option value="name">Name</option>
                <option value="created_at">Date Joined</option>
              </select>
              <button
                onClick={() => {
                  setCustomerSortOrder(customerSortOrder === 'asc' ? 'desc' : 'asc')
                  setCustomerPage(1)
                }}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {customerSortOrder === 'asc' ? '↑' : '↓'} {customerSortOrder === 'asc' ? 'Asc' : 'Desc'}
              </button>
            </div>
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer Id</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Order Count</th>
                  <th>Total Spend</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customersLoading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      Loading customers...
                    </td>
                  </tr>
                ) : customersError ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#991b1b' }}>
                      Error: {customersError}
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((customer, index) => {
                    // Use the exact structure from API response
                    const customerId = customer.customerId || customer.id || `CUST${index + 1}`
                    const customerName = customer.name && customer.name !== 'N/A' ? customer.name : (customer.email ? customer.email.split('@')[0] : 'Unknown')
                    const phone = customer.phone && customer.phone !== 'N/A' ? customer.phone : 'N/A'
                    const orderCount = customer.orderCount || 0
                    const totalSpend = customer.totalSpend || 0
                    const status = customer.status || 'Active'
                    const statusClass = status.toLowerCase() === 'vip' ? 'vip' : status.toLowerCase() === 'inactive' ? 'inactive' : 'active'
                    const statusLabel = status
                    
                    return (
                      <tr key={customer.id || customerId || index}>
                        <td>{customerId}</td>
                        <td>{customerName}</td>
                        <td>{phone}</td>
                        <td>{orderCount}</td>
                        <td>{customer.totalSpendFormatted || new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(totalSpend)}</td>
                        <td>
                          <span className={`customer-status ${statusClass}`}>
                      <span className="customer-status-dot"></span>
                            {statusLabel}
                    </span>
                  </td>
                  <td>
                    <div className="customer-actions">
                            <button 
                              className="customer-action-btn"
                              onClick={() => {
                                setSelectedCustomer(customer)
                                setIsCustomerModalOpen(true)
                              }}
                              title="View customer details"
                            >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 5V8M8 11H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                      </button>
                            <button 
                              className="customer-action-btn" 
                              title="Delete customer"
                              onClick={() => deleteCustomer(customer.id)}
                            >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4H14M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                  </div>
                  </td>
                </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="order-pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCustomerPage(Math.max(1, customerPage - 1))}
              disabled={customerPage === 1 || customersLoading}
            >
              ← Previous
            </button>
            <div className="pagination-numbers">
              {(() => {
                const totalPages = customerTotalPages || 1
                const currentPage = customerPage
                const pages = []
                
                if (totalPages <= 7) {
                  // Show all pages if 7 or fewer
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                  }
                } else {
                  // Show first page
                  pages.push(1)
                  
                  if (currentPage > 3) {
                    pages.push('ellipsis-start')
                  }
                  
                  // Show pages around current page
                  const start = Math.max(2, currentPage - 1)
                  const end = Math.min(totalPages - 1, currentPage + 1)
                  
                  for (let i = start; i <= end; i++) {
                    pages.push(i)
                  }
                  
                  if (currentPage < totalPages - 2) {
                    pages.push('ellipsis-end')
                  }
                  
                  // Show last page
                  pages.push(totalPages)
                }
                
                return pages.map((page, index) => {
                  if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                    return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                  }
                  return (
                    <button
                      key={page}
                      className={`pagination-number ${customerPage === page ? 'active' : ''}`}
                      onClick={() => setCustomerPage(page)}
                    >
                      {page}
                    </button>
                  )
                })
              })()}
        </div>
            <button 
              className="pagination-btn"
              onClick={() => setCustomerPage(Math.min(customerTotalPages || 1, customerPage + 1))}
              disabled={customerPage >= (customerTotalPages || 1) || customersLoading}
            >
              Next →
            </button>
          </div>
        </div>
        )}

        {/* Customer Details Modal */}
        {isCustomerModalOpen && selectedCustomer && (
          <div 
            className="modal-overlay"
            onClick={() => setIsCustomerModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
          >
            <div 
              className="customer-modal"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>Customer Details</h2>
                <button
                  onClick={() => setIsCustomerModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    color: '#6b7280',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6'
                    e.target.style.color = '#111827'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.color = '#6b7280'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Customer ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Customer ID</label>
                  <div style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{selectedCustomer.customerId || selectedCustomer.id}</div>
                </div>

                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Name</label>
                  <div style={{ fontSize: '1rem', color: '#111827' }}>
                    {selectedCustomer.name && selectedCustomer.name !== 'N/A' ? selectedCustomer.name : 'Not provided'}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Email</label>
                  <div style={{ fontSize: '1rem', color: '#111827' }}>{selectedCustomer.email || 'Not provided'}</div>
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Phone</label>
                  <div style={{ fontSize: '1rem', color: '#111827' }}>
                    {selectedCustomer.phone && selectedCustomer.phone !== 'N/A' ? selectedCustomer.phone : 'Not provided'}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Status</label>
                  <div>
                    <span className={`customer-status ${(selectedCustomer.status || 'active').toLowerCase() === 'vip' ? 'vip' : (selectedCustomer.status || 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active'}`}>
                      <span className="customer-status-dot"></span>
                      {selectedCustomer.status || 'Active'}
                    </span>
                  </div>
                </div>

                {/* Order Count */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Total Orders</label>
                  <div style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{selectedCustomer.orderCount || 0}</div>
                </div>

                {/* Total Spend */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Total Spend</label>
                  <div style={{ fontSize: '1.25rem', color: '#111827', fontWeight: '600' }}>
                    {selectedCustomer.totalSpendFormatted || new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(selectedCustomer.totalSpend || 0)}
                  </div>
                </div>

                {/* Date Joined */}
                {selectedCustomer.createdAt && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>Date Joined</label>
                    <div style={{ fontSize: '1rem', color: '#111827' }}>
                      {new Date(selectedCustomer.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  onClick={() => setIsCustomerModalOpen(false)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white'
                  }}
                >
                  Close
                      </button>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'coupon' && (
        <div className="dashboard-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 className="dashboard-title">Coupon Codes</h1>
            <button
              onClick={() => {
                setSelectedCoupon(null)
                setCouponFormData({
                  code: '',
                  description: '',
                  discountType: 'percentage',
                  discountValue: '',
                  minPurchase: '',
                  maxDiscount: '',
                  usageLimit: '',
                  userLimit: '',
                  expiryDate: '',
                  status: 'active'
                })
                setIsCouponModalOpen(true)
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#059669'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#10b981'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
              Create Coupon
                      </button>
                </div>

          {/* Coupons Table */}
          <div className="customer-table-card">
            {couponsLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Loading coupons...
              </div>
            ) : couponsError ? (
              <div style={{ padding: '1rem', color: '#991b1b', background: '#fef2f2', borderRadius: '8px', margin: '1rem' }}>
                Error: {couponsError}
              </div>
            ) : coupons.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>No coupons found. Create your first coupon code!</p>
              </div>
            ) : (
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>Coupon Code</th>
                    <th>Discount</th>
                    <th>Min Purchase</th>
                    <th>Usage Limit</th>
                    <th>Used</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id || coupon.code}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ 
                            fontFamily: 'monospace', 
                            fontSize: '0.875rem', 
                            fontWeight: '600',
                            backgroundColor: '#f3f4f6',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            color: '#111827'
                          }}>
                            {coupon.code}
                    </span>
                        </div>
                  </td>
                  <td>
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue || coupon.discount}%`
                          : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(coupon.discountValue || coupon.discount || 0)
                        }
                  </td>
                      <td>
                        {coupon.minPurchase || coupon.minOrderAmount
                          ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(coupon.minPurchase || coupon.minOrderAmount)
                          : 'No minimum'
                        }
                      </td>
                      <td>{coupon.usageLimit || 'Unlimited'}</td>
                      <td>{coupon.usedCount || coupon.used || 0}</td>
                      <td>
                        {coupon.expiryDate || coupon.validUntil
                          ? new Date(coupon.expiryDate || coupon.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                          : 'No expiry'
                        }
                      </td>
                      <td>
                        <span className={`customer-status ${(coupon.isActive !== false && coupon.status !== 'inactive') ? 'active' : 'inactive'}`}>
                      <span className="customer-status-dot"></span>
                          {coupon.isActive === false || coupon.status === 'inactive' ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="customer-actions">
                          <button 
                            className="customer-action-btn"
                            onClick={() => {
                              setSelectedCoupon(coupon)
                              setCouponFormData({
                                code: coupon.code || '',
                                description: coupon.description || '',
                                discountType: coupon.discountType || 'percentage',
                                discountValue: coupon.discountValue || coupon.discount || '',
                                minPurchase: coupon.minPurchase || coupon.minOrderAmount || '',
                                maxDiscount: coupon.maxDiscount || coupon.maxDiscountAmount || '',
                                usageLimit: coupon.usageLimit || '',
                                userLimit: coupon.userLimit || '1',
                                expiryDate: coupon.expiryDate || coupon.validUntil ? (coupon.expiryDate || coupon.validUntil).split('T')[0] : '',
                                status: coupon.isActive === false ? 'inactive' : 'active'
                              })
                              setIsCouponModalOpen(true)
                            }}
                            title="Edit coupon"
                          >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.68602 11.9444 1.59129C12.1726 1.49657 12.4163 1.44775 12.6625 1.44775C12.9087 1.44775 13.1524 1.49657 13.3806 1.59129C13.6087 1.68602 13.8166 1.82491 13.9917 2.00001C14.1668 2.17511 14.3057 2.38301 14.4004 2.61112C14.4951 2.83923 14.5439 3.08295 14.5439 3.32918C14.5439 3.5754 14.4951 3.81912 14.4004 4.04723C14.3057 4.27534 14.1668 4.48324 13.9917 4.65834L5.32498 13.325L1.33331 14.6667L2.67498 10.675L11.3333 2.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                          <button 
                            className="customer-action-btn"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
                                // Handle delete - you can add API call here
                                console.log('Delete coupon:', coupon.id)
                              }
                            }}
                            title="Delete coupon"
                          >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4H14M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
              </div>
                  </td>
                </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        )}

        {/* Coupon Create/Edit Modal */}
        {isCouponModalOpen && (
          <div 
            className="modal-overlay"
            onClick={() => setIsCouponModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
          >
            <div 
              className="coupon-modal"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                  {selectedCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
                <button
                  onClick={() => setIsCouponModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    color: '#6b7280',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6'
                    e.target.style.color = '#111827'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.color = '#6b7280'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                await handleCouponSubmit()
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Coupon Code */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Coupon Code <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={couponFormData.code}
                      onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER2024"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                        fontWeight: '600'
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Description
                    </label>
                    <textarea
                      value={couponFormData.description}
                      onChange={(e) => setCouponFormData({ ...couponFormData, description: e.target.value })}
                      placeholder="e.g., 20% off on orders above ₦5000"
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  {/* Discount Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Discount Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={couponFormData.discountType}
                      onChange={(e) => setCouponFormData({ ...couponFormData, discountType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (NGN)</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Discount Value <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max={couponFormData.discountType === 'percentage' ? 100 : undefined}
                      value={couponFormData.discountValue}
                      onChange={(e) => setCouponFormData({ ...couponFormData, discountValue: e.target.value })}
                      placeholder={couponFormData.discountType === 'percentage' ? '10' : '1000'}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Min Purchase */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Minimum Purchase (NGN)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={couponFormData.minPurchase}
                      onChange={(e) => setCouponFormData({ ...couponFormData, minPurchase: e.target.value })}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Max Discount (for percentage) */}
                  {couponFormData.discountType === 'percentage' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Maximum Discount (NGN)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={couponFormData.maxDiscount}
                        onChange={(e) => setCouponFormData({ ...couponFormData, maxDiscount: e.target.value })}
                        placeholder="No limit"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  )}

                  {/* Usage Limit */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Usage Limit (Total)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={couponFormData.usageLimit}
                      onChange={(e) => setCouponFormData({ ...couponFormData, usageLimit: e.target.value })}
                      placeholder="Unlimited"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* User Limit */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      User Limit (Per User)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={couponFormData.userLimit}
                      onChange={(e) => setCouponFormData({ ...couponFormData, userLimit: e.target.value })}
                      placeholder="1"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Number of times a single user can use this coupon</p>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={couponFormData.expiryDate}
                      onChange={(e) => setCouponFormData({ ...couponFormData, expiryDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Status
                    </label>
                    <select
                      value={couponFormData.status}
                      onChange={(e) => setCouponFormData({ ...couponFormData, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(false)}
                    style={{
                      padding: '0.625rem 1.25rem',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: 'white',
                      color: '#374151',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f9fafb'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={couponSubmitting}
                    style={{
                      padding: '0.625rem 1.25rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: couponSubmitting ? '#9ca3af' : '#10b981',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: couponSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: couponSubmitting ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!couponSubmitting) {
                        e.target.style.backgroundColor = '#059669'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!couponSubmitting) {
                        e.target.style.backgroundColor = '#10b981'
                      }
                    }}
                  >
                    {couponSubmitting ? 'Saving...' : (selectedCoupon ? 'Update Coupon' : 'Create Coupon')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeMenu === 'transaction' && (
        <div className="dashboard-content">
          <h1 className="dashboard-title">Transactions</h1>

          {/* Search and Filter Controls */}
          <div className="order-search-controls" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="order-search-bar" style={{ flex: '1', minWidth: '200px' }}>
              <svg className="order-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
              />
            </div>
            <select 
              value={transactionStatusFilter}
              onChange={(e) => {
                setTransactionStatusFilter(e.target.value)
                setTransactionPage(1)
              }}
              style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                background: 'white',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="customer-table-card">
            {transactionsLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Loading transactions...
              </div>
            ) : transactionsError ? (
              <div style={{ padding: '1rem', color: '#991b1b', background: '#fef2f2', borderRadius: '8px', margin: '1rem' }}>
                Error: {transactionsError}
              </div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>No transactions found</p>
              </div>
            ) : (
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Transaction ID</th>
                    <th>Customer ID</th>
                    <th>Order Date</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => {
                    const transactionId = transaction.id || transaction.transactionId || transaction.transaction_id || `TXN${index + 1}`
                    const customerId = transaction.customerId || transaction.customer_id || transaction.customerId || 'N/A'
                    const orderDate = transaction.orderDate || transaction.order_date || transaction.createdAt || transaction.created_at
                    const amount = transaction.amountFormatted || transaction.amount_formatted || transaction.amount
                    const status = transaction.status || 'pending'
                    const statusColor = transaction.statusColor || transaction.status_color || (status.toLowerCase() === 'paid' ? 'green' : status.toLowerCase() === 'pending' ? 'orange' : 'red')
                    const paymentMethod = transaction.paymentMethod || transaction.payment_method || transaction.method || 'N/A'
                    
                    return (
                      <tr key={transactionId}>
                        <td>{(transactionPage - 1) * 20 + index + 1}</td>
                        <td>
                          <span style={{ 
                            fontFamily: 'monospace', 
                            fontSize: '0.875rem',
                            color: '#111827'
                          }}>
                            {String(transactionId).substring(0, 12).toUpperCase()}
                    </span>
                  </td>
                        <td>{customerId}</td>
                        <td>
                          {orderDate 
                            ? new Date(orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'N/A'
                          }
                        </td>
                        <td style={{ fontWeight: '600' }}>
                          {typeof amount === 'string' 
                            ? amount 
                            : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(amount || 0)
                          }
                        </td>
                        <td>{paymentMethod}</td>
                        <td>
                          <span className={`status-badge status-${statusColor === 'green' ? 'paid' : statusColor === 'orange' ? 'pending' : 'paid'}`}>
                            <span className="status-dot"></span>
                            {status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="customer-action-btn"
                            onClick={() => {
                              // You can add a transaction details modal here
                              console.log('View transaction details:', transaction)
                            }}
                            title="View transaction details"
                          >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 5V8M8 11H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                  </td>
                </tr>
                    )
                  })}
              </tbody>
            </table>
            )}
          </div>

          {/* Pagination */}
          {transactionTotalPages > 1 && (
            <div className="order-pagination" style={{ marginTop: '2rem' }}>
            <button 
              className="pagination-btn"
                onClick={() => setTransactionPage(Math.max(1, transactionPage - 1))}
                disabled={transactionPage === 1 || transactionsLoading}
            >
              ← Previous
            </button>
            <div className="pagination-numbers">
                {(() => {
                  const totalPages = transactionTotalPages || 1
                  const currentPage = transactionPage
                  const pages = []
                  
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  } else {
                    pages.push(1)
                    
                    if (currentPage > 3) {
                      pages.push('ellipsis-start')
                    }
                    
                    const start = Math.max(2, currentPage - 1)
                    const end = Math.min(totalPages - 1, currentPage + 1)
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(i)
                    }
                    
                    if (currentPage < totalPages - 2) {
                      pages.push('ellipsis-end')
                    }
                    
                    pages.push(totalPages)
                  }
                  
                  return pages.map((page, index) => {
                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                      return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    }
                    return (
                <button
                        key={page}
                        className={`pagination-number ${transactionPage === page ? 'active' : ''}`}
                        onClick={() => setTransactionPage(page)}
                      >
                        {page}
                </button>
                    )
                  })
                })()}
        </div>
            <button 
              className="pagination-btn"
                onClick={() => setTransactionPage(Math.min(transactionTotalPages || 1, transactionPage + 1))}
                disabled={transactionPage >= (transactionTotalPages || 1) || transactionsLoading}
            >
              Next →
            </button>
          </div>
          )}
        </div>
        )}

        {activeMenu === 'messages' && (
        <div className="dashboard-content">
          <h1 className="dashboard-title">Messages</h1>

          <div className="messages-container">
            {/* Users List Sidebar */}
            <div className="messages-users-sidebar">
              <div className="messages-search">
                <svg className="messages-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 15L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                />
              </div>

              {chatUsersLoading && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  Loading users...
                </div>
              )}

              {chatUsersError && (
                <div style={{ 
                  padding: '1rem', 
                  margin: '1rem',
                  background: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  color: '#991b1b', 
                  borderRadius: '8px'
                }}>
                  Error: {chatUsersError}
                </div>
              )}

              {!chatUsersLoading && !chatUsersError && (
                <div className="messages-users-list">
                  {chatUsers
                    .filter(user => {
                      if (!messageSearch.trim()) return true
                      const search = messageSearch.toLowerCase()
                      const name = (user.name || user.full_name || user.email || '').toLowerCase()
                      const email = (user.email || '').toLowerCase()
                      return name.includes(search) || email.includes(search)
                    })
                    .map(user => (
                      <div
                        key={user.id}
                        className={`messages-user-item ${selectedChatUser?.id === user.id ? 'active' : ''}`}
                        onClick={() => setSelectedChatUser(user)}
                      >
                        <div className="messages-user-avatar">
                          {(user.name || user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="messages-user-info">
                          <div className="messages-user-name">
                            {user.name || user.full_name || user.email || 'Unknown User'}
                          </div>
                          <div className="messages-user-email">
                            {user.email || 'No email'}
                          </div>
                        </div>
                        {messages[user.id] && messages[user.id].length > 0 && (
                          <div className="messages-unread-badge">
                            {messages[user.id].filter(m => m.sender !== 'admin').length}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {!chatUsersLoading && !chatUsersError && chatUsers.filter(user => {
                if (!messageSearch.trim()) return true
                const search = messageSearch.toLowerCase()
                const name = (user.name || user.full_name || user.email || '').toLowerCase()
                const email = (user.email || '').toLowerCase()
                return name.includes(search) || email.includes(search)
              }).length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No users found
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="messages-chat-area">
              {selectedChatUser ? (
                <>
                  <div className="messages-chat-header">
                    <div className="messages-chat-user-info">
                      <div className="messages-chat-avatar">
                        {(selectedChatUser.name || selectedChatUser.full_name || selectedChatUser.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="messages-chat-name">
                          {selectedChatUser.name || selectedChatUser.full_name || selectedChatUser.email || 'Unknown User'}
                        </div>
                        <div className="messages-chat-email">
                          {selectedChatUser.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="messages-chat-messages">
                    {messages[selectedChatUser.id] && messages[selectedChatUser.id].length > 0 ? (
                      <>
                        {messages[selectedChatUser.id].map((msg, index) => {
                          const isAdmin = msg.sender === 'admin'
                          const date = new Date(msg.timestamp || msg.createdAt)
                          const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                          
                          return (
                            <div
                              key={msg.id || index}
                              className={`messages-message ${isAdmin ? 'admin' : 'user'}`}
                            >
                              <div className="messages-message-content">
                                <div className="messages-message-text">{msg.message}</div>
                                <div className="messages-message-time">{timeStr}</div>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </>
                    ) : (
                      <div className="messages-empty-state">
                        <svg width="48" height="48" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3, marginBottom: '1rem' }}>
                          <path d="M18 5V13C18 14.1046 17.1046 15 16 15H6L2 19V5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p style={{ color: '#6b7280', margin: 0 }}>No messages yet. Start a conversation!</p>
                      </div>
                    )}
                  </div>

                  <div className="messages-chat-input">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      disabled={sendingMessage}
                    />
                    <button
                      className="messages-send-btn"
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                    >
                      {sendingMessage ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="spinner">
                          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="24" fill="none">
                            <animate attributeName="stroke-dasharray" values="0 32;16 16;0 32" dur="1s" repeatCount="indefinite"/>
                            <animate attributeName="stroke-dashoffset" values="0;-16;-32" dur="1s" repeatCount="indefinite"/>
                          </circle>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="messages-empty-chat">
                  <svg width="64" height="64" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.2, marginBottom: '1rem' }}>
                    <path d="M18 5V13C18 14.1046 17.1046 15 16 15H6L2 19V5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Select a user to start chatting</h3>
                  <p style={{ color: '#6b7280', margin: 0 }}>Choose a user from the list to send messages</p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {activeMenu === 'categories' && (
        <div className="dashboard-content">
          <h1 className="dashboard-title">Categories</h1>

          {/* Discover Section */}
          <div className="categories-discover-section">
            <div className="discover-header">
              <h2 className="discover-title">Discover</h2>
              <div className="discover-actions">
                <button className="add-product-discover-btn" onClick={() => setActiveMenu('add-products')}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 6V14M6 10H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add Product
                </button>
                <button className="more-action-discover-btn">
                  More Action
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="categories-grid-container">
              {discoverCategoriesLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  Loading categories...
                </div>
              ) : discoverCategories.length > 0 ? (
              <div className="categories-grid">
                  {discoverCategories.map((category, index) => (
                    <div key={category.id || category.name || index} className="category-discover-card">
                  <div className="category-discover-icon">
                        <img 
                          src={category.image || category.image_url || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=64&h=64&fit=crop'} 
                          alt={category.name || 'Category'} 
                        />
                  </div>
                      <span className="category-discover-name">{category.name || 'Unnamed Category'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                  ))}
                  </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No categories available
                </div>
              )}
              <button className="categories-nav-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Product List Section */}
          <div className="categories-product-section">
            <div className="categories-product-tabs">
              <button 
                className={`category-product-tab ${categoryProductTab === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setCategoryProductTab('all')
                  setCategoryPage(1)
                }}
              >
                All Product ({categoryProductCounts.all})
              </button>
              <button 
                className={`category-product-tab ${categoryProductTab === 'featured' ? 'active' : ''}`}
                onClick={() => {
                  setCategoryProductTab('featured')
                  setCategoryPage(1)
                }}
              >
                Featured Products ({categoryProductCounts.featured})
              </button>
              <button 
                className={`category-product-tab ${categoryProductTab === 'sale' ? 'active' : ''}`}
                onClick={() => {
                  setCategoryProductTab('sale')
                  setCategoryPage(1)
                }}
              >
                On Sale ({categoryProductCounts.onSale})
              </button>
              <button 
                className={`category-product-tab ${categoryProductTab === 'out-of-stock' ? 'active' : ''}`}
                onClick={() => {
                  setCategoryProductTab('out-of-stock')
                  setCategoryPage(1)
                }}
              >
                Out of Stock ({categoryProductCounts.outOfStock})
              </button>
            </div>
            <div className="categories-product-controls">
              <div className="categories-product-search">
                <svg className="categories-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 15L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search your product" 
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>
              <button className="categories-control-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="categories-control-btn categories-add-btn" onClick={() => setActiveMenu('add-products')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="categories-control-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Product Table */}
          <div className="categories-product-table-card">
            <table className="categories-product-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>No.</th>
                  <th>Product</th>
                  <th>Created Date</th>
                  <th>Order</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categoryProductsLoading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      Loading products...
                  </td>
                </tr>
                ) : categoryProductsError ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                      Error: {categoryProductsError}
                  </td>
                </tr>
                ) : categoryProducts.length > 0 ? (
                  categoryProducts.map((product, index) => (
                    <tr key={product.id || index}>
                  <td><input type="checkbox" /></td>
                      <td>{categoryOffset + index + 1}</td>
                  <td>
                    <div className="category-product-cell">
                          <img 
                            src={product.image_url || product.main_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=40&h=40&fit=crop'} 
                            alt={product.name || 'Product'} 
                          />
                          <span>{product.name || 'Unnamed Product'}</span>
                    </div>
                  </td>
                      <td>{product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}</td>
                      <td>{product.order_count || product.orders || 0}</td>
                  <td>
                    <div className="category-product-actions">
                          <button 
                            className="category-action-btn" 
                            title="Edit"
                            onClick={() => {
                              setEditingProductId(product.id)
                              setActiveMenu('add-products')
                            }}
                          >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.3333 2.66667C11.5084 2.49159 11.7163 2.35282 11.9447 2.25865C12.1731 2.16448 12.4173 2.11667 12.6667 2.11667C12.916 2.11667 13.1602 2.16448 13.3886 2.25865C13.617 2.35282 13.8249 2.49159 14 2.66667C14.1751 2.84175 14.3139 3.04966 14.408 3.27805C14.5022 3.50644 14.55 3.75065 14.55 4C14.55 4.24935 14.5022 4.49356 14.408 4.72195C14.3139 4.95034 14.1751 5.15825 14 5.33333L5.33333 14L2 14.6667L2.66667 11.3333L11.3333 2.66667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                          <button className="category-action-btn" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4H14M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No products found
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(() => {
            const totalPages = Math.ceil(categoryTotalCount / categoryLimit) || 1
            const currentPage = categoryPage
            
            // Generate page numbers
            const pages = []
            if (totalPages <= 7) {
              // Show all pages if 7 or fewer
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
              }
            } else {
              // Show first page
              pages.push(1)
              
              if (currentPage > 3) {
                pages.push('ellipsis-start')
              }
              
              // Show pages around current page
              const start = Math.max(2, currentPage - 1)
              const end = Math.min(totalPages - 1, currentPage + 1)
              
              for (let i = start; i <= end; i++) {
                pages.push(i)
              }
              
              if (currentPage < totalPages - 2) {
                pages.push('ellipsis-end')
              }
              
              // Show last page
              pages.push(totalPages)
            }
            
            return (
          <div className="order-pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCategoryPage(Math.max(1, categoryPage - 1))}
                  disabled={categoryPage === 1 || categoryProductsLoading}
            >
              ← Previous
            </button>
            <div className="pagination-numbers">
                  {pages.map((page, index) => {
                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                      return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    }
                    return (
                <button
                        key={page}
                        className={`pagination-number ${categoryPage === page ? 'active' : ''}`}
                        onClick={() => setCategoryPage(page)}
                        disabled={categoryProductsLoading}
                      >
                        {page}
                </button>
                    )
                  })}
            </div>
            <button 
              className="pagination-btn"
                  onClick={() => setCategoryPage(Math.min(totalPages, categoryPage + 1))}
                  disabled={categoryPage >= totalPages || categoryProductsLoading}
            >
              Next →
            </button>
          </div>
            )
          })()}
        </div>
        )}

        {activeMenu === 'product-list' && (
          <div className="dashboard-content">
            <h1 className="dashboard-title">Product List</h1>
            
            {/* Product List Section */}
            <div className="categories-product-section">
              <div className="categories-product-tabs">
                <button 
                  className={`category-product-tab ${categoryProductTab === 'all' ? 'active' : ''}`}
                  onClick={() => setCategoryProductTab('all')}
                >
                  All Product ({products.length})
                </button>
                <button 
                  className={`category-product-tab ${categoryProductTab === 'featured' ? 'active' : ''}`}
                  onClick={() => setCategoryProductTab('featured')}
                >
                  Featured Products
                </button>
                <button 
                  className={`category-product-tab ${categoryProductTab === 'sale' ? 'active' : ''}`}
                  onClick={() => setCategoryProductTab('sale')}
                >
                  On Sale
                </button>
                <button 
                  className={`category-product-tab ${categoryProductTab === 'out-of-stock' ? 'active' : ''}`}
                  onClick={() => setCategoryProductTab('out-of-stock')}
                >
                  Out of Stock
                </button>
              </div>
              <div className="categories-product-controls">
                <div className="categories-product-search">
                  <svg className="categories-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 15L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input type="text" placeholder="Search your product" />
                </div>
                <button className="categories-control-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button className="categories-control-btn categories-add-btn" onClick={() => setActiveMenu('add-products')}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button className="categories-control-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="categories-product-table-card">
              <table className="categories-product-table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>No.</th>
                    <th>Product</th>
                    <th>Created Date</th>
                    <th>Order</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productsLoading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        Loading products...
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    products.map((product, index) => (
                      <tr key={product.id || index}>
                        <td><input type="checkbox" /></td>
                        <td>{index + 1}</td>
                        <td>
                          <div className="category-product-cell">
                            <img 
                              src={product.image_url || product.main_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=40&h=40&fit=crop'} 
                              alt={product.name} 
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td>{product.order_count || 0}</td>
                        <td>
                          <div className="category-product-actions">
                            <button 
                              className="category-action-btn" 
                              title="Edit"
                              onClick={() => {
                                setEditingProductId(product.id)
                                setActiveMenu('add-products')
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.3333 2.66667C11.5084 2.49159 11.7163 2.35282 11.9447 2.25865C12.1731 2.16448 12.4173 2.11667 12.6667 2.11667C12.916 2.11667 13.1602 2.16448 13.3886 2.25865C13.617 2.35282 13.8249 2.49159 14 2.66667C14.1751 2.84175 14.3139 3.04966 14.408 3.27805C14.5022 3.50644 14.55 3.75065 14.55 4C14.55 4.24935 14.5022 4.49356 14.408 4.72195C14.3139 4.95034 14.1751 5.15825 14 5.33333L5.33333 14L2 14.6667L2.66667 11.3333L11.3333 2.66667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button className="category-action-btn" title="Delete">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 4H14M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="order-pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCategoryPage(Math.max(1, categoryPage - 1))}
                disabled={categoryPage === 1}
              >
                ← Previous
              </button>
              <div className="pagination-numbers">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`pagination-number ${categoryPage === num ? 'active' : ''}`}
                    onClick={() => setCategoryPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <span className="pagination-ellipsis">...</span>
                <button
                  className={`pagination-number ${categoryPage === 24 ? 'active' : ''}`}
                  onClick={() => setCategoryPage(24)}
                >
                  24
                </button>
              </div>
              <button 
                className="pagination-btn"
                onClick={() => setCategoryPage(Math.min(24, categoryPage + 1))}
                disabled={categoryPage === 24}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'add-products' && (
          <div className="dashboard-content">
            <AddProductPage 
              productId={editingProductId}
              onCancel={() => {
                setEditingProductId(null)
                setActiveMenu('product-list')
              }}
              onSuccess={() => {
                setEditingProductId(null)
                fetchProducts()
                setActiveMenu('product-list')
              }}
            />
          </div>
        )}

        {activeMenu === 'product-reviews' && (
          <div className="dashboard-content">
            <ProductReviewsPage />
          </div>
        )}

        {/* Promotional Banner Create/Edit Modal */}
        {isBannerModalOpen && (
          <div 
            className="modal-overlay"
            onClick={() => setIsBannerModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {selectedBanner ? 'Edit Promotional Banner' : 'Create New Promotional Banner'}
                </h2>
                <button
                  onClick={() => setIsBannerModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem' }}>
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  await handleBannerSubmit()
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Preview Section */}
                    <div style={{
                      padding: '2rem',
                      borderRadius: '8px',
                      backgroundColor: bannerFormData.backgroundColor || '#FEF3C7',
                      minHeight: '200px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          {bannerFormData.headerText && (
                            <p style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem' }}>
                              {bannerFormData.headerText}
                            </p>
                          )}
                          {bannerFormData.subtitle && (
                            <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                              {bannerFormData.subtitle}
                            </p>
                          )}
                          {bannerFormData.mainTitle && (
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                              {bannerFormData.mainTitle}
                            </h3>
                          )}
                          {bannerFormData.buttonText && (
                            <button style={{
                              padding: '0.75rem 1.5rem',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}>
                              {bannerFormData.buttonText}
                            </button>
                          )}
                        </div>
                        {bannerFormData.productImage && (
                          <div style={{ width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.3)' }}>
                            <img 
                              src={bannerFormData.productImage} 
                              alt="Product" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.style.backgroundColor = 'rgba(255,255,255,0.5)'
                                e.target.parentElement.innerHTML = '<span style="color: #6b7280; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; height: 100%;">Product Image</span>'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text Fields */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Header Text (e.g., "// Todays Hot Deals")
                      </label>
                      <input
                        type="text"
                        value={bannerFormData.headerText}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, headerText: e.target.value })}
                        placeholder="// Todays Hot Deals"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Subtitle (e.g., "ORIGINAL STOCK")
                      </label>
                      <input
                        type="text"
                        value={bannerFormData.subtitle}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                        placeholder="ORIGINAL STOCK"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Main Title <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={bannerFormData.mainTitle}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, mainTitle: e.target.value })}
                        placeholder="HONEY COMBO PACKAGE"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    {/* Countdown Timer */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Countdown End Date
                      </label>
                      <input
                        type="datetime-local"
                        value={bannerFormData.countdownEndDate}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, countdownEndDate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    {/* Button Settings */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={bannerFormData.buttonText}
                          onChange={(e) => setBannerFormData({ ...bannerFormData, buttonText: e.target.value })}
                          placeholder="SHOP NOW"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          Button Link
                        </label>
                        <input
                          type="text"
                          value={bannerFormData.buttonLink}
                          onChange={(e) => setBannerFormData({ ...bannerFormData, buttonLink: e.target.value })}
                          placeholder="/products"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Image URLs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          Product Image URL
                        </label>
                        <input
                          type="url"
                          value={bannerFormData.productImage || ''}
                          onChange={(e) => setBannerFormData({ ...bannerFormData, productImage: e.target.value })}
                          placeholder="https://example.com/product.jpg"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '0.875rem'
                          }}
                        />
                        {bannerFormData.productImage && (
                          <img 
                            src={bannerFormData.productImage} 
                            alt="Product preview" 
                            style={{
                              marginTop: '0.5rem',
                              maxWidth: '100%',
                              maxHeight: '150px',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                          Background Image URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={bannerFormData.backgroundImage || ''}
                          onChange={(e) => setBannerFormData({ ...bannerFormData, backgroundImage: e.target.value })}
                          placeholder="https://example.com/background.jpg"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '0.875rem'
                          }}
                        />
                        {bannerFormData.backgroundImage && (
                          <img 
                            src={bannerFormData.backgroundImage} 
                            alt="Background preview" 
                            style={{
                              marginTop: '0.5rem',
                              maxWidth: '100%',
                              maxHeight: '150px',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Background Color */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Background Color
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={bannerFormData.backgroundColor}
                          onChange={(e) => setBannerFormData({ ...bannerFormData, backgroundColor: e.target.value })}
                          style={{
                            width: '60px',
                            height: '40px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        />
                        <input
                          type="text"
                          value={bannerFormData.backgroundColor}
                          onChange={(e) => setBannerFormData({ ...bannerFormData, backgroundColor: e.target.value })}
                          placeholder="#FEF3C7"
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Active Status */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={bannerFormData.isActive}
                          onChange={(e) => setBannerFormData({ ...bannerFormData, isActive: e.target.checked })}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>Active (Show on frontend)</span>
                      </label>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '1rem',
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <button
                      type="button"
                      onClick={() => setIsBannerModalOpen(false)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bannerSubmitting}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: bannerSubmitting ? '#9ca3af' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: bannerSubmitting ? 'not-allowed' : 'pointer',
                        opacity: bannerSubmitting ? 0.7 : 1
                      }}
                    >
                      {bannerSubmitting ? 'Saving...' : selectedBanner ? 'Update Banner' : 'Create Banner'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'product-media' && (
          <div className="dashboard-content">
            <h1 className="dashboard-title">Product Media</h1>
            
            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '2rem',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <button
                onClick={() => setProductMediaTab('media')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: productMediaTab === 'media' ? '#10b981' : '#6b7280',
                  borderBottom: productMediaTab === 'media' ? '2px solid #10b981' : '2px solid transparent',
                  marginBottom: '-2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Media Library
              </button>
              <button
                onClick={() => setProductMediaTab('banners')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: productMediaTab === 'banners' ? '#10b981' : '#6b7280',
                  borderBottom: productMediaTab === 'banners' ? '2px solid #10b981' : '2px solid transparent',
                  marginBottom: '-2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Promotional Banners
              </button>
            </div>

            {productMediaTab === 'media' && (
              <>
            {/* Upload Section */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Upload Media
                </h2>
                <button
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*,video/*'
                    input.multiple = true
                    input.onchange = (e) => {
                      // Handle file upload
                      console.log('Files selected:', e.target.files)
                    }
                    input.click()
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload Files
                </button>
              </div>
              
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.style.borderColor = '#10b981'
                e.currentTarget.style.backgroundColor = '#f0fdf4'
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.backgroundColor = '#f9fafb'
                const files = Array.from(e.dataTransfer.files)
                console.log('Files dropped:', files)
              }}
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*,video/*'
                input.multiple = true
                input.onchange = (e) => {
                  console.log('Files selected:', e.target.files)
                }
                input.click()
              }}
              >
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#374151',
                  margin: '0.5rem 0'
                }}>
                  Drag and drop files here, or click to browse
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Supports images and videos (JPG, PNG, GIF, MP4, etc.)
                </p>
              </div>
            </div>

            {/* Media Gallery */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Media Library
                </h2>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  <div style={{
                    position: 'relative'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280'
                    }}>
                      <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 15L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search media..."
                      style={{
                        padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        width: '250px'
                      }}
                    />
                  </div>
                  <select style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}>
                    <option>All Media</option>
                    <option>Images</option>
                    <option>Videos</option>
                  </select>
                </div>
              </div>

              {/* Media Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {/* Placeholder media items */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div
                    key={item}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      display: 'flex',
                      gap: '0.25rem',
                      zIndex: 10
                    }}>
                      <button
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.3333 2.66667C11.5084 2.49159 11.7163 2.35282 11.9447 2.25865C12.1731 2.16448 12.4173 2.11667 12.6667 2.11667C12.916 2.11667 13.1602 2.16448 13.3886 2.25865C13.617 2.35282 13.8249 2.49159 14 2.66667C14.1751 2.84175 14.3139 3.04966 14.408 3.27805C14.5022 3.50644 14.55 3.75065 14.55 4C14.55 4.24935 14.5022 4.49356 14.408 4.72195C14.3139 4.95034 14.1751 5.15825 14 5.33333L5.33333 14L2 14.6667L2.66667 11.3333L11.3333 2.66667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.8)',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4H14M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af'
                    }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16L12 8L16 12L20 8V16C20 17.1046 19.1046 18 18 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '0.75rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>image-{item}.jpg</div>
                      <div style={{ opacity: 0.8 }}>2.5 MB • 1920x1080</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State (commented out, shown when no media) */}
              {/* <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#6b7280'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
                  <path d="M4 16L12 8L16 12L20 8V16C20 17.1046 19.1046 18 18 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <p style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>No media files yet</p>
                <p style={{ fontSize: '0.875rem' }}>Upload your first image or video to get started</p>
              </div> */}
            </div>
              </>
            )}

            {productMediaTab === 'banners' && (
              <>
                {/* Promotional Banners Section */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  marginBottom: '2rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <h2 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#111827',
                      margin: 0
                    }}>
                      Promotional Banners
                    </h2>
                    <button
                      onClick={() => {
                        setSelectedBanner(null)
                        setBannerFormData({
                          title: '',
                          subtitle: '',
                          headerText: '',
                          mainTitle: '',
                          countdownDays: '',
                          countdownHours: '',
                          countdownMinutes: '',
                          countdownSeconds: '',
                          countdownEndDate: '',
                          buttonText: 'SHOP NOW',
                          buttonLink: '/products',
                          backgroundColor: '#FEF3C7',
                          productImage: '',
                          backgroundImage: '',
                          isActive: true
                        })
                        setIsBannerModalOpen(true)
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Create Banner
                    </button>
                  </div>

                  {/* Banners List */}
                  {promotionalBannersLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                      Loading banners...
                    </div>
                  ) : promotionalBannersError ? (
                    <div style={{ padding: '1rem', color: '#991b1b', background: '#fef2f2', borderRadius: '8px' }}>
                      Error: {promotionalBannersError}
                    </div>
                  ) : promotionalBanners.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280' }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
                        <path d="M4 16L12 8L16 12L20 8V16C20 17.1046 19.1046 18 18 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <p style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>No promotional banners yet</p>
                      <p style={{ fontSize: '0.875rem' }}>Create your first promotional banner to get started</p>
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      {promotionalBanners.map((banner) => (
                        <div
                          key={banner.id}
                          style={{
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb',
                            backgroundColor: banner.backgroundColor || '#FEF3C7',
                            minHeight: '300px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)'
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                          onClick={() => {
                            setSelectedBanner(banner)
                            // Format countdownEndDate from ISO to datetime-local format
                            let formattedDate = ''
                            if (banner.countdownEndDate) {
                              try {
                                const date = new Date(banner.countdownEndDate)
                                if (!isNaN(date.getTime())) {
                                  // Convert to YYYY-MM-DDTHH:mm format for datetime-local input
                                  const year = date.getFullYear()
                                  const month = String(date.getMonth() + 1).padStart(2, '0')
                                  const day = String(date.getDate()).padStart(2, '0')
                                  const hours = String(date.getHours()).padStart(2, '0')
                                  const minutes = String(date.getMinutes()).padStart(2, '0')
                                  formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`
                                }
                              } catch (e) {
                                console.error('Error formatting date:', e)
                              }
                            }
                            setBannerFormData({
                              title: banner.title || '',
                              subtitle: banner.subtitle || '',
                              headerText: banner.headerText || '',
                              mainTitle: banner.mainTitle || '',
                              countdownDays: banner.countdownDays || '',
                              countdownHours: banner.countdownHours || '',
                              countdownMinutes: banner.countdownMinutes || '',
                              countdownSeconds: banner.countdownSeconds || '',
                              countdownEndDate: formattedDate,
                              buttonText: banner.buttonText || 'SHOP NOW',
                              buttonLink: banner.buttonLink || '/products',
                              backgroundColor: banner.backgroundColor || '#FEF3C7',
                              productImage: banner.productImage || '',
                              backgroundImage: banner.backgroundImage || '',
                              isActive: banner.isActive !== false
                            })
                            setIsBannerModalOpen(true)
                          }}
                        >
                          {/* Preview Content */}
                          <div style={{
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            minHeight: '300px'
                          }}>
                            <div>
                              {banner.headerText && (
                                <p style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem' }}>
                                  {banner.headerText}
                                </p>
                              )}
                              {banner.subtitle && (
                                <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                                  {banner.subtitle}
                                </p>
                              )}
                              {banner.mainTitle && (
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                                  {banner.mainTitle}
                                </h3>
                              )}
                            </div>
                            {banner.buttonText && (
                              <button style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                width: 'fit-content',
                                cursor: 'pointer'
                              }}>
                                {banner.buttonText}
                              </button>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            display: 'flex',
                            gap: '0.5rem'
                          }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                // Toggle active status
                              }}
                              style={{
                                padding: '0.5rem',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title={banner.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {banner.isActive ? (
                                  <>
                                    <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M6 8L7.5 9.5L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </>
                                ) : (
                                  <>
                                    <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M6 8H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </>
                                )}
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm('Are you sure you want to delete this banner?')) {
                                  // Handle delete
                                }
                              }}
                              style={{
                                padding: '0.5rem',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title="Delete"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 4H14M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
