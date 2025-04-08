import "react-native-reanimated";
import React from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import RootNavigator from "./src/navigation/RootNavigator";
import { RecoilRoot } from "recoil";

export default function App() {
  return (
    <RecoilRoot>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </RecoilRoot>
  );
}
