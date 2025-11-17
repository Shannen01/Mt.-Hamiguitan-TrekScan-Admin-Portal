// Booking Service - Firebase operations for bookings
import { 
  getAllDocuments, 
  getDocumentById, 
  addDocument, 
  updateDocument, 
  deleteDocument, 
  queryDocuments,
  subscribeToCollection,
  timestampToDate,
  dateToTimestamp
} from './firebaseService';
import BookingModel from '../models/BookingModel';
import { Timestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'bookings';

/**
 * Get all bookings
 * @param {Object} filters - Optional filters { status, trekType, month, year, userId }
 * @returns {Promise<Array<BookingModel>>} Array of booking models
 */
export const getAllBookings = async (filters = {}) => {
  try {
    const firestoreFilters = [];
    
    // Filter by status if provided
    if (filters.status && filters.status !== 'all') {
      firestoreFilters.push({
        field: 'status',
        operator: '==',
        value: filters.status
      });
    }
    
    // Filter by trek type if provided
    if (filters.trekType && filters.trekType !== 'all') {
      firestoreFilters.push({
        field: 'trekType',
        operator: '==',
        value: filters.trekType
      });
    }
    
    // Filter by user ID if provided
    if (filters.userId) {
      firestoreFilters.push({
        field: 'userId',
        operator: '==',
        value: filters.userId
      });
    }
    
    // Filter by date range if month/year provided
    if (filters.month || filters.year) {
      const startDate = new Date();
      const endDate = new Date();
      
      if (filters.year) {
        startDate.setFullYear(filters.year, 0, 1);
        endDate.setFullYear(filters.year, 11, 31);
      }
      
      if (filters.month) {
        const monthIndex = parseInt(filters.month) - 1;
        startDate.setMonth(monthIndex, 1);
        endDate.setMonth(monthIndex + 1, 0);
      }
      
      firestoreFilters.push({
        field: 'createdAt',
        operator: '>=',
        value: dateToTimestamp(startDate)
      });
      
      firestoreFilters.push({
        field: 'createdAt',
        operator: '<=',
        value: dateToTimestamp(endDate)
      });
    }
    
    // Filter by trek date range if provided
    if (filters.trekDateFrom || filters.trekDateTo) {
      if (filters.trekDateFrom) {
        firestoreFilters.push({
          field: 'trekDate',
          operator: '>=',
          value: dateToTimestamp(filters.trekDateFrom)
        });
      }
      if (filters.trekDateTo) {
        firestoreFilters.push({
          field: 'trekDate',
          operator: '<=',
          value: dateToTimestamp(filters.trekDateTo)
        });
      }
    }
    
    const bookings = await queryDocuments(
      COLLECTION_NAME,
      firestoreFilters,
      'createdAt',
      'desc'
    );
    
    // Convert to BookingModel instances
    return bookings
      .map(booking => {
        try {
          // Handle both document snapshot and plain object
          if (booking.id && booking.data) {
            return BookingModel.fromDoc(booking);
          }
          return BookingModel.fromMap(booking);
        } catch (err) {
          console.error('Error converting booking to model:', booking, err);
          return null;
        }
      })
      .filter(booking => booking !== null); // Filter out any null bookings
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw error;
  }
};

/**
 * Get a single booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<BookingModel>} Booking model
 */
export const getBookingById = async (bookingId) => {
  try {
    const booking = await getDocumentById(COLLECTION_NAME, bookingId);
    return BookingModel.fromMap({ id: booking.id, ...booking });
  } catch (error) {
    console.error(`Error getting booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Create a new booking
 * @param {Object|BookingModel} bookingData - Booking data or BookingModel instance
 * @returns {Promise<string>} New booking ID
 */
export const createBooking = async (bookingData) => {
  try {
    let bookingModel;
    
    // If it's already a BookingModel, use it; otherwise create one
    if (bookingData instanceof BookingModel) {
      bookingModel = bookingData;
    } else {
      bookingModel = new BookingModel(bookingData);
    }
    
    // Convert to map and remove id (Firestore will generate it)
    const dataToSave = bookingModel.toMap();
    delete dataToSave.id;
    
    return await addDocument(COLLECTION_NAME, dataToSave);
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Update a booking
 * @param {string} bookingId - Booking ID
 * @param {Object|BookingModel} updateData - Data to update or BookingModel instance
 * @returns {Promise<void>}
 */
export const updateBooking = async (bookingId, updateData) => {
  try {
    let dataToUpdate;
    
    // If it's a BookingModel, convert to map; otherwise use as-is
    if (updateData instanceof BookingModel) {
      dataToUpdate = updateData.toMap();
      delete dataToUpdate.id; // Don't update the ID
    } else {
      dataToUpdate = { ...updateData };
      
      // Convert dates to timestamps if present
      if (dataToUpdate.trekDate && !(dataToUpdate.trekDate instanceof Timestamp)) {
        dataToUpdate.trekDate = dateToTimestamp(dataToUpdate.trekDate);
      }
    }
    
    // Always update updatedAt
    dataToUpdate.updatedAt = Timestamp.now();
    
    await updateDocument(COLLECTION_NAME, bookingId, dataToUpdate);
  } catch (error) {
    console.error(`Error updating booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status (pending, approved, rejected, cancelled)
 * @param {string} adminNotes - Optional admin notes
 * @returns {Promise<void>}
 */
export const updateBookingStatus = async (bookingId, status, adminNotes = null) => {
  try {
    const updateData = {
      status: status,
      updatedAt: Timestamp.now()
    };
    
    if (adminNotes !== null) {
      updateData.adminNotes = adminNotes;
    }
    
    await updateDocument(COLLECTION_NAME, bookingId, updateData);
  } catch (error) {
    console.error(`Error updating booking status ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Delete a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<void>}
 */
export const deleteBooking = async (bookingId) => {
  try {
    await deleteDocument(COLLECTION_NAME, bookingId);
  } catch (error) {
    console.error(`Error deleting booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Search bookings by various fields
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array<BookingModel>>} Filtered bookings
 */
export const searchBookings = async (searchTerm, filters = {}) => {
  try {
    const allBookings = await getAllBookings(filters);
    
    if (!searchTerm) {
      return allBookings;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allBookings.filter(booking => 
      booking.id?.toLowerCase().includes(lowerSearchTerm) ||
      booking.userId?.toLowerCase().includes(lowerSearchTerm) ||
      booking.affiliation?.toLowerCase().includes(lowerSearchTerm) ||
      booking.notes?.toLowerCase().includes(lowerSearchTerm) ||
      booking.adminNotes?.toLowerCase().includes(lowerSearchTerm)
    );
  } catch (error) {
    console.error('Error searching bookings:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for bookings
 * @param {Function} callback - Callback function to call when data changes
 * @param {Object} filters - Optional filters
 * @returns {Function} Unsubscribe function
 */
export const subscribeToBookings = (callback, filters = {}) => {
  try {
    const firestoreFilters = [];
    
    if (filters.status && filters.status !== 'all') {
      firestoreFilters.push({
        field: 'status',
        operator: '==',
        value: filters.status
      });
    }
    
    if (filters.trekType && filters.trekType !== 'all') {
      firestoreFilters.push({
        field: 'trekType',
        operator: '==',
        value: filters.trekType
      });
    }
    
    if (filters.userId) {
      firestoreFilters.push({
        field: 'userId',
        operator: '==',
        value: filters.userId
      });
    }
    
    return subscribeToCollection(COLLECTION_NAME, (bookings) => {
      // Convert to BookingModel instances
      const bookingModels = bookings.map(booking => BookingModel.fromMap(booking));
      callback(bookingModels);
    }, firestoreFilters);
  } catch (error) {
    console.error('Error setting up bookings listener:', error);
    throw error;
  }
};

/**
 * Format date for display
 * @param {Date|Timestamp|string} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'full')
 * @returns {string} Formatted date string
 */
export const formatBookingDate = (date, format = 'short') => {
  if (!date) return 'Not specified';
  
  let dateObj;
  
  // Handle Firestore Timestamp
  if (date && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  }
  // Handle string dates
  else if (typeof date === 'string') {
    if (date.includes('/')) {
      const dateParts = date.split('/');
      if (dateParts.length === 3) {
        dateObj = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = new Date(date);
    }
  } 
  // Handle Date objects
  else if (date instanceof Date) {
    dateObj = date;
  } 
  // Try to convert timestamp-like objects
  else if (date && date.seconds) {
    dateObj = new Date(date.seconds * 1000);
  }
  else {
    dateObj = timestampToDate(date);
  }
  
  if (!dateObj || isNaN(dateObj.getTime())) {
    return date?.toString() || 'Not specified';
  }
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    case 'long':
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    case 'full':
      return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    default:
      return dateObj.toLocaleDateString();
  }
};

