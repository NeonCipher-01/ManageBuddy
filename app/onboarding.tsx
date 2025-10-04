import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { Colors } from '@/constants/colors';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import { PersonalityMode } from '@/types';

export default function OnboardingScreen() {
  const router = useRouter();
  const { theme, createUserProfile } = useApp();
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [bills, setBills] = useState<string>('');
  const [mode, setMode] = useState<PersonalityMode>('bro');
  const [loading, setLoading] = useState<boolean>(false);

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    if (step === 2) {
      if (!monthlyIncome || parseFloat(monthlyIncome) <= 0) {
        Alert.alert('Required', 'Please enter your monthly income');
        return;
      }
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await createUserProfile({
        name: name.trim(),
        monthlyIncome: parseFloat(monthlyIncome) || 0,
        bills: parseFloat(bills) || 0,
        mode,
        setupCompleted: true
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                { backgroundColor: s <= step ? colors.primary : colors.border }
              ]}
            />
          ))}
        </View>
        <Text style={[styles.stepText, { color: colors.textSecondary }]}>
          Step {step} of 3
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.emoji, { color: colors.primary }]}>👋</Text>
            <Text style={[styles.question, { color: colors.text }]}>
              What should I call you?
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.emoji, { color: colors.primary }]}>💵</Text>
            <Text style={[styles.question, { color: colors.text }]}>
              What&apos;s your monthly income?
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="5000"
              placeholderTextColor={colors.textSecondary}
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
              keyboardType="numeric"
              autoFocus
            />

            <Text style={[styles.subQuestion, { color: colors.text }]}>
              Any fixed bills you want to track?
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="1500 (optional)"
              placeholderTextColor={colors.textSecondary}
              value={bills}
              onChangeText={setBills}
              keyboardType="numeric"
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.emoji, { color: colors.primary }]}>🎭</Text>
            <Text style={[styles.question, { color: colors.text }]}>
              How do you want your buddy to talk to you?
            </Text>

            <TouchableOpacity
              style={[
                styles.modeCard,
                { backgroundColor: colors.card, borderColor: mode === 'bro' ? colors.primary : colors.border }
              ]}
              onPress={() => setMode('bro')}
            >
              <View style={styles.modeHeader}>
                <Text style={[styles.modeEmoji]}>😎</Text>
                <View style={styles.modeInfo}>
                  <Text style={[styles.modeTitle, { color: colors.text }]}>Casual Bro Mode</Text>
                  <Text style={[styles.modeDescription, { color: colors.textSecondary }]}>
                    &quot;Bro you&apos;re killing it!&quot;
                  </Text>
                </View>
                {mode === 'bro' && <Check size={24} color={colors.primary} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeCard,
                { backgroundColor: colors.card, borderColor: mode === 'professional' ? colors.primary : colors.border }
              ]}
              onPress={() => setMode('professional')}
            >
              <View style={styles.modeHeader}>
                <Text style={[styles.modeEmoji]}>💼</Text>
                <View style={styles.modeInfo}>
                  <Text style={[styles.modeTitle, { color: colors.text }]}>Professional Mode</Text>
                  <Text style={[styles.modeDescription, { color: colors.textSecondary }]}>
                    &quot;Good job staying within budget.&quot;
                  </Text>
                </View>
                {mode === 'professional' && <Check size={24} color={colors.primary} />}
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.backButton, { borderColor: colors.border }]}
            onPress={() => setStep(step - 1)}
            disabled={loading}
          >
            <ChevronLeft size={20} color={colors.text} />
            <Text style={[styles.buttonText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={step === 3 ? handleFinish : handleNext}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
            {loading ? 'Please wait...' : step === 3 ? 'Finish' : 'Next'}
          </Text>
          {step < 3 && <ChevronRight size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 40,
    height: 6,
    borderRadius: 3,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  stepContainer: {
    gap: 24,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  question: {
    fontSize: 28,
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  subQuestion: {
    fontSize: 20,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginTop: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    borderWidth: 1,
    textAlign: 'center',
  },
  modeCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  modeEmoji: {
    fontSize: 32,
  },
  modeInfo: {
    flex: 1,
    gap: 4,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  modeDescription: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  backButton: {
    borderWidth: 1,
  },
  nextButton: {
    flex: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
