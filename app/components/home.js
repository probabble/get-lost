import React, { Component } from "react";
import { Text, View } from "react-native";
import { Link } from "react-router-native";

const Home = props => (
  <View>
    <Text>T H E W I D E N O W </Text>
    <Link to="/audio">
      <Text> L I S T E N </Text>
    </Link>
  </View>
);

export default Home;
