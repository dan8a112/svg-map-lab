import React from "react";
import { View, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import type { SVGMapProps } from "@/types";

type SVGMapComponentProps = Pick<SVGMapProps, "svgString"> & {
  style?: ViewStyle;
};

export const SVGMap: React.FC<SVGMapComponentProps> = ({
  svgString,
  style,
}) => (
  <View style={style}>
    <SvgXml xml={svgString} width="100%" height="100%" />
  </View>
);
