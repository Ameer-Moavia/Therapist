import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Fonts, Sizes } from '../constants/styles';
import { getDatabase, ref, get } from 'firebase/database'; // Firebase Realtime Database imports

const TestReports = ({ navigation,route }) => {
    const email  = route.params.email;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const sanitizeEmail = (email) => {
        return email.replace(/\./g, '_');
    };

    useEffect(() => {
        const getUserEmail = async () => {
            const fetchUserTests = async (email) => {
                
                const sanitizedEmail = sanitizeEmail(email);
                const db = getDatabase();
                const userRef = ref(db, `tests/${sanitizedEmail}`);

                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        const docData = snapshot.val();
                        const newData = [];

                        if (docData.BAI) {
                            newData.push({
                                title: 'BAI (Anxiety Test Reports)',
                                data: Object.values(docData.BAI).map(test => ({
                                    ...test,
                                    date: new Date(test.date),
                                    type: 'BAI'
                                }))
                            });
                        }

                        if (docData.BDI) {
                            newData.push({
                                title: 'BDI (Depression Test Reports)',
                                data: Object.values(docData.BDI).map(test => ({
                                    ...test,
                                    date: new Date(test.date),
                                    type: 'BDI'
                                }))
                            });
                        }

                        if (docData.ESS) {
                            newData.push({
                                title: 'ESS (Epworth Sleeplessness Scale)',
                                data: Object.values(docData.ESS).map(test => ({
                                    ...test,
                                    date: new Date(test.date),
                                    type: 'ESS'
                                }))
                            });
                        }

                        if (docData.PTSD) {
                            newData.push({
                                title: 'PTSD (Posttraumatic Stress)',
                                data: Object.values(docData.PTSD).map(test => ({
                                    ...test,
                                    date: new Date(test.date),
                                    type: 'PTSD'
                                }))
                            });
                        }

                        if (docData.PanicDisorder) {
                            newData.push({
                                title: 'Panic Disorder Test',
                                data: Object.values(docData.PanicDisorder).map(test => ({
                                    ...test,
                                    date: new Date(test.date),
                                    type: 'PanicDisorder'
                                }))
                            });
                        }

                        if (docData.AngerControlTest) {
                            newData.push({
                                title: 'Anger Control Test',
                                data: Object.values(docData.AngerControlTest).map(test => ({
                                    ...test,
                                    date: new Date(test.date),
                                    type: 'AngerControl'
                                }))
                            });
                        }

                        setData(newData);
                    }
                    setIsLoading(false); // Set loading to false when data is fetched
                } catch (error) {
                    console.error('Error retrieving data from Realtime Database:', error);
                    setIsLoading(false); // Set loading to false in case of error
                }
            };

            try {


                fetchUserTests(email);
            } catch (error) {
                console.error('Error retrieving user email from AsyncStorage:', error);
                setIsLoading(false); // Set loading to false in case of error
            }
        };

        getUserEmail();
    }, []);

    const renderTestItem = ({ item }) => {
        const validity = calculateValidity(item.date);
        let result = {};
        switch (item.type) {
            case 'BAI':
                result = calculateTypeBAI(item.score);
                break;
            case 'BDI':
                result = calculateTypeBDI(item.score);
                break;
            case 'ESS':
                result = calculateTypeESS(item.score);
                break;
            case 'PTSD':
                result = calculateTypePTSD(item.score);
                break;
            case 'PanicDisorder':
                result = calculateTypePanicDisorder(item.score);
                break;
            case 'AngerControl':
                result = calculateTypeAngerControl(item.score);
                break;
            default:
                break;
        }

        const { type, color } = result;

        return (
            <View style={styles.testItemContainer}>
                <Text style={[styles.testItemText, { color }]}>{item.score}</Text>
                <Text style={styles.testItemText}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text style={styles.testItemText}>{validity}</Text>
                <Text style={[styles.testItemText, { color, fontWeight: 'bold' }]}>{type}</Text>
            </View>
        );
    };

    const calculateValidity = (testDate) => {
        const currentDate = new Date();
        const differenceInDays = Math.floor((currentDate - new Date(testDate)) / (1000 * 60 * 60 * 24));
        return 7 - differenceInDays;
    };

    const calculateTypeBAI = (score) => {
        if (score >= 0 && score <= 21) return { type: 'Low', color: 'green' };
        else if (score >= 22 && score <= 35) return { type: 'Moderate', color: 'orange' };
        else if (score >= 36) return { type: 'High', color: 'red' };
    };

    const calculateTypeBDI = (score) => {
        if (score >= 0 && score <= 10) {
            return { type: "Normal", color: 'green' };
        } else if (score >= 11 && score <= 16) {
            return { type: "Mild Disturbance", color: 'brown' };
        } else if (score >= 17 && score <= 20) {
            return { type: "Borderline Clinical", color: 'orange' };
        } else if (score >= 21 && score <= 30) {
            return { type: "Moderate", color: 'orange' };
        } else if (score >= 31 && score <= 40) {
            return { type: "Severe", color: 'red' };
        } else {
            return { type: "Extreme", color: 'red' };
        }
    };

    const calculateTypeESS = (score) => {
        if (score >= 0 && score <= 7) return { type: 'Normal', color: 'green' };
        else if (score >= 8 && score <= 9) return { type: 'Mild', color: '#ffc40c' };
        else if (score >= 10 && score <= 15) return { type: 'Moderate', color: 'orange' };
        else if (score >= 16 && score <= 24) return { type: 'Severe', color: 'red' };
    };

    const calculateTypePTSD = (score) => {
        if (score >= 0 && score <= 10) return { type: 'Minimal', color: 'green' };
        else if (score >= 11 && score <= 20) return { type: 'Mild', color: '#ffc40c' };
        else if (score >= 21 && score <= 30) return { type: 'Moderate', color: 'orange' };
        else if (score >= 31 && score <= 40) return { type: 'Severe', color: 'red' };
        else return { type: 'Extreme', color: 'red' };
    };

    const calculateTypePanicDisorder = (score) => {
        if (score >= 0 && score <= 9) return { type: 'Minimal', color: 'green' };
        else if (score >= 10 && score <= 15) return { type: 'Mild', color: '#ffc40c' };
        else if (score >= 16 && score <= 30) return { type: 'Moderate', color: 'orange' };
        else if (score >= 31 && score <= 50) return { type: 'Severe', color: 'red' };
    };

    const calculateTypeAngerControl = (score) => {
        if (score >= 0 && score <= 21) return { type: 'Low', color: 'green' };
        else if (score >= 22 && score <= 35) return { type: 'Moderate', color: 'orange' };
        else if (score >= 36) return { type: 'High', color: 'red' };
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test Reports</Text>
            <View style={{paddingBottom:70}}>
                <SectionList
                    sections={data}
                    keyExtractor={(item, index) => item + index}
                    renderItem={renderTestItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.tableContainer}>
                            <Text style={styles.tableTitle}>{title}</Text>
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerText}>Score</Text>
                                <Text style={styles.headerText}>Date</Text>
                                <Text style={styles.headerText}>Validity</Text>
                                <Text style={styles.headerText}>Type</Text>
                            </View>
                        </View>
                    )}
                    stickySectionHeadersEnabled={false}
                />
          
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('BottomTabBarScreen')}>
                <Text style={styles.submitButtonText}>Close</Text>
            </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
        padding: Sizes.fixPadding,
        justifyContent: "space-between"
    },
    title: {
        ...Fonts.primaryColor20Bold,
        marginBottom: Sizes.fixPadding,
        textAlign: 'center',
    },
    tableContainer: {
        marginBottom: Sizes.fixPadding,
        borderWidth: 1,
        borderColor: Colors.lightGrayColor,
        borderRadius: 10,
        padding: Sizes.fixPadding,
        borderBottomWidth:0,
    },
    tableTitle: {
        ...Fonts.primaryColor16Bold,
        marginBottom: Sizes.fixPadding,
        textAlign: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrayColor,
        paddingBottom: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
    },
    headerText: {
        ...Fonts.grayColor16Regular,
        flex: 1,
        textAlign: 'center',
    },
    testItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.lightGrayColor,
        paddingBottom: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
        borderRadius: 10,
        borderTopWidth:0,
    },
    testItemText: {
        ...Fonts.grayColor16Regular,
        flex: 1,
        textAlign: 'center',
    },
    submitButton: {
        position:"absolute",
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 175,
        bottom:0,
        left:10
    },
    submitButtonText: {
        ...Fonts.whiteColor16Medium,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TestReports;
