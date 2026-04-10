import { getMockLeads } from '../store/leadsMock';
import { getMockSales } from '../store/salesMock';
import { getMockCampaigns } from '../store/campaignsMock';

/**
 * KPI Service for calculating dashboard metrics
 * Reference date: 2025-11-12
 */

export interface KPIMetrics {
  leadConversionPercent: number;
  leadConversionDetails: {
    wonLeads: number;
    totalLeads: number;
  };
  campaignROI: number;
  campaignROIDetails: {
    totalRevenue: number;
    totalSpend: number;
  };
  avgRating: number;
  avgRatingDetails: {
    totalRatings: number;
    reviewCount: number;
  };
  mtdSales: number;
  mtdSalesDetails: {
    salesCount: number;
  };
}

class KPIService {
  private referenceDate = new Date('2025-11-12');

  /**
   * Calculate Lead Conversion % = won_leads / total_leads_this_month
   */
  calculateLeadConversion(): { percent: number; wonLeads: number; totalLeads: number } {
    const leads = getMockLeads();
    const currentMonth = this.referenceDate.getMonth();
    const currentYear = this.referenceDate.getFullYear();

    // Filter leads created in current month
    const leadsThisMonth = leads.filter(lead => {
      const createdDate = new Date(lead.created_at);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    });

    const wonLeads = leadsThisMonth.filter(lead => lead.status === 'won').length;
    const totalLeads = leadsThisMonth.length;

    const percent = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

    return {
      percent,
      wonLeads,
      totalLeads,
    };
  }

  /**
   * Calculate Campaign ROI = total_revenue_from_campaign / spend
   */
  calculateCampaignROI(): { roi: number; totalRevenue: number; totalSpend: number } {
    const campaigns = getMockCampaigns();

    const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
    const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);

    const roi = totalSpend > 0 ? (totalRevenue / totalSpend) * 100 : 0;

    return {
      roi,
      totalRevenue,
      totalSpend,
    };
  }

  /**
   * Calculate Avg Rating = avg(Reviews.rating last 90 days)
   * Note: Using mock data - in real implementation, would query Reviews table
   */
  calculateAvgRating(): { avgRating: number; totalRatings: number; reviewCount: number } {
    // Mock rating data (in real implementation, would come from Reviews table)
    // Simulating reviews from last 90 days
    const mockReviewsLast90Days = [
      { rating: 5, date: '2025-11-10' },
      { rating: 4, date: '2025-11-09' },
      { rating: 5, date: '2025-11-08' },
      { rating: 4, date: '2025-11-05' },
      { rating: 5, date: '2025-11-03' },
      { rating: 5, date: '2025-10-30' },
      { rating: 4, date: '2025-10-28' },
      { rating: 5, date: '2025-10-25' },
      { rating: 4, date: '2025-10-20' },
      { rating: 5, date: '2025-10-18' },
      { rating: 5, date: '2025-10-15' },
      { rating: 4, date: '2025-10-10' },
      { rating: 5, date: '2025-10-05' },
      { rating: 5, date: '2025-09-30' },
      { rating: 4, date: '2025-09-25' },
      { rating: 5, date: '2025-09-20' },
      { rating: 5, date: '2025-09-15' },
      { rating: 4, date: '2025-08-30' },
      { rating: 5, date: '2025-08-25' },
      { rating: 5, date: '2025-08-20' },
    ];

    const totalRatings = mockReviewsLast90Days.reduce((sum, review) => sum + review.rating, 0);
    const reviewCount = mockReviewsLast90Days.length;
    const avgRating = reviewCount > 0 ? totalRatings / reviewCount : 0;

    return {
      avgRating,
      totalRatings,
      reviewCount,
    };
  }

  /**
   * Calculate MTD Sales = sum(Sales.total where date in current month)
   */
  calculateMTDSales(): { mtdSales: number; salesCount: number } {
    const sales = getMockSales();
    const currentMonth = this.referenceDate.getMonth();
    const currentYear = this.referenceDate.getFullYear();

    // Filter sales in current month
    const salesThisMonth = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return (
        saleDate.getMonth() === currentMonth &&
        saleDate.getFullYear() === currentYear
      );
    });

    const mtdSales = salesThisMonth.reduce((sum, sale) => sum + sale.total, 0);
    const salesCount = salesThisMonth.length;

    return {
      mtdSales,
      salesCount,
    };
  }

  /**
   * Get all KPI metrics
   */
  getAllKPIs(): KPIMetrics {
    const leadConversion = this.calculateLeadConversion();
    const campaignROI = this.calculateCampaignROI();
    const avgRating = this.calculateAvgRating();
    const mtdSales = this.calculateMTDSales();

    return {
      leadConversionPercent: leadConversion.percent,
      leadConversionDetails: {
        wonLeads: leadConversion.wonLeads,
        totalLeads: leadConversion.totalLeads,
      },
      campaignROI: campaignROI.roi,
      campaignROIDetails: {
        totalRevenue: campaignROI.totalRevenue,
        totalSpend: campaignROI.totalSpend,
      },
      avgRating: avgRating.avgRating,
      avgRatingDetails: {
        totalRatings: avgRating.totalRatings,
        reviewCount: avgRating.reviewCount,
      },
      mtdSales: mtdSales.mtdSales,
      mtdSalesDetails: {
        salesCount: mtdSales.salesCount,
      },
    };
  }
}

export const kpiService = new KPIService();
