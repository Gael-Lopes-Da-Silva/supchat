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
        boxShadow: "#333 5px 5px 0px",
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
        gap: 30,
    },

    input: {
        backgroundColor: "#fffceb",
        fontWeight: "bold",
        padding: 10,
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: '#333',
        borderWidth: 3,
        boxShadow: "#333 5px 5px 0px",
    },

    label: {
        fontWeight: "bold",
    },

    button: {
        padding: 10,
        backgroundColor: "#fffceb",
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: '#333',
        borderWidth: 3,
        boxShadow: "#333 5px 5px 0px",
    },

    buttonText: {
        textAlign: "center",
        fontWeight: "bold",
    }
});

class App extends React.Component {
    handleSubmit() { }

    render() {
        return (
            <View style={styles.main}>
                <View style={styles.container}>
                    <Text style={styles.h1}>Connexion</Text>
                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>Email</Text>
                            <TextInput style={styles.input} />
                        </View>
                        <View>
                            <Text style={styles.label}>Mot de passe</Text>
                            <TextInput style={styles.input} secureTextEntry={true} />
                        </View>
                        <TouchableOpacity onPress={this.handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Se Connecter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default App;