import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Colors } from '@/constants/colors';
import { User, DollarSign, MessageSquare, LogOut, Moon, Sun, Globe, Check, X } from 'lucide-react-native';
import { PersonalityMode, CURRENCIES } from '@/types';
import { getCurrencySymbol, getCurrencyName } from '@/utils/currency';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { userProfile, updateUserProfile, theme, toggleTheme } = useApp();
  const colors = Colors[theme];

  const [name, setName] = useState<string>(userProfile?.name || '');
  const [monthlyIncome, setMonthlyIncome] = useState<string>(userProfile?.monthlyIncome.toString() || '');
  const [bills, setBills] = useState<string>(userProfile?.bills.toString() || '');
  const [mode, setMode] = useState<PersonalityMode>(userProfile?.mode || 'bro');
  const [currency, setCurrency] = useState<string>(userProfile?.currency || 'USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    if (!name.trim() || !monthlyIncome || parseFloat(monthlyIncome) <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        name: name.trim(),
        monthlyIncome: parseFloat(monthlyIncome),
        bills: parseFloat(bills) || 0,
        currency,
        mode
      });
      Alert.alert('Success', 'Settings updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  if (!userProfile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Currency</Text>
            </View>
            <TouchableOpacity
              style={[styles.currencySelector, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setShowCurrencyModal(true)}
              disabled={loading}
            >
              <View style={styles.currencyInfo}>
                <Text style={[styles.currencySymbol, { color: colors.text }]}>
                  {getCurrencySymbol(currency)}
                </Text>
                <View style={styles.currencyDetails}>
                  <Text style={[styles.currencyCode, { color: colors.text }]}>{currency}</Text>
                  <Text style={[styles.currencyName, { color: colors.textSecondary }]}>
                    {getCurrencyName(currency)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.changeText, { color: colors.primary }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Budget</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Monthly Income</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={monthlyIncome}
                onChangeText={setMonthlyIncome}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Fixed Bills</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={bills}
                onChangeText={setBills}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MessageSquare size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Personality Mode</Text>
            </View>
            <View style={styles.modeButtons}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  { 
                    backgroundColor: mode === 'bro' ? colors.primary : colors.background,
                    borderColor: mode === 'bro' ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setMode('bro')}
                disabled={loading}
              >
                <Text style={[styles.modeButtonText, { color: mode === 'bro' ? '#FFFFFF' : colors.text }]}>
                  😎 Bro Mode
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  { 
                    backgroundColor: mode === 'professional' ? colors.primary : colors.background,
                    borderColor: mode === 'professional' ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setMode('professional')}
                disabled={loading}
              >
                <Text style={[styles.modeButtonText, { color: mode === 'professional' ? '#FFFFFF' : colors.text }]}>
                  💼 Professional
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon size={24} color={colors.text} />
            ) : (
              <Sun size={24} color={colors.text} />
            )}
            <Text style={[styles.settingText, { color: colors.text }]}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleSignOut}
          >
            <LogOut size={24} color={colors.danger} />
            <Text style={[styles.settingText, { color: colors.danger }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showCurrencyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={true}>
              {CURRENCIES.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyOption,
                    { 
                      backgroundColor: currency === curr.code ? colors.background : 'transparent',
                      borderColor: currency === curr.code ? colors.primary : 'transparent'
                    }
                  ]}
                  onPress={() => {
                    setCurrency(curr.code);
                    setShowCurrencyModal(false);
                  }}
                >
                  <View style={styles.currencyOptionContent}>
                    <Text style={[styles.currencyOptionSymbol, { color: colors.text }]}>
                      {curr.symbol}
                    </Text>
                    <View style={styles.currencyOptionDetails}>
                      <Text style={[styles.currencyOptionCode, { color: colors.text }]}>
                        {curr.code}
                      </Text>
                      <Text style={[styles.currencyOptionName, { color: colors.textSecondary }]}>
                        {curr.name}
                      </Text>
                    </View>
                  </View>
                  {currency === curr.code && <Check size={24} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700' as const,
    width: 32,
    textAlign: 'center',
  },
  currencyDetails: {
    gap: 2,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  currencyName: {
    fontSize: 13,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    padding: 16,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
  },
  currencyOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  currencyOptionSymbol: {
    fontSize: 28,
    fontWeight: '700' as const,
    width: 40,
    textAlign: 'center',
  },
  currencyOptionDetails: {
    gap: 2,
  },
  currencyOptionCode: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  currencyOptionName: {
    fontSize: 13,
  },
});
