import { StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    margin: Spacing.sm,
  },
  container: {
    width: '100%',
    borderRadius: 24, // Rounded corners 20-24px as requested
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 0, // No heavy borders
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.0, // aspectRatio 1:1 occupied fully
    position: 'relative',
    backgroundColor: '#F7F8FA', // generous spacing palette
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  // Floating discount badge
  discountBadge: {
    position: 'absolute',
    top: 12,
    zIndex: 10,
    height: 36, // Height about 34-38px
    borderRadius: 18, // Rounded pill
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FF4D4F', // Primary Red
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },

  // Floating wishlist button
  wishlistButton: {
    position: 'absolute',
    top: 12,
    zIndex: 10,
  },
  wishlistCircle: {
    width: 44, // 42-46px circular
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF', // White background
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },

  // Countdown timer
  countdownOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16, // Rounded radius: 16px
    backgroundColor: 'rgba(255, 255, 255, 0.72)', // Frosted glass backdrop (semi-transparent white)
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  countdownLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 6,
    textTransform: 'uppercase',
  },
  countdownSegment: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  countdownBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#111827', // Timer blocks dark background (#111827)
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownValue: {
    color: '#FFFFFF', // White bold digits
    fontSize: 12,
    fontWeight: '800',
  },
  countdownLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  countdownSeparator: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 12,
    marginHorizontal: 1,
    paddingBottom: 10,
  },

  // Content area below image
  content: {
    paddingHorizontal: 16, // Horizontal 16-18px
    paddingVertical: 14, // Vertical 14-16px
    gap: 8, // Spacing 8px system
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },

  // Rating section
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6DA', // Soft Amber #FFF6DA
    borderRadius: 999, // 999px border radius
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  ratingText: {
    color: '#8F5E00', // Dark Amber text color
    fontWeight: '700',
    fontSize: 12,
  },
  reviewCount: {
    fontSize: 12,
    color: '#6B7280', // Gray color smaller typography
  },

  // Price Section
  priceContainer: {
    marginVertical: 4,
  },
  oldPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '800',
  },

  // Add To Cart Button
  cartButton: {
    width: '100%',
    height: 48, // Large height 48-54px
    borderRadius: 16, // Border radius 16px
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 4,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
