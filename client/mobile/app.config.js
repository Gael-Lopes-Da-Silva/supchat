import 'dotenv/config';

export default {
  expo: {
    name: "supchat",
    slug: "supchat",
    scheme: "supchat",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/favicon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.supinfo.supchat",
      config: {
        googleSignIn: {
          reservedClientId: "$(GOOGLE_IOS_RESERVED_CLIENT_ID)"
        }
      },
      infoPlist: {
        NSCameraUsageDescription: "Cette application utilise la caméra pour scanner le QR code de connexion",
        NSPhotoLibraryUsageDescription: "Cette application nécessite l'accès à la galerie pour les images de profil",
        UIBackgroundModes: ["remote-notification"]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/favicon.png",
        backgroundColor: "#f77066"
      },
      package: "com.supinfo.supchat",
      googleServicesFile: "./google-services.json",
      config: {
        googleSignIn: {
          certificateHash: "$(ANDROID_CERTIFICATE_HASH)"
        }
      },
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            { scheme: "supchat", host: "*" },
            { scheme: "exp+supchat", host: "*" },
            { scheme: "fb$(FACEBOOK_CLIENT_ID)", host: "*" }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/favicon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#f77066"
        }
      ],
      "@react-native-google-signin/google-signin",
      [
        "react-native-fbsdk-next",
        {
          appID: "$(FACEBOOK_CLIENT_ID)",
          clientToken: "$(FACEBOOK_CLIENT_TOKEN)",
          displayName: "Supchat",
          scheme: "fb$(FACEBOOK_CLIENT_ID)",
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
          isAutoInitEnabled: true,
          iosUserTrackingPermission: "Cette application souhaite accéder à vos données pour l'authentification Facebook."
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiUrl: process.env.API_URL,
      clientWebUrl: process.env.CLIENT_WEB_URL,
      googleClientId: process.env.GOOGLE_MOBILE_CLIENT_ID,
      googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
      facebookAppId: process.env.FACEBOOK_CLIENT_ID
    }
  }
};