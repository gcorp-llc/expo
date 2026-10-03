import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { styles } from './ProductCard.styles';

interface SaleCountdownProps {
  saleEndDate: string;
  onExpired: () => void;
}

export const SaleCountdown = ({ saleEndDate, onExpired }: SaleCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    expired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(saleEndDate) - +new Date();
      if (difference <= 0) {
        return {
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          expired: true,
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const pad = (num: number) => num < 10 ? `0${num}` : num.toString();

      return {
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
        expired: false,
      };
    };

    // Set initial calculations
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    if (initialTime.expired) {
      onExpired();
      return;
    }

    const timer = setInterval(() => {
      const nextTime = calculateTimeLeft();
      setTimeLeft(nextTime);
      if (nextTime.expired) {
        clearInterval(timer);
        onExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [saleEndDate, onExpired]);

  if (timeLeft.expired) {
    return null;
  }

  const Segment = ({ value, label }: { value: string; label: string }) => (
    <View style={styles.countdownSegment}>
      <View style={styles.countdownBox}>
        <Text style={styles.countdownValue}>{value}</Text>
      </View>
      <Text style={styles.countdownLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.countdownOverlay}>
      <View style={styles.countdownContainer}>
        <Segment value={timeLeft.days} label="D" />
        <Text style={styles.countdownSeparator}>:</Text>
        <Segment value={timeLeft.hours} label="H" />
        <Text style={styles.countdownSeparator}>:</Text>
        <Segment value={timeLeft.minutes} label="M" />
        <Text style={styles.countdownSeparator}>:</Text>
        <Segment value={timeLeft.seconds} label="S" />
      </View>
    </View>
  );
};
