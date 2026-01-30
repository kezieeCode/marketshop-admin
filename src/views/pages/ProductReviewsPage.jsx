import { useState, useEffect } from 'react'
import { API_CONFIG } from '../../config/api.js'

const ProductReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, approved, pending, rejected
  const [filterRating, setFilterRating] = useState('all') // all, 5, 4, 3, 2, 1
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReviews, setSelectedReviews] = useState([])
  const [notification, setNotification] = useState(null)
  const reviewsPerPage = 10

  // Fetch reviews
  useEffect(() => {
    fetchReviews()
  }, [filterStatus, filterRating])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        throw new Error('Authentication required')
      }

      // In a real app, this would be an API call
      // For now, using mock data
      setTimeout(() => {
        const mockReviews = [
          {
            id: 1,
            productId: 101,
            productName: 'Organic Fresh Tomatoes',
            productImage: 'https://via.placeholder.com/60',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            rating: 5,
            comment: 'Excellent quality! Very fresh and tasty. Highly recommend!',
            status: 'approved',
            date: '2024-01-15',
            helpful: 12
          },
          {
            id: 2,
            productId: 102,
            productName: 'Fresh Strawberries',
            productImage: 'https://via.placeholder.com/60',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            rating: 4,
            comment: 'Good quality strawberries, sweet and fresh. Would buy again.',
            status: 'approved',
            date: '2024-01-14',
            helpful: 8
          },
          {
            id: 3,
            productId: 103,
            productName: 'Premium Beef Steak',
            productImage: 'https://via.placeholder.com/60',
            customerName: 'Mike Johnson',
            customerEmail: 'mike@example.com',
            rating: 5,
            comment: 'Amazing quality meat! Very tender and flavorful.',
            status: 'pending',
            date: '2024-01-13',
            helpful: 5
          },
          {
            id: 4,
            productId: 104,
            productName: 'Fresh Salmon Fillet',
            productImage: 'https://via.placeholder.com/60',
            customerName: 'Sarah Williams',
            customerEmail: 'sarah@example.com',
            rating: 3,
            comment: 'The fish was okay, but could be fresher. Delivery was fast though.',
            status: 'approved',
            date: '2024-01-12',
            helpful: 3
          },
          {
            id: 5,
            productId: 105,
            productName: 'Organic Avocados',
            productImage: 'https://via.placeholder.com/60',
            customerName: 'David Brown',
            customerEmail: 'david@example.com',
            rating: 2,
            comment: 'Some avocados were overripe when they arrived. Not satisfied.',
            status: 'rejected',
            date: '2024-01-11',
            helpful: 1
          },
          {
            id: 6,
            productId: 106,
            productName: 'Fresh Milk 1L',
            productImage: 'https://via.placeholder.com/60',
            customerName: 'Emily Davis',
            customerEmail: 'emily@example.com',
            rating: 5,
            comment: 'Perfect! Fresh and creamy. Best milk I\'ve had in a while.',
            status: 'approved',
            date: '2024-01-10',
            helpful: 15
          },
          {
            id: 7,
            productId: 107,
            productName: 'Whole Grain Bread',
            productImage: 'https://via.placeholder.com/60',
            customerName: 'Chris Wilson',
            customerEmail: 'chris@example.com',
            rating: 4,
            comment: 'Good bread, nice texture. A bit pricey but worth it.',
            status: 'pending',
            date: '2024-01-09',
            helpful: 4
          },
          {
            id: 8,
            productId: 108,
            productName: 'Organic Spinach',
            productImage: 'https://via.placeholder.com/60',
            customerName: 'Lisa Anderson',
            customerEmail: 'lisa@example.com',
            rating: 5,
            comment: 'Very fresh organic spinach. Great for salads!',
            status: 'approved',
            date: '2024-01-08',
            helpful: 9
          }
        ]

        let filtered = mockReviews

        // Filter by status
        if (filterStatus !== 'all') {
          filtered = filtered.filter(r => r.status === filterStatus)
        }

        // Filter by rating
        if (filterRating !== 'all') {
          filtered = filtered.filter(r => r.rating === parseInt(filterRating))
        }

        setReviews(filtered)
        setIsLoading(false)
      }, 500)
    } catch (error) {
      setNotification({ type: 'error', message: error.message || 'Failed to load reviews' })
      setIsLoading(false)
    }
  }

  // Filter reviews by search term
  const filteredReviews = reviews.filter(review => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      review.productName.toLowerCase().includes(search) ||
      review.customerName.toLowerCase().includes(search) ||
      review.comment.toLowerCase().includes(search)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)
  const startIndex = (currentPage - 1) * reviewsPerPage
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage)

  // Handle review status change
  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        throw new Error('Authentication required')
      }

      // In a real app, this would be an API call
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, status: newStatus } : r
      ))

      setNotification({ 
        type: 'success', 
        message: `Review ${newStatus} successfully!` 
      })
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.message || 'Failed to update review status' 
      })
    }
  }

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedReviews.length === 0) {
      setNotification({ type: 'error', message: 'Please select reviews first' })
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        throw new Error('Authentication required')
      }

      // In a real app, this would be an API call
      if (action === 'approve') {
        setReviews(prev => prev.map(r => 
          selectedReviews.includes(r.id) ? { ...r, status: 'approved' } : r
        ))
        setNotification({ type: 'success', message: `${selectedReviews.length} review(s) approved!` })
      } else if (action === 'reject') {
        setReviews(prev => prev.map(r => 
          selectedReviews.includes(r.id) ? { ...r, status: 'rejected' } : r
        ))
        setNotification({ type: 'success', message: `${selectedReviews.length} review(s) rejected!` })
      } else if (action === 'delete') {
        setReviews(prev => prev.filter(r => !selectedReviews.includes(r.id)))
        setNotification({ type: 'success', message: `${selectedReviews.length} review(s) deleted!` })
      }

      setSelectedReviews([])
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.message || 'Failed to perform bulk action' 
      })
    }
  }

  // Toggle review selection
  const toggleReviewSelection = (reviewId) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    )
  }

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedReviews.length === paginatedReviews.length) {
      setSelectedReviews([])
    } else {
      setSelectedReviews(paginatedReviews.map(r => r.id))
    }
  }

  // Clear notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Stats
  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0'
  }

  return (
    <div className="product-reviews-page">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="reviews-header">
        <div>
          <h1 className="reviews-title">Product Reviews</h1>
          <p className="reviews-subtitle">Manage and moderate customer reviews</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="reviews-stats-grid">
        <div className="review-stat-card">
          <div className="review-stat-header">
            <span className="review-stat-label">Total Reviews</span>
          </div>
          <div className="review-stat-value">{stats.total}</div>
        </div>
        <div className="review-stat-card">
          <div className="review-stat-header">
            <span className="review-stat-label">Approved</span>
          </div>
          <div className="review-stat-value approved">{stats.approved}</div>
        </div>
        <div className="review-stat-card">
          <div className="review-stat-header">
            <span className="review-stat-label">Pending</span>
          </div>
          <div className="review-stat-value pending">{stats.pending}</div>
        </div>
        <div className="review-stat-card">
          <div className="review-stat-header">
            <span className="review-stat-label">Average Rating</span>
          </div>
          <div className="review-stat-value rating">{stats.averageRating} ⭐</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="reviews-controls">
        <div className="reviews-filters">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Rating</label>
            <select 
              className="filter-select"
              value={filterRating}
              onChange={(e) => {
                setFilterRating(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
        <div className="reviews-search">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="bulk-actions-bar">
          <span className="bulk-actions-count">{selectedReviews.length} selected</span>
          <div className="bulk-actions-buttons">
            <button 
              className="bulk-action-btn approve"
              onClick={() => handleBulkAction('approve')}
            >
              Approve
            </button>
            <button 
              className="bulk-action-btn reject"
              onClick={() => handleBulkAction('reject')}
            >
              Reject
            </button>
            <button 
              className="bulk-action-btn delete"
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="reviews-table-card">
        {isLoading ? (
          <div className="loading-state">Loading reviews...</div>
        ) : paginatedReviews.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
              <path d="M9.049 2.927C9.349 2.005 10.651 2.005 10.951 2.927L12.47 7.6C12.6111 8.018 13.0022 8.30063 13.442 8.30063H18.31C19.275 8.30063 19.676 9.53143 18.887 10.1L14.946 12.938C14.5836 13.203 14.4225 13.6667 14.563 14.0846L16.082 18.7576C16.382 19.68 15.33 20.4386 14.541 19.8686L10.6 17.0306C10.2376 16.7656 9.76238 16.7656 9.4 17.0306L5.459 19.8686C4.67 20.4386 3.618 19.68 3.918 18.7576L5.437 14.0846C5.57755 13.6667 5.41638 13.203 5.054 12.938L1.113 10.1C0.323998 9.53143 0.724998 8.30063 1.69 8.30063H6.558C6.99777 8.30063 7.38889 8.018 7.53 7.6L9.049 2.927Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>No reviews found</p>
          </div>
        ) : (
          <table className="reviews-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === paginatedReviews.length && paginatedReviews.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.map(review => (
                <tr key={review.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={() => toggleReviewSelection(review.id)}
                    />
                  </td>
                  <td>
                    <div className="review-product-cell">
                      <img src={review.productImage} alt={review.productName} />
                      <span>{review.productName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="review-customer-cell">
                      <div className="customer-name">{review.customerName}</div>
                      <div className="customer-email">{review.customerEmail}</div>
                    </div>
                  </td>
                  <td>
                    <div className="review-rating-cell">
                      <div className="rating-stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <span className="rating-value">{review.rating}</span>
                    </div>
                  </td>
                  <td>
                    <div className="review-comment-cell">
                      <p className="review-comment">{review.comment}</p>
                      {review.helpful > 0 && (
                        <span className="helpful-count">👍 {review.helpful} helpful</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`review-status ${review.status}`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className="review-date">{review.date}</span>
                  </td>
                  <td>
                    <div className="review-actions">
                      {review.status === 'pending' && (
                        <>
                          <button
                            className="action-btn approve"
                            onClick={() => handleStatusChange(review.id, 'approved')}
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => handleStatusChange(review.id, 'rejected')}
                            title="Reject"
                          >
                            ✕
                          </button>
                        </>
                      )}
                      {review.status === 'approved' && (
                        <button
                          className="action-btn reject"
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                          title="Reject"
                        >
                          ✕
                        </button>
                      )}
                      {review.status === 'rejected' && (
                        <button
                          className="action-btn approve"
                          onClick={() => handleStatusChange(review.id, 'approved')}
                          title="Approve"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this review?')) {
                            setReviews(prev => prev.filter(r => r.id !== review.id))
                            setNotification({ type: 'success', message: 'Review deleted successfully!' })
                          }
                        }}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="reviews-pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="pagination-ellipsis">...</span>
                <button
                  className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductReviewsPage
