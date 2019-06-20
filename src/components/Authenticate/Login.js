import React from "react";
import axios from "axios";
import {
  View,
  Button,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  AsyncStorage,
  Image,
  Linking,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import SafariView from "react-native-safari-view";
// import SendBird from "sendbird";
// import Config from "../../config";

const URL = "https://labs13-localchat.herokuapp.com";

// var sb = new SendBird({ appId: Config.appId });
export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined, // user has not logged in yet
      userId: "",
      nickname: ""
    };
  }

  // Set up Linking
  componentDidMount() {
    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener("url", this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then(url => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  }

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener("url", this.handleOpenURL);
    this.props.navigation.navigate("MyProfile", { id: this.state.user.id });
    this.props.navigation.navigate("JoinChat");
  }

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    this.setState({
      // Decode the user string and parse it into JSON
      user: JSON.parse(decodeURI(user_string))
    });
    if (Platform.OS === "ios") {
      SafariView.dismiss();
    }
  };

  // Handle Login with Google button tap
  loginWithGoogle = () =>
    this.openURL("https://labs13-localchat.herokuapp.com/auth/google");

  // Handle Login with Facebook button tap
  loginWithFacebook = () =>
    this.openURL("https://labs13-localchat.herokuapp.com/auth/facebook");

  // logout = async () => {
  // 	try {
  // 		await this.openURL(
  // 			'https://labs13-localchat.herokuapp.com/auth/logout'
  // 		);
  // 		this.setState({ user: undefined });
  // 	} catch (error) {
  // 		console.error(error);
  // 	}
  // };

  // Open URL in a browser
  openURL = url => {
    // Use SafariView on iOS
    if (Platform.OS === "ios") {
      SafariView.show({
        url: url,
        fromBottom: true
      });
    } else {
      // Or Linking.openURL on Android
      Linking.openURL(url);
    }
  };
  // viewJoinChats = () => {
  //   // AsyncStorage.setItem();
  //   this.props.navigation.navigate("JoinChat", { id: this.state.user.id });
  // };

  // signOut = () => {
  //   this.setState({
  //     user: undefined
  //   });
  // };

  signOut = () => {
    this.setState({
      user: undefined
    });
    AsyncStorage.removeItem("userID");
    sb.disconnect(function() {
      // A current user is discconected from SendBird server.
    });
  };

  setGFId = () => {
    if (this.state.user.google_id) {
      return AsyncStorage.setItem("userID", this.state.user.google_id);
    } else {
      return AsyncStorage.setItem("userID", this.state.user.facebook_id);
    }
  };

  render() {
    const { user } = this.state;
    console.log(this.props);
    // console.log('THIS IS THE USER ID', this.state.user);
    // console.log('loginstate', this.state);
    return (
      <View style={styles.container}>
        {user ? (
          // Show user info if already logged in
          this.setGFId() &&
          AsyncStorage.setItem("firstname", this.state.user.first_name) &&
          AsyncStorage.setItem("lastname", this.state.user.last_name) &&
          AsyncStorage.setItem("email", this.state.user.email) &&
          AsyncStorage.setItem("phonenumber", this.state.user.phone_num) && (
            this.props.navigation.navigate("JoinChat", { id: this.state.user.id })
            // <View style={styles.content}>
            //   <Text style={styles.header}>Welcome {user.first_name}!</Text>
            //   <View style={styles.avatar}>
            //     <Image
            //       source={{ uri: user.avatar }}
            //       style={styles.avatarImage}
            //     />
            //     <Button title="Join Chats" onPress={this.viewJoinChats} />
            //     <Button title="Sign Out" onPress={this.signOut} color="red" />
            //   </View>
            // </View>
          )
        ) : (
          // Show Please log in message if not
          <View style={styles.content}>
            <Image 
              source={require("./CMLogo.png")}
            />
            {/* <View style={styles.avatar}>
              <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
              </View>
            <Text style={styles.text}>Please log in to continue {"\n"}</Text> */}
            {/* Login buttons */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Welcome to chatmaps!</Text>
            </View>
            <TouchableOpacity
              onPress={this.loginWithGoogle} style={styles.btnClickContain}>
              <View
                style={styles.btnContainer}>
                <Icon
                  name='google'
                  size={25}
                  color='#4285F4'
                  style={styles.btnIcon}/>
                <Text style={styles.btnText}>Sign In with Google +</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.loginWithFacebook} style={styles.btnClickContain}>
              <View
                style={styles.btnContainer}>
                <Icon
                  name='facebook-square'
                  size={25}
                  color='#3b5998'
                  style={styles.btnIcon}/>
                <Text style={styles.btnText}>Sign In with Facebook</Text>
              </View>
            </TouchableOpacity>
            {/* <View>
              <View style={styles.buttons}>
                <Icon.Button
                  name="facebook"
                  backgroundColor="#3b5998"
                  onPress={this.loginWithFacebook}
                  {...iconStyles}
                >
                  Login with Facebook
                </Icon.Button>
              </View>
              <View style={styles.buttons}>
                <Icon.Button
                  name="google"
                  backgroundColor="#DD4B39"
                  onPress={this.loginWithGoogle}
                  {...iconStyles}
                >
                  Login with Google
                </Icon.Button>
              </View>
            </View> */}
            
          </View>
        )}
      </View>
    );
  }
}

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
  },
  header: {
    textAlign: "center",
    marginVertical: "20%"
  },
  headerText: {
    fontSize: 30,
    fontWeight: "600"
  },
  // text: {
  //   textAlign: "center",
  //   color: "#333",
  //   marginBottom: 5
  // },
  // buttons: {
  //   marginTop: 30,
  // },
  btnClickContain: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: .75,
    borderRadius: 25,
    padding: 10,
    width: "75%",
    // marginTop: 20,
    marginBottom: 20,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  btnIcon: {
    height: 25,
    width: 25,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: "15%"
  }
});

