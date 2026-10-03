import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Message, PollOption } from '@/types/messaging';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PollMessageProps {
  message: Message;
  isMe: boolean;
}

export const PollMessage = ({ message, isMe }: PollMessageProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const { question, options } = message.metadata || {};
  const [selected, setSelected] = useState<string | null>(null);

  const totalVotes = options?.reduce((acc: number, opt: PollOption) => acc + opt.votes, 0) || 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.question, { color: isMe ? '#FFF' : colors.text }]}>{question}</Text>
      <View style={styles.options}>
        {options?.map((opt: PollOption) => {
          const percent = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setSelected(opt.id)}
              style={[
                styles.option,
                {
                  backgroundColor: isMe ? 'rgba(255,255,255,0.1)' : colors.surface
                }
              ]}
            >
              <View
                style={[
                  styles.progress,
                  {
                    width: `${percent}%`,
                    backgroundColor: isMe ? 'rgba(255,255,255,0.2)' : `${colors.tint}15`
                  }
                ]}
              />
              <View style={styles.optionContent}>
                <Text style={[styles.optionText, { color: isMe ? '#FFF' : colors.text }]}>{opt.text}</Text>
                <Text style={[styles.voteText, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>
                  {Math.round(percent)}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[styles.totalVotes, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>
        {totalVotes} votes
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
    gap: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: '800',
  },
  options: {
    gap: 8,
  },
  option: {
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  voteText: {
    fontSize: 12,
  },
  totalVotes: {
    fontSize: 12,
    textAlign: 'center',
  }
});
