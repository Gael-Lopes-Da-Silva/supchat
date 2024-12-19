import { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

class App extends Component {
    state = {
        
    };
    
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Text>Hellow World!</Text>
                </View>
            </View>
        );
    }
}

export default App;