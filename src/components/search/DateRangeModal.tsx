'use client'

import { useState, useRef, useEffect } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Calendar, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilters } from '@/contexts/EnhancedFilterContext';
import { useLanguage } from '@/shared/components/LanguageProvider';
import { cn } from '@/lib/utils';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const DateRangeModal = ({ isOpen, onClose, onApply }: DateRangeModalProps) => {
  const { filters, dispatch } = useFilters();
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  // Parse dates from filters
  const startDate = filters.pickupDate ? new Date(filters.pickupDate) : new Date();
  const endDate = filters.dropoffDate ? new Date(filters.dropoffDate) : null;

  const [ranges, setRanges] = useState([
    {
      startDate: startDate,
      endDate: endDate || startDate,
      key: 'selection',
    }
  ]);

  const [pickupTime, setPickupTime] = useState<string>('any');
  const [dropoffTime, setDropoffTime] = useState<string>('any');

  // Time options
  const timeOptions = [
    { value: 'any', label: 'Any time' },
    { value: '00:00', label: '12:00 AM' },
    { value: '01:00', label: '1:00 AM' },
    { value: '02:00', label: '2:00 AM' },
    { value: '03:00', label: '3:00 AM' },
    { value: '04:00', label: '4:00 AM' },
    { value: '05:00', label: '5:00 AM' },
    { value: '06:00', label: '6:00 AM' },
    { value: '07:00', label: '7:00 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '21:00', label: '9:00 PM' },
    { value: '22:00', label: '10:00 PM' },
    { value: '23:00', label: '11:00 PM' },
  ];

  // Calculate days difference
  // Simple logic: calendar days + 1 if dropoff time > pickup time
  const calculateDays = () => {
    if (!ranges[0].startDate || !ranges[0].endDate) return 0;
    
    const start = new Date(ranges[0].startDate);
    const end = new Date(ranges[0].endDate);
    
    // Calculate calendar days difference
    const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const calendarDays = Math.ceil((endDateOnly.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60 * 24));
    
    // If dropoff time > pickup time, add 1 day
    const pickupHour = pickupTime !== 'any' ? parseInt(pickupTime.split(':')[0], 10) : 0;
    const dropoffHour = dropoffTime !== 'any' ? parseInt(dropoffTime.split(':')[0], 10) : 0;
    
    const totalDays = calendarDays + (dropoffHour > pickupHour ? 1 : 0);
    
    // Ensure minimum of 1 day
    return Math.max(1, totalDays);
  };

  const days = calculateDays();

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle range change
  const handleRangeChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    if (selection) {
      setRanges([selection]);
    }
  };

  // Handle apply
  const handleApply = () => {
    if (ranges[0].startDate && ranges[0].endDate) {
      dispatch({
        type: 'SET_PICKUP_DATE',
        payload: ranges[0].startDate.toISOString().split('T')[0],
      });
      dispatch({
        type: 'SET_DROPOFF_DATE',
        payload: ranges[0].endDate.toISOString().split('T')[0],
      });
      onApply();
      onClose();
    }
  };

  // Close on outside click (but not when clicking on Select dropdowns)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Check if click is on Select dropdown content (which renders in a portal)
      // Radix Select Content is rendered in a portal outside the modal
      const isSelectContent = target.closest('[data-radix-select-content]') || 
                             target.closest('[data-radix-popper-content-wrapper]') ||
                             target.closest('[role="listbox"]') ||
                             target.closest('[data-radix-portal]') ||
                             // Also check for Radix Select viewport and items
                             target.closest('[data-radix-select-viewport]') ||
                             target.closest('[data-radix-select-item]');
      
      if (isSelectContent) {
        return; // Don't close if clicking on Select dropdown
      }
      
      // Check if click is outside modal
      if (modalRef.current && !modalRef.current.contains(target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Add event listener with a small delay to avoid immediate closing when Select opens
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside, true);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold">{t('rentalDates') || 'Rental dates'}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar */}
          <div className="p-6">
            <div className="date-range-picker-wrapper">
              <DateRange
                editableDateInputs={false}
                onChange={handleRangeChange}
                moveRangeOnFirstSelection={false}
                ranges={ranges}
                months={2}
                direction="horizontal"
                showDateDisplay={false}
                showMonthAndYearPickers={true}
                showPreview={true}
                rangeColors={['#22c55e']} // Green color
                className="date-range-picker"
                minDate={new Date()}
              />
            </div>

            {/* Time Selection and Summary */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="flex items-center gap-4">
                {/* Pick-up time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t('pickupTime') || 'Pick-up time'}
                  </label>
                  <Select value={pickupTime} onValueChange={setPickupTime}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Drop-off time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t('dropoffTime') || 'Drop-off time'}
                  </label>
                  <Select value={dropoffTime} onValueChange={setDropoffTime}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Total days */}
              <div className="text-right">
                <div className="text-sm text-muted-foreground">{t('total') || 'Total'}</div>
                <div className="text-lg font-semibold text-foreground">
                  {days} {days === 1 ? t('day') || 'day' : t('days') || 'days'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t sticky bottom-0 bg-white">
            <Button
              onClick={handleApply}
              disabled={!ranges[0].startDate || !ranges[0].endDate}
              className="bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              {t('viewCars') || 'View cars'}
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .date-range-picker-wrapper {
          position: relative;
        }

        .date-range-picker .rdrDefinedRangesWrapper {
          display: none;
        }
        
        .date-range-picker .rdrDateDisplayWrapper {
          display: none;
        }
        
        .date-range-picker .rdrCalendarWrapper {
          background: white;
          border-radius: 8px;
        }
        
        .date-range-picker .rdrMonth {
          padding: 0 16px;
        }
        
        .date-range-picker .rdrMonthAndYearWrapper {
          padding: 16px 8px;
          font-weight: 600;
          font-size: 16px;
        }
        
        .date-range-picker .rdrNextPrevButton {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .date-range-picker .rdrNextPrevButton:hover {
          background: #f8fafc;
        }
        
        .date-range-picker .rdrDay {
          border-radius: 8px;
          margin: 2px;
          font-weight: 500;
          height: 36px;
          width: 36px;
        }
        
        .date-range-picker .rdrDay:hover {
          background: #f1f5f9;
        }
        
        .date-range-picker .rdrDay.rdrDayInRange {
          background: #dcfce7;
          color: #15803d;
        }
        
        .date-range-picker .rdrDay.rdrDayStartOfRange,
        .date-range-picker .rdrDay.rdrDayEndOfRange {
          background: #22c55e;
          color: white;
          border-radius: 8px;
          font-weight: 600;
        }
        
        .date-range-picker .rdrDay.rdrDayStartOfRange {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        
        .date-range-picker .rdrDay.rdrDayEndOfRange {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        
        .date-range-picker .rdrDay.rdrDayDisabled {
          background: #f8fafc;
          color: #cbd5e1;
          cursor: not-allowed;
        }
        
        .date-range-picker .rdrWeekDay {
          font-weight: 600;
          color: #64748b;
          font-size: 12px;
          padding: 8px 0;
        }

        .date-range-picker .rdrDayNumber {
          font-size: 14px;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .date-range-picker .rdrMonths {
            flex-direction: column;
          }
          
          .date-range-picker .rdrMonth {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

