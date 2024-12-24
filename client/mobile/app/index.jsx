import * as React from "react";

import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#f77066',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    container: {
        backgroundColor: "#fffceb",
        padding: 20,
        borderRadius: 12,
        width: '80%',
        borderStyle: "solid",
        borderColor: '#333',
        borderWidth: 3,
        borderBottomWidth: 5,
        borderRightWidth: 5,
    },

    h1: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
        textDecorationLine: "underline"
    },
    
    form: {
        gap: 10,
    },
    
    input: {
        backgroundColor: "#fffceb",
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: '#333',
        borderWidth: 3,
        borderBottomWidth: 5,
        borderRightWidth: 5,
    },
    
    button: {
        backgroundColor: "#fffceb",
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: '#333',
        borderWidth: 3,
        borderBottomWidth: 5,
        borderRightWidth: 5,
    },
    
    buttonText: {
        textAlign: "center",
        fontWeight: "bold",
        margin: 5,
    }
});

class App extends React.Component {
    login() {
        
    }
    
    render() {
        return (
            <View style={styles.main}>
                <View style={styles.container}>
                    <Text style={styles.h1}>Connexion</Text>
                    <View style={styles.form}>
                        <TextInput style={styles.input} placeholder="Email" />
                        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
                        <TouchableOpacity onPress={this.login} style={styles.button}>
                            <Text style={styles.buttonText}>Connexion</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default App;