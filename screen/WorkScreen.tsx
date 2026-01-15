// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const DARK_BLUE = '#0A2540';
// const WHITE = '#FFFFFF';
// const ORANGE = '#FF9500';
// const LIGHT_GRAY = '#B0B3B8';
// // const DARK_GRAY = '#666666';
// const LIGHT_BLACK = '#060505ff';

// const WorkScreen: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'Tasks' | 'Visits' | 'Clients'>('Tasks');

//   return (
//     <SafeAreaView style={styles.containerDark}>
//       <StatusBar barStyle="light-content" backgroundColor={DARK_BLUE} />

//       {/* Header */}
//       <View style={styles.headerDark}>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.titleWhite}>Work Dashboard</Text>
//           <Text style={styles.orangeDot}>•</Text>
//         </View>
//       </View>

//       {/* Subtabs */}
//       <View style={styles.tabContainerDark}>
//         {(['Tasks', 'Visits', 'Clients'] as const).map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setActiveTab(tab)}
//             activeOpacity={0.8}
//             style={styles.tabWrapper}
//           >
//             <Text
//               style={[
//                 styles.tabWhite,
//                 activeTab === tab && styles.activeTabWhite,
//               ]}
//             >
//               {tab}
//             </Text>
//             {activeTab === tab && <View style={styles.activeLine} />}
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Content */}
//       <View style={styles.contentDark}>
//         <Text style={styles.contentTextGray}>
//           Your firm has not enabled Task and Visit
//         </Text>
//         <Text style={styles.contentTextGray}>Management.</Text>
//         <Text style={styles.contentTextGray}>
//           Please contact your administrator.
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   containerDark: {
//     flex: 1,
//     backgroundColor: DARK_BLUE,
//   },
//   headerTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerDark: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: DARK_BLUE,
//   },
//   titleWhite: {
//     fontSize: 25,
//     fontWeight: '800',
//     padding: 5,
//     color: WHITE,
//   },
//   orangeDot: {
//     fontSize: 34,
//     color: ORANGE,
//     marginLeft: 4,
//   },
//   tabContainerDark: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     backgroundColor: DARK_BLUE,
//     borderBottomWidth: 1,
//     borderBottomColor: '#1B3555',
//   },
//   tabWrapper: {
//     alignItems: 'center',
//   },
//   tabWhite: {
//     fontSize: 17,
//     fontWeight: '400',
//     color: LIGHT_GRAY,
//   },
//   activeTabWhite: {
//     color: WHITE,
//     fontWeight: '600',
//   },
//   activeLine: {
//     marginTop: 4,
//     height: 3,
//     width: 40,
//     backgroundColor: ORANGE,
//     borderRadius: 2,
//   },
//   contentDark: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//     backgroundColor: WHITE,
//   },
//   contentTextGray: {
//     fontSize: 15,
//     color: LIGHT_BLACK,
//     textAlign: 'center',
//     lineHeight: 24,
//   },
// });

// export { WorkScreen };


import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width } = Dimensions.get('window');

const DARK_BLUE = '#0A2540';
const WHITE = '#FFFFFF';
const ORANGE = '#FF9500';
const LIGHT_GRAY = '#B0B3B8';
const LIGHT_BLACK = '#060505ff';

const WorkScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Visits' | 'Clients'>('Tasks');
  const scrollViewRef = useRef<ScrollView>(null);

  // Tab Order Definition
  const tabs: ('Tasks' | 'Visits' | 'Clients')[] = ['Tasks', 'Visits', 'Clients'];

  // Handle Tab Press (scrolls to the correct page)
  const handleTabPress = (tab: 'Tasks' | 'Visits' | 'Clients') => {
    setActiveTab(tab);
    const index = tabs.indexOf(tab);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  // Sync Active Tab on Swipe
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    const newTab = tabs[slide];
    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  // Reusable Content Component
  const renderPlaceholderContent = (title: string) => (
    <View style={[styles.contentPage, { width: width }]}>
      <Text style={styles.contentTextGray}>
        Your firm has not enabled {title}
      </Text>
      <Text style={styles.contentTextGray}>Management.</Text>
      <Text style={styles.contentTextGray}>
        Please contact your administrator.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.containerDark}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BLUE} />

      {/* Header */}
      <View style={styles.headerDark}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.titleWhite}>Work Dashboard</Text>
          <Text style={styles.orangeDot}>•</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainerDark}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.8}
            style={styles.tabWrapper}
          >
            <Text
              style={[
                styles.tabWhite,
                activeTab === tab && styles.activeTabWhite,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Horizontal ScrollView for Swiping */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.contentContainer}
      >
        {/* Content for Tasks */}
        {renderPlaceholderContent('Task')}

        {/* Content for Visits */}
        {renderPlaceholderContent('Visit')}

        {/* Content for Clients */}
        {renderPlaceholderContent('Client')}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    backgroundColor: DARK_BLUE,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: DARK_BLUE,
  },
  titleWhite: {
    fontSize: 25,
    fontWeight: '800',
    padding: 5,
    color: WHITE,
  },
  orangeDot: {
    fontSize: 34,
    color: ORANGE,
    marginLeft: 4,
  },
  tabContainerDark: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: DARK_BLUE,
    borderBottomWidth: 1,
    borderBottomColor: '#1B3555',
  },
  tabWrapper: {
    alignItems: 'center',
  },
  tabWhite: {
    fontSize: 17,
    fontWeight: '400',
    color: LIGHT_GRAY,
  },
  activeTabWhite: {
    color: WHITE,
    fontWeight: '600',
  },
  activeLine: {
    marginTop: 4,
    height: 3,
    width: 40,
    backgroundColor: ORANGE,
    borderRadius: 2,
  },
  // New container style for the scroll view area
  contentContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  // Style for individual pages inside the scroll view
  contentPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: WHITE,
  },
  contentTextGray: {
    fontSize: 15,
    color: LIGHT_BLACK,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export { WorkScreen };