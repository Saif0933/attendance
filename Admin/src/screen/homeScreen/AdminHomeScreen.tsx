
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import popup screens
import AdminPunching from './AdminPunching';
import Others from './Others';

const { width, height } = Dimensions.get('window');

const AdminHomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [othersModalVisible, setOthersModalVisible] = useState(false);
  const [punchingModalVisible, setPunchingModalVisible] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* MAP */}
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 23.3441,
            longitude: 85.3096,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker coordinate={{ latitude: 23.3441, longitude: 85.3096 }}>
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationInner} />
            </View>
          </Marker>
        </MapView>

        {/* ROUTINE */}
        <View style={styles.topLeftContainer}>
          <TouchableOpacity style={styles.starterCard}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#333"
              style={styles.cardIcon}
            />
            <Text style={styles.starterText}>Routine</Text>
          </TouchableOpacity>
        </View>

        {/* NAVIGATION */}
        <View style={styles.topRightContainer}>
          <TouchableOpacity style={[styles.circleButton, styles.navButton]}>
            <Ionicons
              name="navigate-outline"
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* OTHERS */}
        <View style={styles.bottomLeftContainer}>
          <TouchableOpacity
            style={styles.othersCard}
            onPress={() => setOthersModalVisible(true)}
          >
            <Ionicons
              name="people-outline"
              size={20}
              color="#333"
            />
            <Text style={styles.othersText}>Others</Text>
          </TouchableOpacity>
        </View>

        {/* PUNCH */}
        <View style={styles.bottomRightContainer}>
          <TouchableOpacity
            style={styles.handButton}
            onPress={() => setPunchingModalVisible(true)}
          >
            <Ionicons
              name="finger-print"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* OTHERS MODAL */}
      <Modal transparent visible={othersModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Others onClose={() => setOthersModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* PUNCH MODAL */}
      <Modal transparent visible={punchingModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentDark}>
            <TouchableOpacity
              style={styles.modalCloseButtonDark}
              onPress={() => setPunchingModalVisible(false)}
            >
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
            <AdminPunching />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { ...StyleSheet.absoluteFillObject },

  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(66,133,244,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: '#fff',
  },

  topLeftContainer: { position: 'absolute', top: 60, left: 20 },
  starterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 6,
  },
  cardIcon: { marginRight: 6 },
  starterText: { fontSize: 16, fontWeight: '700', color: '#333' },

  topRightContainer: { position: 'absolute', top: 60, right: 20 },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  navButton: { backgroundColor: '#1A1A1A' },

  bottomLeftContainer: { position: 'absolute', bottom: 40, left: 20 },
  othersCard: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  othersText: { fontSize: 11, fontWeight: '700', marginTop: 4 },

  bottomRightContainer: { position: 'absolute', bottom: 40, right: 20 },
  handButton: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#E67E22',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '100%',
  },
  modalContentDark: {
    backgroundColor: '#000',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCloseButtonDark: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#333',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default AdminHomeScreen;
